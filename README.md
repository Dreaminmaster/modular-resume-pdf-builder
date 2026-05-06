# Modular Resume PDF Builder

一个纯前端的模块化简历生成器：**信息池 + 勾选显示 + 模板排版 + PDF 导出**。

在线体验：
- GitHub Pages: https://dreaminmaster.github.io/modular-resume-pdf-builder/
- GitHub Repo: https://github.com/Dreaminmaster/modular-resume-pdf-builder

---

## 项目定位

这不是“固定模板填空器”，而是一个更灵活的模块化简历工具：

1. 先填写完整**信息池**
2. 再勾选要显示的字段 / 经历 / bullet
3. 最后切换不同**模板排版**
4. 导出 PDF 或打印

核心原则：
- **取消勾选不是删除**
- **模板只读 visible 内容**
- **最终简历 = 被勾选内容 + 当前模板排版**

---

## 主要特性

### 数据与显示分离
- 每个字段都包含 `label / value / visible`
- 每个经历都可整体控制显示 / 隐藏
- 每个 bullet 也能单独勾选
- 取消勾选后内容仍保留在本地信息池中

### 实时预览
- 左侧模块导航
- 中间问卷式编辑区
- 右侧 A4 简历实时预览
- 仅渲染 `visible === true && value 非空` 的内容

### 模板系统
当前已支持 6 套模板：
- 经典单栏中文模板
- 英文极简模板
- 工程技术模板
- 校招双栏模板
- 产品经理模板
- 学术 CV 模板

### 导出能力
- `html2pdf.js` 一键导出 PDF
- `window.print()` 浏览器打印导出
- 自动隐藏编辑器，仅导出右侧简历区域
- 增强分页避免规则，尽量减少 section / entry / bullet 被切断

### 本地化与数据管理
- `localStorage` 自动保存
- 导入 / 导出自定义 JSON
- 导入 / 导出 **JSON Resume**
- 无需后端，无需登录

### 交互增强
- 模块顺序调整
- 条目上移 / 下移
- bullet 上移 / 下移
- 头像上传与显示控制
- 主题色调整
- 字体大小调整
- 中文 / English / 双语标题模式

---

## 技术栈

- HTML
- CSS
- JavaScript
- html2pdf.js

无构建工具，复制后即可直接打开 `index.html` 使用。

---

## 项目结构

```text
.
├── index.html
├── style.css
├── app.js
└── README.md
```

---

## 使用方式

### 本地打开
直接双击 `index.html` 即可。

### 推荐工作流
1. 填写完整简历信息池
2. 取消不想显示的字段 / 经历 / bullet
3. 切换不同模板观察效果
4. 导出 PDF 或打印

---

## 数据结构示例

### 字段结构

```json
{
  "label": "邮箱",
  "value": "xxx@email.com",
  "visible": true
}
```

### 经历结构

```json
{
  "id": "internship_001",
  "visible": true,
  "company": { "label": "公司名称", "value": "", "visible": true },
  "position": { "label": "岗位", "value": "", "visible": true },
  "date": { "label": "时间", "value": "", "visible": true },
  "bullets": [
    { "value": "完成生产流程优化", "visible": true }
  ]
}
```

---

## JSON Resume 兼容

本项目参考了 JSON Resume 的思想：
- 数据结构标准化
- 数据与主题分离

目前已支持：
- 导出为 JSON Resume 风格数据
- 从 JSON Resume 导入并映射到本项目的信息池

说明：
- 当前是**兼容映射**，不是 100% 全字段无损双向同步
- 后续可继续增强对更多 schema 字段的支持

---

## 模板理念

模板只负责：
- 排版
- 模块顺序微调
- 字体风格
- 视觉层次
- 中英文呈现方式

模板**不修改原始数据本身**。

---

## 部署

适合部署到：
- GitHub Pages
- Cloudflare Pages
- Netlify
- 任意静态托管平台

本项目当前已部署到 GitHub Pages：
https://dreaminmaster.github.io/modular-resume-pdf-builder/

---

## Roadmap

- [x] 模块化信息池
- [x] 字段 / 条目 / bullet 可见性控制
- [x] 多模板系统
- [x] PDF 导出
- [x] JSON 导入 / 导出
- [x] JSON Resume 兼容导入 / 导出
- [x] 中英 / 双语标题模式
- [ ] 更完整的 JSON Resume schema 对齐
- [ ] 拖拽排序
- [ ] 更多海外简历模板
- [ ] 学术成果更细粒度字段
- [ ] React / Vue 重构版本

---

## License

MIT
