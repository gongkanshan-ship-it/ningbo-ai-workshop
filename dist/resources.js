/* Course materials use one complete ZIP package. Enable download only after publication. */
"use strict";
const courseConfiguration = {
  "01": { tools: ["WorkBuddy"], setup: "安装并登录 WorkBuddy；建立独立练习文件夹，允许软件访问该目录。", check: "读取一份练习文件，生成内容后保存，并实际打开检查。额外配置待讲师确认。", links: [[official.workbuddy, "WorkBuddy 官网"]] },
  "02": { tools: ["WorkBuddy"], setup: "完成 WorkBuddy 安装与登录；建立独立的 Skill 练习目录。", check: "确认可读取练习目录并保存输出。额外工具与配置待讲师确认。", links: [[official.workbuddy, "WorkBuddy 官网"]] },
  "03": { tools: ["演示工具待讲师确认"], setup: "按统一课前指引完成设备和基础软件准备。本课额外工具与配置待讲师确认。", check: "确认笔记本电脑、电源和网络可用。", links: [] },
  "04": { tools: ["WorkBuddy", "企查查 MCP"], setup: "安装并登录 WorkBuddy；按企查查官方指南完成 MCP 接入。", check: "确认工作区可读取材料、保存输出，并完成企查查 MCP 连接测试。额外配置待讲师确认。", links: [[official.workbuddy, "WorkBuddy 官网"], [official.qcc, "企查查 MCP 操作指南"]] },
  "05": { tools: ["演示工具待讲师确认"], setup: "准备可联网的笔记本电脑，整理前四课学习记录。", check: "本课演示工具、账户及额外配置待讲师确认。", links: [] }
};

function showCourseResources(mode, courseId = null) {
  if (mode === "materials") {
    window.workshopDialog.show("课程材料", "COURSE MATERIALS / 统一下载", `
      <article class="material-package" aria-labelledby="material-package-title">
        <div class="material-package-heading">
          <span class="material-package-format" aria-hidden="true">ZIP</span>
          <span class="material-package-status">待发布</span>
        </div>
        <p class="material-package-eyebrow">五门课程 · 一个资料包</p>
        <h3 id="material-package-title">全部课程材料包</h3>
        <p class="material-package-description">课程资料将统一整理为一个 ZIP 压缩包，发布后可在此一键下载。</p>
        <div class="material-package-footer">
          <p id="material-package-notice">材料正在收集与核对中，完整资料包尚未发布。</p>
          <button type="button" class="button primary material-package-download" disabled aria-describedby="material-package-notice">一键下载全部课程材料 <span aria-hidden="true">↓</span></button>
        </div>
      </article>
    `, "resources");
    return;
  }

  const selectedCourse = courses.find(course => course.id === courseId);
  const visibleCourses = selectedCourse ? [selectedCourse] : courses;
  const cards = visibleCourses.map(course => {
    const config = courseConfiguration[course.id] || { tools: ["待讲师确认"], setup: "本课软件及配置要求待讲师确认。", check: "按统一课前指引完成设备和基础软件准备。", links: [] };
    return `<article class="resource-card"><div class="resource-card-heading"><span>${course.id}</span><div><h3>${escapeHtml(course.title)}</h3><p>${escapeHtml(course.subtitle)}</p></div></div>
      <div class="software-tags">${config.tools.map(tool => `<span>${escapeHtml(tool)}</span>`).join("")}</div>
      <dl class="configuration-list"><div><dt>课前配置</dt><dd>${escapeHtml(config.setup)}</dd></div><div><dt>准备检查</dt><dd>${escapeHtml(config.check)}</dd></div></dl>
      ${config.links.length ? `<div class="resource-official-links">${config.links.map(([url, label]) => externalLink(url, label)).join("")}</div>` : ""}
    </article>`;
  }).join("");
  const actions = selectedCourse
    ? `<div class="single-resource-toolbar"><p>第 ${selectedCourse.id} 课 · 软件与配置</p><button type="button" class="text-link" data-open-resources="software" aria-haspopup="dialog">查看全部课程配置 <span aria-hidden="true">↗</span></button></div>`
    : `<div class="resource-bundle"><p>先按课前指引完成 WorkBuddy 与企查查 MCP 的准备，再查看各课配置说明。</p><a class="text-link" href="#system-requirements" data-resource-jump>查看设备与系统要求 <span aria-hidden="true">↗</span></a></div>`;
  window.workshopDialog.show(selectedCourse ? "本课配置" : "软件准备清单", "COURSE SETUP / 课程配置", `${actions}<div class="resource-grid${selectedCourse ? " resource-grid-single" : ""}">${cards}</div>`, "resources");
}

// Delegation also supports resource buttons rendered inside the shared dialog.
document.addEventListener("click", event => {
  const button = event.target.closest?.("[data-open-resources]");
  if (button) showCourseResources(button.dataset.openResources, button.dataset.resourceCourse || null);
  if (event.target.closest?.("[data-resource-jump]")) window.workshopDialog.close();
});
