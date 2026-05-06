const STORAGE_KEY = 'modular_resume_builder_v1';

const MODULE_DEFS = [
  { key: 'personalInfo', label: '基本信息', type: 'fields' },
  { key: 'education', label: '教育背景', type: 'list', itemLabel: '教育经历' },
  { key: 'internships', label: '实习经历', type: 'list', itemLabel: '实习经历' },
  { key: 'projects', label: '项目经历', type: 'list', itemLabel: '项目经历' },
  { key: 'research', label: '科研经历', type: 'list', itemLabel: '科研经历' },
  { key: 'awards', label: '获奖经历', type: 'list', itemLabel: '获奖经历' },
  { key: 'achievements', label: '专利 / 论文 / 成果', type: 'list', itemLabel: '成果条目' },
  { key: 'skills', label: '技能', type: 'list', itemLabel: '技能分类' },
  { key: 'certificates', label: '证书', type: 'list', itemLabel: '证书' },
  { key: 'languages', label: '语言能力', type: 'list', itemLabel: '语言能力' },
  { key: 'summary', label: '自我评价', type: 'fields' },
  { key: 'links', label: '作品链接', type: 'list', itemLabel: '链接条目' }
];

const TEMPLATE_META = {
  'cn-classic': { name: '经典单栏中文模板', className: 'template-cn-classic' },
  'en-minimal': { name: '英文极简模板', className: 'template-en-minimal' },
  'engineering': { name: '工程技术模板', className: 'template-engineering' }
};

function createField(label, value = '', visible = true, placeholder = '') {
  return { label, value, visible, placeholder };
}
function createBullet(value = '', visible = true) { return { value, visible }; }
function uid(prefix) { return prefix + '_' + Math.random().toString(36).slice(2, 9); }

function createEducationItem() {
  return {
    id: uid('edu'), visible: true,
    school: createField('学校', '', true, '例如：同济大学'),
    degree: createField('学历/学位', '', true, '例如：硕士 / 本科'),
    major: createField('专业', '', true, '例如：机械工程'),
    date: createField('时间', '', true, '例如：2021.09 - 2024.06'),
    location: createField('地点', '', true, '例如：上海'),
    bullets: [createBullet('GPA 3.8/4.0，专业前 10%', true)]
  };
}
function createExperienceItem(prefix, sampleTitle) {
  return {
    id: uid(prefix), visible: true,
    name: createField('名称', '', true, sampleTitle),
    role: createField('岗位/角色', '', true, '例如：机械设计实习生 / 项目负责人'),
    org: createField('单位/平台', '', true, '例如：ABB / 实验室 / 学院创新中心'),
    date: createField('时间', '', true, '例如：2023.06 - 2023.09'),
    location: createField('地点', '', true, '例如：上海'),
    bullets: [
      createBullet('负责核心模块设计与推进，协调 3 人小组完成阶段目标。', true),
      createBullet('通过数据分析或流程优化，将效率提升 20%+。', true)
    ]
  };
}
function createAwardItem() {
  return {
    id: uid('award'), visible: true,
    title: createField('奖项名称', '', true, '例如：全国大学生机械创新设计大赛一等奖'),
    issuer: createField('颁发单位', '', true, '例如：教育部高等学校机械基础课程教学指导委员会'),
    date: createField('时间', '', true, '例如：2023.11'),
    bullets: [createBullet('校级/省级/国家级，排名前 5%。', true)]
  };
}
function createAchievementItem() {
  return {
    id: uid('achievement'), visible: true,
    title: createField('成果名称', '', true, '例如：发明专利《一种自动抓取机构》'),
    type: createField('类型', '', true, '例如：论文 / 专利 / 软著 / 成果转化'),
    date: createField('时间', '', true, '例如：2024.03'),
    status: createField('状态', '', true, '例如：已授权 / 已录用 / 审核中'),
    bullets: [createBullet('本人排名第 1，负责结构设计与实验验证。', true)]
  };
}
function createSkillItem() {
  return {
    id: uid('skill'), visible: true,
    category: createField('技能分类', '', true, '例如：编程 / 软件 / 硬件 / 办公'),
    content: createField('技能内容', '', true, '例如：Python、MATLAB、SolidWorks、PLC、AutoCAD'),
    bullets: []
  };
}
function createCertificateItem() {
  return {
    id: uid('cert'), visible: true,
    name: createField('证书名称', '', true, '例如：大学英语六级 CET-6'),
    issuer: createField('颁发机构', '', true, '例如：教育部考试中心'),
    date: createField('时间', '', true, '例如：2022.12'),
    bullets: []
  };
}
function createLanguageItem() {
  return {
    id: uid('lang'), visible: true,
    language: createField('语言', '', true, '例如：英语'),
    level: createField('水平', '', true, '例如：IELTS 7.0 / CET-6 / 流利沟通'),
    bullets: []
  };
}
function createLinkItem() {
  return {
    id: uid('link'), visible: true,
    title: createField('链接名称', '', true, '例如：GitHub / 作品集 / 个人网站'),
    url: createField('链接地址', '', true, '例如：https://github.com/yourname'),
    desc: createField('说明', '', true, '例如：机械臂控制与视觉项目合集'),
    bullets: []
  };
}

