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
function shouldHideFieldInTemplate(fieldKey) { return window.state.settings.template === 'en-minimal' && EN_HIDDEN_FIELDS.includes(fieldKey); }

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
    settings: { template: 'cn-classic', languageMode: 'zh', themeColor: '#2563eb', fontScale: 1, moduleOrder: BASE_MODULE_DEFS.map(x => x.key) },
    modules: {
      personalInfo: { visible: true, collapsed: false, fields: {
        name: createField('姓名', '', true, '例如：张三'), title: createField('求职意向', '', true, '例如：机械工程师 / 产品经理 / Data Analyst'), phone: createField('电话', '', true, '例如：138-0000-0000'), email: createField('邮箱', '', true, '例如：name@email.com'), location: createField('所在地', '', true, '例如：上海'), website: createField('个人主页', '', true, '例如：https://portfolio.com'), gender: createField('性别', '', true, '例如：男 / 女'), birth: createField('出生年月', '', true, '例如：2001.08'), political: createField('政治面貌', '', true, '例如：中共党员'), avatar: createField('头像', '', false, '上传头像图片后自动写入')
      }},
      education: { visible: true, items: [createEducationItem()], collapsed: false }, internships: { visible: true, items: [createExperienceItem('intern', '例如：制造工程实习')], collapsed: false }, projects: { visible: true, items: [createExperienceItem('project', '例如：六轴机械臂视觉抓取项目')], collapsed: false }, research: { visible: true, items: [createExperienceItem('research', '例如：机器人末端执行器优化课题')], collapsed: false }, awards: { visible: true, items: [createAwardItem()], collapsed: false }, achievements: { visible: true, items: [createAchievementItem()], collapsed: false }, skills: { visible: true, items: [createSkillItem()], collapsed: false }, certificates: { visible: true, items: [createCertificateItem()], collapsed: false }, languages: { visible: true, items: [createLanguageItem()], collapsed: false }, summary: { visible: true, collapsed: false, fields: { summary: createField('自我评价', '', true, '例如：请用 2-4 句概括你的优势、方向与成果。') } }, links: { visible: true, items: [createLinkItem()], collapsed: false }
    }
  };
}

window.state = null;
window.loadState = function () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const base = defaultState();
    if (!raw) return base;
    const merged = window.deepMerge(base, JSON.parse(raw));
    merged.settings.moduleOrder = window.normalizeOrder(merged.settings.moduleOrder);
    if (!merged.settings.languageMode) merged.settings.languageMode = 'zh';
    return merged;
  } catch {
    return defaultState();
  }
};
