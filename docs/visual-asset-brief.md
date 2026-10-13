# 安颜个人主页素材：扁平简约版

最新偏好：项目插画采用少量纯色色块与简洁轮廓，减少物件和装饰；小安保留原有黑白简约风格。

## 已完成

素材目录：`outputs/flat-assets-v2/`。打开其中的 `index.html` 可预览，并切换浅色、灰蓝、深绿、杏桃背景。网站使用 `public/photos/project-flat-v1/` 中的 5 张插画：FocusFlow 主展台、AYBot 项目索引、QAR 纸飞机与云层。

| 素材 | 文件 | 用途 |
| --- | --- | --- |
| FocusFlow：便签、思绪气泡、铅笔与计时器 | `illustrations/focusflow.png` | 蓝色项目展台的场景插画 |
| AYBot：书本、笔记本与索引卡 | `illustrations/aybot.png` | 知识检索项目封面 |
| QAR：纸飞机 | `illustrations/qar-plane.png` | 航空研究项目的独立漂浮图层 |
| QAR：宽云组 | `illustrations/qar-cloud-wide.png` | 场景下方的独立云层 |
| QAR：小云组 | `illustrations/qar-cloud-small.png` | 场景侧面的独立云层 |
| 小安：11 张原版动作 | `mascot/` | 首页、向导和动作切换 |

5 张新插画均为 1448 × 1086 透明 PNG，使用内置 image_gen 生成。原始提示词与尺寸信息保存在素材包的 `prompts.md` 和 `manifest.json`。小安文件与原始素材逐字节一致。

## 后续制作规范

- 小安：黑白平涂、干净轮廓，保持脸型、长卷发、黑色服装及身体比例。以 `public/photos/guide-actions-v2/` 为唯一角色参考。
- 项目插画：奶油白、浅绿、灰蓝、杏桃少量配色，纯色大形与稀疏细线，保持留白。
- 不添加水彩、彩铅、纸张纹理、重阴影、厚白贴纸边或复杂背景。
- 图片不含文字和指标；标题、按钮和项目数据仍由网页排版。
- QAR 三张透明图独立使用，方便调整位置与分别添加轻微漂浮动效。
- 保留原始 PNG，后续接入网站时再制作适合显示尺寸的压缩版本。

已有花朵、旅行照片、本人照片和真实产品截图继续使用。旧版柔和纹理素材在 `outputs/soft-assets-v1/` 留作历史稿；本版是当前采用方向。
