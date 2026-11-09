import type { ProjectId } from "./projects";

type Skill = { name: string; works: Partial<Record<ProjectId, string>> };

export const skills = {
  product: { name: "产品设计", works: {
    focus: "面试、简历、论文一起挤过来的时候，先做哪一件？我把选择放在第一步。选好以后，屏幕上只留眼前要做的事，和做到哪里算完成。",
    mood: "有些日子只想记一下心情。在花园点一下「不错」，这条心情就记好了。想多说一点，再去选强度、勾原因，或者写句话。",
    quiz: "我把题目按模块收在一起。做错一道，先就地看解析，下次还能从错题里找到它。"
  }},
  ai: { name: "AI 工作流", works: {
    focus: "做到一半又想起别的事，我让模型先判断这个念头跟手头的任务有没有关系。要不要暂停，由使用的人决定。进度存在 SQLite 里，回来还能接着做。",
    aybot: "做毕业设计时，我把找资料和写回答分成两个节点。回答偏了，就能回头看是漏了资料，还是拿到了资料却没用好。"
  }},
  data: { name: "数据分析", works: {
    olist: "一张订单可能有好几件商品，直接连表会把钱算重。我先把每单的金额加起来，再去看这单什么时候送到、买家给了几星。",
    qar: "团队里我负责分析代码和图表。把飞行数据按机场、飞行阶段和超限类型分开看，比只看一个异常总数更容易找到要检查的地方。",
    ev: "市场销量、能源消费和碳排放来自不同的数据表。我参与收集资料，先对齐各项指标的口径，再用 Python 分析和画图。"
  }},
  model: { name: "统计建模", works: {
    qar: "我用 PCA 和随机森林从一百多项飞行参数里筛出五项，再用 LOF 找出离群记录，交给 SVM 分类。这里识别的是异常线索。",
    thesis: "我的硕士论文用了 3,808 名参与者的数据。我比较了几种模型下血糖和 HDL 的关联，最后把篇幅留给 BMI 等结果更稳定的因素。",
    movie: "这是小组项目。我负责清洗数据、训练其中几类模型，再画 ROC 曲线。随机森林的 AUC 是 0.769。想少漏掉潜力片时，我也会单独看召回率。",
    ev: "我把两个问题分开算。新能源汽车保有量用灰色模型推演，碳排放和宏观因素的关系用岭回归估计，分别看各自的历史拟合。"
  }},
  web: { name: "前端实现", works: {
    mood: "记录、植物图鉴和呼吸练习都可以在浏览器里用。日记存在本机，音景用 Web Audio 生成。想写字的时候，记录页才需要键盘。",
    quiz: "我用原生 JavaScript 做了答题卡，把进度、收藏和错题存在浏览器里。刷新以后，做过的题还能找回来。"
  }}
} satisfies Record<string, Skill>;

export type SkillId = keyof typeof skills;
export const skillIds = Object.keys(skills) as SkillId[];
export function worksFor(id: SkillId): Skill["works"] { return skills[id].works; }
export function projectsFor(id: SkillId) { return Object.keys(skills[id].works) as ProjectId[]; }

// Keep shared frame URLs stable when screenshots are inserted or reordered.
type Frame = { linkPage?: number; portrait?: boolean; label: string; image: string; caption: string; source?: string };
type Entry = { title: string; status: string; process: string[]; cover?: string; source?: string; frames?: Frame[] };

const photo = (file: string) => "./photos/evidence/" + file;

