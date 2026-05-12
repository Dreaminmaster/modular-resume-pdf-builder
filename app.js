const STORAGE_KEY = 'modular_resume_builder_v8';

const BASE_MODULE_DEFS = [
  { key: 'personalInfo', label: '基本信息', en: 'Profile', type: 'fields' },
  { key: 'education', label: '教育背景', en: 'Education', type: 'list', itemLabel: '教育经历' },
  { key: 'internships', label: '实习经历', en: 'Internships', type: 'list', itemLabel: '实习经历' },
  { key: 'projects', label: '项目经历', en: 'Projects', type: 'list', itemLabel: '项目经历' },
  { key: 'research', label: '科研经历', en: 'Research', type: 'list', itemLabel: '科研经历' },
  { key: 'awards', label: '获奖经历', en: 'Awards', type: 'list', itemLabel: '获奖经历' },
  { key: 'achievements', label: '专利 / 论文 / 成果', en: 'Achievements', type: 'list', itemLabel: '成果条目' },
  { key: 'skills', label: '技能', en: 'Skills', type: 'list', itemLabel: '技能分类' },
  { key: 'certificates', label: '证书', en: 'Certificates', type: 'list', itemLabel: '证书' },
  { key: 'languages', label: '语言能力', en: 'Languages', type: 'list', itemLabel: '语言能力' },
  { key: 'summary', label: '自我评价', en: 'Summary', type: 'fields' },
  { key: 'links', label: '作品链接', en: 'Links', type: 'list', itemLabel: '链接条目' }
];

const TEMPLATE_META = {
  'cn-classic': { name: '经典单栏中文模板', className: 'template-cn-classic', hint: '适合中文校招 / 通用求职，结构稳重清晰。' },
  'compact-cn': { name: '一页紧凑中文模板', className: 'template-compact-cn', hint: '适合中文校招 / 实习 / 内容较多但希望压到一页。' },
  'en-minimal': { name: '英文极简模板', className: 'template-en-minimal', hint: '适合海外简历，默认隐藏性别、出生年月、政治面貌、头像等国内字段。' },
  'ats-en': { name: '英文 ATS 模板', className: 'template-ats-en', hint: '适合海外实习、外企投递与 graduate application，强调黑白克制与 ATS 友好。' },
  'engineering': { name: '工程技术模板', className: 'template-engineering', hint: '优先突出项目经历、技能、实习与工程成果。' },
  'engineering-project': { name: '工程项目强化模板', className: 'template-engineering-project', hint: '适合机械、自动化、机器人、制造等技术岗位，强化项目与技能扫描效率。' },
  'campus': { name: '校招双栏模板', className: 'template-campus', hint: '适合应届生，把教育与技能信息放在更醒目的侧栏。' },
  'product': { name: '产品经理模板', className: 'template-product', hint: '优先展示项目、实习、结果数据与作品链接。' },
  'academic': { name: '学术 CV 模板', className: 'template-academic', hint: '优先展示教育、科研、成果与获奖，适合学术申请。' }
};
const THEME_PRESETS = {
  graphite: { name: 'Graphite', zhName: '黑灰', accent: '#1f2937', soft: '#f3f4f6', border: '#d1d5db' },
  navy: { name: 'Navy', zhName: '深蓝', accent: '#1e3a8a', soft: '#eff6ff', border: '#bfdbfe' },
  slate: { name: 'Slate', zhName: '蓝灰', accent: '#475569', soft: '#f1f5f9', border: '#cbd5e1' },
  indigo: { name: 'Indigo', zhName: '靛蓝', accent: '#4338ca', soft: '#eef2ff', border: '#c7d2fe' },
  forest: { name: 'Forest', zhName: '墨绿', accent: '#166534', soft: '#ecfdf5', border: '#bbf7d0' },
  burgundy: { name: 'Burgundy', zhName: '酒红', accent: '#7f1d1d', soft: '#fef2f2', border: '#fecaca' }
};

const LANGUAGE_META = { zh: '中文模式', en: 'English Mode', bilingual: '中英双语标题' };
const EXPERIENCE_KEYS = ['internships', 'projects', 'research'];
const EN_HIDDEN_FIELDS = ['gender', 'birth', 'political', 'avatar'];

function createField(label, value = '', visible = true, placeholder = '') { return { label, value, visible, placeholder }; }
function createBullet(value = '', visible = true) { return { value, visible }; }
function uid(prefix) { return prefix + '_' + Math.random().toString(36).slice(2, 9); }
function text(v) { return (v || '').toString().trim(); }
function isFieldVisible(field) { return !!field && field.visible && text(field.value) !== ''; }
function escapeHtml(str) { return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function nl2br(str) { return str.replace(/\n/g, '<br>'); }
function visibleBullets(item) { return (item.bullets || []).filter(b => b.visible && text(b.value)); }
function safeArray(v) { return Array.isArray(v) ? v : []; }

function createEducationItem() { return { id: uid('edu'), visible: true, school: createField('学校', '', true, '例如：同济大学'), degree: createField('学历/学位', '', true, '例如：硕士 / 本科'), major: createField('专业', '', true, '例如：机械工程'), date: createField('时间', '', true, '例如：2021.09 - 2024.06'), location: createField('地点', '', true, '例如：上海'), bullets: [createBullet('', true)] }; }
function createExperienceItem(prefix, sampleTitle) { return { id: uid(prefix), visible: true, name: createField('名称', '', true, sampleTitle), role: createField('岗位/角色', '', true, '例如：机械设计实习生 / 项目负责人'), org: createField('单位/平台', '', true, '例如：ABB / 实验室 / 学院创新中心'), date: createField('时间', '', true, '例如：2023.06 - 2023.09'), location: createField('地点', '', true, '例如：上海'), bullets: [createBullet('', true), createBullet('', true)] }; }
function createAwardItem() { return { id: uid('award'), visible: true, title: createField('奖项名称', '', true, '例如：全国大学生机械创新设计大赛一等奖'), issuer: createField('颁发单位', '', true, '例如：教育部高等学校机械基础课程教学指导委员会'), date: createField('时间', '', true, '例如：2023.11'), bullets: [createBullet('', true)] }; }
function createAchievementItem() { return { id: uid('achievement'), visible: true, title: createField('成果名称', '', true, '例如：发明专利《一种自动抓取机构》'), type: createField('类型', '', true, '例如：论文 / 专利 / 软著 / 成果转化'), date: createField('时间', '', true, '例如：2024.03'), status: createField('状态', '', true, '例如：已授权 / 已录用 / 审核中'), bullets: [createBullet('', true)] }; }
function createSkillItem() { return { id: uid('skill'), visible: true, category: createField('技能分类', '', true, '例如：编程 / 软件 / 硬件 / 办公'), content: createField('技能内容', '', true, '例如：Python、MATLAB、SolidWorks、PLC、AutoCAD'), bullets: [] }; }
function createCertificateItem() { return { id: uid('cert'), visible: true, name: createField('证书名称', '', true, '例如：大学英语六级 CET-6'), issuer: createField('颁发机构', '', true, '例如：教育部考试中心'), date: createField('时间', '', true, '例如：2022.12'), bullets: [] }; }
function createLanguageItem() { return { id: uid('lang'), visible: true, language: createField('语言', '', true, '例如：英语'), level: createField('水平', '', true, '例如：IELTS 7.0 / CET-6 / 流利沟通'), bullets: [] }; }
function createLinkItem() { return { id: uid('link'), visible: true, title: createField('链接名称', '', true, '例如：GitHub / 作品集 / 个人网站'), url: createField('链接地址', '', true, '例如：https://github.com/yourname'), desc: createField('说明', '', true, '例如：项目合集 / 作品说明'), bullets: [] }; }

function defaultState() {
  return {
    settings: { template: 'cn-classic', theme: 'navy', languageMode: 'zh', themeColor: '#2563eb', fontScale: 1, moduleOrder: BASE_MODULE_DEFS.map(x => x.key), pdfFileName: '', typography: { density: 'standard', fontSize: 'standard', margin: 'standard', accent: 'theme' } },
    modules: {
      personalInfo: { visible: true, collapsed: false, fields: {
        name: createField('姓名', '', true, '例如：张三'), title: createField('求职意向', '', true, '例如：机械工程师 / 产品经理 / Data Analyst'), phone: createField('电话', '', true, '例如：138-0000-0000'), email: createField('邮箱', '', true, '例如：name@email.com'), location: createField('所在地', '', true, '例如：上海'), website: createField('个人主页', '', false, '例如：https://portfolio.com'), gender: createField('性别', '', false, '例如：男 / 女'), birth: createField('出生年月', '', false, '例如：2001.08'), political: createField('政治面貌', '', false, '例如：中共党员'), avatar: createField('头像', '', false, '上传头像图片后自动写入')
      }},
      education: { visible: true, items: [createEducationItem()], collapsed: false }, internships: { visible: true, items: [createExperienceItem('intern', '例如：制造工程实习')], collapsed: false }, projects: { visible: true, items: [createExperienceItem('project', '例如：六轴机械臂视觉抓取项目')], collapsed: false }, research: { visible: false, items: [createExperienceItem('research', '例如：机器人末端执行器优化课题')], collapsed: false }, awards: { visible: false, items: [createAwardItem()], collapsed: false }, achievements: { visible: false, items: [createAchievementItem()], collapsed: false }, skills: { visible: true, items: [createSkillItem()], collapsed: false }, certificates: { visible: false, items: [createCertificateItem()], collapsed: false }, languages: { visible: false, items: [createLanguageItem()], collapsed: false }, summary: { visible: false, collapsed: false, fields: { summary: createField('自我评价', '', false, '例如：请用 2-4 句概括你的优势、方向与成果。') } }, links: { visible: false, items: [createLinkItem()], collapsed: false }
    }
  };
}

let state = loadState();
const editorContent = document.getElementById('editor-content');
const moduleNav = document.getElementById('module-nav');
const moduleOrderList = document.getElementById('module-order-list');
const resumePage = document.getElementById('resume-page');
const previewPanel = document.getElementById('preview-panel');
const templateSelect = document.getElementById('template-select');
const templateHint = document.getElementById('template-hint');
const languageModeSelect = document.getElementById('language-mode');
const currentTemplateName = document.getElementById('current-template-name');
const currentLanguageName = document.getElementById('current-language-name');
const themeColorInput = document.getElementById('theme-color');
const themePresets = document.getElementById('theme-presets');
const fontScaleInput = document.getElementById('font-scale');
const fontScaleValue = document.getElementById('font-scale-value');
const pageWarning = document.getElementById('page-warning');

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const base = defaultState();
    if (!raw) return base;
    const merged = deepMerge(base, JSON.parse(raw));
    merged.settings.moduleOrder = normalizeOrder(merged.settings.moduleOrder);
  if (!merged.settings.languageMode) merged.settings.languageMode = 'zh';
  if (!merged.settings.theme || !THEME_PRESETS[merged.settings.theme]) merged.settings.theme = 'navy';
  if (!merged.settings.themeColor) merged.settings.themeColor = THEME_PRESETS[merged.settings.theme].accent;
  return merged;
  } catch {
    return defaultState();
  }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function deepMerge(base, extra) { if (Array.isArray(base)) return Array.isArray(extra) ? extra : base; if (typeof base !== 'object' || base === null) return extra ?? base; const output = { ...base }; for (const key of Object.keys(extra || {})) output[key] = key in base ? deepMerge(base[key], extra[key]) : extra[key]; return output; }
