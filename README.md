# Modular Resume PDF Builder

一个纯前端的模块化简历生成器：**信息池 + 勾选显示 + 模板排版 + PDF 导出**。

在线目标：GitHub Pages 静态部署，可直接浏览器打开使用，无需后端、无需登录。

## 特性

- 纯前端：HTML / CSS / JavaScript
- 信息池与模板分离
- 每个模块可勾选显示/隐藏
- 每个字段包含 `label / value / visible`
- 每条经历可整体勾选显示/隐藏
- 每个 bullet 可单独勾选显示/隐藏
- 取消勾选不删除数据，只是不显示
- 右侧 A4 简历实时预览
- 3 套模板
  - 经典单栏中文模板
  - 英文极简模板
  - 工程技术模板
- `html2pdf.js` 一键导出 PDF
- `window.print()` 浏览器打印导出
- 打印时只导出右侧简历区域
- `localStorage` 自动保存
- 支持 JSON 导入 / 导出
- 支持模块折叠展开
- 支持主题色与字体大小调整

## 项目结构

```text
.
├── index.html
├── style.css
└── app.js
```

## 使用方式

### 本地打开

直接双击 `index.html`，或用任意静态服务器打开。

### 核心逻辑

- 填写完整信息池
- 勾选要显示的字段 / 经历 / bullet
- 切换模板查看不同排版
- 导出 PDF 或打印

## 数据结构示例

```json
{
  "label": "邮箱",
  "value": "xxx@email.com",
  "visible": true
}
```

经历类示例：

```json
{
  "id": "internship_001",
  "visible": true,
  "company": { "label": "公司名称", "value": "", "visible": true },
  "position": { "label": "岗位", "value": "", "visible": true },
  "date": { "label": "时间", "value": "", "visible": true },
  "bullets": [
    { "value": "", "visible": true }
  ]
}
```

## 模板理念

模板只负责：

- 排版
- 模块顺序
- 字体与视觉风格
- 中英文简历呈现方式

模板**不改变用户数据本身**。

## PDF 导出

提供两种方式：

1. `html2pdf.js` 一键导出 PDF
2. 浏览器 `window.print()` 打印导出

打印样式中会自动隐藏左侧和中间编辑区，只保留右侧 A4 简历区域。

## 部署

本项目适合部署到：

- GitHub Pages
- Cloudflare Pages
- Netlify
- 任意静态托管平台

## 后续可扩展方向

- 模块拖拽排序
- 自定义模板系统
- 多页分页优化
- 头像模块
- React / Vue 重构
- 可自托管 JSON Resume 兼容导出

## License

MIT