function defaultState() {
  return {
    settings: { template: 'cn-classic', themeColor: '#2563eb', fontScale: 1 },
    modules: {
      personalInfo: {
        visible: true,
        fields: {
          name: createField('姓名', '', true, '例如：张三'),
          title: createField('求职意向', '', true, '例如：机械工程师 / 产品经理 / Data Analyst'),
          phone: createField('电话', '', true, '例如：138-0000-0000'),
          email: createField('邮箱', '', true, '例如：name@email.com'),
          location: createField('所在地', '', true, '例如：上海'),
          website: createField('个人主页', '', true, '例如：https://portfolio.com'),
          gender: createField('性别', '', true, '例如：男 / 女'),
          birth: createField('出生年月', '', true, '例如：2001.08'),
          political: createField('政治面貌', '', true, '例如：中共党员')
        },
        collapsed: false
      },
      education: { visible: true, items: [createEducationItem()], collapsed: false },
      internships: { visible: true, items: [createExperienceItem('intern', '例如：制造工程实习')], collapsed: false },
      projects: { visible: true, items: [createExperienceItem('project', '例如：六轴机械臂视觉抓取项目')], collapsed: false },
      research: { visible: true, items: [createExperienceItem('research', '例如：机器人末端执行器优化课题')], collapsed: false },
      awards: { visible: true, items: [createAwardItem()], collapsed: false },
      achievements: { visible: true, items: [createAchievementItem()], collapsed: false },
      skills: { visible: true, items: [createSkillItem()], collapsed: false },
      certificates: { visible: true, items: [createCertificateItem()], collapsed: false },
      languages: { visible: true, items: [createLanguageItem()], collapsed: false },
      summary: {
        visible: true,
        fields: {
          summary: createField('自我评价', '', true, '例如：具备机械设计、自动化控制与跨团队协作经验，能够快速推进项目落地。')
        },
        collapsed: false
      },
      links: { visible: true, items: [createLinkItem()], collapsed: false }
    }
  };
}

let state = loadState();

const editorContent = document.getElementById('editor-content');
const moduleNav = document.getElementById('module-nav');
const resumePage = document.getElementById('resume-page');
const templateSelect = document.getElementById('template-select');
const currentTemplateName = document.getElementById('current-template-name');
const themeColorInput = document.getElementById('theme-color');
const fontScaleInput = document.getElementById('font-scale');
const fontScaleValue = document.getElementById('font-scale-value');
const pageWarning = document.getElementById('page-warning');

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return deepMerge(defaultState(), JSON.parse(raw));
  } catch (e) {
    console.warn('load failed', e);
    return defaultState();
  }
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function deepMerge(base, extra) {
  if (Array.isArray(base)) return Array.isArray(extra) ? extra : base;
  if (typeof base !== 'object' || base === null) return extra ?? base;
  const output = { ...base };
  for (const key of Object.keys(extra || {})) {
    if (key in base) output[key] = deepMerge(base[key], extra[key]);
    else output[key] = extra[key];
  }
  return output;
}
function text(v) { return (v || '').toString().trim(); }
function isFieldVisible(field) { return !!field && field.visible && text(field.value) !== ''; }
function visibleBullets(item) { return (item.bullets || []).filter(b => b.visible && text(b.value)); }
function moduleHasContent(modDef) {
  const mod = state.modules[modDef.key];
  if (!mod) return false;
  if (modDef.type === 'fields') return Object.values(mod.fields).some(f => text(f.value));
  return mod.items.some(item => Object.values(item).some(v => v && typeof v === 'object' && 'value' in v && text(v.value)) || visibleBullets(item).length);
}

