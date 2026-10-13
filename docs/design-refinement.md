# 页面精简与素材接入

## 参考

- 国内：Dine 为 OneKey 制作的网站。Awwwards Site of the Day 与 Developer Award，奖项记录：https://dinehq.com/news/we-won-sotd/ ，项目案例：https://dinehq.com/work/onekey/ 。
- 国外：Michaël Bernard 的 Studio Alphonse。CSS Design Awards Special Kudos 与 UI、UX、Innovation 公开奖项，记录：https://www.cssdesignawards.com/sites/studio-alphonse/47451/ 。角色、照片与轻交互可以成为同一套视觉语言，网站无需为每段说明另造一个交互模块。

## 本站取舍

- 删除与项目详情重复的四步工作台，导航改为项目、关于我、屏幕之外。
- 本科两年修完四年学分放入教育背景，真实项目数据与获奖信息保留。
- 浅灰白底、灰蓝重点色、细分隔线；减少不规则圆角、旋转卡片、阴影和装饰标签。
- 三个主要项目继续错落展示，其余项目用简洁索引进入详情。
- 按 humanizer 规范精简标题、项目引语和引导文字，使用具体内容而非抽象口号。
- 保留原版黑白小安、开场动画、个人关键词、照片翻面、项目筛选与弹窗中的鼠标指引。
- 新插画位于 public/photos/project-flat-v1/，真实产品截图用于项目详情。

## 2026-10-13 · User-led interactions

Reference: [HEYTEA official website](https://www.heytea.com/).
Its published CSS confirms a perspective flip card with a 0.6s rotation, a short fade/slide entrance, and Swiper-based store galleries. The animated homepage could not be captured reliably in the browser, so these are source-confirmed patterns rather than a claim to have visually audited every screen. No HEYTEA imagery, fonts, copy, or implementation was copied.

Applied to this portfolio:
- Featured artwork follows the pointer in shallow layers and enters once as it reaches the viewport.
- Desktop project index previews the focused/hovered project, with a sticky illustration or existing product screenshot. Direct click still opens its case study; the compact mobile list stays direct.
- Travel prints support horizontal drag, click-to-flip, arrow keys, previous/next buttons, and a five-photo contact sheet. A drag cannot accidentally flip the print; vertical touch gestures remain available for page scrolling.
- Reduced-motion preferences disable the added movement. No autoplay, scroll hijacking, animation library, or new downloaded assets.
- Opening animation, original black-and-white Xiao An, and dialog cursor portal retained.

Validation: TypeScript and production build passed; desktop browser verified filter counts, keyboard index preview, dialog cursor, drag-to-next without flip, click-to-flip, thumbnail selection. Viewport tool did not apply its requested 390px override (reported 1280px), so narrow-screen rendering was not visually verified in this pass.
