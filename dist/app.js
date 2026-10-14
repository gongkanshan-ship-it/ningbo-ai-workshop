"use strict";
const courses = [
  { id: "01", title: "认识你的 AI 工作台", subtitle: "WorkBuddy 初体验", duration: 60, software: "WorkBuddy", description: "从基础操作开始，熟悉 AI 工作台的使用方法，在法律场景中完成第一次体验。", preparation: "安装并登录 WorkBuddy；建立独立练习文件夹，确认能读取、生成并保存文件。" },
  { id: "02", title: "大模型的聪明与幻觉", subtitle: "生成式人工智能基础", duration: 60, software: "课堂演示工具待讲师补充", description: "理解生成式人工智能的基本原理、幻觉形成原因、核验方法和使用边界，为后续实操建立判断依据。", preparation: "准备笔记本电脑；课堂演示工具与核验资料待讲师补充。" },
  { id: "03", title: "把咨询经验写进 Skill", subtitle: "法律咨询技能制作", duration: 75, software: "WorkBuddy", description: "理解 Skill 的基本结构，把法律咨询中的经验写成规则，在具体场景中完成制作并学习迭代方法。", preparation: "完成 WorkBuddy 基础操作；本次入门课使用的短输入、操作卡及 Skill 资料待讲师补充。" },
  { id: "04", title: "检索的加速度", subtitle: "MCP、知识库与 RAG 实战", duration: 60, software: "ima、WorkBuddy、元典 MCP", description: "认识 MCP、知识库与 RAG，理解数据获取与检索的关系，并在法律检索场景中练习使用。", preparation: "安装并登录 ima；准备 WorkBuddy，按后续操作指南接入元典 MCP。课堂知识库材料与具体接入步骤待补充。" },
  { id: "05", title: "给 AI 立规矩", subtitle: "案件分析工作区构建", duration: 90, software: "WorkBuddy", description: "学习为工作区设置规则，拆解任务、组织案件分析流程，并对 AI 输出进行核验，让工作可以持续推进。", preparation: "准备独立工作区；确认可访问练习目录并保存输出。本次课堂选用的模拟案例与工作区模板待讲师补充。" },
  { id: "06", title: "看懂 Agent", subtitle: "原理、产品与认知框架", duration: 45, software: "演示产品待讲师补充", description: "建立对 Agent 形态与产品的判断框架，串联六门课程的知识，形成带回工作中的后续行动。", preparation: "整理前五课的学习记录；演示产品与准备材料待讲师补充。" }
];
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
document.getElementById("course-list").innerHTML = courses.map(course => `
  <details class="course-row" id="course-${course.id}"><summary><span class="course-number">${course.id}</span><span class="course-title">${course.title}<small>${course.subtitle}</small></span><span class="course-duration">${course.duration} 分钟</span><span class="course-toggle" aria-hidden="true">＋</span></summary><div class="course-detail"><p>${course.description}</p><div class="course-resource"><div><span class="resource-label">使用软件</span><strong>${course.software}</strong></div><div><span class="resource-label">课前准备</span><p>${course.preparation}</p></div><div><span class="resource-label">材料下载</span><a class="text-link" href="downloads/course-${course.id}-preparation.txt" download>第 ${course.id} 课 · 课前准备说明 <span aria-hidden="true">↓</span></a></div><div><span class="resource-label">课堂材料</span><span class="pending-text">讲师课件与练习材料待补充</span></div></div></div></details>
`).join("");
const preparationItems = [
  ["带好笔记本与电源", "确认设备可联网，预留存储空间。"],
  ["完成 WorkBuddy、ima 安装与登录", "分别启动软件，确认账户可用。"],
  ["准备元典 MCP", "按课程操作指南完成接入，并进行一次连接测试。"],
  ["建立独立的练习文件夹", "将练习与日常工作分开，只使用公开或脱敏材料。"],
  ["跑通一次最小操作", "读取材料 → 生成内容 → 保存文件 → 实际打开检查。"],
  ["记录问题与报错", "保留系统版本、操作步骤及完整报错，便于技术组定位。"]
];
document.getElementById("preparation-list").innerHTML = preparationItems.map(([title, text], index) => `<li><span class="preparation-number">${String(index + 1).padStart(2, "0")}</span><div><strong>${title}</strong><p>${text}</p></div></li>`).join("");
const official = {
  workbuddy: "https://www.workbuddy.cn/",
  win: "https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Installation-Win-Guide",
  mac: "https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Installation-Mac-Guide",
  ima: "https://ima.tencent.com/download",
  mcp: "https://open.chineselaw.com/mcp-config/"
};
const externalLink = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
document.getElementById("system-cards").innerHTML = `
  <article class="system-card"><span class="system-label">01 / WINDOWS</span><h3>Windows</h3><p class="system-baseline">Windows 10 及以上 · x64</p><ul><li>安装 WorkBuddy 与 ima。</li><li>Windows ARM 设备请提前联系技术组核验。</li></ul><div class="official-links">${externalLink(official.win, "WorkBuddy 安装指南")}${externalLink(official.ima, "ima 官方下载")}</div></article>
  <article class="system-card"><span class="system-label">02 / MACOS</span><h3>Mac</h3><p class="system-baseline">macOS 12 及以上</p><ul><li>WorkBuddy：M 系列芯片选 ARM64；Intel 芯片选 X64。</li><li>ima 从官网下载 Mac 客户端。</li></ul><div class="official-links">${externalLink(official.mac, "WorkBuddy 安装指南")}${externalLink(official.ima, "ima 官方下载")}</div></article>
  <article class="system-card"><span class="system-label">03 / HARMONYOS</span><h3>鸿蒙</h3><p class="system-baseline">课前完成设备适配测试</p><ul><li>WorkBuddy 已提供鸿蒙电脑版，ima 已提供鸿蒙客户端。</li><li>材料导入、Skill 运行和元典 MCP 连接需按本班流程测试。</li><li>最低系统版本及课堂兼容情况待核验。</li></ul><div class="official-links">${externalLink(official.workbuddy, "WorkBuddy 官方下载")}${externalLink(official.ima, "ima 官方下载")}</div></article>
  <div class="mcp-setup"><strong>元典 MCP</strong><p>在支持 MCP 的授课工具内接入，具体账户配置与操作步骤将在课程指南中补充。</p>${externalLink(official.mcp, "官方 MCP 接入说明")}</div>`;

