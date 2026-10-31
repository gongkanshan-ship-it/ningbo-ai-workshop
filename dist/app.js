"use strict";
// Course titles and order follow the first-cohort training plan. Timings await publication.
const courses = [
  { id: "01", title: "认识你的 AI 工作台", subtitle: "Workbuddy 初体验与可视化实务", software: "WorkBuddy", description: "从工作台基础操作开始，在法律场景中完成首次体验，学习使用可视化组件表达成果。", preparation: "完成课前指引中的安装、登录与电脑环境检查。" },
  { id: "02", title: "把管理经验写进 Skill", subtitle: "律所管理技能制作", software: "WorkBuddy", description: "学习 Skill 的基本结构与规则设计，将律所管理经验写成可用的技能，在场景制作中理解迭代方法和知识库应用。", preparation: "完成 WorkBuddy 基础操作，想好一个希望通过 AI 改善的律所管理场景。" },
  { id: "03", title: "大模型的聪明与幻觉", subtitle: "生成式人工智能基础", software: "具体演示工具以授课安排为准", description: "理解大模型基本原理、幻觉形成、核验方法和使用边界，为实际应用建立判断依据。", preparation: "准备可联网的笔记本电脑，记录前两课使用过程中遇到的问题。" },
  { id: "04", title: "给 AI 立规矩", subtitle: "案件分析工作区构建", software: "WorkBuddy、企查查 MCP", description: "学习工作区规则、任务拆解和外部数据接入，构建案件分析流程，并核验输出结果。", preparation: "按课前指引完成 WorkBuddy 与企查查连接器准备；课堂统一使用脱敏材料。" },
  { id: "05", title: "看懂 Agent", subtitle: "原理、产品与认知框架", software: "演示产品以授课安排为准", description: "认识 Agent 形态，建立产品判断框架，串联各课内容，形成课后的应用行动。", preparation: "整理前四课的学习记录和小组实践问题。" }
];
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
document.getElementById("course-list").innerHTML = courses.map(course => `
  <details class="course-row" id="course-${course.id}"><summary><span class="course-number">${course.id}</span><span class="course-title">${course.title}<small>${course.subtitle}</small></span><span class="course-duration">时长待公布</span><span class="course-toggle" aria-hidden="true">＋</span></summary><div class="course-detail"><p>${course.description}</p><div class="course-resource"><div><span class="resource-label">使用软件</span><strong>${course.software}</strong></div><div><span class="resource-label">课前准备</span><p>${course.preparation}</p></div></div></div></details>
`).join("");
const official = {
  workbuddy: "https://www.workbuddy.cn/",
  win: "https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Installation-Win-Guide",
  mac: "https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Installation-Mac-Guide",
  qcc: "https://agent.qcc.com/guide"
};
const externalLink = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;

const feedbackTemplate = "技术问题反馈\n系统及版本：\n工具及版本：\n我正在进行的操作：\n复现步骤：\n完整报错：\n截图：请另附（注意遮盖个人和客户信息）";
document.getElementById("copy-support").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(feedbackTemplate); document.getElementById("copy-status").textContent = "模板已复制，可填写后向现场技术组出示。"; }
  catch (_) { const textarea = document.getElementById("support-template"); textarea.value = feedbackTemplate; textarea.hidden = false; textarea.focus(); textarea.select(); document.getElementById("copy-status").textContent = "请手动复制下方模板。"; }
});

// Shared, accessible detail dialog for course resources and the timetable.
const dialog = document.getElementById("detail-dialog");
let dialogOwner = null;
window.workshopDialog = {
  element: dialog,
  get owner() { return dialogOwner; },
  show(title, kicker, content, owner = null) {
    closeMobileNavigation();
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

const navLinks = [...document.querySelectorAll("#main-nav a")];
const sectionOrder = ["home", "prepare", "overview", "courses", "groups", "rules", "support"];
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
  scrollFrame = null;
}
window.addEventListener("scroll", () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateNavigation); }, { passive: true });
window.addEventListener("resize", updateNavigation);
updateNavigation();

// Compact mobile navigation; keep all chapters accessible without shrinking text.
const siteHeader = document.querySelector(".site-header");
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileNavigation = window.matchMedia("(max-width: 680px)");
document.documentElement.classList.add("nav-enhanced");
function closeMobileNavigation() {
  siteHeader.classList.remove("navigation-open");
  mobileMenuToggle.setAttribute("aria-expanded", "false");
  mobileMenuToggle.setAttribute("aria-label", "展开导航");
  updateNavigation();
}
mobileMenuToggle.addEventListener("click", () => {
  const open = !siteHeader.classList.contains("navigation-open");
  siteHeader.classList.toggle("navigation-open", open);
  mobileMenuToggle.setAttribute("aria-expanded", String(open));
  mobileMenuToggle.setAttribute("aria-label", open ? "收起导航" : "展开导航");
  updateNavigation();
});
siteHeader.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener("click", closeMobileNavigation));
document.addEventListener("click", event => {
  if (siteHeader.classList.contains("navigation-open") && !siteHeader.contains(event.target)) closeMobileNavigation();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && siteHeader.classList.contains("navigation-open")) {
    closeMobileNavigation();
    mobileMenuToggle.focus();
  }
});
mobileNavigation.addEventListener("change", closeMobileNavigation);
updateNavigation();