function render() {
  applySettings();
  renderNav();
  renderEditor();
  renderPreview();
  saveState();
}

function applySettings() {
  document.documentElement.style.setProperty('--primary', state.settings.themeColor);
  document.documentElement.style.setProperty('--font-scale', state.settings.fontScale);
  templateSelect.value = state.settings.template;
  themeColorInput.value = state.settings.themeColor;
  fontScaleInput.value = state.settings.fontScale;
  fontScaleValue.textContent = Math.round(state.settings.fontScale * 100) + '%';
  currentTemplateName.textContent = TEMPLATE_META[state.settings.template].name;
  resumePage.className = 'resume-page ' + TEMPLATE_META[state.settings.template].className;
}

function renderNav() {
  moduleNav.innerHTML = '';
  MODULE_DEFS.forEach(def => {
    const mod = state.modules[def.key];
    const row = document.createElement('div');
    row.className = 'module-nav-item';
    row.innerHTML = `
      <label style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">
        <input class="checkbox" type="checkbox" ${mod.visible ? 'checked' : ''} data-action="toggle-module" data-module="${def.key}">
        <a href="#module-${def.key}">${def.label}</a>
      </label>
      <span class="status-dot ${moduleHasContent(def) ? 'filled' : ''}"></span>
    `;
    moduleNav.appendChild(row);
  });
}

function renderEditor() {
  editorContent.innerHTML = '';
  MODULE_DEFS.forEach(def => {
    const mod = state.modules[def.key];
    const card = document.createElement('section');
    card.className = 'module-card';
    card.id = 'module-' + def.key;

    const bodyClass = mod.collapsed ? 'module-body collapsed' : 'module-body';
    card.innerHTML = `
      <div class="module-header">
        <div class="module-title-wrap">
          <input class="checkbox" type="checkbox" ${mod.visible ? 'checked' : ''} data-action="toggle-module" data-module="${def.key}">
          <div>
            <h3 class="module-title">${def.label}</h3>
            <div class="helper-text">模块隐藏后，内容仍然保留在信息池中</div>
          </div>
        </div>
        <div class="module-actions">
          ${def.type === 'list' ? `<button class="icon-btn" data-action="add-item" data-module="${def.key}">+ 新增${def.itemLabel}</button>` : ''}
          <button class="icon-btn" data-action="collapse-module" data-module="${def.key}">${mod.collapsed ? '展开' : '折叠'}</button>
        </div>
      </div>
      <div class="${bodyClass}"></div>
    `;

    const body = card.querySelector('.module-body');
    if (def.type === 'fields') {
      body.appendChild(renderFieldsBlock(def.key, mod.fields));
    } else {
      mod.items.forEach((item, index) => body.appendChild(renderItemCard(def.key, item, index, def.itemLabel)));
      const actions = document.createElement('div');
      actions.className = 'section-actions';
      actions.innerHTML = `<button class="btn" data-action="add-item" data-module="${def.key}">+ 添加${def.itemLabel}</button>`;
      body.appendChild(actions);
    }
    editorContent.appendChild(card);
  });
}

