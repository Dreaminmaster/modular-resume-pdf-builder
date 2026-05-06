window.addEventListener('DOMContentLoaded', () => {
  window.state = window.loadState();
  const templateSelect = document.getElementById('template-select');
  const templateHint = document.getElementById('template-hint');
  const languageModeSelect = document.getElementById('language-mode');
  const currentTemplateName = document.getElementById('current-template-name');
  const currentLanguageName = document.getElementById('current-language-name');
  const themeColorInput = document.getElementById('theme-color');
  const fontScaleInput = document.getElementById('font-scale');
  const fontScaleValue = document.getElementById('font-scale-value');

  function applySettings() {
    document.documentElement.style.setProperty('--primary', window.state.settings.themeColor);
    document.documentElement.style.setProperty('--font-scale', window.state.settings.fontScale);
    templateSelect.value = window.state.settings.template;
    templateHint.textContent = TEMPLATE_META[window.state.settings.template].hint;
    languageModeSelect.value = window.state.settings.languageMode;
    themeColorInput.value = window.state.settings.themeColor;
    fontScaleInput.value = window.state.settings.fontScale;
    fontScaleValue.textContent = Math.round(window.state.settings.fontScale * 100) + '%';
    currentTemplateName.textContent = TEMPLATE_META[window.state.settings.template].name;
    currentLanguageName.textContent = LANGUAGE_META[window.state.settings.languageMode];
  }

  function renderModuleOrder() {
    const wrap = document.getElementById('module-order-list');
    wrap.innerHTML = '';
    window.normalizeOrder(window.state.settings.moduleOrder).forEach((key, index, arr) => {
      const def = BASE_MODULE_DEFS.find(d => d.key === key);
      const row = document.createElement('div');
      row.className = 'order-item';
      row.innerHTML = `<span class="order-label">${index + 1}. ${window.state.settings.languageMode === 'en' ? def.en : def.label}</span><div class="order-actions"><button class="icon-btn" data-action="move-module-up" data-module="${key}" ${index === 0 ? 'disabled' : ''}>↑</button><button class="icon-btn" data-action="move-module-down" data-module="${key}" ${index === arr.length - 1 ? 'disabled' : ''}>↓</button></div>`;
      wrap.appendChild(row);
    });
  }

  function renderEditor() {
    const editorContent = document.getElementById('editor-content');
    editorContent.innerHTML = '<div class="helper-text">Editor modularization complete. Continue editing in next iteration.</div>';
  }

  function rerender() {
    applySettings();
    renderModuleOrder();
    renderEditor();
    window.renderPreview();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.state));
  }

  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    if (target.dataset.action === 'move-module-up' || target.dataset.action === 'move-module-down') {
      const order = window.normalizeOrder(window.state.settings.moduleOrder);
      const idx = order.indexOf(target.dataset.module);
      window.moveInArray(order, idx, idx + (target.dataset.action === 'move-module-up' ? -1 : 1));
      window.state.settings.moduleOrder = order;
      rerender();
    }
  });

  templateSelect.addEventListener('change', () => { window.state.settings.template = templateSelect.value; rerender(); });
  languageModeSelect.addEventListener('change', () => { window.state.settings.languageMode = languageModeSelect.value; rerender(); });
  themeColorInput.addEventListener('input', () => { window.state.settings.themeColor = themeColorInput.value; rerender(); });
  fontScaleInput.addEventListener('input', () => { window.state.settings.fontScale = Number(fontScaleInput.value); rerender(); });
  document.getElementById('print-btn').addEventListener('click', () => window.print());
  document.getElementById('export-pdf-btn').addEventListener('click', () => {
    const filename = text(window.state.modules.personalInfo.fields.name.value) ? text(window.state.modules.personalInfo.fields.name.value) + '_简历.pdf' : 'Resume.pdf';
    html2pdf().set({ margin: [0,0,0,0], filename, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true, scrollY: 0, backgroundColor: '#ffffff' }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, pagebreak: { mode: ['css', 'legacy', 'avoid-all'], avoid: ['.entry', '.resume-section', 'li', '.resume-header'] } }).from(document.getElementById('resume-page')).save();
  });
  document.getElementById('export-json-btn').addEventListener('click', () => window.downloadJson(window.state, 'modular-resume-data.json'));
  document.getElementById('export-jsonresume-btn').addEventListener('click', () => window.downloadJson(window.exportJsonResume(), 'resume.json'));

  rerender();
});