function normalizeOrder(order) { const all = BASE_MODULE_DEFS.map(x => x.key); const valid = Array.isArray(order) ? order.filter(k => all.includes(k)) : []; all.forEach(k => { if (!valid.includes(k)) valid.push(k); }); return valid; }
function moduleDefs() { return normalizeOrder(state.settings.moduleOrder).map(k => BASE_MODULE_DEFS.find(x => x.key === k)).filter(Boolean); }
function moduleTitle(def) { return state.settings.languageMode === 'en' ? def.en : state.settings.languageMode === 'bilingual' ? `${def.label} / ${def.en}` : def.label; }
function moduleHasContent(def) { const mod = state.modules[def.key]; if (!mod) return false; if (def.type === 'fields') return Object.values(mod.fields).some(f => text(f.value)); return mod.items.some(item => Object.values(item).some(v => v && typeof v === 'object' && 'value' in v && text(v.value)) || visibleBullets(item).length); }
function getItem(moduleKey, itemId) { return state.modules[moduleKey].items.find(i => i.id === itemId); }
function moveInArray(arr, from, to) { if (from < 0 || to < 0 || from >= arr.length || to >= arr.length) return; const [item] = arr.splice(from, 1); arr.splice(to, 0, item); }
function shouldHideFieldInTemplate(fieldKey) { return state.settings.template === 'en-minimal' && EN_HIDDEN_FIELDS.includes(fieldKey); }
function isMeaningfullyEmpty() { const p = state.modules.personalInfo.fields; if ([p.name, p.title, p.phone, p.email, p.location, p.website, state.modules.summary.fields.summary].some(f => text(f.value))) return false; const listModules = ['education', 'internships', 'projects', 'research', 'awards', 'achievements', 'skills', 'certificates', 'languages', 'links']; return !listModules.some(k => state.modules[k].items.some(item => Object.values(item).some(v => v && typeof v === 'object' && 'value' in v && text(v.value)) || visibleBullets(item).length)); }

function render() { applySettings(); renderThemePresets(); renderNav(); renderOrderControls(); renderEditor(); renderPreview(); saveState(); }
function updateModuleStatusIndicators() {
  const containers = [moduleNav, document.getElementById('mobile-module-status-list')].filter(Boolean);
  containers.forEach(container => {
    container.querySelectorAll('[data-module-status-key]').forEach(dot => {
      const key = dot.dataset.moduleStatusKey;
      const def = BASE_MODULE_DEFS.find(item => item.key === key);
      const filled = def ? moduleHasContent(def) : false;
      dot.classList.toggle('filled', filled);
      dot.setAttribute('aria-label', filled ? '已填写内容' : '未填写内容');
    });
  });
}
function updatePreviewOnly() { renderPreview(); updateModuleStatusIndicators(); saveState(); }
function getActiveThemePreset() {
  return THEME_PRESETS[state.settings.theme] || THEME_PRESETS.navy;
}
function renderThemePresets() {
  const container = document.getElementById('theme-presets');
  if (!container) return;
  container.innerHTML = Object.entries(THEME_PRESETS).map(([key, preset]) => {
    const active = state.settings.theme === key;
    return `<button type="button" class="theme-preset ${active ? 'active' : ''}" data-theme-key="${key}" title="${preset.name} ${preset.zhName}"><span class="theme-dot" style="--dot:${preset.accent};--dot-soft:${preset.soft};--dot-border:${preset.border};"></span><span class="theme-meta"><strong>${preset.name}</strong><span>${preset.zhName}</span></span></button>`;
  }).join('');
}
function applyThemePresetVariables() {
  const preset = getActiveThemePreset();
  document.documentElement.style.setProperty('--primary', preset.accent);
  document.documentElement.style.setProperty('--primary-soft', preset.soft);
  resumePage.style.setProperty('--resume-accent-color', preset.accent);
  resumePage.style.setProperty('--resume-border-color', preset.border);
  resumePage.style.setProperty('--resume-accent-soft', preset.soft);
}
function applyResumeTypographyClasses() {
  const t = state.settings.typography || {
    density: 'standard',
    fontSize: 'standard',
    margin: 'standard',
    accent: 'theme'
  };

  resumePage.classList.remove(
    'density-compact',
    'density-standard',
    'density-spacious',
    'font-small',
    'font-standard',
    'font-large',
    'margin-narrow',
    'margin-standard',
    'margin-wide',
    'accent-theme',
    'accent-black',
    'accent-blue',
    'accent-purple'
  );

  resumePage.classList.add(
    `density-${t.density}`,
    `font-${t.fontSize}`,
    `margin-${t.margin}`,
    `accent-${t.accent}`
  );
}
function updateEditorMobileSummary() {
  const summaryEl = document.getElementById('editor-mobile-summary');
  if (summaryEl) {
    summaryEl.textContent = `当前：${TEMPLATE_META[state.settings.template].name} · ${THEME_PRESETS[state.settings.theme].zhName}`;
  }
}
function applySettings() {
  const preset = getActiveThemePreset();
  document.documentElement.style.setProperty('--primary', preset.accent);
  document.documentElement.style.setProperty('--primary-soft', preset.soft);
  document.documentElement.style.setProperty('--font-scale', state.settings.fontScale);
  templateSelect.value = state.settings.template;
  templateHint.textContent = TEMPLATE_META[state.settings.template].hint;
  languageModeSelect.value = state.settings.languageMode;
  themeColorInput.value = preset.accent;
  fontScaleInput.value = state.settings.fontScale;
  fontScaleValue.textContent = Math.round(state.settings.fontScale * 100) + '%';
  currentTemplateName.textContent = TEMPLATE_META[state.settings.template].name;
  currentLanguageName.textContent = LANGUAGE_META[state.settings.languageMode];
  resumePage.className = 'resume-page ' + TEMPLATE_META[state.settings.template].className;
  applyThemePresetVariables();
  document.getElementById('pdf-filename-input').value = state.settings.pdfFileName;
  const t = state.settings.typography || { density: 'standard', fontSize: 'standard', margin: 'standard', accent: 'theme' };
  document.getElementById('typography-density').value = t.density;
  document.getElementById('typography-font-size').value = t.fontSize;
  document.getElementById('typography-margin').value = t.margin;
  document.getElementById('typography-accent').value = t.accent;
  updateEditorMobileSummary(); // 更新手机顶部摘要
}
function currentActiveModuleKey() {
  const active = document.activeElement && document.activeElement.closest && document.activeElement.closest('[id^="module-"]');
  if (active && active.id) return active.id.replace('module-', '');
  const firstVisible = moduleDefs().find(def => state.modules[def.key]?.visible);
  return firstVisible ? firstVisible.key : 'personalInfo';
}