function renderFieldsBlock(moduleKey, fields) {
  const wrap = document.createElement('div');
  const keys = Object.keys(fields);
  const gridClass = keys.length >= 4 ? 'grid-2' : '';
  if (gridClass) wrap.classList.add(gridClass);
  keys.forEach(fieldKey => wrap.appendChild(renderField(moduleKey, null, fieldKey, fields[fieldKey])));
  return wrap;
}

function renderField(moduleKey, itemId, fieldKey, field) {
  const row = document.createElement('div');
  row.className = 'field-row';
  row.innerHTML = `
    <div class="field-top">
      <input class="checkbox" type="checkbox" ${field.visible ? 'checked' : ''} data-action="toggle-field" data-module="${moduleKey}" ${itemId ? `data-item="${itemId}"` : ''} data-field="${fieldKey}">
      <label class="field-label">${field.label}</label>
    </div>
    ${fieldKey === 'summary' ?
      `<textarea data-action="update-field" data-module="${moduleKey}" ${itemId ? `data-item="${itemId}"` : ''} data-field="${fieldKey}" placeholder="${field.placeholder || ''}">${field.value || ''}</textarea>` :
      `<input class="input" data-action="update-field" data-module="${moduleKey}" ${itemId ? `data-item="${itemId}"` : ''} data-field="${fieldKey}" value="${escapeHtml(field.value || '')}" placeholder="${field.placeholder || ''}">`
    }
    <div class="field-meta">仅当 visible = true 且内容非空时，右侧模板才会渲染</div>
  `;
  return row;
}

function renderItemCard(moduleKey, item, index, itemLabel) {
  const card = document.createElement('div');
  card.className = 'item-card';

  const fieldEntries = Object.entries(item).filter(([k, v]) => !['id', 'visible', 'bullets'].includes(k) && v && typeof v === 'object' && 'label' in v);
  const grid = document.createElement('div');
  grid.className = fieldEntries.length > 2 ? 'grid-2' : 'grid-1';
  fieldEntries.forEach(([fieldKey, field]) => grid.appendChild(renderField(moduleKey, item.id, fieldKey, field)));

  const bulletsWrap = document.createElement('div');
  bulletsWrap.className = 'bullets-block';
  const bulletsTitle = document.createElement('div');
  bulletsTitle.innerHTML = '<strong>Bullet 描述</strong><div class="helper-text">每一个 bullet 也可单独勾选显示或隐藏</div>';
  bulletsWrap.appendChild(bulletsTitle);
  (item.bullets || []).forEach((bullet, bulletIndex) => bulletsWrap.appendChild(renderBullet(moduleKey, item.id, bullet, bulletIndex)));

  const bulletActions = document.createElement('div');
  bulletActions.className = 'section-actions';
  bulletActions.innerHTML = `<button class="btn" data-action="add-bullet" data-module="${moduleKey}" data-item="${item.id}">+ 添加 Bullet</button>`;
  bulletsWrap.appendChild(bulletActions);

  card.innerHTML = `
    <div class="item-card-header">
      <div class="item-card-title">
        <input class="checkbox" type="checkbox" ${item.visible ? 'checked' : ''} data-action="toggle-item" data-module="${moduleKey}" data-item="${item.id}">
        <span>${itemLabel} ${index + 1}</span>
      </div>
      <div class="item-card-actions">
        <button class="icon-btn" data-action="delete-item" data-module="${moduleKey}" data-item="${item.id}">删除</button>
      </div>
    </div>
  `;
  card.appendChild(grid);
  card.appendChild(bulletsWrap);
  return card;
}

function renderBullet(moduleKey, itemId, bullet, bulletIndex) {
  const row = document.createElement('div');
  row.className = 'bullet-row';
  row.innerHTML = `
    <input class="checkbox" type="checkbox" ${bullet.visible ? 'checked' : ''} data-action="toggle-bullet" data-module="${moduleKey}" data-item="${itemId}" data-bullet="${bulletIndex}">
    <div style="flex:1;display:grid;gap:8px;">
      <textarea data-action="update-bullet" data-module="${moduleKey}" data-item="${itemId}" data-bullet="${bulletIndex}" placeholder="例如：主导机械结构优化，降低设备故障率 15%。">${bullet.value || ''}</textarea>
      <div class="section-actions">
        <button class="icon-btn" data-action="delete-bullet" data-module="${moduleKey}" data-item="${itemId}" data-bullet="${bulletIndex}">删除 Bullet</button>
      </div>
    </div>
  `;
  return row;
}

