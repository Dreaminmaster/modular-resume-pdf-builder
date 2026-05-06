window.renderPreview = function () {
  const resumePage = document.getElementById('resume-page');
  const pageWarning = document.getElementById('page-warning');
  function firstVisible(item, keys) { for (const key of keys) { const field = item[key]; if (isFieldVisible(field)) return field.value.trim(); } return ''; }
  function itemHasVisibleContent(item) { return Object.values(item).some(v => v && typeof v === 'object' && 'value' in v && isFieldVisible(v)) || visibleBullets(item).length > 0; }
  function renderEntry(item) { const title = firstVisible(item, ['name', 'title', 'school', 'language']) || ''; const subtitle = [firstVisible(item, ['role', 'degree', 'type']), firstVisible(item, ['org', 'major', 'issuer', 'status'])].filter(Boolean).join(' · '); const date = firstVisible(item, ['date', 'level']) || ''; const location = firstVisible(item, ['location']) || ''; const bullets = visibleBullets(item); return `<div class="entry html2pdf__page-break-inside"><div class="entry-header"><div><div class="entry-title">${escapeHtml(title)}</div>${subtitle ? `<div class="entry-subtitle">${escapeHtml(subtitle)}</div>` : ''}${location ? `<div class="helper-text">${escapeHtml(location)}</div>` : ''}</div>${date ? `<div class="entry-date">${escapeHtml(date)}</div>` : ''}</div>${bullets.length ? `<ul>${bullets.map(b => `<li>${nl2br(escapeHtml(b.value))}</li>`).join('')}</ul>` : ''}</div>`; }
  function renderSkills(items) { const chips = []; const rows = []; items.forEach(item => { const category = firstVisible(item, ['category']); const content = firstVisible(item, ['content']); if (category && content) rows.push(`<div class="entry"><span class="entry-title">${escapeHtml(category)}：</span>${escapeHtml(content)}</div>`); else if (content) chips.push(...content.split(/[,，、]/).map(s => s.trim()).filter(Boolean)); }); return rows.length ? rows.join('') : `<div class="chips">${chips.map(c => `<span class="chip">${escapeHtml(c)}</span>`).join('')}</div>`; }
  function renderLanguages(items) { return `<div class="plain-list">${items.map(item => { const l = firstVisible(item, ['language']); const lv = firstVisible(item, ['level']); return l || lv ? `<div><span class="entry-title">${escapeHtml(l)}</span>${lv ? `：${escapeHtml(lv)}` : ''}</div>` : ''; }).join('')}</div>`; }
  function renderLinks(items) { return `<div class="plain-list">${items.map(item => { const t = firstVisible(item, ['title']); const u = firstVisible(item, ['url']); const d = firstVisible(item, ['desc']); if (!t && !u && !d) return ''; const maybeLink = u ? `<a href="${escapeHtml(u)}" target="_blank" rel="noopener noreferrer">${escapeHtml(u)}</a>` : ''; return `<div><span class="entry-title">${escapeHtml(t || u || 'Link')}</span>${u ? ` — ${maybeLink}` : ''}${d ? ` · ${escapeHtml(d)}` : ''}</div>`; }).join('')}</div>`; }
  function renderListModule(key, title) { const mod = window.state.modules[key]; if (!mod || !mod.visible) return ''; const items = mod.items.filter(item => item.visible && itemHasVisibleContent(item)); if (!items.length) return ''; if (key === 'skills') return `<section class="resume-section"><div class="section-title">${title}</div>${renderSkills(items)}</section>`; if (key === 'languages') return `<section class="resume-section"><div class="section-title">${title}</div>${renderLanguages(items)}</section>`; if (key === 'links') return `<section class="resume-section"><div class="section-title">${title}</div>${renderLinks(items)}</section>`; return `<section class="resume-section"><div class="section-title">${title}</div>${items.map(renderEntry).join('')}</section>`; }
  function renderHeader() {
    const p = window.state.modules.personalInfo; if (!p.visible) return '';
    const f = p.fields; const name = isFieldVisible(f.name) ? escapeHtml(f.name.value) : 'Your Name';
    const title = isFieldVisible(f.title) ? `<div class="entry-subtitle">${escapeHtml(f.title.value)}</div>` : '';
    const common = [f.phone, f.email, f.location, f.website].filter(isFieldVisible).map(x => `<span class="contact-item">${escapeHtml(x.value)}</span>`);
    const extra = window.state.settings.template === 'en-minimal' ? [] : ['gender', 'birth', 'political'].map(k => f[k]).filter(isFieldVisible).map(x => `<span class="contact-item">${escapeHtml(x.value)}</span>`);
    const showAvatar = !shouldHideFieldInTemplate('avatar') && isFieldVisible(f.avatar);
    return `<div class="resume-header ${showAvatar ? 'with-avatar' : ''}"><div><div class="resume-name">${name}</div>${title}<div class="resume-headline">${[...common, ...extra].join('<span>·</span>')}</div></div>${showAvatar ? `<img class="resume-avatar" src="${f.avatar.value}" alt="avatar">` : ''}</div>`;
  }
  function isMeaningfullyEmpty() {
    const p = window.state.modules.personalInfo.fields;
    if ([p.name, p.title, p.phone, p.email, p.location, p.website, window.state.modules.summary.fields.summary].some(f => text(f.value))) return false;
    const listModules = ['education', 'internships', 'projects', 'research', 'awards', 'achievements', 'skills', 'certificates', 'languages', 'links'];
    return !listModules.some(k => window.state.modules[k].items.some(item => Object.values(item).some(v => v && typeof v === 'object' && 'value' in v && text(v.value)) || visibleBullets(item).length));
  }
  if (isMeaningfullyEmpty()) {
    const msg = window.state.settings.languageMode === 'zh' ? '请先填写信息池，勾选后的内容会出现在这里。' : 'Start by filling your information pool.';
    resumePage.innerHTML = `<div class="preview-meta-card"><strong>${escapeHtml(msg)}</strong></div>`;
    pageWarning.classList.remove('hidden');
    pageWarning.textContent = window.state.settings.languageMode === 'zh' ? '提示：开始填写后，右侧会实时生成简历预览。' : 'Tip: start filling content and the preview will update here.';
    return;
  }
  const order = window.getPreviewOrder(window.state.settings.template);
  const labels = Object.fromEntries(BASE_MODULE_DEFS.map(d => [d.key, window.state.settings.languageMode === 'en' ? d.en : window.state.settings.languageMode === 'bilingual' ? `${d.label} / ${d.en}` : d.label]));
  const parts = [renderHeader()];
  order.forEach(k => {
    if (k === 'experience') {
      const items = EXPERIENCE_KEYS.flatMap(key => window.state.modules[key].visible ? window.state.modules[key].items.filter(item => item.visible && itemHasVisibleContent(item)) : []);
      if (items.length) parts.push(`<section class="resume-section"><div class="section-title">${window.state.settings.languageMode === 'zh' ? '经历' : window.state.settings.languageMode === 'bilingual' ? '经历 / Experience' : 'Experience'}</div>${items.map(renderEntry).join('')}</section>`);
    } else if (k === 'summary') {
      const field = window.state.modules.summary.fields.summary;
      if (isFieldVisible(field)) parts.push(`<section class="resume-section"><div class="section-title">${labels.summary}</div><div class="summary">${nl2br(escapeHtml(field.value))}</div></section>`);
    } else {
      const html = renderListModule(k, labels[k]);
      if (html) parts.push(html);
    }
  });
  resumePage.innerHTML = parts.join('') + `<div class="page-footer"><span>${TEMPLATE_META[window.state.settings.template].name}</span><span>Generated by Modular Resume PDF Builder</span></div>`;
  pageWarning.classList.remove('hidden');
  const pxPerMm = 96 / 25.4; const a4Height = 297 * pxPerMm; const ratio = resumePage.scrollHeight / a4Height;
  pageWarning.textContent = ratio <= 1.02 ? '提示：当前内容基本可控制在一页 A4 内。' : ratio <= 1.35 ? '提示：当前内容略超一页，建议精简 1-2 个条目或 bullet。' : '提示：当前内容明显超过一页，导出时将自动分页，建议切换模板或精简内容。';
};
