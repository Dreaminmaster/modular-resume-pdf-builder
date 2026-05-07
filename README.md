# Modular Resume PDF Builder

A front-end resume builder based on one simple idea:

**One information pool. Flexible visibility control. Multiple resume layouts.**

Build your resume once, choose what to show, switch templates, and export a clean PDF.

[Live Demo](https://dreaminmaster.github.io/modular-resume-pdf-builder/) · [GitHub](https://github.com/Dreaminmaster/modular-resume-pdf-builder) · `v1.0.1` · MIT License

![Modular Resume PDF Builder](docs/screenshot-editor.png)

---

## The Idea

Most resume builders start with a template.

This one starts with your information.

You can keep all resume materials in one place, then decide which modules, fields, entries, and bullet points should appear in the current resume.

Hidden content is preserved, not deleted.

---

## How it works

```text
Information Pool
      ↓
Content Scope
      ↓
Visibility Control
      ↓
Template Layout
      ↓
PDF Export
```

---

## Features

### Data Model
- Field-level `label / value / visible`
- Item-level visibility
- Bullet-level visibility
- Local-only storage via `localStorage`
- JSON import/export
- JSON Resume compatible import/export

### Editing Experience
- Three-column layout
  - Left: module navigation and settings
  - Middle: questionnaire-style editor
  - Right: A4 live preview
- Beginner 4-step onboarding flow
- Module collapse/expand
- Module ordering controls
- Item move up/down
- Bullet move up/down
- Empty-state guidance for first-time users
- Theme color and font scale controls in Advanced Settings

### Templates
Currently included:
- Classic Chinese Single Column
- English Minimal
- Engineering
- Campus Two-Column
- Product Manager
- Academic CV

### Export
- `html2pdf.js` PDF export
- Browser print fallback
- Only the resume preview is exported/printed
- A4-oriented sizing and page-break avoidance rules

---

## Usage Flow

1. Fill in your full information pool
2. Uncheck fields/items/bullets you do not want to show
3. Choose a template
4. Export PDF

This means one dataset can generate multiple resume versions.

---

## Privacy

This project is designed to be privacy-friendly:

- No backend
- No account system
- No network storage for resume data
- Data is saved in the browser only
- Files are exported locally by the user

If you deploy the project yourself, your data handling still depends on your hosting environment, but the application itself does not require a server database.

---

## Known Limitations

- JSON Resume support is still a compatibility mapping, not full schema parity
- Drag-and-drop sorting is not implemented yet; button-based reordering is used instead
- Very long content may still span multiple PDF pages depending on browser rendering behavior
- Different browsers may produce slightly different print/PDF results
- Mobile experience is usable but desktop-first

---

## Roadmap

- Better JSON Resume schema coverage
- Drag-and-drop sorting
- More overseas resume templates
- Better multi-page export control
- Richer academic publication fields
- Template thumbnail picker
- React / Vue refactor in the future

---

## Project Structure

```text
.
├── docs/
│   ├── screenshot-editor.png
│   ├── screenshot-templates.png
│   └── screenshot-preview.png
├── index.html
├── style.css
├── app.js
└── README.md
```

---

## Chinese Notes / 中文说明

### 项目简介
这是一个纯前端模块化简历生成器，核心不是“固定模板填空”，而是：

1. 先填写完整信息池
2. 再勾选显示内容
3. 最后切换模板导出

### 隐私说明
- 不需要后端
- 不需要账号
- 数据默认保存在浏览器本地
- 不会自动上传到服务器

### 当前重点能力
- 模块化信息池
- 字段 / 条目 / bullet 级 visible 控制
- 多模板排版
- PDF 导出
- JSON Resume 兼容导入导出

---

## License

MIT
