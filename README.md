# 安颜｜AI 产品与数据作品集

一个围绕 AI 产品原型、数据建模与个人表达构建的交互式作品集。

## Selected Work

- **FocusFlow**：面向执行功能与任务启动困难的 AI 助手，包含 Brain Dump、任务拆解、专注计时、中断暂存和断点恢复。
- **心情日记**：情绪花园与主动关怀产品，包含记录、即时关怀、反馈记忆及可选的“小萤”AI 陪聊；作品区使用项目原素材演示三步流程，并链接至在线应用。
- **AYBot**：基于 LangChain、Coze 与 RAG 的知识检索助手，先召回相关材料，再结合可追溯的上下文回答问题。
- **QAR 航空安全模型**：PCA、随机森林、LOF 与 SVM 组合的飞行安全预警研究。
- **新能源汽车与双碳**：长三角数学建模二等奖项目，使用 GM(1,1)、回归与岭回归分析市场增长和双碳目标。

## Interaction

- 橙色海报首屏、描边真人照片与卡通人像切换
- 可跳过、可重播的开幕动画；首次会话播放，并尊重减少动态效果设置
- 小人问候互动，移动端支持点按
- Canvas 像素采样生成的“我”字关键词粒子
- 乱码解码文字、磁性光标与坐标 HUD
- 轻量人像视差与摄影拼贴
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

## Interactive studio redesign

The orange portrait opening leads into an editorial project playground with three featured exhibits (FocusFlow, Mood Diary and MathorCup) and a smaller archive of the remaining six projects. Category filters keep all nine projects reachable. A native dialog opens each case with its original evidence, result-first narrative chapters, process notes and source links.

- **Thinking workbench**: four keyboard-accessible steps connect methods to concrete project examples.
- **Off screen**: five travel photographs can be turned over and browsed with previous/next controls; interest buttons reveal debate, music, games and art notes.
- **Little guide**: click to open section navigation, choose a project, high-five or minimize. Dragging repositions the character without accidentally opening the menu. The menu returns to a safe corner when opened.
- **Accessibility**: native modal focus containment and Escape; focus restoration; arrow-key tab navigation; reduced-motion CSS; mobile tap equivalents.

Project content lives in `app/projects.ts`; the new sections in `app/StudioSections.tsx` and their styles in `app/Studio.css`. The existing portrait opening and keyword particle identity map are retained.
