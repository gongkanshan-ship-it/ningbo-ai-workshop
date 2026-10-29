(() => {
  "use strict";
  const scoreItems = [["tasks", "课堂作业", 1], ["collaboration", "课堂表现", 1], ["presentation", "成果展示", 1], ["attendance", "出勤扣分", -1]];
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  function deriveScores(data) {
    if (!data || data.schemaVersion !== 3 || data.scoreModel !== "addition-minus-attendance" || data.mode !== "demo" || !Array.isArray(data.teams) || !data.teams.length) throw new Error("Invalid score source");
    const ids = new Set();
    return data.teams.map(team => {
      if (!team || typeof team.id !== "string" || !team.id.trim() || typeof team.name !== "string" || !team.name.trim() || ids.has(team.id)) throw new Error("Invalid group");
      ids.add(team.id);
      const result = { id: team.id, name: team.name };
      for (const [key] of scoreItems) {
        if (!Number.isFinite(team[key]) || team[key] < 0) throw new Error("Invalid score result");
        result[key] = team[key];
      }
      const total = scoreItems.reduce((sum, [key, , sign]) => sum + sign * result[key], 0);
      if (!Number.isFinite(total)) throw new Error("Invalid score total");
      return { ...result, total };
    });
  }
  function compareStandings(a, b) {
    return b.total - a.total || b.presentation - a.presentation || b.tasks - a.tasks || a.attendance - b.attendance;
  }
  // Keep exact ties equal; no extra tiebreak is defined by the scoring rules.
  function sortScores(teams, item = "total") {
    return [...teams].sort((a, b) => (item === "total" ? 0 : item === "attendance" ? a[item] - b[item] : b[item] - a[item]) || compareStandings(a, b));
  }
  // The pure calculation is available to the local verification script without a browser.
  if (typeof module !== "undefined" && module.exports) module.exports = { deriveScores, compareStandings, sortScores };
  if (typeof document === "undefined") return;
  const dialogApi = window.workshopDialog;
  if (!dialogApi || !document.getElementById("score-body")) return;
  let teams = [];
  let lastResultSignature = "", dataRequestActive = false;
  let scoreDialogTeam = null;
  const signedValue = (item, value) => `${item === "attendance" && value ? "−" : ""}${value}`;
  function renderScores() {
    const sort = document.getElementById("score-sort").value;
    const sorted = sortScores(teams, sort);
    document.getElementById("score-body").innerHTML = sorted.map((team, index) => `<tr><td>${String(index + 1).padStart(2, "0")}</td><td><button type="button" data-team="${escapeHtml(team.id)}" aria-label="查看${escapeHtml(team.name)}积分结果">${escapeHtml(team.name)} <span aria-hidden="true">↗</span></button></td><td>${team.tasks}</td><td>${team.collaboration}</td><td>${team.presentation}</td><td class="deduction-value">${signedValue("attendance", team.attendance)}</td><td>${team.total}</td></tr>`).join("");
    document.querySelectorAll("[data-team]").forEach(button => button.addEventListener("click", () => showTeam(button.dataset.team)));
  }
  async function loadScores() {
    if (dataRequestActive) return;
    dataRequestActive = true;
    try {
      const response = await fetch("data/score-results.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Score source unavailable");
      const data = await response.json(), nextTeams = deriveScores(data), signature = JSON.stringify(data);
      if (signature !== lastResultSignature) {
        teams = nextTeams;
        renderScores();
        if (dialogApi.element.open && dialogApi.owner === "scoring" && scoreDialogTeam) showTeam(scoreDialogTeam);
        lastResultSignature = signature;
      }
      document.getElementById("score-data-status").textContent = `虚拟演示 · ${teams.length} 个小组`;
    } catch (_) {
      document.getElementById("score-data-status").textContent = teams.length ? "积分更新失败，当前显示上次成功读取的演示结果。" : "积分结果暂时无法读取，请稍后重试。";
    } finally { dataRequestActive = false; }
  }
  function showTeam(id) {
    const team = teams.find(item => item.id === id);
    if (!team) return;
    scoreDialogTeam = id;
    dialogApi.show(`${team.name} · 积分结果`, "DEMO / 虚拟演示", `<p class="draft-label">虚拟小组 · 演示数据</p><div class="score-breakdown">${scoreItems.map(([key, label]) => `<div><span>${label}</span><strong>${signedValue(key, team[key])}<small> 分</small></strong></div>`).join("")}</div><div class="total-line"><span>小组总分</span><strong>${team.total}</strong></div><p class="score-equation">${team.tasks} ＋ ${team.collaboration} ＋ ${team.presentation} − ${team.attendance} ＝ ${team.total}</p><div class="dialog-links"><a class="text-link" href="#rules" data-score-close>积分规则 ↗</a></div>`, "scoring");
    dialogApi.element.querySelector("[data-score-close]").addEventListener("click", () => dialogApi.close());
  }
  document.getElementById("score-sort").addEventListener("change", renderScores);
  dialogApi.element.addEventListener("close", () => { scoreDialogTeam = null; });
  loadScores();
  setInterval(() => { if (!document.hidden) loadScores(); }, 30000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) loadScores(); });
})();
