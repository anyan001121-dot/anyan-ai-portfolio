# 安颜｜AI 产品与数据作品集

一个围绕 AI 产品原型、数据建模与个人表达构建的交互式作品集。

## Selected Work

- **FocusFlow**：面向执行功能与任务启动困难的 AI 助手，包含 Brain Dump、任务拆解、专注计时、中断暂存和断点恢复。
- **AYBot**：基于 LangChain、Coze 与 RAG 的知识检索助手，先召回相关材料，再结合可追溯的上下文回答问题。
- **QAR 航空安全模型**：PCA、随机森林、LOF 与 SVM 组合的飞行安全预警研究。
- **新能源汽车与双碳**：长三角数学建模二等奖项目，使用 GM(1,1)、回归与岭回归分析市场增长和双碳目标。

## Interaction

- Canvas 像素采样生成的“我”字关键词粒子
- 乱码解码文字、磁性光标与坐标 HUD
- 2.5D 人像视差与摄影拼贴
- Mac 窗口式产品原型和 RAG 流程预览

## Local Development

```bash
npm install
npm run dev
```

构建 GitHub Pages 静态版本：

```bash
npm run build:pages
```

推送到 `main` 分支后，GitHub Actions 会自动构建并发布网站。
