# Modular Resume PDF Builder

[中文](#中文说明) | [English](#english)

**当前稳定版本：v1.0.1**

一个基于“信息池 + 可见性控制 + 多模板排版”的纯前端简历生成器。

你只需要维护一份完整信息池，然后按不同岗位勾选显示内容、切换模板，并导出 PDF。

[在线体验](https://dreaminmaster.github.io/modular-resume-pdf-builder/) · [GitHub 仓库](https://github.com/Dreaminmaster/modular-resume-pdf-builder) · `v1.0.1`

![Modular Resume PDF Builder](docs/screenshot-editor.png)

---

## 中文说明

### 核心理念

大多数简历工具是从模板开始的。

这个项目是从你的**信息池**开始的。

你可以把所有简历材料保存在一处，再决定当前这份简历中要显示哪些：
- 模块
- 字段
- 条目
- bullet 描述

隐藏的内容不会被删除，只是暂时不显示。

### 工作方式

```text
信息池
   ↓
内容范围
   ↓
可见性控制
   ↓
模板排版
   ↓
PDF 导出
```

### 截图

#### 编辑界面
![Editor Screenshot](docs/screenshot-editor.png)

#### 模板与设置
![Template Screenshot](docs/screenshot-templates.png)

#### 实时预览
![Preview Screenshot](docs/screenshot-preview.png)

### 版本记录

#### v1.0.1
- 新增自定义 PDF 文件名输入框
- 左侧模块导航更名为“简历内容范围”
- 填写区只显示当前勾选的模块
- 调整默认显示模块范围
- 调整基本信息字段默认开关
- 隐藏模块的数据会保留，可随时恢复

#### v1.0.0
- 初始稳定版发布
- 信息池编辑
- 字段 / 条目 / bullet 可见性控制
- 多模板
- 实时预览
- PDF 导出
- 桌面端与移动端响应式布局

### 使用授权 / 使用限制

本项目**不开放他人使用、修改、商用或二次分发**。

你可以：
- 浏览仓库内容
- 查看演示页面
- 作为作品展示参考

你**不可以**：
- 将本项目用于商业用途
- 复制后直接投入个人或企业使用
- 修改后再次发布
- 重新分发、售卖或作为模板产品传播
- 用于训练、打包、二次开发后对外提供服务

如需任何授权，请先联系作者并获得明确书面许可。

### 主要特性

- 字段级 `label / value / visible`
- 条目级显示/隐藏
- bullet 级显示/隐藏
- 本地 `localStorage` 自动保存
- JSON 导入 / 导出
- JSON Resume 兼容导入 / 导出
- 多模板切换
- 浏览器端 PDF 导出

### 隐私说明

- 无后端
- 无账号系统
- 不自动上传简历数据
- 数据默认保存在浏览器本地

### 已知限制

- JSON Resume 目前是兼容映射，不是完整 schema 对齐
- 超长内容在不同浏览器中分页效果可能略有差异
- 当前仍以桌面端体验优先

---

## English

A front-end resume builder based on one simple idea:

**One information pool. Flexible visibility control. Multiple resume layouts.**

Build your resume once, choose what to show, switch templates, and export a clean PDF.

[Live Demo](https://dreaminmaster.github.io/modular-resume-pdf-builder/) · [GitHub](https://github.com/Dreaminmaster/modular-resume-pdf-builder) · `v1.0.1`

### The Idea

Most resume builders start with a template.

This one starts with your information.

You can keep all resume materials in one place, then decide which modules, fields, entries, and bullet points should appear in the current resume.

Hidden content is preserved, not deleted.

### How it works

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

### Changelog

#### v1.0.1
- Added custom PDF filename input
- Renamed module navigation to Resume Content Scope / 简历内容范围
- Editor now only shows selected modules
- Adjusted default visible modules
- Adjusted default personal information fields
- Kept hidden module data preserved and restorable

#### v1.0.0
- Initial stable release
- Information pool editing
- Field / item / bullet visibility controls
- Multiple templates
- Live preview
- PDF export
- Responsive desktop and mobile layout

### Usage Restriction

This project is provided for **display and portfolio showcase only**.

You may:
- view the repository
- browse the demo
- refer to it as a showcased project

You may **not**:
- use it in commercial scenarios
- modify and republish it
- redistribute it
- sell it
- reuse it as a template product
- deploy it as your own service without explicit permission

For any usage authorization, please contact the author first and obtain explicit written permission.

### Project Structure

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
