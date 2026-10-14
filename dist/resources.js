/* Course resource details. Only published local files have download links. */
"use strict";
const courseMaterials = {
  "01": ["基础操作练习材料"],
  "02": ["课堂演示与核验资料"],
  "03": ["入门课短输入样例", "操作卡与 Skill 资料"],
  "04": ["知识库练习材料", "元典 MCP 接入操作指南"],
  "05": ["课堂模拟案例", "工作区模板"],
  "06": ["Agent 演示与准备材料"]
};
const courseConfiguration = {
  "01": { tools: ["WorkBuddy"], setup: "安装并登录；建立独立练习文件夹，允许软件访问该目录。", check: "读取一份练习文件，生成内容后保存，并实际打开检查。", links: [[official.workbuddy, "WorkBuddy 官网"]] },
  "02": { tools: ["课堂演示工具待补充"], setup: "准备可联网的笔记本电脑。具体工具与账户要求待讲师补充。", check: "核验资料与演示方式将在本课准备说明中更新。", links: [] },
  "03": { tools: ["WorkBuddy"], setup: "完成第 1 课基础操作，准备独立的 Skill 练习目录。", check: "本课 Skill 资料、导入步骤与测试输入待讲师补充。", links: [[official.workbuddy, "WorkBuddy 官网"]] },
  "04": { tools: ["ima", "WorkBuddy", "元典 MCP"], setup: "安装并登录 ima 与 WorkBuddy；按操作指南配置元典 MCP。", check: "课前完成一次材料导入与连接测试；课堂知识库材料和接入步骤待补充。", links: [[official.ima, "ima 官方下载"], [official.mcp, "元典 MCP 接入说明"]] },
  "05": { tools: ["WorkBuddy"], setup: "建立独立工作区，确认练习目录可读取、输出文件可保存。", check: "课堂使用的模拟案例与工作区模板待讲师补充。", links: [[official.workbuddy, "WorkBuddy 官网"]] },
  "06": { tools: ["演示产品待补充"], setup: "整理前五课学习记录，准备可联网的笔记本电脑。", check: "演示产品、账户及配置要求待讲师补充。", links: [] }
};
function showCourseResources(mode, courseId = null) {
  const materials = mode === "materials";
  const selectedCourse = courses.find(course => course.id === courseId);
  const visibleCourses = selectedCourse ? [selectedCourse] : courses;
  const cards = visibleCourses.map(course => {
    const config = courseConfiguration[course.id];
    const content = materials ? `
      <p class="resource-summary">${escapeHtml(course.preparation)}</p>
      <div class="resource-file"><div><strong>第 ${course.id} 课 · 准备说明</strong><small>TXT · 已备资料</small></div><a class="text-link" href="downloads/course-${course.id}-preparation.txt" download aria-label="下载第 ${course.id} 课准备说明">下载 <span aria-hidden="true">↓</span></a></div>
      <ul class="pending-files">${courseMaterials[course.id].map(file => `<li><span>${escapeHtml(file)}</span><small>待补充</small></li>`).join("")}</ul>
    ` : `
      <div class="software-tags">${config.tools.map(tool => `<span>${escapeHtml(tool)}</span>`).join("")}</div>
      <dl class="configuration-list"><div><dt>课前配置</dt><dd>${escapeHtml(config.setup)}</dd></div><div><dt>准备检查</dt><dd>${escapeHtml(config.check)}</dd></div></dl>
      ${config.links.length ? `<div class="resource-official-links">${config.links.map(([url, label]) => externalLink(url, label)).join("")}</div>` : ""}
    `;
    return `<article class="resource-card"><div class="resource-card-heading"><span>${course.id}</span><div><h3>${escapeHtml(course.title)}</h3><p>${escapeHtml(course.subtitle)}</p></div></div>${content}</article>`;
  }).join("");
  let actions = materials ? `<div class="resource-bundle"><div><strong>一次备齐，分课使用</strong><p>当前资料包包含六课准备说明；课件与练习材料将随课程补充。</p></div><a class="button primary" href="downloads/course-preparation-all.zip" download>一键下载已备资料 <span aria-hidden="true">↓</span></a></div>` : `<div class="resource-bundle"><p>先按自己的系统完成基础安装，再查看每门课的配置要求。</p><a class="text-link" href="#system-requirements" data-resource-jump>查看设备与系统要求 <span aria-hidden="true">↗</span></a></div>`;
  if (selectedCourse) actions = `<div class="single-resource-toolbar"><p>第 ${selectedCourse.id} 课 · ${materials ? "所需材料与下载" : "软件与配置"}</p><button type="button" class="text-link" data-resource-all>查看全部六课 <span aria-hidden="true">↗</span></button></div>`;
  window.workshopDialog.show(selectedCourse ? (materials ? "本课材料" : "本课配置") : (materials ? "六课准备说明" : "软件准备清单"), materials ? "COURSE MATERIALS / 分课资料" : "COURSE SETUP / 分课配置", `${actions}<div class="resource-grid${selectedCourse ? " resource-grid-single" : ""}">${cards}</div>`, "resources");
  document.querySelector("[data-resource-all]")?.addEventListener("click", () => showCourseResources(mode));
  document.querySelector("[data-resource-jump]")?.addEventListener("click", () => window.workshopDialog.close());
}
document.querySelectorAll("[data-open-resources]").forEach(button => button.addEventListener("click", () => showCourseResources(button.dataset.openResources)));