function renderNav() { moduleNav.innerHTML = ''; const activeKey = currentActiveModuleKey(); moduleDefs().forEach(def => { const mod = state.modules[def.key]; const row = document.createElement('div'); row.className = 'module-nav-item' + (def.key === activeKey ? ' active' : ''); row.innerHTML = `<label style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;"><input class="checkbox" type="checkbox" ${mod.visible ? 'checked' : ''} data-action="toggle-module" data-module="${def.key}"><a href="#module-${def.key}">${moduleTitle(def)}</a></label><span class="status-dot ${moduleHasContent(def) ? 'filled' : ''}" data-module-status-key="${def.key}" aria-label="${moduleHasContent(def) ? '已填写内容' : '未填写内容'}"></span>`; moduleNav.appendChild(row); }); }

function renderOrderControls() { moduleOrderList.innerHTML = ''; const defs = moduleDefs(); defs.forEach((def, index) => { const item = document.createElement('div'); item.className = 'order-item'; item.innerHTML = `<span class="order-label">${index + 1}. ${moduleTitle(def)}</span><div class="order-actions"><button class="icon-btn" data-action="move-module-up" data-module="${def.key}" ${index === 0 ? 'disabled' : ''}>↑</button><button class="icon-btn" data-action="move-module-down" data-module="${def.key}" ${index === defs.length - 1 ? 'disabled' : ''}>↓</button></div>`; moduleOrderList.appendChild(item); }); }
function renderEditor() { editorContent.innerHTML = ''; moduleDefs().forEach(def => { const mod = state.modules[def.key]; if (!mod.visible) return; const card = document.createElement('section'); card.className = 'module-card'; card.id = 'module-' + def.key; const bodyClass = mod.collapsed ? 'module-body collapsed' : 'module-body'; card.innerHTML = `<div class="module-header"><div class="module-title-wrap"><input class="checkbox" type="checkbox" ${mod.visible ? 'checked' : ''} data-action="toggle-module" data-module="${def.key}"><div><h3 class="module-title">${moduleTitle(def)}</h3><div class="helper-text">关闭后仅从本次简历隐藏，已填写内容会保留。</div></div></div><div class="module-actions">${def.type === 'list' ? `<button class="icon-btn" data-action="add-item" data-module="${def.key}">+ 新增${def.itemLabel}</button>` : ''}<button class="icon-btn" data-action="collapse-module" data-module="${def.key}">${mod.collapsed ? '展开' : '折叠'}</button></div></div><div class="${bodyClass}"></div>`; const body = card.querySelector('.module-body'); if (def.key === 'personalInfo') body.appendChild(renderAvatarControls()); if (def.type === 'fields') body.appendChild(renderFieldsBlock(def.key, mod.fields, def.key === 'personalInfo' ? ['avatar'] : [])); else { mod.items.forEach((item, index) => body.appendChild(renderItemCard(def.key, item, index, def.itemLabel))); const actions = document.createElement('div'); actions.className = 'section-actions'; actions.innerHTML = `<button class="btn" data-action="add-item" data-module="${def.key}">+ 添加${def.itemLabel}</button>`; body.appendChild(actions); } editorContent.appendChild(card); }); }
function renderAvatarControls() { const wrap = document.createElement('div'); const avatarField = state.modules.personalInfo.fields.avatar; const preview = avatarField.value ? `<img class="avatar-preview" src="${avatarField.value}" alt="avatar preview">` : `<div class="avatar-placeholder">无头像</div>`; wrap.className = 'field-row avatar-uploader'; wrap.innerHTML = `<div class="field-top"><input class="checkbox" type="checkbox" ${avatarField.visible ? 'checked' : ''} data-action="toggle-field" data-module="personalInfo" data-field="avatar"><label class="field-label">头像</label></div>${preview}<div class="section-actions"><label class="btn btn-file">上传头像<input id="avatar-input" type="file" accept="image/*" hidden></label><button class="btn" data-action="clear-avatar">清除头像</button></div>`; return wrap; }
function renderFieldsBlock(moduleKey, fields, exclude = []) { const wrap = document.createElement('div'); const keys = Object.keys(fields).filter(k => !exclude.includes(k)); if (keys.length >= 4) wrap.classList.add('grid-2'); keys.forEach(fieldKey => wrap.appendChild(renderField(moduleKey, null, fieldKey, fields[fieldKey]))); return wrap; }
function renderField(moduleKey, itemId, fieldKey, field) { const row = document.createElement('div'); row.className = 'field-row'; const isLong = fieldKey === 'summary' || fieldKey === 'desc'; row.innerHTML = `<div class="field-top"><input class="checkbox" type="checkbox" ${field.visible ? 'checked' : ''} data-action="toggle-field" data-module="${moduleKey}" ${itemId ? `data-item="${itemId}"` : ''} data-field="${fieldKey}"><label class="field-label">${field.label}</label></div>${isLong ? `<textarea data-action="update-field" data-module="${moduleKey}" ${itemId ? `data-item="${itemId}"` : ''} data-field="${fieldKey}" placeholder="${field.placeholder || ''}">${field.value || ''}</textarea>` : `<input class="input" data-action="update-field" data-module="${moduleKey}" ${itemId ? `data-item="${itemId}"` : ''} data-field="${fieldKey}" value="${escapeHtml(field.value || '')}" placeholder="${field.placeholder || ''}">`}`; return row; }
function renderItemCard(moduleKey, item, index, itemLabel) { const card = document.createElement('div'); card.className = 'item-card'; const fieldEntries = Object.entries(item).filter(([k, v]) => !['id', 'visible', 'bullets'].includes(k) && v && typeof v === 'object' && 'label' in v); const grid = document.createElement('div'); grid.className = fieldEntries.length > 2 ? 'grid-2' : 'grid-1'; fieldEntries.forEach(([fieldKey, field]) => grid.appendChild(renderField(moduleKey, item.id, fieldKey, field))); const bulletsWrap = document.createElement('div'); bulletsWrap.className = 'bullets-block'; bulletsWrap.innerHTML = '<div><strong>要点描述</strong><div class="helper-text">每条描述都可以单独显示或隐藏。</div></div>'; (item.bullets || []).forEach((bullet, bulletIndex) => bulletsWrap.appendChild(renderBullet(moduleKey, item.id, bullet, bulletIndex))); const bulletActions = document.createElement('div'); bulletActions.className = 'section-actions'; bulletActions.innerHTML = `<button class="btn" data-action="add-bullet" data-module="${moduleKey}" data-item="${item.id}">+ 添加描述</button>`; bulletsWrap.appendChild(bulletActions); card.innerHTML = `<div class="item-card-header"><div class="item-card-title"><input class="checkbox" type="checkbox" ${item.visible ? 'checked' : ''} data-action="toggle-item" data-module="${moduleKey}" data-item="${item.id}"><span>${itemLabel} ${index + 1}</span></div><div class="item-card-actions"><button class="icon-btn" data-action="move-item-up" data-module="${moduleKey}" data-item="${item.id}">↑ 上移</button><button class="icon-btn" data-action="move-item-down" data-module="${moduleKey}" data-item="${item.id}">↓ 下移</button><button class="icon-btn" data-action="delete-item" data-module="${moduleKey}" data-item="${item.id}">删除</button></div></div>`; card.appendChild(grid); card.appendChild(bulletsWrap); return card; }
function renderBullet(moduleKey, itemId, bullet, bulletIndex) { const row = document.createElement('div'); row.className = 'bullet-row'; row.innerHTML = `<input class="checkbox" type="checkbox" ${bullet.visible ? 'checked' : ''} data-action="toggle-bullet" data-module="${moduleKey}" data-item="${itemId}" data-bullet="${bulletIndex}"><div style="flex:1;display:grid;gap:8px;"><textarea data-action="update-bullet" data-module="${moduleKey}" data-item="${itemId}" data-bullet="${bulletIndex}" placeholder="例如：负责核心项目推进、数据分析或成果总结。">${bullet.value || ''}</textarea><div class="section-actions"><button class="icon-btn" data-action="move-bullet-up" data-module="${moduleKey}" data-item="${itemId}" data-bullet="${bulletIndex}">↑ 上移</button><button class="icon-btn" data-action="move-bullet-down" data-module="${moduleKey}" data-item="${itemId}" data-bullet="${bulletIndex}">↓ 下移</button><button class="icon-btn" data-action="delete-bullet" data-module="${moduleKey}" data-item="${itemId}" data-bullet="${bulletIndex}">删除 Bullet</button></div></div>`; return row; }
function createItemByModule(moduleKey) { if (moduleKey === 'education') return createEducationItem(); if (moduleKey === 'internships') return createExperienceItem('intern', '例如：供应链优化实习'); if (moduleKey === 'projects') return createExperienceItem('project', '例如：智能分拣系统设计'); if (moduleKey === 'research') return createExperienceItem('research', '例如：数字孪生产线研究'); if (moduleKey === 'awards') return createAwardItem(); if (moduleKey === 'achievements') return createAchievementItem(); if (moduleKey === 'skills') return createSkillItem(); if (moduleKey === 'certificates') return createCertificateItem(); if (moduleKey === 'languages') return createLanguageItem(); if (moduleKey === 'links') return createLinkItem(); return createExperienceItem('item', '新条目'); }

