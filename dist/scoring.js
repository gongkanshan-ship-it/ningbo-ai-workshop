(() => {
  "use strict";
  const scoreItems = [["tasks", "课堂作业", 1], ["collaboration", "课堂表现", 1], ["presentation", "成果展示", 1], ["attendance", "出勤扣分", -1]];
  const itemNames = Object.fromEntries(scoreItems.map(([key, label]) => [key, label]));
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  function deriveScores(data) {
    if (!data || data.schemaVersion !== 2 || data.scoreModel !== "addition-minus-attendance" || data.mode !== "demo" || !Array.isArray(data.teams) || !data.teams.length || !Array.isArray(data.records)) throw new Error("Invalid score source");
    const state = new Map();
    for (const team of data.teams) {
      if (typeof team.id !== "string" || !team.id.trim() || typeof team.name !== "string" || !team.name.trim() || state.has(team.id)) throw new Error("Invalid group");
      state.set(team.id, { id: team.id, name: team.name, attendance: 0, tasks: 0, collaboration: 0, presentation: 0 });
    }
    const ids = new Set(), previousByItem = new Map();
    let lastSequence = 0;
    for (const record of data.records) {
      const team = state.get(record.teamId);
      if (!team || !Object.hasOwn(itemNames, record.item) || typeof record.id !== "string" || !record.id || ids.has(record.id) || !Number.isInteger(record.sequence) || record.sequence <= lastSequence) throw new Error("Invalid history identity");
      if (record.status !== "confirmed" || !["initial", "correction"].includes(record.type)) throw new Error("Unconfirmed score record");
      if (!Number.isFinite(record.before) || !Number.isFinite(record.after) || record.after < 0 || record.before !== team[record.item]) throw new Error("Broken score history");
      if (![record.reason, record.reporter, record.confirmer, record.displayTime, record.evidence?.id, record.evidence?.title, record.evidence?.content].every(value => typeof value === "string" && value.trim())) throw new Error("Missing score evidence");
      const itemKey = `${record.teamId}:${record.item}`, previous = previousByItem.get(itemKey);
      if (record.type === "initial" ? Boolean(previous) || record.previousRecordId !== null : !previous || record.previousRecordId !== previous) throw new Error("Broken revision reference");
      team[record.item] = record.after;
      previousByItem.set(itemKey, record.id);
      ids.add(record.id);
      lastSequence = record.sequence;
    }
    for (const team of data.teams) for (const [key] of scoreItems) if (!previousByItem.has(`${team.id}:${key}`)) throw new Error("Missing initial score");
    return [...state.values()].map(team => {
      const total = scoreItems.reduce((sum, [key, , sign]) => sum + sign * team[key], 0);
      if (!Number.isFinite(total)) throw new Error("Invalid score total");
      return { ...team, total };
    });
  }
  // The pure calculation is available to the local verification script without a browser.
  if (typeof module !== "undefined" && module.exports) module.exports = { deriveScores };
  if (typeof document === "undefined") return;
  const dialogApi = window.workshopDialog;
  if (!dialogApi || !document.getElementById("score-body")) return;
  let teams = [], ledger = [];
  let lastLedgerSignature = "", dataRequestActive = false;
  let scoreDialogTeam = null, evidenceDialogId = null;
  const teamName = id => teams.find(team => team.id === id)?.name || id;
  const signedValue = (item, value) => `${item === "attendance" && value ? "−" : ""}${value}`;
  function renderScores() {
    const sort = document.getElementById("score-sort").value;
    const sorted = [...teams].sort((a, b) => (sort === "attendance" ? a[sort] - b[sort] : b[sort] - a[sort]) || b.total - a.total || a.id.localeCompare(b.id));
    document.getElementById("score-body").innerHTML = sorted.map((team, index) => `<tr><td>${String(index + 1).padStart(2, "0")}</td><td><button type="button" data-team="${escapeHtml(team.id)}" aria-label="查看${escapeHtml(team.name)}积分明细">${escapeHtml(team.name)} <span aria-hidden="true">↗</span></button></td><td>${team.tasks}</td><td>${team.collaboration}</td><td>${team.presentation}</td><td class="deduction-value">${signedValue("attendance", team.attendance)}</td><td>${team.total}</td></tr>`).join("");
    document.querySelectorAll("[data-team]").forEach(button => button.addEventListener("click", () => showTeam(button.dataset.team)));
  }
  function renderHistory() {
    const filter = document.getElementById("history-team").value;
    const records = ledger.filter(record => filter === "all" || record.teamId === filter);
    const corrections = records.filter(record => record.type === "correction").reverse(), initial = records.filter(record => record.type === "initial");
    document.getElementById("history-count").textContent = `${corrections.length} 次修改 · ${initial.length} 条初次登记`;
    document.getElementById("history-list").innerHTML = corrections.map(record => {
      const impact = (record.after - record.before) * (record.item === "attendance" ? -1 : 1);
      return `<article class="history-entry" id="record-${escapeHtml(record.id)}"><div class="history-entry-meta"><span>${escapeHtml(record.displayTime)}</span><span>${escapeHtml(record.id)}</span></div><div class="history-entry-main"><h3>${escapeHtml(teamName(record.teamId))} · ${itemNames[record.item]}</h3><div class="score-change"><span>${record.before}</span><span aria-hidden="true">→</span><strong>${record.after}</strong><small>总分 ${impact > 0 ? "+" : ""}${impact} 分</small></div></div><p><strong>修改原因</strong>${escapeHtml(record.reason)}</p><p><strong>依据</strong>${escapeHtml(record.evidence.title)}</p><div class="history-entry-footer"><span>报送：${escapeHtml(record.reporter)} · 确认：${escapeHtml(record.confirmer)}</span><span>原记录：${escapeHtml(record.previousRecordId)}</span><button type="button" class="text-link" data-evidence="${escapeHtml(record.id)}">查看依据 <span aria-hidden="true">↗</span></button></div></article>`;
    }).join("") || '<p class="history-empty">该组暂无修改记录。</p>';
    document.getElementById("initial-record-list").innerHTML = initial.map(record => `<div class="initial-record"><div><strong>${escapeHtml(teamName(record.teamId))} · ${itemNames[record.item]}</strong><span>${escapeHtml(record.id)} · ${escapeHtml(record.displayTime)}</span></div><span>${record.before} → ${record.after} 分</span><button type="button" class="text-link" data-evidence="${escapeHtml(record.id)}">依据 ↗</button></div>`).join("");
    document.querySelectorAll("[data-evidence]").forEach(button => button.addEventListener("click", () => showEvidence(button.dataset.evidence)));
  }
  async function loadScores() {
    if (dataRequestActive) return;
    dataRequestActive = true;
    try {
      const response = await fetch("data/score-ledger.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Score source unavailable");
      const data = await response.json(), nextTeams = deriveScores(data), signature = JSON.stringify(data);
      if (signature !== lastLedgerSignature) {
        const filter = document.getElementById("history-team").value;
        teams = nextTeams; ledger = data.records;
        document.getElementById("history-team").innerHTML = '<option value="all">全部小组</option>' + teams.map(team => `<option value="${escapeHtml(team.id)}">${escapeHtml(team.name)}</option>`).join("");
        if (teams.some(team => team.id === filter)) document.getElementById("history-team").value = filter;
        renderScores(); renderHistory();
        if (dialogApi.element.open && dialogApi.owner === "scoring") {
          if (scoreDialogTeam) showTeam(scoreDialogTeam);
          else if (evidenceDialogId) showEvidence(evidenceDialogId);
        }
        lastLedgerSignature = signature;
      }
      document.getElementById("score-data-status").textContent = `虚拟演示 · ${ledger.length} 条确认记录`;
    } catch (_) {
      document.getElementById("score-data-status").textContent = teams.length ? "积分更新失败，当前显示上次成功读取的演示记录。" : "积分记录暂时无法读取，请稍后重试。";
    } finally { dataRequestActive = false; }
  }
  function showTeam(id) {
    const team = teams.find(item => item.id === id);
    if (!team) return;
    scoreDialogTeam = id; evidenceDialogId = null;
    dialogApi.show(`${team.name} · 积分明细`, "DEMO / 虚拟演示", `<p class="draft-label">虚拟小组 · 演示数据</p><div class="score-breakdown">${scoreItems.map(([key, label]) => `<div><span>${label}</span><strong>${signedValue(key, team[key])}<small> 分</small></strong></div>`).join("")}</div><div class="total-line"><span>小组总分</span><strong>${team.total}</strong></div><p class="score-equation">${team.tasks} ＋ ${team.collaboration} ＋ ${team.presentation} − ${team.attendance} ＝ ${team.total}</p><div class="dialog-links"><a class="text-link" href="#rules" data-score-close>积分规则 ↗</a><a class="text-link" href="#score-history" id="team-history-link">本组修改历史 ↗</a></div>`, "scoring");
    document.getElementById("team-history-link").addEventListener("click", () => { document.getElementById("history-team").value = id; renderHistory(); dialogApi.close(); });
    dialogApi.element.querySelector("[data-score-close]").addEventListener("click", () => dialogApi.close());
  }
  function showEvidence(id) {
    const record = ledger.find(item => item.id === id);
    if (!record) return;
    evidenceDialogId = id; scoreDialogTeam = null;
    const impact = (record.after - record.before) * (record.item === "attendance" ? -1 : 1);
    dialogApi.show("积分记录依据", "DEMO / 演示依据", `<div class="evidence-detail"><p class="draft-label">以下为展示留痕方式的虚拟记录，不是实际活动凭证。</p><dl><div><dt>记录编号</dt><dd>${escapeHtml(record.id)}</dd></div><div><dt>小组 / 项目</dt><dd>${escapeHtml(teamName(record.teamId))} / ${itemNames[record.item]}</dd></div><div><dt>分项变化</dt><dd>${record.before} → ${record.after} 分${record.item === "attendance" ? "（扣分值）" : ""}</dd></div><div><dt>总分影响</dt><dd>${impact > 0 ? "+" : ""}${impact} 分</dd></div><div><dt>记录时间</dt><dd>${escapeHtml(record.displayTime)}</dd></div><div><dt>原记录</dt><dd>${escapeHtml(record.previousRecordId || "初次登记")}</dd></div><div><dt>依据编号</dt><dd>${escapeHtml(record.evidence.id)}</dd></div><div><dt>依据名称</dt><dd>${escapeHtml(record.evidence.title)}</dd></div><div><dt>报送 / 确认</dt><dd>${escapeHtml(record.reporter)} / ${escapeHtml(record.confirmer)}</dd></div></dl><h3>依据摘要</h3><p>${escapeHtml(record.evidence.content)}</p><h3>登记说明</h3><p>${escapeHtml(record.reason)}</p></div>`, "scoring");
  }
  document.getElementById("score-sort").addEventListener("change", renderScores);
  document.getElementById("history-team").addEventListener("change", renderHistory);
  dialogApi.element.addEventListener("close", () => { scoreDialogTeam = null; evidenceDialogId = null; });
  loadScores();
  setInterval(() => { if (!document.hidden) loadScores(); }, 30000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) loadScores(); });
})();
