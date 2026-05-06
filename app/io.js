window.downloadJson = function (data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

window.parseDateStart = function (v) { const m = text(v).split('-')[0]?.trim(); return m || ''; };
window.parseDateEnd = function (v) { const parts = text(v).split('-'); return parts[1] ? parts[1].trim() : ''; };

window.exportJsonResume = function () {
  const p = window.state.modules.personalInfo.fields;
  const basics = { name: text(p.name.value), label: text(p.title.value), email: text(p.email.value), phone: text(p.phone.value), url: text(p.website.value), summary: text(window.state.modules.summary.fields.summary.value), image: text(p.avatar.value), location: { address: text(p.location.value) }, profiles: window.state.modules.links.items.filter(i => i.visible).map(i => ({ network: text(i.title.value), url: text(i.url.value), username: text(i.desc.value) })) };
  const education = window.state.modules.education.items.filter(i => i.visible).map(i => ({ institution: text(i.school.value), studyType: text(i.degree.value), area: text(i.major.value), startDate: window.parseDateStart(i.date.value), endDate: window.parseDateEnd(i.date.value), score: visibleBullets(i).map(b => b.value).join(' | ') }));
  const work = window.state.modules.internships.items.filter(i => i.visible).map(i => ({ name: text(i.org.value), position: text(i.role.value), location: text(i.location.value), startDate: window.parseDateStart(i.date.value), endDate: window.parseDateEnd(i.date.value), summary: text(i.name.value), highlights: visibleBullets(i).map(b => b.value) }));
  const projects = window.state.modules.projects.items.filter(i => i.visible).map(i => ({ name: text(i.name.value), description: [text(i.role.value), text(i.org.value)].filter(Boolean).join(' · '), startDate: window.parseDateStart(i.date.value), endDate: window.parseDateEnd(i.date.value), highlights: visibleBullets(i).map(b => b.value), url: '' }));
  const skills = window.state.modules.skills.items.filter(i => i.visible).map(i => ({ name: text(i.category.value) || 'Skills', keywords: text(i.content.value).split(/[,，、]/).map(s => s.trim()).filter(Boolean) }));
  const languages = window.state.modules.languages.items.filter(i => i.visible).map(i => ({ language: text(i.language.value), fluency: text(i.level.value) }));
  return { basics, work, education, skills, languages, projects, meta: { canonical: 'https://jsonresume.org/schema/' } };
};

window.importJsonResume = function (data) {
  window.state = defaultState();
  const b = data.basics || {};
  const pf = window.state.modules.personalInfo.fields;
  pf.name.value = b.name || '';
  pf.title.value = b.label || '';
  pf.email.value = b.email || '';
  pf.phone.value = b.phone || '';
  pf.website.value = b.url || '';
  pf.location.value = (b.location && (b.location.address || b.location.city || b.location.region || b.location.countryCode)) || '';
  pf.avatar.value = b.image || '';
  pf.avatar.visible = !!b.image;
  if (safeArray(data.education).length) window.state.modules.education.items = data.education.map(e => ({ id: uid('edu'), visible: true, school: createField('学校', e.institution || '', true), degree: createField('学历/学位', e.studyType || '', true), major: createField('专业', e.area || '', true), date: createField('时间', [e.startDate, e.endDate].filter(Boolean).join(' - '), true), location: createField('地点', '', true), bullets: e.score ? [createBullet(e.score, true)] : [] }));
  if (safeArray(data.work).length) window.state.modules.internships.items = data.work.map(w => ({ id: uid('intern'), visible: true, name: createField('名称', w.summary || '', true), role: createField('岗位/角色', w.position || '', true), org: createField('单位/平台', w.name || '', true), date: createField('时间', [w.startDate, w.endDate].filter(Boolean).join(' - '), true), location: createField('地点', w.location || '', true), bullets: safeArray(w.highlights).map(h => createBullet(h, true)) }));
  if (safeArray(data.projects).length) window.state.modules.projects.items = data.projects.map(p => ({ id: uid('project'), visible: true, name: createField('名称', p.name || '', true), role: createField('岗位/角色', p.description || '', true), org: createField('单位/平台', '', true), date: createField('时间', [p.startDate, p.endDate].filter(Boolean).join(' - '), true), location: createField('地点', '', true), bullets: safeArray(p.highlights).map(h => createBullet(h, true)) }));
  if (safeArray(data.skills).length) window.state.modules.skills.items = data.skills.map(s => ({ id: uid('skill'), visible: true, category: createField('技能分类', s.name || '', true), content: createField('技能内容', safeArray(s.keywords).join('、'), true), bullets: [] }));
  if (safeArray(data.languages).length) window.state.modules.languages.items = data.languages.map(l => ({ id: uid('lang'), visible: true, language: createField('语言', l.language || '', true), level: createField('水平', l.fluency || '', true), bullets: [] }));
};