function parseDateStart(v) { const m = text(v).split('-')[0]?.trim(); return m || ''; }
function parseDateEnd(v) { const parts = text(v).split('-'); return parts[1] ? parts[1].trim() : ''; }
function exportJsonResume() { const p = state.modules.personalInfo.fields; const basics = { name: text(p.name.value), label: text(p.title.value), email: text(p.email.value), phone: text(p.phone.value), url: text(p.website.value), summary: text(state.modules.summary.fields.summary.value), image: text(p.avatar.value), location: { address: text(p.location.value) }, profiles: state.modules.links.items.filter(i => i.visible).map(i => ({ network: text(i.title.value), url: text(i.url.value), username: text(i.desc.value) })) }; const education = state.modules.education.items.filter(i => i.visible).map(i => ({ institution: text(i.school.value), studyType: text(i.degree.value), area: text(i.major.value), startDate: parseDateStart(i.date.value), endDate: parseDateEnd(i.date.value), score: visibleBullets(i).map(b => b.value).join(' | ') })); const work = state.modules.internships.items.filter(i => i.visible).map(i => ({ name: text(i.org.value), position: text(i.role.value), location: text(i.location.value), startDate: parseDateStart(i.date.value), endDate: parseDateEnd(i.date.value), summary: text(i.name.value), highlights: visibleBullets(i).map(b => b.value) })); const projects = state.modules.projects.items.filter(i => i.visible).map(i => ({ name: text(i.name.value), description: [text(i.role.value), text(i.org.value)].filter(Boolean).join(' · '), startDate: parseDateStart(i.date.value), endDate: parseDateEnd(i.date.value), highlights: visibleBullets(i).map(b => b.value), url: '' })); const skills = state.modules.skills.items.filter(i => i.visible).map(i => ({ name: text(i.category.value) || 'Skills', keywords: text(i.content.value).split(/[,，、]/).map(s => s.trim()).filter(Boolean) })); const languages = state.modules.languages.items.filter(i => i.visible).map(i => ({ language: text(i.language.value), fluency: text(i.level.value) })); return { basics, work, education, skills, languages, projects, meta: { canonical: 'https://jsonresume.org/schema/' } }; }
function importJsonResume(data) { state = defaultState(); const b = data.basics || {}; const pf = state.modules.personalInfo.fields; pf.name.value = b.name || ''; pf.title.value = b.label || ''; pf.email.value = b.email || ''; pf.phone.value = b.phone || ''; pf.website.value = b.url || ''; pf.location.value = (b.location && (b.location.address || b.location.city || b.location.region || b.location.countryCode)) || ''; pf.avatar.value = b.image || ''; pf.avatar.visible = !!b.image; if (safeArray(data.education).length) state.modules.education.items = data.education.map(e => ({ id: uid('edu'), visible: true, school: createField('学校', e.institution || '', true), degree: createField('学历/学位', e.studyType || '', true), major: createField('专业', e.area || '', true), date: createField('时间', [e.startDate, e.endDate].filter(Boolean).join(' - '), true), location: createField('地点', '', true), bullets: e.score ? [createBullet(e.score, true)] : [] })); if (safeArray(data.work).length) state.modules.internships.items = data.work.map(w => ({ id: uid('intern'), visible: true, name: createField('名称', w.summary || '', true), role: createField('岗位/角色', w.position || '', true), org: createField('单位/平台', w.name || '', true), date: createField('时间', [w.startDate, w.endDate].filter(Boolean).join(' - '), true), location: createField('地点', w.location || '', true), bullets: safeArray(w.highlights).map(h => createBullet(h, true)) })); if (safeArray(data.projects).length) state.modules.projects.items = data.projects.map(p => ({ id: uid('project'), visible: true, name: createField('名称', p.name || '', true), role: createField('岗位/角色', p.description || '', true), org: createField('单位/平台', '', true), date: createField('时间', [p.startDate, p.endDate].filter(Boolean).join(' - '), true), location: createField('地点', '', true), bullets: safeArray(p.highlights).map(h => createBullet(h, true)) })); if (safeArray(data.skills).length) state.modules.skills.items = data.skills.map(s => ({ id: uid('skill'), visible: true, category: createField('技能分类', s.name || '', true), content: createField('技能内容', safeArray(s.keywords).join('、'), true), bullets: [] })); if (safeArray(data.languages).length) state.modules.languages.items = data.languages.map(l => ({ id: uid('lang'), visible: true, language: createField('语言', l.language || '', true), level: createField('水平', l.fluency || '', true), bullets: [] })); render(); }