export const entries: Record<ProjectId, Entry> = {
  focus: {title:"FocusFlow", status:"网页版已上线", cover:photo("focus-web-entry.png"), source:"FocusFlow 公开网页版 · 示例操作截图",
    process:["在鹅卵石草稿区写下一件事，点「出发咯」。","从一个可编辑的动作开始。临时想起别的事，可以先放进念头口袋。","暂停时给自己留句话，回来接着做。需要更贴合任务的建议时，可以连接自己的 AI。"],
    frames:[
      {label:"写下任务", image:photo("focus-web-entry.png"), caption:"写下眼前这一件事。鹅卵石草稿区保留横线和「出发咯」。"},
      {label:"眼前一步", image:photo("focus-web-active.png"), caption:"第一步可以自己改。回邮件的念头已放进下方口袋，眼前的任务还在。"},
      {label:"暂停书签", image:photo("focus-web-paused.png"), caption:"留下接续提示，刷新后仍能从原步骤接回。"},
      {label:"AI 设置", image:photo("focus-web-ai.png"), caption:"可以接入自己的 AI 接口，并补充当下的时间或精力。默认用离线模板。"},
      {label:"项目插画", image:"./photos/project-flat-v1/focusflow.png", caption:"FocusFlow 的项目封面插画。", source:"FocusFlow · 原主页插画"}
    ]},
  mood: {title:"心情日记", status:"已上线", cover:"./photos/mood-diary/tulip.webp",
    source:"心情日记发布版 · 示例操作截图",
    process:["在花园里选一个心情，花就种下了。","点「补充一点」，先选强度，再选和什么有关，最后可以留一句话。","只想记一下的话，选「今天就记到这里」就好。"],
    frames:[
      {linkPage:3,portrait:true,label:"花园选心情",image:photo("mood-garden-entry.jpg"),caption:"花园下面有五种心情。这次点「不错」。"},
      {linkPage:7,portrait:true,label:"已经记下",image:photo("mood-recorded.jpg"),caption:"花园里多了一朵花。点「今天就记到这里」就可以离开，想多说一点再继续。"},
      {linkPage:8,portrait:true,label:"选强度",image:photo("mood-intensity.jpg"),caption:"补充的第一步是选强度。这次选 3。"},
      {linkPage:9,portrait:true,label:"选关联因素",image:photo("mood-factors.jpg"),caption:"这次勾了「天气」。没想到原因，也可以跳过。"},
      {linkPage:10,portrait:true,label:"留一句话",image:photo("mood-note.jpg"),caption:"最后可以留一句话。今天没什么想写的，就点「先不写」。"},
      {linkPage:11,portrait:true,label:"低落时",image:photo("mood-care.jpg"),caption:"选「低落」时，会弹出关怀选项。可以停一会儿、说说发生了什么，也可以只留下记录。"},
      {linkPage:12,portrait:true,label:"练习后",image:photo("mood-feedback.jpg"),caption:"选「和我待一会儿」，做完一分钟呼吸练习，再记一下此刻的感受。"},
      {linkPage:1,label:"花朵",image:"./photos/mood-diary/tulip.webp",caption:"我挑了这朵郁金香做封面。放大一点，几层珊瑚色的花瓣就能看清。",source:"项目插画 · Soft open bloom"},
      {linkPage:2,label:"应用图标",image:photo("mood-logo.jpeg"),caption:"图标里也留了一朵橙花，底色换成薄荷绿。",source:"心情日记 · 原始应用图标"},
      {linkPage:4,label:"花园",image:"./photos/mood-diary/garden.webp",caption:"记录心情时用到的花园背景。",source:"心情日记 · 场景插画"},
      {linkPage:5,label:"向日葵",image:"./photos/mood-diary/sunflower.webp",caption:"花园里的向日葵。",source:"心情日记 · 植物插画"},
      {linkPage:6,label:"垂下的花",image:"./photos/mood-diary/low-flower.webp",caption:"心情低落时，对应的是这朵垂下来的花。",source:"心情日记 · 植物插画"}
    ]},
  quiz: {title:"北森刷题台",status:"已上线 · 727 道题",cover:photo("quiz1.webp"),source:"言语模块第 1 题 · 实际作答截图",
    process:["选言语、资料或图形模块，打开一张题卡。","作答后，题卡显示正确选项和解析。","需要再练的题，可以从错题和收藏里找。"],
    frames:[
      {label:"题卡",image:photo("quiz1.webp"),caption:"读题时，四个选项和当前进度都在眼前。"},
      {label:"作答反馈",image:photo("quiz2.webp"),caption:"这次选了 A。提交后能看到正确答案是 D，也能看到 A 漏掉了哪一层意思。"},
      {label:"练习首页",image:"./photos/beisen-quiz-home.png",caption:"从首页选一个模块，开始练题。",source:"北森刷题台 · 项目截图"},
      {label:"练习界面",image:"./photos/beisen-quiz-practice.png",caption:"答题时的练习界面。",source:"北森刷题台 · 项目截图"}
    ]},
  olist: {title:"Olist",status:"公开订单数据 · 离线分析",cover:photo("olist1.webp"),source:"Olist-analysis · 项目仓库原图",
    process:["先按订单汇总明细，核对连表前后的订单数和成交额。","比较按时和延迟订单，再按送达天数细分。","调整已观测的订单差异，最后拆开履约环节，看先查哪里。"],
    frames:[
      {label:"按时和晚到",image:photo("olist1.webp"),caption:"按时送达的订单里，9.2% 收到差评。晚到的订单里，这个比例是 54.0%。"},
      {label:"晚了几天",image:photo("olist2.webp"),caption:"提前一两天或当天送到的订单，差评率是 11.7%。晚到 1 至 3 天，就到了 32.2%。"},
      {label:"匹配后再比",image:photo("olist3.webp"),caption:"把已知特征相近的订单放在一起比，估计差距还有 45.05 个百分点。数据里没记录的差异仍可能影响结果。"},
      {label:"先查哪一段",image:photo("olist4.webp"),caption:"按项目的口径拆分超时量，运输段占 85.5%。如果接着查，我会先看运输线路。"}
    ]},
  aybot:{title:"AYBot",cover:"./photos/project-flat-v1/aybot.png",source:"AYBot · 毕业设计材料",frames:[
      {label:"工作流",image:"./photos/aybot-coze-workflow.jpg",caption:"在 Coze 里，把找资料和组织回答拆成不同的节点。"},
      {label:"回答示例",image:"./photos/aybot-answer.png",caption:"一次实际问答的界面。"},
      {label:"架构图",image:"./photos/aybot-architecture.png",caption:"项目里的知识检索与生成流程。"},
      {label:"项目插画",image:"./photos/project-flat-v1/aybot.png",caption:"AYBot 的项目封面插画。",source:"AYBot · 原主页插画"}
    ],status:"毕业设计原型",process:["收到问题，分别查知识库和外部资料。","知识库最多取三个相关片段。","把找到的材料交给回答节点，保留可回查的来源。"]},
  qar:{title:"QAR 航空安全",status:"MathorCup 全国二等奖 · 团队项目",process:["整理一百多项高频飞行参数。","筛出五项关键指标，找出离群记录。","按机场和飞行阶段回看超限情况，缩小排查范围。"]},
  ev:{title:"新能源汽车与双碳",status:"长三角数学建模竞赛二等奖 · 团队项目",process:["对齐市场、能源和宏观数据的口径。","分别建模，估计保有量趋势和碳排放关联。","用历史数据检查拟合情况。"]},
  thesis:{title:"血糖与 HDL",status:"统计学硕士论文 · 3,808 名参与者",process:["整理临床、生活方式和遗传变量。","比较不同回归模型，检查变量之间的相关性。","把单个位点的证据和整个基因面板的结果分开解释。"]},
  movie:{title:"电影商业成功预测",status:"IMDb · 小组项目",process:["整理上映前能知道的信息，划分训练集和测试集。","比较七类模型，分别看精确率和召回率。","结合筛选潜力片时漏判和误判的代价来选模型。"]}
};
