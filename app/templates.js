const TEMPLATE_ORDER_RULES = {
  engineering: ['projects', 'skills', 'internships', 'achievements', 'education'],
  academic: ['education', 'research', 'achievements', 'awards', 'languages'],
  product: ['projects', 'internships', 'skills', 'links', 'education'],
  'en-minimal': ['education', 'internships', 'projects', 'skills', 'languages', 'achievements']
};

const TEMPLATE_META = {
  'cn-classic': { name: '经典单栏中文模板', className: 'template-cn-classic', hint: '适合中文校招 / 通用求职，结构稳重清晰。' },
  'en-minimal': { name: '英文极简模板', className: 'template-en-minimal', hint: '适合海外简历，默认隐藏性别、出生年月、政治面貌、头像等国内字段。' },
  'engineering': { name: '工程技术模板', className: 'template-engineering', hint: '优先突出项目经历、技能、实习与工程成果。' },
  'campus': { name: '校招双栏模板', className: 'template-campus', hint: '适合应届生，把教育与技能信息放在更醒目的侧栏。' },
  'product': { name: '产品经理模板', className: 'template-product', hint: '优先展示项目、实习、结果数据与作品链接。' },
  'academic': { name: '学术 CV 模板', className: 'template-academic', hint: '优先展示教育、科研、成果与获奖，适合学术申请。' }
};

window.normalizeOrder = function (order) {
  const all = BASE_MODULE_DEFS.map(x => x.key);
  const valid = Array.isArray(order) ? order.filter(k => all.includes(k)) : [];
  all.forEach(k => { if (!valid.includes(k)) valid.push(k); });
  return valid;
};

window.deepMerge = function (base, extra) {
  if (Array.isArray(base)) return Array.isArray(extra) ? extra : base;
  if (typeof base !== 'object' || base === null) return extra ?? base;
  const output = { ...base };
  for (const key of Object.keys(extra || {})) output[key] = key in base ? window.deepMerge(base[key], extra[key]) : extra[key];
  return output;
};

window.getPreviewOrder = function (template) {
  let manual = window.normalizeOrder(window.state.settings.moduleOrder).filter(k => k !== 'personalInfo');
  if (TEMPLATE_ORDER_RULES[template]) {
    const first = TEMPLATE_ORDER_RULES[template];
    manual = [...first.filter(k => manual.includes(k)), ...manual.filter(k => !first.includes(k))];
  }
  if (template === 'en-minimal') {
    const mapped = []; let inserted = false;
    manual.forEach(k => {
      if (EXPERIENCE_KEYS.includes(k)) {
        if (!inserted) { mapped.push('experience'); inserted = true; }
      } else mapped.push(k);
    });
    return mapped;
  }
  return manual;
};