function getPreviewOrder(template) { let manual = normalizeOrder(state.settings.moduleOrder).filter(k => k !== 'personalInfo'); if (template === 'engineering') return [...['projects', 'skills', 'internships', 'achievements', 'education'].filter(k => manual.includes(k)), ...manual.filter(k => !['projects', 'skills', 'internships', 'achievements', 'education'].includes(k))]; if (template === 'engineering-project') return [...['education', 'skills', 'projects', 'internships', 'achievements', 'awards', 'certificates'].filter(k => manual.includes(k)), ...manual.filter(k => !['education', 'skills', 'projects', 'internships', 'achievements', 'awards', 'certificates'].includes(k))]; if (template === 'academic') return [...['education', 'research', 'achievements', 'awards', 'languages'].filter(k => manual.includes(k)), ...manual.filter(k => !['education', 'research', 'achievements', 'awards', 'languages'].includes(k))]; if (template === 'product') return [...['projects', 'internships', 'skills', 'links', 'education'].filter(k => manual.includes(k)), ...manual.filter(k => !['projects', 'internships', 'skills', 'links', 'education'].includes(k))]; if (template === 'compact-cn') return [...['education', 'internships', 'projects', 'skills', 'awards', 'certificates', 'links'].filter(k => manual.includes(k)), ...manual.filter(k => !['education', 'internships', 'projects', 'skills', 'awards', 'certificates', 'links'].includes(k))]; if (template === 'ats-en') return [...['summary', 'education', 'internships', 'projects', 'skills', 'awards', 'links'].filter(k => manual.includes(k)), ...manual.filter(k => !['summary', 'education', 'internships', 'projects', 'skills', 'awards', 'links'].includes(k))]; if (template === 'en-minimal') { manual = [...['education', 'internships', 'projects', 'skills', 'languages', 'achievements'].filter(k => manual.includes(k)), ...manual.filter(k => !['education', 'internships', 'projects', 'skills', 'languages', 'achievements'].includes(k))]; const mapped = []; let inserted = false; manual.forEach(k => { if (EXPERIENCE_KEYS.includes(k)) { if (!inserted) { mapped.push('experience'); inserted = true; } } else mapped.push(k); }); return mapped; } return manual; }
function findDef(key) { return BASE_MODULE_DEFS.find(d => d.key === key); }
function previewTitle(key) { if (key === 'experience') return state.settings.languageMode === 'zh' ? '经历' : state.settings.languageMode === 'bilingual' ? '经历 / Experience' : 'Experience'; const def = findDef(key); return def ? moduleTitle(def) : key; }
function firstVisible(item, keys) { for (const key of keys) { const field = item[key]; if (isFieldVisible(field)) return field.value.trim(); } return ''; }
function itemHasVisibleContent(item) { return Object.values(item).some(v => v && typeof v === 'object' && 'value' in v && isFieldVisible(v)) || visibleBullets(item).length > 0; }
function renderEntry(item) { const title = firstVisible(item, ['name', 'title', 'school', 'language']) || ''; const subtitle = [firstVisible(item, ['role', 'degree', 'type']), firstVisible(item, ['org', 'major', 'issuer', 'status'])].filter(Boolean).join(' · '); const date = firstVisible(item, ['date', 'level']) || ''; const location = firstVisible(item, ['location']) || ''; const bullets = visibleBullets(item); return `<div class="entry html2pdf__page-break-inside"><div class="entry-header"><div><div class="entry-title">${escapeHtml(title)}</div>${subtitle ? `<div class="entry-subtitle">${escapeHtml(subtitle)}</div>` : ''}${location ? `<div class="helper-text">${escapeHtml(location)}</div>` : ''}</div>${date ? `<div class="entry-date">${escapeHtml(date)}</div>` : ''}</div>${bullets.length ? `<ul>${bullets.map(b => `<li>${nl2br(escapeHtml(b.value))}</li>`).join('')}</ul>` : ''}</div>`; }
function renderSkills(items) { const chips = []; const rows = []; items.forEach(item => { const category = firstVisible(item, ['category']); const content = firstVisible(item, ['content']); if (category && content) rows.push(`<div class="entry"><span class="entry-title">${escapeHtml(category)}：</span>${escapeHtml(content)}</div>`); else if (content) chips.push(...content.split(/[,，、]/).map(s => s.trim()).filter(Boolean)); }); return rows.length ? rows.join('') : `<div class="chips">${chips.map(c => `<span class="chip">${escapeHtml(c)}</span>`).join('')}</div>`; }
function renderLanguages(items) { return `<div class="plain-list">${items.map(item => { const l = firstVisible(item, ['language']); const lv = firstVisible(item, ['level']); return l || lv ? `<div><span class="entry-title">${escapeHtml(l)}</span>${lv ? `：${escapeHtml(lv)}` : ''}</div>` : ''; }).join('')}</div>`; }
function renderLinks(items) { return `<div class="plain-list">${items.map(item => { const t = firstVisible(item, ['title']); const u = firstVisible(item, ['url']); const d = firstVisible(item, ['desc']); if (!t && !u && !d) return ''; const maybeLink = u ? `<a href="${escapeHtml(u)}" target="_blank" rel="noopener noreferrer">${escapeHtml(u)}</a>` : ''; return `<div><span class="entry-title">${escapeHtml(t || u || 'Link')}</span>${u ? ` — ${maybeLink}` : ''}${d ? ` · ${escapeHtml(d)}` : ''}</div>`; }).join('')}</div>`; }
function renderListModule(key) { const mod = state.modules[key]; if (!mod || !mod.visible) return ''; const items = mod.items.filter(item => item.visible && itemHasVisibleContent(item)); if (!items.length) return ''; const title = previewTitle(key); if (key === 'skills') return `<section class="resume-section"><div class="section-title">${title}</div>${renderSkills(items)}</section>`; if (key === 'languages') return `<section class="resume-section"><div class="section-title">${title}</div>${renderLanguages(items)}</section>`; if (key === 'links') return `<section class="resume-section"><div class="section-title">${title}</div>${renderLinks(items)}</section>`; return `<section class="resume-section html2pdf__page-break-inside"><div class="section-title">${title}</div>${items.map(renderEntry).join('')}</section>`; }
function renderSummary() { const mod = state.modules.summary; if (!mod || !mod.visible) return ''; const field = mod.fields.summary; if (!isFieldVisible(field)) return ''; return `<section class="resume-section"><div class="section-title">${previewTitle('summary')}</div><div class="summary">${nl2br(escapeHtml(field.value))}</div></section>`; }
function renderCombinedExperience() { const items = EXPERIENCE_KEYS.flatMap(k => state.modules[k].visible ? state.modules[k].items.filter(item => item.visible && itemHasVisibleContent(item)) : []); if (!items.length) return ''; return `<section class="resume-section html2pdf__page-break-inside"><div class="section-title">${previewTitle('experience')}</div>${items.map(renderEntry).join('')}</section>`; }
function renderHeader() { const p = state.modules.personalInfo; if (!p.visible) return ''; const f = p.fields; const name = isFieldVisible(f.name) ? escapeHtml(f.name.value) : 'Your Name'; const title = isFieldVisible(f.title) ? `<div class="entry-subtitle">${escapeHtml(f.title.value)}</div>` : ''; const common = [f.phone, f.email, f.location, f.website].filter(isFieldVisible).map(x => `<span class="contact-item">${escapeHtml(x.value)}</span>`); const extra = state.settings.template === 'en-minimal' ? [] : ['gender', 'birth', 'political'].map(k => f[k]).filter(isFieldVisible).map(x => `<span class="contact-item">${escapeHtml(x.value)}</span>`); const showAvatar = !shouldHideFieldInTemplate('avatar') && isFieldVisible(f.avatar); return `<div class="resume-header ${showAvatar ? 'with-avatar' : ''}"><div><div class="resume-name">${name}</div>${title}<div class="resume-headline">${[...common, ...extra].join('<span>·</span>')}</div></div>${showAvatar ? `<img class="resume-avatar" src="${f.avatar.value}" alt="avatar">` : ''}</div>`; }
function renderPageFooter() { return ''; }
function renderPreviewMeta() { return ''; }
function renderEmptyState() { const msg = state.settings.languageMode === 'zh' ? '请先填写信息池，勾选后的内容会出现在这里。' : 'Start by filling your information pool.'; return `<div class="preview-meta-card"><strong>${escapeHtml(msg)}</strong></div>`; }
function renderCampusLayout(order) { const leftKeys = ['education', 'skills', 'languages', 'certificates', 'links']; const left = []; const right = []; order.forEach(k => { if (k === 'experience') right.push(renderCombinedExperience()); else if (k === 'summary') right.push(renderSummary()); else if (leftKeys.includes(k)) left.push(renderListModule(k)); else right.push(renderListModule(k)); }); return `<div class="sidebar-col">${renderHeader()}${left.join('')}</div><div class="main-col">${right.join('')}</div>`; }
function renderPreview() { if (isMeaningfullyEmpty()) { resumePage.innerHTML = renderEmptyState(); applyResumeTypographyClasses(); return requestAnimationFrame(checkPageOverflow); } const template = state.settings.template; const order = getPreviewOrder(template); if (template === 'campus') { resumePage.innerHTML = renderCampusLayout(order); applyResumeTypographyClasses(); return requestAnimationFrame(checkPageOverflow); } const parts = [renderHeader()]; order.forEach(key => { if (key === 'experience') parts.push(renderCombinedExperience()); else if (key === 'summary') parts.push(renderSummary()); else parts.push(renderListModule(key)); }); resumePage.innerHTML = parts.join(''); applyResumeTypographyClasses(); requestAnimationFrame(checkPageOverflow); }
function checkPageOverflow() { const pxPerMm = 96 / 25.4; const a4Height = 297 * pxPerMm; const ratio = resumePage.scrollHeight / a4Height; const pageStateEl = document.getElementById('current-page-status'); if (ratio <= 1.02) { pageWarning.textContent = '当前内容基本可控制在一页 A4 内。'; if (pageStateEl) pageStateEl.textContent = 'A4 单页'; } else if (ratio <= 1.35) { pageWarning.textContent = '当前内容略超一页，建议精简 1-2 个条目或描述。'; if (pageStateEl) pageStateEl.textContent = '接近两页'; } else { pageWarning.textContent = '当前内容明显超过一页，导出时将自动分页。'; if (pageStateEl) pageStateEl.textContent = '多页'; } pageWarning.classList.remove('hidden'); }