function getItem(moduleKey, itemId) {
  return state.modules[moduleKey].items.find(i => i.id === itemId);
}

function renderPreview() {
  const template = state.settings.template;
  const order = getModuleOrder(template);
  const parts = [];
  parts.push(renderHeader(template));
  order.forEach(key => {
    const html = renderModulePreview(key, template);
    if (html) parts.push(html);
  });
  resumePage.innerHTML = parts.join('');
  requestAnimationFrame(checkPageOverflow);
}

function getModuleOrder(template) {
  if (template === 'engineering') {
    return ['education', 'projects', 'skills', 'internships', 'research', 'achievements', 'awards', 'certificates', 'languages', 'summary', 'links'];
  }
  if (template === 'en-minimal') {
    return ['education', 'experience', 'projects', 'skills', 'research', 'achievements', 'certificates', 'languages', 'links', 'summary'];
  }
  return ['education', 'internships', 'projects', 'research', 'awards', 'achievements', 'skills', 'certificates', 'languages', 'summary', 'links'];
}

function renderHeader(template) {
  const p = state.modules.personalInfo;
  if (!p.visible) return '';
  const f = p.fields;
  const name = isFieldVisible(f.name) ? escapeHtml(f.name.value) : '你的姓名';
  const title = isFieldVisible(f.title) ? `<div class="entry-subtitle">${escapeHtml(f.title.value)}</div>` : '';
  const commonContacts = [f.phone, f.email, f.location, f.website].filter(isFieldVisible).map(x => `<span class="contact-item">${escapeHtml(x.value)}</span>`);
  let extra = [];
  if (template !== 'en-minimal') {
    extra = [f.gender, f.birth, f.political].filter(isFieldVisible).map(x => `<span class="contact-item">${escapeHtml(x.value)}</span>`);
  }
  return `
    <div class="resume-header">
      <div class="resume-name">${name}</div>
      ${title}
      <div class="resume-headline">${[...commonContacts, ...extra].join('<span>·</span>')}</div>
    </div>
  `;
}

function renderModulePreview(key, template) {
  if (template === 'en-minimal' && key === 'experience') {
    return renderCombinedExperience();
  }
  const def = MODULE_DEFS.find(d => d.key === key);
  const mod = state.modules[key];
  if (!def || !mod || !mod.visible) return '';

  if (def.type === 'fields') {
    const fields = Object.values(mod.fields).filter(isFieldVisible);
    if (!fields.length) return '';
    if (key === 'summary') return `<section class="resume-section"><div class="section-title">${template === 'en-minimal' ? 'Summary' : def.label}</div><div class="summary">${nl2br(escapeHtml(fields[0].value))}</div></section>`;
    return '';
  }

  const items = mod.items.filter(item => item.visible && itemHasVisibleContent(item));
  if (!items.length) return '';
  const title = template === 'en-minimal' ? translateLabel(def.label) : def.label;

  if (key === 'skills') return `<section class="resume-section"><div class="section-title">${title}</div>${renderSkills(items)}</section>`;
  if (key === 'languages') return `<section class="resume-section"><div class="section-title">${title}</div>${renderLanguages(items)}</section>`;
  if (key === 'links') return `<section class="resume-section"><div class="section-title">${title}</div>${renderLinks(items)}</section>`;
  return `<section class="resume-section"><div class="section-title">${title}</div>${items.map(item => renderEntry(item)).join('')}</section>`;
}

function renderCombinedExperience() {
  const groups = [state.modules.internships, state.modules.projects, state.modules.research].filter(Boolean);
  const items = groups.flatMap(g => g.visible ? g.items.filter(item => item.visible && itemHasVisibleContent(item)) : []);
  if (!items.length) return '';
  return `<section class="resume-section"><div class="section-title">Experience</div>${items.map(item => renderEntry(item)).join('')}</section>`;
}