const feedbackTemplate = "技术问题反馈\n系统及版本：\n工具及版本：\n我正在进行的操作：\n复现步骤：\n完整报错：\n截图：请另附（注意遮盖个人和客户信息）";
document.getElementById("copy-support").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(feedbackTemplate); document.getElementById("copy-status").textContent = "模板已复制，可填写后向现场技术组出示。"; }
  catch (_) { const textarea = document.getElementById("support-template"); textarea.value = feedbackTemplate; textarea.hidden = false; textarea.focus(); textarea.select(); document.getElementById("copy-status").textContent = "请手动复制下方模板。"; }
});

// Shared, accessible detail dialog for course resources and scoring evidence.
const dialog = document.getElementById("detail-dialog");
let dialogOwner = null;
window.workshopDialog = {
  element: dialog,
  get owner() { return dialogOwner; },
  show(title, kicker, content, owner = null) {
    dialogOwner = owner;
    dialog.classList.toggle("resource-dialog", owner === "resources");
    document.getElementById("dialog-title").textContent = title;
    document.getElementById("dialog-kicker").textContent = kicker;
    document.getElementById("dialog-content").innerHTML = content;
    if (!dialog.open) dialog.showModal();
    else dialog.querySelector(".dialog-close").focus();
    dialog.scrollTop = 0;
  },
  close() { dialog.close(); }
};
document.querySelectorAll(".dialog-close,.dialog-done").forEach(button => button.addEventListener("click", () => dialog.close()));
dialog.addEventListener("close", () => { dialogOwner = null; });
dialog.addEventListener("click", event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});

const scoreNavToggle = document.getElementById("score-nav-toggle");
const scoreNavPanel = document.getElementById("score-nav-panel");
function closeScoreNavigation() {
  scoreNavPanel.hidden = true;
  scoreNavToggle.setAttribute("aria-expanded", "false");
}
scoreNavToggle.addEventListener("click", event => {
  const open = scoreNavPanel.hidden;
  scoreNavPanel.hidden = !open;
  scoreNavToggle.setAttribute("aria-expanded", String(open));
  if (open && event.detail === 0) scoreNavPanel.querySelector("a").focus();
});
scoreNavPanel.querySelectorAll("a").forEach(link => link.addEventListener("click", closeScoreNavigation));
document.addEventListener("click", event => {
  if (!scoreNavPanel.contains(event.target) && !scoreNavToggle.contains(event.target)) closeScoreNavigation();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !scoreNavPanel.hidden) {
    closeScoreNavigation();
    scoreNavToggle.focus();
  }
});
const navLinks = [...document.querySelectorAll("#main-nav a, #score-nav-panel a")];
const sectionOrder = ["home", "overview", "prepare", "courses", "groups", "rules", "scores", "score-history", "support"];
const trackedSections = sectionOrder.map(id => document.getElementById(id));
let scrollFrame;
function updateNavigation() {
  const headerHeight = document.querySelector(".site-header").offsetHeight;
  document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
  let activeSection = trackedSections[0];
  trackedSections.forEach(section => { if (section && section.getBoundingClientRect().top <= headerHeight + 80) activeSection = section; });
  navLinks.forEach(link => {
    const active = link.getAttribute("href") === `#${activeSection.id}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  const scoreActive = ["rules", "scores", "score-history"].includes(activeSection.id);
  scoreNavToggle.classList.toggle("active", scoreActive);
  if (scoreActive) scoreNavToggle.setAttribute("aria-current", "location");
  else scoreNavToggle.removeAttribute("aria-current");
  scrollFrame = null;
}
window.addEventListener("scroll", () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateNavigation); }, { passive: true });
window.addEventListener("resize", updateNavigation);
updateNavigation();
