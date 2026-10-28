(() => {
  "use strict";
  function validateProgramme(data, courseIds) {
    if (!data || data.schemaVersion !== 3 || !["draft", "published"].includes(data.status) || typeof data.notice !== "string" || !Array.isArray(data.days) || data.days.length !== 2) throw new Error("Invalid two-day programme");
    const coursesSeen = new Set();
    data.days.forEach((day, index) => {
      if (day.id !== `day-${index + 1}` || typeof day.label !== "string" || !day.label || !Array.isArray(day.entries) || !day.entries.length) throw new Error("Invalid programme day");
      day.entries.forEach(entry => {
        if (typeof entry.time !== "string" || !entry.time.trim() || typeof entry.title !== "string" || !entry.title.trim() || !["course", "activity", "interval"].includes(entry.kind)) throw new Error("Invalid timetable entry");
        if (entry.kind === "course") {
          if (!courseIds.includes(entry.courseId) || coursesSeen.has(entry.courseId)) throw new Error("Invalid timetable course");
          coursesSeen.add(entry.courseId);
        }
        if (entry.featured !== undefined && typeof entry.featured !== "boolean") throw new Error("Invalid feature flag");
        if (entry.note !== undefined && typeof entry.note !== "string") throw new Error("Invalid timetable note");
      });
    });
    if (coursesSeen.size !== courseIds.length) throw new Error("Missing course");
    return data;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = { validateProgramme };
  if (typeof document === "undefined") return;
  let programme = null, selectedDay = 0;
  const dayTabs = document.getElementById("schedule-days"), dayPanel = document.getElementById("day-timetable"), allButton = document.getElementById("open-schedule");
  const resourceButton = (label, mode, id) => `<button type="button" class="text-link" data-schedule-resource="${mode}" data-schedule-course="${id}" aria-haspopup="dialog">${label} <span aria-hidden="true">↗</span></button>`;
  function renderEntries(day, expanded = false) {
    return `<ol class="timetable-list">${day.entries.filter(entry => expanded || entry.featured !== false).map(entry => {
      const title = escapeHtml(entry.title), note = entry.note ? `<p>${escapeHtml(entry.note)}</p>` : "";
      const linkedTitle = entry.kind === "course" && !expanded ? `<a class="timetable-course-link" href="#course-${entry.courseId}" data-course-jump="${entry.courseId}">${title}<span aria-hidden="true">↗</span></a>` : title;
      const links = entry.kind === "course" && expanded ? `<div class="programme-links">${resourceButton("配置", "software", entry.courseId)}<a class="text-link" href="#course-${entry.courseId}" data-course-jump="${entry.courseId}">课程介绍 <span aria-hidden="true">↗</span></a></div>` : "";
      return `<li class="timetable-row${entry.kind === "interval" ? " is-interval" : ""}"><span class="timetable-time">${escapeHtml(entry.time)}</span><div class="timetable-content"><h3>${linkedTitle}</h3>${note}${links}</div></li>`;
    }).join("")}</ol>`;
  }
  function selectDay(index, focus = false) {
    selectedDay = index;
    dayTabs.querySelectorAll("button").forEach((button, i) => {
      button.setAttribute("aria-selected", String(i === index));
      button.tabIndex = i === index ? 0 : -1;
      if (focus && i === index) button.focus();
    });
    dayPanel.querySelectorAll(".timetable-day").forEach((panel, i) => {
      const active = i === index;
      panel.classList.toggle("is-active", active);
      panel.inert = !active;
      panel.setAttribute("aria-hidden", String(!active));
      panel.tabIndex = active ? 0 : -1;
    });
  }
  function showProgramme() {
    if (!programme) return;
    window.workshopDialog.show("两天课程时间表", "TWO-DAY PROGRAMME / 完整课表", `<p class="programme-note">${escapeHtml(programme.notice)}</p><div class="programme-days">${programme.days.map((day, index) => `<section class="programme-day" aria-labelledby="full-${day.id}"><h3 id="full-${day.id}">${escapeHtml(day.label)}<small>DAY 0${index + 1}</small></h3>${renderEntries(day, true)}</section>`).join("")}</div>`, "resources");
  }
  allButton.addEventListener("click", showProgramme);
  dayTabs.addEventListener("click", event => {
    const button = event.target.closest("button[data-day-index]");
    if (button) selectDay(Number(button.dataset.dayIndex));
  });
  dayTabs.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const index = event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - selectedDay;
    selectDay(index, true);
  });
  document.addEventListener("click", event => {
    const resource = event.target.closest?.("[data-schedule-resource]");
    if (resource) showCourseResources(resource.dataset.scheduleResource, resource.dataset.scheduleCourse);
    const courseLink = event.target.closest?.("[data-course-jump]");
    if (courseLink) { document.getElementById(`course-${courseLink.dataset.courseJump}`).open = true; window.workshopDialog.close(); }
  });
  async function loadProgramme() {
    try {
      const response = await fetch("data/schedule.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Programme unavailable");
      programme = validateProgramme(await response.json(), courses.map(course => course.id));
      document.getElementById("schedule-edition").textContent = programme.status === "draft" ? "2026年11月7—8日 · 具体时间待公布" : "两天课表";
      dayTabs.innerHTML = programme.days.map((day, index) => `<button type="button" class="schedule-day-tab" role="tab" id="tab-${day.id}" data-day-index="${index}" aria-controls="panel-${day.id}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}"><span>${escapeHtml(day.label)}</span><small>DAY 0${index + 1}</small></button>`).join("");
      // Both days share one grid cell, so the longer day sets a stable height.
      dayPanel.innerHTML = programme.days.map(day => `<div class="timetable-day" id="panel-${day.id}" role="tabpanel" aria-labelledby="tab-${day.id}" aria-hidden="true" tabindex="-1" inert>${renderEntries(day)}</div>`).join("");
      selectDay(selectedDay);
      document.getElementById("schedule-notice").textContent = programme.status === "draft" ? "课程次序可能微调，以现场授课为准" : "课表时间均为北京时间";
      allButton.disabled = false;
    } catch (_) {
      programme = null;
      dayTabs.innerHTML = "";
      dayPanel.textContent = "课表暂时无法读取，请稍后刷新。";
      document.getElementById("schedule-edition").textContent = "课表暂未读取";
      allButton.disabled = true;
    }
  }
  loadProgramme();
})();
