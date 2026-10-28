(() => {
  const host = document.getElementById("preclass-guide-content");
  if (!host) return;

  // Source: 学习指南-含课前指引（1028课程表缺）.pdf, pages 2–3.
  // Group size follows the user's confirmed instruction: 10 participants per group.
  host.innerHTML = `
    <div class="guide-layout">
    <aside class="guide-intro" aria-labelledby="guide-title">
      <p class="eyebrow">THE WORKSHOP HANDBOOK</p>
      <h2 id="guide-title">课前指引</h2>
      <p class="guide-intro-copy">备好电脑与软件，<br>把课堂时间留给<br>学习与实践。</p>
      <div class="guide-intro-art" aria-hidden="true">
        <svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="227" cy="49" r="32" fill="currentColor" opacity=".06"/>
          <g stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 123H292M18 117H282M83 42V141M87 42V141M83 49L20 117M83 60L42 117M83 73L61 117M87 49L159 117M87 65L135 117M87 84L109 117" opacity=".65"/>
            <path d="M163 112V84H182V112M169 91H176M169 99H176M231 112V73H251V112M237 81H245M237 90H245M260 112V92H275V112" opacity=".32"/>
            <path d="M192 112V76C192 51 198 32 205 27C214 35 219 58 219 78V112M199 112V76C199 51 202 36 205 27M212 112V77C212 52 208 35 205 27M194 64H217M193 77H219M192 91H219M192 103H219" opacity=".48"/>
            <path d="M8 143C57 129 105 158 154 146S242 128 292 141M27 157C73 147 108 169 152 158S230 147 275 155M68 171C107 169 128 180 165 171S226 163 245 167" opacity=".38"/>
          </g>
        </svg>
      </div>
      <ol class="guide-route" aria-label="准备顺序">
        <li><span>01</span><span>备好电脑</span></li>
        <li><span>02</span><span>安装软件</span></li>
        <li><span>03</span><span>连接工具</span></li>
      </ol>
    </aside>
    <div class="guide-main">
    <div class="guide-tabs" role="tablist" aria-label="课前指引内容">
      <button type="button" id="guide-tab-prepare" role="tab" aria-selected="true" aria-controls="guide-panel-prepare" tabindex="0"><span class="guide-tab-number" aria-hidden="true">01</span>课前准备<span class="guide-tab-caption">电脑与软件环境</span></button>
      <button type="button" id="guide-tab-notice" role="tab" aria-selected="false" aria-controls="guide-panel-notice" tabindex="-1"><span class="guide-tab-number" aria-hidden="true">02</span>学员须知<span class="guide-tab-caption">学习纪律与参训提示</span></button>
    </div>
    <div class="guide-panels">
      <div class="guide-panel" id="guide-panel-prepare" role="tabpanel" aria-labelledby="guide-tab-prepare" tabindex="0">
        <div class="guide-preparation-grid">
          <article class="guide-step guide-device" id="system-requirements" aria-labelledby="guide-device-title">
            <div class="guide-step-heading"><span aria-hidden="true">01</span><h3 id="guide-device-title">电脑与网络</h3></div>
            <div class="guide-step-body guide-device-layout">
            <div class="guide-device-settings">
              <div class="guide-platform-tabs" role="tablist" aria-label="选择电脑系统">
                <button type="button" id="guide-os-tab-mac" role="tab" aria-selected="true" aria-controls="guide-os-panel-mac" tabindex="0">Mac</button>
                <button type="button" id="guide-os-tab-windows" role="tab" aria-selected="false" aria-controls="guide-os-panel-windows" tabindex="-1">Windows</button>
              </div>
              <div class="guide-platform-panels">
                <div class="guide-platform" id="guide-os-panel-mac" role="tabpanel" aria-labelledby="guide-os-tab-mac" tabindex="0"><p>macOS 12 或以上</p><p class="guide-package">苹果 M 系列选 <strong>ARM64</strong><br>Intel 芯片选 <strong>X64</strong></p></div>
                <div class="guide-platform" id="guide-os-panel-windows" role="tabpanel" aria-labelledby="guide-os-tab-windows" tabindex="0" hidden inert><p>Windows 10 / 11 · 64 位 x64 系统</p><p class="guide-package">ARM64 设备请联系技术组核验。</p></div>
              </div>
              <p class="guide-configuration"><strong>课堂建议配置</strong><span>内存 8GB 及以上（16GB 更佳）；可用空间至少 10GB。</span></p>
            </div>
            <ul class="guide-checklist">
              <li>系统与安装包匹配，电脑已备妥。</li>
              <li>携带电脑电源适配器及充电线，并确认能够正常充电。</li>
              <li>连接现场网络并完成认证，浏览器能够打开软件官网。</li>
              <li>手机可扫码或接收验证码，能够完成账号登录与授权。</li>
            </ul>
            </div>
          </article>
            <article class="guide-step guide-workbuddy" aria-labelledby="guide-workbuddy-title">
              <div class="guide-step-heading"><span aria-hidden="true">02</span><h3 id="guide-workbuddy-title">WorkBuddy 安装与文件操作</h3></div>
              <div class="guide-step-body guide-software-layout"><div class="guide-software-copy">
              <dl class="guide-installation"><div><dt>Mac</dt><dd>打开安装包，将应用拖入“应用程序”。</dd></div><div><dt>Windows</dt><dd>双击安装包，按提示完成安装。</dd></div></dl>
              <p class="guide-test"><span>登录测试</span>完成安装与登录，确认能够正常进入主界面。</p>
              </div><div class="guide-download-area">
                <a class="guide-official-link" href="https://www.workbuddy.cn/" target="_blank" rel="noopener noreferrer">打开 WorkBuddy 官网 <span aria-hidden="true">↗</span><span class="sr-only">（在新标签页打开）</span></a>
                <p class="guide-download-note">安装包可从官网下载，也可查看班级群分享或网站链接。</p>
              </div></div>
            </article>
            <article class="guide-step guide-qcc" aria-labelledby="guide-qcc-title">
              <div class="guide-step-heading"><span aria-hidden="true">03</span><h3 id="guide-qcc-title">企查查 MCP 连接与调用</h3></div>
              <div class="guide-step-body">
              <p class="guide-qcc-copy">在 WorkBuddy 中启用企查查连接器，完成登录授权，并确认能够看到可用工具。</p>
              <a class="guide-official-link" href="https://agent.qcc.com/guide" target="_blank" rel="noopener noreferrer">查看企查查官方接入指南 <span aria-hidden="true">↗</span><span class="sr-only">（在新标签页打开）</span></a>
              </div>
            </article>
        </div>
        <div class="guide-help-note"><h3>检查完成后</h3><p>请确认以上准备是否已完成。如仍需协助，记录电脑系统、问题类型和问题简述，再联系技术组。</p><div class="guide-problem-types" aria-label="问题类型"><span>安装</span><span>登录</span><span>网络</span><span>文件操作</span><span>MCP 连接</span></div></div>
      </div>
      <div class="guide-panel" id="guide-panel-notice" role="tabpanel" aria-labelledby="guide-tab-notice" tabindex="0" hidden inert>
        <div class="guide-welcome"><p class="guide-salutation">亲爱的学员：</p><p>欢迎参加律所合伙人 AI 赋能专项研修班（第一期·领航班）。本期研修以管理层认知启蒙和应用能力提升为重点，通过集中培训、场景实操、分组协作和成果展示，帮助您把人工智能转化为可复用的律所管理与法律实务工作方法。</p></div>
        <ol class="guide-notice-list">
          <li><span class="guide-notice-number" aria-hidden="true">01</span><div><h3>全程参训</h3><p>请按课程安排准时参加两天全部课程，不迟到、不早退；确有特殊情况需请假的，请提前联系班务组。</p></div></li>
          <li><span class="guide-notice-number" aria-hidden="true">02</span><div><h3>维护课堂秩序</h3><p>培训期间请将手机调至静音或振动状态，不随意走动，不在课堂上接打电话，共同保持专注、有序的学习环境。</p></div></li>
          <li><span class="guide-notice-number" aria-hidden="true">03</span><div><h3>遵守保密要求</h3><p>现场演示和练习统一使用脱敏材料，不得使用真实客户材料或未脱敏案件信息；未经允许，不公开传播课程资料、他人成果及现场信息。</p></div></li>
          <li><span class="guide-notice-number" aria-hidden="true">04</span><div><h3>做好实操准备</h3><p>请自备可联网笔记本电脑和电源，按课前指引完成账号、软件和环境准备；课堂操作遇到问题可及时联系技术组。</p></div></li>
          <li><span class="guide-notice-number" aria-hidden="true">05</span><div><h3>积极参与协作</h3><p>每组 10 人，请服从分组安排，主动参与讨论、课堂作业和成果制作。每组最终提交 1 个 Skill，并参加小组成果展示。</p></div></li>
          <li><span class="guide-notice-number" aria-hidden="true">06</span><div><h3>餐食与其他安排</h3><p>培训期间统一安排午餐，住宿自理。课程次序可能微调，以现场授课为准。</p></div></li>
        </ol>
      </div>
    </div>
    <div class="guide-footer">
      <div class="guide-contacts" aria-label="现场联系人">
        <a href="tel:18616366112"><span>班务组联系人</span><strong>董远航</strong><span class="guide-phone">186 1636 6112</span><span class="sr-only">，拨打电话</span></a>
        <a href="tel:13967892069"><span>技术组联系人</span><strong>上官明泓</strong><span class="guide-phone">139 6789 2069</span><span class="sr-only">，拨打电话</span></a>
      </div>
      <div class="guide-more"><button class="text-link" type="button" data-open-resources="software" aria-haspopup="dialog">查看课程配置 <span aria-hidden="true">↗</span></button><a class="text-link" href="#overview">查看课程安排 <span aria-hidden="true">↓</span></a></div>
    </div>
    </div>
    </div>
  `;

  // Each tab group has its own scope: switching systems must not switch guide pages.
  function bindTabs(tabList) {
    const tabs = [...tabList.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute("aria-controls")));
    function select(index, focus = false) {
      tabs.forEach((tab, current) => {
        const selected = current === index;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[current].hidden = !selected;
        panels[current].inert = !selected;
      });
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(index));
      tab.addEventListener("keydown", event => {
        let next;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        select(next, true);
      });
    });
    return select;
  }
  const selectTab = bindTabs(host.querySelector('.guide-tabs'));
  bindTabs(host.querySelector('.guide-platform-tabs'));

  // Keep device links useful even when the attendee-notice tab is selected.
  function revealDeviceRequirements() {
    if (window.location.hash !== "#system-requirements") return;
    selectTab(0);
    requestAnimationFrame(() => document.getElementById("system-requirements").scrollIntoView({ block: "start" }));
  }
  document.addEventListener("click", event => {
    const link = event.target.closest('a[href="#system-requirements"]');
    if (link) selectTab(0);
  });
  window.addEventListener("hashchange", revealDeviceRequirements);
  revealDeviceRequirements();
})();