function itemHasVisibleContent(item) {
  const fieldOk = Object.values(item).some(v => v && typeof v === 'object' && 'value' in v && isFieldVisible(v));
  return fieldOk || visibleBullets(item).length > 0;
}

function renderEntry(item) {
  const title = firstVisible(item, ['name', 'title', 'school', 'language']) || '';
  const subtitle = [firstVisible(item, ['role', 'degree', 'type']), firstVisible(item, ['org', 'major', 'issuer', 'status'])].filter(Boolean).join(' · ');
  const date = firstVisible(item, ['date', 'level']) || '';
  const location = firstVisible(item, ['location']) || '';
  const bullets = visibleBullets(item);
  return `
    <div class="entry">
      <div class="entry-header">
        <div>
          <div class="entry-title">${escapeHtml(title)}</div>
          ${subtitle ? `<div class="entry-subtitle">${escapeHtml(subtitle)}</div>` : ''}
          ${location ? `<div class="helper-text">${escapeHtml(location)}</div>` : ''}
        </div>
        ${date ? `<div class="entry-date">${escapeHtml(date)}</div>` : ''}
      </div>
      ${bullets.length ? `<ul>${bullets.map(b => `<li>${nl2br(escapeHtml(b.value))}</li>`).join('')}</ul>` : ''}
    </div>
  `;
}

function renderSkills(items) {
  const chips = [];
  const rows = [];
  items.forEach(item => {
    const category = firstVisible(item, ['category']);
    const content = firstVisible(item, ['content']);
    if (category && content) rows.push(`<div class="entry"><span class="entry-title">${escapeHtml(category)}：</span>${escapeHtml(content)}</div>`);
    else if (content) chips.push(...content.split(/[,，、]/).map(s => s.trim()).filter(Boolean));
  });
  if (rows.length) return rows.join('');
  return `<div class="chips">${chips.map(c => `<span class="chip">${escapeHtml(c)}</span>`).join('')}</div>`;
}

function renderLanguages(items) {
  return `<div class="plain-list">${items.map(item => {
    const l = firstVisible(item, ['language']);
    const lv = firstVisible(item, ['level']);
    return l || lv ? `<div><span class="entry-title">${escapeHtml(l)}</span>${lv ? `：${escapeHtml(lv)}` : ''}</div>` : '';
  }).join('')}</div>`;
}

function renderLinks(items) {
  return `<div class="plain-list">${items.map(item => {
    const t = firstVisible(item, ['title']);
    const u = firstVisible(item, ['url']);
    const d = firstVisible(item, ['desc']);
    if (!t && !u && !d) return '';
    return `<div><span class="entry-title">${escapeHtml(t || u || 'Link')}</span>${u ? ` — ${escapeHtml(u)}` : ''}${d ? ` · ${escapeHtml(d)}` : ''}</div>`;
  }).join('')}</div>`;
}

function firstVisible(item, keys) {
  for (const key of keys) {
    const field = item[key];
    if (isFieldVisible(field)) return field.value.trim();
  }
  return '';
}
function translateLabel(label) {
  const map = {
    '教育背景': 'Education', '项目经历': 'Projects', '实习经历': 'Internships', '科研经历': 'Research',
    '获奖经历': 'Awards', '专利 / 论文 / 成果': 'Achievements', '技能': 'Skills', '证书': 'Certificates',
    '语言能力': 'Languages', '自我评价': 'Summary', '作品链接': 'Links'
  };
  return map[label] || label;
}
function nl2br(str) { return str.replace(/\n/g, '<br>'); }
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function createItemByModule(moduleKey) {
  if (moduleKey === 'education') return createEducationItem();
  if (moduleKey === 'internships') return createExperienceItem('intern', '例如：供应链优化实习');
  if (moduleKey === 'projects') return createExperienceItem('project', '例如：智能分拣系统设计');
  if (moduleKey === 'research') return createExperienceItem('research', '例如：数字孪生产线研究');
  if (moduleKey === 'awards') return createAwardItem();
  if (moduleKey === 'achievements') return createAchievementItem();
  if (moduleKey === 'skills') return createSkillItem();
  if (moduleKey === 'certificates') return createCertificateItem();
  if (moduleKey === 'languages') return createLanguageItem();
  if (moduleKey === 'links') return createLinkItem();
  return createExperienceItem('item', '新条目');
}

