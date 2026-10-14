/* Public roster is separate from the virtual score teams. No attendee data is invented. */
(() => {
  'use strict';
  const nonempty = value => typeof value === 'string' && value.trim().length > 0;
  const normalize = value => String(value ?? '').normalize('NFKC').toLocaleLowerCase().trim().replace(/\s+/g, ' ');
  const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

  function validateRoster(data) {
    if (!data || data.schemaVersion !== 1 || !['pending', 'published'].includes(data.status) || !Array.isArray(data.groups)) throw new Error('Invalid roster format');
    if (data.status === 'pending') {
      if (data.groups.length !== 0) throw new Error('Unpublished roster must not include members');
      return data;
    }
    if (!nonempty(data.publishedAt) || !nonempty(data.source) || !data.groups.length) throw new Error('Published roster requires a source, date and groups');
    const groupIds = new Set(), memberIds = new Set();
    data.groups.forEach(group => {
      if (!group || !nonempty(group.id) || group.id === 'all' || groupIds.has(group.id) || !nonempty(group.name) || !Array.isArray(group.members) || !group.members.length) throw new Error('Invalid roster group');
      groupIds.add(group.id);
      group.members.forEach(member => {
        if (!member || !nonempty(member.id) || memberIds.has(member.id) || !nonempty(member.name) || !nonempty(member.firm)) throw new Error('Invalid roster member');
        if (member.role && !['member', 'leader'].includes(member.role)) throw new Error('Unknown member role');
        if (member.role === 'leader' && !nonempty(member.roleSource)) throw new Error('A group leader requires a confirmed source');
        memberIds.add(member.id);
      });
    });
    return data;
  }

  function filterRoster(groups, query = '', groupId = 'all') {
    const needle = normalize(query);
    return groups.filter(group => groupId === 'all' || group.id === groupId)
      .map(group => ({...group, totalMembers: group.members.length, members: group.members.filter(member => !needle || normalize(member.name).includes(needle) || normalize(member.firm).includes(needle))}))
      .filter(group => group.members.length > 0);
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = {validateRoster, filterRoster};
  if (typeof document === 'undefined') return;
  const section = document.getElementById('groups');
  if (!section) return;
  const toolbar = document.getElementById('roster-toolbar');
  const search = document.getElementById('roster-search');
  const groupSelect = document.getElementById('roster-group');
  const status = document.getElementById('roster-status');
  const list = document.getElementById('roster-list');
  const reset = document.getElementById('roster-reset');
  const retry = document.getElementById('roster-retry');
  let roster = null;

  function emptyState(title, description) {
    list.innerHTML = `<div class="roster-empty"><div class="roster-symbol" aria-hidden="true"><i></i><i></i><i></i></div><div><h3>${escape(title)}</h3><p>${escape(description)}</p></div></div>`;
  }

  function renderResults() {
    if (!roster || roster.status !== 'published') return;
    const groups = filterRoster(roster.groups, search.value, groupSelect.value);
    const totalMembers = groups.reduce((sum, group) => sum + group.members.length, 0);
    const filtered = normalize(search.value) !== '' || groupSelect.value !== 'all';
    reset.hidden = !filtered;
    status.textContent = filtered ? `找到 ${totalMembers} 位学员 · ${groups.length} 个小组` : `${groups.length} 个小组 · ${totalMembers} 位学员`;
    if (!groups.length) {
      list.innerHTML = '<p class="roster-no-results">没有找到匹配的学员，请尝试其他姓名或律所。</p>';
      return;
    }
    list.innerHTML = groups.map(group => `<article class="roster-group"><div class="roster-group-heading"><h3>${escape(group.name)}</h3><span class="roster-group-count">${group.members.length === group.totalMembers ? `${group.totalMembers} 位学员` : `找到 ${group.members.length} / ${group.totalMembers} 位学员`}</span></div><div class="roster-columns" aria-hidden="true"><span>姓名</span><span>所在律所</span></div><ul class="roster-members" aria-label="${escape(group.name)}成员">${group.members.map(member => `<li class="roster-member"><div class="roster-member-name"><strong>${escape(member.name)}</strong>${member.role === 'leader' ? '<span class="roster-leader">组长</span>' : ''}</div><span class="roster-member-firm">${escape(member.firm)}</span></li>`).join('')}</ul></article>`).join('');
  }

  async function loadRoster() {
    roster = null;
    toolbar.hidden = true;
    retry.hidden = true;
    list.innerHTML = '';
    status.textContent = '正在读取小组名册…';
    section.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch('data/roster.json', {cache:'no-store'});
      if (!response.ok) throw new Error(`Roster request failed: ${response.status}`);
      roster = validateRoster(await response.json());
      if (roster.status === 'pending') {
        status.textContent = '';
        emptyState('分组名单待公布', '公布后可按小组浏览，并按姓名或律所查找。');
      } else {
        search.value = '';
        groupSelect.innerHTML = '<option value="all">全部小组</option>' + roster.groups.map(group => `<option value="${escape(group.id)}">${escape(group.name)}</option>`).join('');
        toolbar.hidden = false;
        renderResults();
      }
    } catch (error) {
      status.textContent = '暂时无法读取小组名册。';
      emptyState('名册加载失败', '请检查网络后重新加载。');
      retry.hidden = false;
    } finally {
      section.removeAttribute('aria-busy');
    }
  }

  search.addEventListener('input', renderResults);
  groupSelect.addEventListener('change', renderResults);
  reset.addEventListener('click', () => { search.value = ''; groupSelect.value = 'all'; renderResults(); search.focus(); });
  retry.addEventListener('click', loadRoster);
  loadRoster();
})();