function openMobileDrawer(title, html) { const drawer = document.getElementById('mobile-drawer'); document.getElementById('mobile-drawer-title').textContent = title; document.getElementById('mobile-drawer-content').innerHTML = html; drawer.classList.remove('hidden'); }
function closeMobileDrawer() { document.getElementById('mobile-drawer').classList.add('hidden'); document.getElementById('mobile-drawer-content').innerHTML = ''; }
function openMobilePreview() { const modal = document.getElementById('mobile-preview-modal'); const cloneWrap = document.getElementById('mobile-preview-clone'); cloneWrap.innerHTML = ''; const cloned = resumePage.cloneNode(true); cloneWrap.appendChild(cloned); modal.classList.remove('hidden'); }
function closeMobilePreview() { document.getElementById('mobile-preview-modal').classList.add('hidden'); document.getElementById('mobile-preview-clone').innerHTML = ''; }
function buildTemplateListHtml() {
  const currentTemplateName = TEMPLATE_META[state.settings.template].name;
  const currentThemeName = `${THEME_PRESETS[state.settings.theme].name} ${THEME_PRESETS[state.settings.theme].zhName}`;
  return `
    <div class="template-theme-drawer-head">
      <strong>${currentTemplateName} · ${currentThemeName}</strong>
      <span class="muted small">模板决定结构，主题决定颜色风格</span>
    </div>
    <div class="template-theme-selector">
      <div class="selector-col">
        <h4>模板</h4>
        <div class="template-list">${Object.entries(TEMPLATE_META).map(([key, meta]) => `<button class="btn mobile-template-option ${state.settings.template === key ? 'active' : ''}" data-template="${key}">${meta.name}</button>`).join('')}</div>
      </div>
      <div class="selector-col">
        <h4>主题风格</h4>
        <div class="theme-list">${Object.entries(THEME_PRESETS).map(([key, preset]) => `<button class="theme-preset mobile-theme-option ${state.settings.theme === key ? 'active' : ''}" data-mobile-theme="${key}"><span class="theme-dot" style="--dot:${preset.accent};--dot-soft:${preset.soft};--dot-border:${preset.border};"></span><span class="theme-meta"><strong>${preset.name}</strong><span>${preset.zhName}</span></span></button>`).join('')}</div>
      </div>
    </div>
    <div class="template-theme-drawer-actions">
      <button class="btn mobile-open-preview">查看预览</button>
      <button class="btn btn-primary mobile-template-done">完成</button>
    </div>`;
}
function buildMobileModuleOrderHtml() {
  const defs = moduleDefs();
  return `<div class="section-actions" style="display:grid;gap:10px;">
    <div class="panel-title" style="margin:0;">简历内容排序</div>
    <div class="muted small">调整后会同步影响填写区、预览区和 PDF 导出顺序。</div>
    <div id="mobile-module-status-list" class="module-order-list">${defs.map((def, index) => `<div class="order-item"><div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1;"><span class="status-dot ${moduleHasContent(def) ? 'filled' : ''}" data-module-status-key="${def.key}" aria-label="${moduleHasContent(def) ? '已填写内容' : '未填写内容'}"></span><span class="order-label">${index + 1}. ${moduleTitle(def)}</span></div><div class="order-actions"><button class="icon-btn" data-action="move-module-up" data-module="${def.key}" ${index === 0 ? 'disabled' : ''}>↑</button><button class="icon-btn" data-action="move-module-down" data-module="${def.key}" ${index === defs.length - 1 ? 'disabled' : ''}>↓</button></div></div>`).join('')}</div>
  </div>`;
}
function buildThemePresetHtml() {
  return `<div class="theme-presets mobile-theme-presets">${Object.entries(THEME_PRESETS).map(([key, preset]) => `<button type="button" class="theme-preset mobile-theme-option ${state.settings.theme === key ? 'active' : ''}" data-mobile-theme="${key}"><span class="theme-dot" style="--dot:${preset.accent};--dot-soft:${preset.soft};--dot-border:${preset.border};"></span><span class="theme-meta"><strong>${preset.name}</strong><span>${preset.zhName}</span></span></button>`).join('')}</div>`;
}
function buildMoreMenuHtml() {
  const t = state.settings.typography || { density: 'standard', fontSize: 'standard', margin: 'standard', accent: 'theme' };
  const currentTemplateName = TEMPLATE_META[state.settings.template].name;
  const currentThemeName = THEME_PRESETS[state.settings.theme].zhName;
  return `
    <div class="section-actions" style="display:grid;gap:10px;">
      <div class="panel-title" style="margin:0;">简历排版设置</div>
      <label class="control-label">排版密度</label>
      <select class="input mobile-typography-control" data-typography-key="density">
        <option value="compact" ${t.density === 'compact' ? 'selected' : ''}>紧凑</option>
        <option value="standard" ${t.density === 'standard' ? 'selected' : ''}>标准</option>
        <option value="spacious" ${t.density === 'spacious' ? 'selected' : ''}>舒展</option>
      </select>
      <label class="control-label">字体大小</label>
      <select class="input mobile-typography-control" data-typography-key="fontSize">
        <option value="small" ${t.fontSize === 'small' ? 'selected' : ''}>小</option>
        <option value="standard" ${t.fontSize === 'standard' ? 'selected' : ''}>标准</option>
        <option value="large" ${t.fontSize === 'large' ? 'selected' : ''}>大</option>
      </select>
      <label class="control-label">页边距</label>
      <select class="input mobile-typography-control" data-typography-key="margin">
        <option value="narrow" ${t.margin === 'narrow' ? 'selected' : ''}>窄</option>
        <option value="standard" ${t.margin === 'standard' ? 'selected' : ''}>标准</option>
        <option value="wide" ${t.margin === 'wide' ? 'selected' : ''}>宽</option>
      </select>
      <label class="control-label">强调色</label>
      <select class="input mobile-typography-control" data-typography-key="accent">
        <option value="theme" ${t.accent === 'theme' ? 'selected' : ''}>跟随主题</option>
        <option value="black" ${t.accent === 'black' ? 'selected' : ''}>黑色</option>
        <option value="blue" ${t.accent === 'blue' ? 'selected' : ''}>蓝色</option>
        <option value="purple" ${t.accent === 'purple' ? 'selected' : ''}>紫色</option>
      </select>
      <button class="btn mobile-typography-reset">重置排版</button>
      <button class="btn mobile-open-module-order">简历内容排序</button>
      <hr style="border:none;border-top:1px solid rgba(148,163,184,.18);margin:4px 0;">
      <div class="panel-title" style="margin:0;">数据备份</div>
      <button class="btn mobile-export-json">导出 JSON</button>
      <button class="btn mobile-import-json">导入 JSON</button>
      <button class="btn btn-danger mobile-reset">清空数据</button>
      <hr style="border:none;border-top:1px solid rgba(148,163,184,.18);margin:4px 0;">
      <div class="panel-title" style="margin:0;">JSON Resume</div>
      <button class="btn mobile-export-jsonresume">导出 JSON Resume</button>
      <button class="btn mobile-open-advanced">打开高级设置</button>
    </div>`;
}

function handleAction(action, target) { const moduleKey = target.dataset.module, itemId = target.dataset.item, bulletIndex = Number(target.dataset.bullet); if (action === 'collapse-module') state.modules[moduleKey].collapsed = !state.modules[moduleKey].collapsed; if (action === 'add-item') state.modules[moduleKey].items.push(createItemByModule(moduleKey)); if (action === 'delete-item' && confirm('确认删除这条经历/条目？删除后不可恢复。')) state.modules[moduleKey].items = state.modules[moduleKey].items.filter(i => i.id !== itemId); if (action === 'add-bullet') getItem(moduleKey, itemId).bullets.push(createBullet('', true)); if (action === 'delete-bullet' && confirm('确认删除这个 bullet？')) getItem(moduleKey, itemId).bullets.splice(bulletIndex, 1); if (action === 'move-module-up') { const order = normalizeOrder(state.settings.moduleOrder); const i = order.indexOf(moduleKey); moveInArray(order, i, i - 1); state.settings.moduleOrder = order; } if (action === 'move-module-down') { const order = normalizeOrder(state.settings.moduleOrder); const i = order.indexOf(moduleKey); moveInArray(order, i, i + 1); state.settings.moduleOrder = order; } if (action === 'move-item-up') { const arr = state.modules[moduleKey].items; const i = arr.findIndex(x => x.id === itemId); moveInArray(arr, i, i - 1); } if (action === 'move-item-down') { const arr = state.modules[moduleKey].items; const i = arr.findIndex(x => x.id === itemId); moveInArray(arr, i, i + 1); } if (action === 'move-bullet-up') moveInArray(getItem(moduleKey, itemId).bullets, bulletIndex, bulletIndex - 1); if (action === 'move-bullet-down') moveInArray(getItem(moduleKey, itemId).bullets, bulletIndex, bulletIndex + 1); if (action === 'clear-avatar') { const avatar = state.modules.personalInfo.fields.avatar; avatar.value = ''; avatar.visible = false; }
  render();
  const drawerTitle = document.getElementById('mobile-drawer-title')?.textContent?.trim();
  if ((action === 'move-module-up' || action === 'move-module-down') && drawerTitle === '简历内容排序' && !document.getElementById('mobile-drawer')?.classList.contains('hidden')) {
    document.getElementById('mobile-drawer-content').innerHTML = buildMobileModuleOrderHtml();
  }
}

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action]');
  if (target) {
    const action = target.dataset.action;
    if (['toggle-module', 'toggle-field', 'toggle-item', 'toggle-bullet', 'update-field', 'update-bullet'].includes(action)) return; // 这些操作在 input/change event listener 里处理
    if (!['collapse-module', 'add-item', 'delete-item', 'add-bullet', 'delete-bullet', 'move-module-up', 'move-module-down', 'move-item-up', 'move-item-down', 'move-bullet-up', 'move-bullet-down', 'clear-avatar'].includes(action)) return; // 只处理这些 action
    handleAction(action, target);
    return;
  }

  // 其他点击事件
  if (e.target.id === 'scroll-preview-btn') previewPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (e.target.id === 'mobile-template-btn') openMobileDrawer('模板与主题', buildTemplateListHtml());
  if (e.target.id === 'mobile-preview-btn') openMobilePreview();
  if (e.target.id === 'mobile-export-btn') exportPDF();
  if (e.target.id === 'mobile-more-btn') openMobileDrawer('更多', buildMoreMenuHtml());
  if (e.target.id === 'mobile-drawer-close') closeMobileDrawer();
  if (e.target.id === 'mobile-preview-close') closeMobilePreview();
  if (e.target.id === 'mobile-preview-export') exportPDF();
  if (e.target.id === 'editor-mobile-change-template') openMobileDrawer('模板与主题', buildTemplateListHtml());

  const option = e.target.closest('.mobile-template-option');
  if (option) {
    state.settings.template = option.dataset.template;
    applySettings(); // 应用设置 (会更新主题色)
    renderNav(); // 重新渲染导航
    renderOrderControls(); // 重新渲染排序
    renderEditor(); // 重新渲染编辑器
    renderPreview(); // 重新渲染预览
    saveState();
    updateEditorMobileSummary(); // 更新手机顶部摘要
    openMobileDrawer('模板与主题', buildTemplateListHtml()); // 重新渲染抽屉，更新选中状态
    return;
  }

  const mobileTheme = e.target.closest('.mobile-theme-option');
  if (mobileTheme) {
    state.settings.theme = mobileTheme.dataset.mobileTheme;
    // state.settings.themeColor = THEME_PRESETS[state.settings.theme].accent; // 已经通过 applySettings 统一管理
    applySettings();
    renderThemePresets();
    renderPreview();
    saveState();
    updateEditorMobileSummary(); // 更新手机顶部摘要
    openMobileDrawer('模板与主题', buildTemplateListHtml()); // 重新渲染抽屉，更新选中状态
    return;
  }

  if (e.target.classList.contains('mobile-template-done')) { closeMobileDrawer(); return; }
  if (e.target.classList.contains('mobile-open-advanced')) { closeMobileDrawer(); const adv = document.querySelector('.advanced-settings'); adv.open = true; adv.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  if (e.target.classList.contains('mobile-open-module-order')) { openMobileDrawer('简历内容排序', buildMobileModuleOrderHtml()); }
  if (e.target.classList.contains('mobile-export-json')) { closeMobileDrawer(); document.getElementById('export-json-btn').click(); }
  if (e.target.classList.contains('mobile-import-json')) { closeMobileDrawer(); document.getElementById('import-json-input').click(); }
  if (e.target.classList.contains('mobile-export-jsonresume')) { closeMobileDrawer(); document.getElementById('export-jsonresume-btn').click(); }
  if (e.target.classList.contains('mobile-reset')) { closeMobileDrawer(); document.getElementById('reset-btn').click(); }
  if (e.target.classList.contains('mobile-typography-reset')) { state.settings.typography = { density: 'standard', fontSize: 'standard', margin: 'standard', accent: 'theme' }; closeMobileDrawer(); applySettings(); renderPreview(); saveState(); }
  if (e.target.classList.contains('mobile-open-preview')) { closeMobileDrawer(); openMobilePreview(); }
});
window.addEventListener('change', (e) => { const t = e.target, action = t.dataset.action; if (action === 'toggle-module') { state.modules[t.dataset.module].visible = t.checked; updateVisibilityOnly(); return; } if (action === 'toggle-item') { getItem(t.dataset.module, t.dataset.item).visible = t.checked; updateVisibilityOnly(); return; } if (action === 'toggle-field') { if (t.dataset.item) getItem(t.dataset.module, t.dataset.item)[t.dataset.field].visible = t.checked; else state.modules[t.dataset.module].fields[t.dataset.field].visible = t.checked; updateVisibilityOnly(); return; } if (action === 'toggle-bullet') { getItem(t.dataset.module, t.dataset.item).bullets[Number(t.dataset.bullet)].visible = t.checked; updateVisibilityOnly(); return; } if (t.id === 'avatar-input') { const file = t.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { state.modules.personalInfo.fields.avatar.value = reader.result; state.modules.personalInfo.fields.avatar.visible = true; render(); }; reader.readAsDataURL(file); return; } if (t.classList.contains('mobile-typography-control')) { const key = t.dataset.typographyKey; state.settings.typography[key] = t.value; renderPreview(); saveState(); return; } });
window.addEventListener('input', (e) => {
  const t = e.target, action = t.dataset.action;
  if (action === 'update-field') { if (t.dataset.item) getItem(t.dataset.module, t.dataset.item)[t.dataset.field].value = t.value; else state.modules[t.dataset.module].fields[t.dataset.field].value = t.value; updatePreviewOnly(); return; }
  if (action === 'update-bullet') { getItem(t.dataset.module, t.dataset.item).bullets[Number(t.dataset.bullet)].value = t.value; updatePreviewOnly(); return; }
  if (t.id === 'pdf-filename-input') { state.settings.pdfFileName = t.value; saveState(); return; }
});

templateSelect.addEventListener('change', () => { state.settings.template = templateSelect.value; render(); });
languageModeSelect.addEventListener('change', () => { state.settings.languageMode = languageModeSelect.value; render(); });
document.addEventListener('click', (e) => {
  const btn = e.target.closest('#theme-presets [data-theme-key]');
  if (!btn) return;
  state.settings.theme = btn.dataset.themeKey;
  state.settings.themeColor = THEME_PRESETS[state.settings.theme].accent;
  applySettings();
  renderThemePresets();
  renderPreview();
  saveState();
});
themeColorInput.addEventListener('input', () => {
  state.settings.themeColor = themeColorInput.value;
  const matched = Object.entries(THEME_PRESETS).find(([, preset]) => preset.accent.toLowerCase() === themeColorInput.value.toLowerCase());
  if (matched) state.settings.theme = matched[0];
  applySettings();
  renderThemePresets();
  renderPreview();
  saveState();
});
fontScaleInput.addEventListener('input', () => { state.settings.fontScale = Number(fontScaleInput.value); render(); });
function sanitizeFileName(name) {
  return text(name).replace(/[\/\\:*?"<>|]/g, '_').replace(/\s+/g, '_');
}

function ensurePdfExtension(name) {
  return name.toLowerCase().endsWith('.pdf') ? name : `${name}.pdf`;
}

function buildDefaultPdfFileName() {
  const personal = state.modules.personalInfo.fields;
  const name = sanitizeFileName(personal.name.value) || 'Resume';
  const title = sanitizeFileName(personal.title.value);
  const templateName = sanitizeFileName(TEMPLATE_META[state.settings.template]?.name || '');
  const parts = [name, title, templateName].filter(Boolean);
  return ensurePdfExtension(parts.join('_'));
}

function getPdfFileName() {
  const customName = sanitizeFileName(state.settings.pdfFileName || '');
  if (customName) return ensurePdfExtension(customName);
  return buildDefaultPdfFileName();
}

async function exportPDF() {
  const element = document.getElementById('resume-page');

  if (!element) {
    alert('未找到简历预览区域。');
    return;
  }

  if (typeof html2pdf === 'undefined') {
    alert('PDF 导出库未加载，请使用“浏览器打印导出”。');
    return;
  }

  const fileName = getPdfFileName();

  console.log('[exportPDF] start');
  console.log('[exportPDF] filename:', fileName);
  console.log('[exportPDF] html2pdf type:', typeof html2pdf);
  console.log('[exportPDF] target:', element);

  try {
    const options = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollY: 0,
        ignoreElements: (el) => el.classList?.contains('export-exclude')
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: ['css', 'legacy'],
        avoid: ['.resume-section', '.entry', 'li']
      }
    };

    const worker = html2pdf().set(options).from(element).toPdf();
    const pdf = await worker.get('pdf');
    const blob = pdf.output('blob');

    if (!blob || blob.size === 0) {
      throw new Error('PDF Blob is empty');
    }

    const file = new File([blob], fileName, { type: 'application/pdf' });
    const shareData = { files: [file] };

    if (navigator.canShare && navigator.canShare(shareData) && navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('[exportPDF] shared successfully');
        return;
      } catch (shareError) {
        console.warn('[exportPDF] share canceled or failed:', shareError);

        if (shareError?.name === 'AbortError' || shareError?.name === 'NotAllowedError') {
          console.log('[exportPDF] share canceled by user');
          return;
        }
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    console.log('[exportPDF] downloaded by fallback');
  } catch (error) {
    console.error('[exportPDF] failed:', error);
    alert(`PDF 导出失败：${error?.message || error}`);
  }
}

function printResume() {
  window.print();
}

document.getElementById('print-btn')?.addEventListener('click', printResume);
document.getElementById('export-pdf-btn')?.addEventListener('click', exportPDF);
document.getElementById('mobile-export-btn')?.addEventListener('click', exportPDF);
document.getElementById('mobile-preview-export')?.addEventListener('click', exportPDF);
document.getElementById('export-json-btn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'modular-resume-backup.json';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('typography-density')?.addEventListener('change', (e) => { state.settings.typography.density = e.target.value; renderPreview(); saveState(); });
document.getElementById('typography-font-size')?.addEventListener('change', (e) => { state.settings.typography.fontSize = e.target.value; renderPreview(); saveState(); });
document.getElementById('typography-margin')?.addEventListener('change', (e) => { state.settings.typography.margin = e.target.value; renderPreview(); saveState(); });
document.getElementById('typography-accent')?.addEventListener('change', (e) => { state.settings.typography.accent = e.target.value; renderPreview(); saveState(); });
document.getElementById('typography-reset-btn')?.addEventListener('click', () => {
  state.settings.typography = { density: 'standard', fontSize: 'standard', margin: 'standard', accent: 'theme' };
  applySettings();
  renderPreview();
  saveState();
});
document.getElementById('export-jsonresume-btn').addEventListener('click', () => { const blob = new Blob([JSON.stringify(exportJsonResume(), null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'resume.json'; a.click(); URL.revokeObjectURL(url); });
document.getElementById('import-json-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!/\.json$/i.test(file.name)) {
    alert('仅支持 .json 文件。');
    e.target.value = '';
    return;
  }
  if (!confirm('导入后会覆盖当前本地草稿，是否继续？')) {
    e.target.value = '';
    return;
  }
  const backupState = JSON.parse(JSON.stringify(state));
  try {
    const parsed = JSON.parse(await file.text());
    const merged = deepMerge(defaultState(), parsed);
    merged.settings.moduleOrder = normalizeOrder(merged.settings.moduleOrder);
    if (!merged.settings.languageMode) merged.settings.languageMode = 'zh';
    state = merged;
    render();
    saveState();
    alert('导入成功');
  } catch {
    state = backupState;
    render();
    saveState();
    alert('JSON 文件格式不正确');
  }
  e.target.value = '';
});
document.getElementById('import-jsonresume-input').addEventListener('change', async (e) => { const file = e.target.files[0]; if (!file) return; try { importJsonResume(JSON.parse(await file.text())); alert('JSON Resume 导入成功。'); } catch { alert('导入失败：JSON Resume 格式不正确。'); } e.target.value = ''; });
document.getElementById('reset-btn').addEventListener('click', () => { if (confirm('确认清空全部数据？此操作会移除 localStorage 中保存的信息池。')) { state = defaultState(); render(); } });

render();