editorContent.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  const moduleKey = target.dataset.module;
  const itemId = target.dataset.item;
  const bulletIndex = Number(target.dataset.bullet);

  if (action === 'collapse-module') state.modules[moduleKey].collapsed = !state.modules[moduleKey].collapsed;
  if (action === 'add-item') state.modules[moduleKey].items.push(createItemByModule(moduleKey));
  if (action === 'delete-item') {
    if (confirm('确认删除这条经历/条目？删除后不可恢复。')) {
      state.modules[moduleKey].items = state.modules[moduleKey].items.filter(i => i.id !== itemId);
    }
  }
  if (action === 'add-bullet') getItem(moduleKey, itemId).bullets.push(createBullet('', true));
  if (action === 'delete-bullet') {
    if (confirm('确认删除这个 bullet？')) getItem(moduleKey, itemId).bullets.splice(bulletIndex, 1);
  }
  render();
});

window.addEventListener('change', (e) => {
  const t = e.target;
  const action = t.dataset.action;
  if (action === 'toggle-module') state.modules[t.dataset.module].visible = t.checked;
  if (action === 'toggle-item') getItem(t.dataset.module, t.dataset.item).visible = t.checked;
  if (action === 'toggle-field') {
    if (t.dataset.item) getItem(t.dataset.module, t.dataset.item)[t.dataset.field].visible = t.checked;
    else state.modules[t.dataset.module].fields[t.dataset.field].visible = t.checked;
  }
  if (action === 'toggle-bullet') getItem(t.dataset.module, t.dataset.item).bullets[Number(t.dataset.bullet)].visible = t.checked;
  render();
});

window.addEventListener('input', (e) => {
  const t = e.target;
  const action = t.dataset.action;
  if (action === 'update-field') {
    if (t.dataset.item) getItem(t.dataset.module, t.dataset.item)[t.dataset.field].value = t.value;
    else state.modules[t.dataset.module].fields[t.dataset.field].value = t.value;
    render();
  }
  if (action === 'update-bullet') {
    getItem(t.dataset.module, t.dataset.item).bullets[Number(t.dataset.bullet)].value = t.value;
    render();
  }
});

templateSelect.addEventListener('change', () => { state.settings.template = templateSelect.value; render(); });
themeColorInput.addEventListener('input', () => { state.settings.themeColor = themeColorInput.value; render(); });
fontScaleInput.addEventListener('input', () => { state.settings.fontScale = Number(fontScaleInput.value); render(); });

document.getElementById('print-btn').addEventListener('click', () => window.print());

document.getElementById('export-pdf-btn').addEventListener('click', () => {
  const nameField = state.modules.personalInfo.fields.name;
  const filename = (text(nameField.value) ? text(nameField.value) + '_简历.pdf' : 'Resume.pdf');
  const opt = {
    margin: [0, 0, 0, 0],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  };
  html2pdf().set(opt).from(resumePage).save();
});

document.getElementById('export-json-btn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'modular-resume-data.json';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('import-json-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    state = deepMerge(defaultState(), parsed);
    render();
    alert('JSON 导入成功。');
  } catch (err) {
    alert('导入失败：JSON 格式不正确。');
  }
  e.target.value = '';
});

document.getElementById('reset-btn').addEventListener('click', () => {
  if (confirm('确认清空全部数据？此操作会移除 localStorage 中保存的信息池。')) {
    state = defaultState();
    render();
  }
});

function checkPageOverflow() {
  const pxPerMm = 96 / 25.4;
  const a4Height = 297 * pxPerMm;
  pageWarning.classList.toggle('hidden', resumePage.scrollHeight <= a4Height + 24);
}

render();
