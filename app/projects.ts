export type Project = {
  year: string; title: string; subtitle: string; tags: string[];
  metric: string; metricLabel: string; lead: string;
  star: { situation: string; task: string; action: string; result: string };
  tone: string; preview: string; award?: string; url?: string; liveUrl?: string; linkLabel?: string;
  stage?: string;
  contribution?: string;
  decision?: { title: string; detail: string; basis: string };
  evidence?: {
    summary: string;
    items: { label: string; text: string }[];
    next?: string;
    links?: { label: string; url: string }[];
  };
  research?: { title: string; url: string; summary: string; application: string; notesUrl: string };
  steps?: { label: string; description: string }[];
  overturn?: { before: string; evidence: string; after: string };
  /** 30-second version: every line is condensed from the full write-up below, no new claims. */
  brief: { role: string; result: string; method: string; why: string };
};

export const projects: Project[] = [
  {
    year: "2026",
    title: "FocusFlow",
    brief: { role: "独立设计与开发，用 Claude Code、Codex 辅助编码", result: "可运行原型：逐步执行、杂念暂存、暂停后接回", method: "LangGraph · Streamlit · SQLite", why: "AI 可以理解杂念，不能擅自换掉当前任务" },
    subtitle: "面向 ADHD 任务启动困难的 AI 助手",
    stage: "可运行原型 · 使用效果待验证",
    contribution: "独立设计任务启动与中断工作流，使用 Claude Code、Codex 辅助需求拆解、代码开发、调试与迭代。",
    decision: {
      title: "AI 可以理解杂念，不能擅自换掉当前任务。",
      detail: "临时输入先进入稍后列表，模型只判断与当前任务的相关性，核心状态由规则控制。需要处理急事时，用户可以主动暂停。计时默认收起，优先保留当前步骤、完成标准和返回提示。",
      basis: "依据：工作流设计与两轮情境走查记录。走查暴露了完成标准未显示、暂存输入未清空等问题，随后完成修正。",
    },
    evidence: {
      summary: "已有文献调研、情境走查和功能测试，真实任务中的帮助仍待验证。",
      items: [
        { label: "设计依据", text: "NICE NG87 支持低干扰、清晰提示和可休息的设计方向。具体功能是项目中的设计选择。" },
        { label: "已有产出", text: "实现逐步执行、杂念暂存、暂停与返回；练习模式用于检查流程。自动化测试与模拟走查不计作真实用户试用。" },
        { label: "使用条件", text: "本地单用户模式可以持久化恢复；公开演示采用临时会话，刷新后的恢复能力有限。" },
      ],
      next: "下一步观察用户是否在真实任务上做出第一个动作、中断后是否能接回，以及工具本身增加了多少操作。生成建议或点击完成不直接计作任务成功。",
      links: [{ label: "走查与验证计划", url: "https://github.com/anyan001121-dot/focusflow/blob/main/docs/product-review-2026-09-16.md" }],
    },
    tags: ["LangGraph", "Streamlit", "SQLite", "LLM"],
    metric: "≤ 3",
    metricLabel: "候选任务 · 执行时聚焦一步",
    lead: "知道要做什么，却迟迟开始不了。FocusFlow 帮用户找到眼前能动手的一小步。",
    star: {
      situation: "我关注年轻人在学习与工作中难以启动任务的时刻，尤其是 ADHD 用户的使用困难。结合 NICE NG87 的环境调整说明与项目情境走查，将切入点收窄为‘知道要做什么，却开始不了’，以及被打断后难以接回原任务。",
      task: "让用户不必先整理好所有待办，就能开始眼前的一步。第一阶段围绕任务启动、杂念暂存和中断恢复设计流程，减少开始前需要做的选择。",
      action: "用 LangGraph 串联输入、任务拆解和执行流程：先给出最多 3 个候选任务，选定后只展示当前步骤与完成条件；步骤太难可以继续拆小，突然想起的事可以暂存。SQLite 保存任务状态，暂停时可留返回提示，计时按需展开。",
      result: "已实现任务输入、逐步执行、杂念暂存及暂停恢复的可运行原型，并提供无需 API 密钥的练习模式。当前产出是功能与流程的实现；是否帮助用户更容易开始或返回任务，仍需在真实使用情境中验证。",
    },
    research: {
      title: "NICE NG87 · 环境调整",
      url: "https://www.nice.org.uk/guidance/ng87/chapter/recommendations#terms-used-in-this-guideline",
      summary: "指南举例包括减少干扰、较短的专注时段配合休息，以及用文字补充口头说明，并强调按个人需要调整。",
      application: "据此将低干扰、可暂停和清晰提示作为设计方向，落实为当前一步、杂念暂存与返回提示。具体功能是产品设计推论，指南不能代替实际使用效果的验证。",
      notesUrl: "https://github.com/anyan001121-dot/focusflow/blob/main/docs/product-review-2026-09-16.md",
    },
    steps: [
      { label: "杂乱输入", description: "写下眼前的事，不必先整理优先级；一句话也可以开始。" },
      { label: "聚焦当前一步", description: "从最多 3 个候选任务中选择一个，再看当前动作与完成条件。如果这一步仍然太难，可以继续拆小。" },
      { label: "暂存与返回", description: "想到别的事先暂存；需要离开时保留当前步骤，回来继续。计时按需展开。" },
    ],
    tone: "focus",
    preview: "focusflow",
    url: "https://github.com/anyan001121-dot/focusflow",
  },
  {
    year: "2026",
    title: "北森刷题台",
    brief: { role: "独立开发并上线", result: "727 道题、三大模块，可在线练习与复盘", method: "原生 JS · LocalStorage", why: "从抽题、作答到错题回看，一条完整练习流程" },
    subtitle: "校招测评练习产品",
    tags: ["Vanilla JS", "LocalStorage", "Quiz UX", "GitHub Pages"],
    metric: "727",
    metricLabel: "道题 · 三大模块",
    lead: "将 727 道测评题整合为一套可练习、可追踪、可复盘的在线系统。",
    star: {
      situation: "备考校招测评时，727 道题分散在三个模块，练习和复盘需要来回切换。",
      task: "做一套从选题、答题到错题回看的完整刷题流程。",
      action: "用原生 JS 与 LocalStorage 实现快速小测、顺序/随机练习、答题卡、收藏、错题筛选和成绩报告。",
      result: "收录言语 321 题、资料 254 题、图形 152 题；进度、错题和收藏均保存在本地，可直接在线使用。",
    },
    steps: [
      { label: "抽题", description: "从言语、资料、图形三大模块里随机抽一题，也可以按模块顺序练习。" },
      { label: "作答", description: "答题卡实时记录进度，不确定的题目可以先收藏，稍后回头看。" },
      { label: "查看反馈", description: "提交后立即看到正误和正确率，答错的题会自动进入错题筛选。" },
    ],
    tone: "quiz",
    preview: "quiz",
    url: "https://github.com/anyan001121-dot/beisen-quiz",
    liveUrl: "https://anyan001121-dot.github.io/beisen-quiz/",
  },
  {
    year: "2024",
    title: "AYBot",
    brief: { role: "毕业设计，独立完成需求、知识库与工作流", result: "5 节点检索工作流原型，回答可追溯来源", method: "Coze · LangChain · RAG", why: "把找资料和组织答案拆开，出错时能分清是哪一步" },
    subtitle: "RAG 知识检索助手",
    stage: "毕业设计原型 · 检索与回答质量待系统评估",
    contribution: "独立完成需求分析、知识库构建、Coze 工作流、Prompt 设计、外部信息接入与案例调试。",
    decision: {
      title: "把找资料和组织答案拆开。",
      detail: "先从内部知识库与外部信息源检索，再将材料送入生成节点，用 Prompt 约束角色、回答边界与输出格式。节点分开后，可以分别检查问题出在检索还是生成。",
      basis: "依据：毕业设计中的五节点工作流与检索配置。",
    },
    evidence: {
      summary: "已完成知识问答与信息聚合原型；Top 3 是检索配置。",
      items: [
        { label: "参数口径", text: "最大召回数量 3、最低匹配度 0.14 为原型配置，尚未通过标注问题集证明是最优组合。" },
        { label: "现有证据", text: "毕业设计保留了工作流与案例展示，尚无统一测试集上的命中率、答案正确率和幻觉率对照。" },
      ],
      next: "用同一组问题比较直接生成与检索后生成，分别记录资料是否相关、答案是否有依据、资料不足时能否说明限制。",
    },
    tags: ["LangChain", "Coze", "LLM", "API"],
    metric: "TOP 3",
    metricLabel: "知识片段召回",
    lead: "先检索依据，再组织答案。",
    star: {
      situation: "通用大模型不了解本地资料，面对新信息时也容易给出没有依据的回答。",
      task: "搭建一套先找资料、再生成答案的检索流程，并让信息来源可以追溯。",
      action: "在 Coze 中拆成输入、知识库检索、外部搜索、答案生成和输出 5 个节点；每次召回 Top 3 片段，最低匹配度设为 0.14。",
      result: "回答会结合内部资料与外部搜索依据；扩展工作流还能按关键词整理 10 条新闻并定时推送。",
    },
    tone: "coral",
    preview: "aybot",
  },
  {
    year: "2023",
    title: "QAR 航空安全模型",
    brief: { role: "团队项目：负责代码、建模框架、可视化与调优", result: "MathorCup 全国二等奖；100+ 参数中筛出 5 项关键指标", method: "PCA · 随机森林 · LOF · SVM", why: "先缩小分析范围，再定位异常出现的场景" },
    subtitle: "高维飞行数据风险识别与预警",
    stage: "数模竞赛 · 离线建模与风险分析",
    contribution: "团队项目中负责 Python 分析代码、整体建模框架、可视化和模型调优。",
    decision: {
      title: "先缩小分析范围，再定位异常出现的场景。",
      detail: "面对 100+ 项飞行参数，先筛选关键项，再结合机场、飞行阶段和超限类型做分组分析。异常分类之外，保留热力图，让结果能回答哪些场景值得进一步检查。",
      basis: "依据：竞赛论文的特征筛选、超限分组分析与 LOF / SVM 建模流程。",
    },
    evidence: {
      summary: "获得 MathorCup 全国二等奖；成果为竞赛数据上的离线分析。",
      items: [
        { label: "具体产出", text: "筛出下降率、着陆 G 值、盘量、下滑道偏差和航向道偏差 5 项关键指标，并形成机场、机号与飞行阶段的超限分布图。" },
        { label: "标签口径", text: "预警分类使用 LOF 生成的离群标签。识别这些标签的表现，不能直接解释为识别真实事故的能力。" },
        { label: "适用范围", text: "属于竞赛离线建模，尚无实时部署和真实事故验证。超限频数用于定位检查线索，未按飞行暴露量校正。" },
      ],
    },
    tags: ["PCA", "Random Forest", "LOF", "SVM"],
    metric: "5 项",
    metricLabel: "关键飞行指标",
    lead: "从 100+ 项高频飞行参数中识别关键风险信号。",
    award: "MathorCup 数学建模挑战赛全国二等奖",
    star: {
      situation: "QAR 底层时间序列包含 100+ 项高频飞行参数，数据量大、噪声多，异常信号分散在不同机场与飞行阶段。",
      task: "负责 Python 分析代码、整体建模框架、可视化及模型调优，参与数据预处理、特征筛选、异常分类与风险分析。",
      action: "清理缺失与异常记录，使用 PCA 和随机森林开展降维与特征筛选；用 LOF 生成离群标签，再训练 Sigmoid 核 SVM。按机场、机号、飞行阶段与超限类型汇总频数并绘制热力图，保留可供检查的具体场景。",
      result: "形成 5 项关键指标、离群分类模型及超限场景分析，项目获 MathorCup 全国二等奖。模型使用算法生成的离群标签，成果用于离线探索，尚未验证真实事故识别或实时预警效果。",
    },
    tone: "blue",
    preview: "metric",
  },
  {
    year: "2023",
    title: "新能源汽车与双碳",
    brief: { role: "团队项目：负责数据分析、建模框架与可视化", result: "长三角二等奖；碳排放模型样本内 R² 0.973", method: "GM(1,1) · 多元回归 · 岭回归", why: "把市场趋势和碳排放拆成两个问题分别回答" },
    subtitle: "市场增长与双碳目标建模",
    stage: "数模竞赛 · 历史数据分析与趋势推演",
    contribution: "团队项目中负责 Python 数据分析、整体建模框架、代码实现及可视化，参与公开数据采集和口径统一。",
    decision: {
      title: "把市场趋势和碳排放拆成两个问题。",
      detail: "新能源汽车发展年限短、历史数据有限，团队使用 GM(1,1) 推演保有量趋势；另以人口、GDP、城镇化率拟合碳排放。两组模型分别回答市场变化与宏观关联，指标也分别报告。",
      basis: "依据：竞赛论文的问题一、问题四及对应结果表。",
    },
    evidence: {
      summary: "获得长三角数学建模竞赛二等奖；下列数字描述历史样本的拟合。",
      items: [
        { label: "保有量趋势", text: "GM(1,1) 使用 2017 至 2022 年的 6 个年度观测；历史拟合平均相对误差为 1.983%。2024 至 2026 年的值属于当时作出的预测。" },
        { label: "碳排放关联", text: "R² 0.973 对应以 GDP、人口和城镇化率解释碳排放的岭回归模型，为样本内拟合优度。" },
        { label: "适用范围", text: "历史拟合不能替代未来预测检验，变量关联也不直接代表政策或产业变化的因果影响。" },
      ],
      next: "如继续开展这项研究，应补充后续年度实际值，按相同地区与统计口径检验当年的预测。",
    },
    tags: ["GM(1,1)", "Regression", "Ridge"],
    metric: "R² .973",
    metricLabel: "碳排放模型 · 样本内拟合",
    lead: "整合市场、能源与碳排放数据，分别分析新能源汽车趋势与宏观因素关联。",
    award: "长三角数学建模竞赛二等奖",
    star: {
      situation: "新能源市场、能源消费与碳排放数据来自不同口径，难以直接比较。",
      task: "评估新能源汽车增长与双碳目标之间的关系，并推演关键时间节点。",
      action: "收集并统一市场、能源和宏观数据口径；用 GM(1,1) 推演保有量趋势，多元回归分析充电设施等因素与保有量的关联，另用 Cobb-Douglas 岭回归拟合碳排放。",
      result: "GM(1,1) 在 2017 至 2022 年历史数据上的平均拟合相对误差为 1.983%；碳排放岭回归模型样本内 R² 为 0.973。形成趋势推演与关联分析报告，获长三角数学建模竞赛二等奖。",
    },
    tone: "acid",
    preview: "metric",
  },
  {
    year: "2026",
    title: "电影商业成功预测",
    brief: { role: "小组项目：负责清洗、建模、评价与 ROC 可视化", result: "随机森林 AUC 0.769；SVM 召回率 45.5%", method: "R · 7 类模型比较", why: "只用上映前信息，按决策成本选模型" },
    subtitle: "IMDb 数据挖掘小组项目",
    contribution: "小组项目中负责数据清洗、分层划分、决策树系列与 SVM 建模、评价指标、ROC 可视化及结果整合。",
    tags: ["R", "LDA", "SVM", "Random Forest", "kNN"],
    metric: "AUC .769",
    metricLabel: "随机森林",
    lead: "只用上映前信息预测电影表现，再按决策成本选择模型。",
    star: {
      situation: "IMDb 数据含 2,000 部电影、28 个变量；成功影片仅占训练集的 23.9%，单看准确率容易掩盖漏判。",
      task: "用上映前可获得的信息构造成功标签，并比较不同模型在‘发现潜力片’与‘减少误判’两类决策中的表现。",
      action: "结合 IMDb 评分与 ROI 定义目标，剔除上映后变量防止泄漏；完成缺失值填补、偏态变量对数变换和 70/30 分层切分，比较 LDA、决策树、Bagging、随机森林、SVM 与 kNN 等 7 类模型。",
      result: "随机森林 AUC 0.7685、精确率 68.9%；SVM 召回率 45.5%、F1 0.459，最适合优先捕捉潜在成功影片。上映年份、片长、预算与导演关注度反复进入关键变量。",
    },
    tone: "paper",
    preview: "metric",
  },
  {
    year: "2026",
    title: "Olist 履约质量分析",
    brief: { role: "负责口径治理、履约分析与下单时预警建模", result: "测试集 Top 10% 差评命中率为基线 2.43 倍", method: "DuckDB · PSM / IPW · LightGBM", why: "发现时间泄漏后，主动把 AUC 从 0.932 修正为 0.636" },
    subtitle: "巴西电商履约与差评归因",
    stage: "公开数据分析 · 运营建议待实际干预验证",
    contribution: "完成多表口径治理、履约分析、特征调整与下单时预警建模，并将结果整理为运营建议。",
    decision: {
      title: "接受更低的 AUC，让模型符合使用时点。",
      detail: "第一版 AUC 达到 0.932，回查发现卖家历史特征混入未来订单。改为只使用下单前的扩展窗口统计后，AUC 回落至 0.636；再按高风险订单的命中率评估是否值得小范围试验。",
      basis: "依据：项目 README 中的时间泄漏排查记录与下单时预警结果。",
    },
    evidence: {
      summary: "在公开历史数据中找到履约排查方向，并给出离线预警结果。",
      items: [
        { label: "数据范围", text: "分析窗口为 2017 年 1 月至 2018 年 8 月，涉及 9 张表和约 9.8 万订单。各分析按有效字段筛选样本，不能混用整体订单与模型测试集的基线。" },
        { label: "匹配估计", text: "控制 110 维已观测协变量后，PSM 估计 ATT 为 +45.05 个百分点。结果仍依赖混杂因素已被充分观测等假设，不作为随机实验结论。" },
        { label: "环节拆分", text: "85.5% 指按项目基准拆分后，运输段占超时量的比例，不是运输方应承担的责任比例。" },
        { label: "预警表现", text: "仅使用下单时可得特征，AUC 为 0.636；测试集分数最高的 10% 共 2,111 单，实际差评率 24.6%，为该测试集基线的 2.43 倍，覆盖 24.3% 的差评。" },
      ],
      next: "优先排查运输线路，再结合触达成本测试高风险订单干预。当前没有已实现的降差评或收入收益。",
      links: [{ label: "分析口径与完整报告", url: "https://github.com/anyan001121-dot/olist-analysis#readme" }],
    },
    tags: ["DuckDB", "PSM/IPW", "因果推断", "LightGBM"],
    metric: "2.43×",
    metricLabel: "测试集 Top 10% 差评命中率 / 基线",
    lead: "先修正指标口径，再判断履约排查与提前干预该从哪里开始。",
    star: {
      situation: "Olist 公开数据涉及 9 张表、约 9.8 万订单、11.2 万明细和 10 万条评论。客户标识、同日多单和一对多关联会改变复购与 GMV 口径，需要先确认统计对象。",
      task: "围绕样本中 13.7% 的差评率，检查延迟与差评的关系，并判断应优先排查哪些履约环节、哪些订单适合提前干预。",
      action: "用 DuckDB 统一订单粒度，修正一对多 JOIN 带来的 GMV 高估 4.57%，并采用跨日复购口径。比较延迟与按时订单，使用 PSM、IPW 和回归调整检查可观测特征的影响；再拆分运输与备货超时，构建仅使用下单时可得特征的 LightGBM 模型。",
      result: "分析更支持优先排查运输网络，同时保留具体卖家的问题检查。修正时间泄漏后，预警模型 AUC 为 0.636；测试集 Top 10% 订单差评率为 24.6%，是测试集基线的 2.43 倍。据此提出定向干预建议，实际成本与收益尚待验证。",
    },
    overturn: {
      before: "下单时差评预警模型第一版 AUC 达到 0.932，卖家历史特征贡献异常突出。",
      evidence: "排查特征口径才发现问题：卖家历史表现用的是“全期平均值”，混进了预测那一刻还没发生的未来订单信息，是一次时间穿越泄漏。",
      after: "改用下单前的扩展窗口统计后，AUC 回落到 0.636，符合提前预警的特征时点。是否适合部署，还要结合干预成本、监测和实际验证。",
    },
    steps: [
      { label: "确认统计对象", description: "先区分订单、客户和商品明细，检查 9 张表的键和关联关系。" },
      { label: "修正口径", description: "使用 customer_unique_id 识别跨订单客户，采用跨日复购口径，并先聚合再关联以修正 GMV 高估 4.57%。同日多单未逐笔认定为拆单。" },
      { label: "比较与调整", description: "匹配 110 维已观测协变量后，SMD 全部 < 0.045，ATT 估计为 +45.05 个百分点；仍需考虑未观测混杂。" },
    ],
    tone: "steel",
    preview: "metric",
    url: "https://github.com/anyan001121-dot/olist-analysis",
    liveUrl: "https://claude.ai/artifact/BHLyhhHL68UPTpoqz7vkge",
    linkLabel: "查看分析报告",
  },
  {
    year: "2026",
    title: "血糖与 HDL 关联因素",
    brief: { role: "硕士论文，独立完成分析、写作与答辩", result: "N = 3,808：BMI 每增 1 kg/m²，血糖约升 1.2%、HDL 约降 1.4%", method: "HC3 · GAM · Lasso · BMA", why: "没有为了结论好看而夸大遗传效应" },
    subtitle: "统计学硕士论文",
    contribution: "独立完成数据处理、探索分析、统计建模、稳健性检查、英文论文及答辩。",
    tags: ["HC3", "GAM", "Lasso", "BMA"],
    metric: "N 3,808",
    metricLabel: "参与者",
    lead: "基于 3,808 名参与者的数据，评估血糖与 HDL 的临床、生活方式及遗传关联。",
    star: {
      situation: "血糖和 HDL 同时受到临床、生活方式与遗传因素影响，变量之间也存在相关性。",
      task: "基于 3,808 名参与者识别稳定关联，并评估 SNP 面板的整体贡献。",
      action: "结合 HC3、GLM/GAM、Lasso 与 BMA，并通过共线性检查精简候选位点。",
      result: "BMI 每增加 1 kg/m²，血糖约升 1.2%、HDL 约降 1.4%；女性 HDL 约高 20%，并发现 SNP 面板与血糖存在整体关联。",
    },
    overturn: {
      before: "本以为遗传位点（SNP）会是这篇论文最亮眼的发现，是血糖和 HDL 的重要解释变量。",
      evidence: "多重比较校正之后，单个位点的证据非常有限，SNP 面板对预测效果的整体增益也很小。",
      after: "没有为了让结论“更好看”而夸大遗传效应，而是把论文重心放回 BMI、吸烟等效应清晰、稳定的生活方式因素上，对遗传部分的表述也写得更保守克制。",
    },
    tone: "lavender",
    preview: "metric",
  },
  {
    year: "2026",
    title: "心情日记",
    brief: { role: "提出产品方向，设计图鉴、随机事件与回看思路", result: "已上线：轻量记录、低落关怀、植物图鉴与趋势回看", method: "JavaScript · Web Audio · LLM", why: "先让一次记录足够轻，再给下次一点期待" },
    subtitle: "轻量情绪记录与日常关怀",
    stage: "已上线 · 长期记录的 API 关联分析规划中",
    contribution: "提出轻量记录与低落关怀的产品方向，设计植物图鉴、随机事件和长期回看思路。",
    decision: {
      title: "先让一次记录足够轻，再给下次记录一点期待。",
      detail: "入口只需选择当下心情，文字按意愿补充；正念、呼吸和书写作为可选支持。植物图鉴与随机事件用于增加探索感，长期 API 分析放在后续阶段。",
      basis: "依据：项目功能与产品构思；图鉴和随机事件是否促进持续记录，仍是待检验的假设。",
    },
    evidence: {
      summary: "记录、关怀与花园功能已上线；持续记录与关怀效果尚待验证。",
      items: [
        { label: "已实现", text: "五档心情、简短记录、正念与呼吸、植物图鉴、随机事件，以及 7 / 30 天趋势回看和可选 AI 陪聊。" },
        { label: "规划中", text: "基于长期记录的 API 关联分析尚未实现。现有趋势图和 AI 陪聊不等同于自动发现情绪与生活事件的关系。" },
        { label: "如何判断", text: "先观察用户能否轻松完成一次记录、是否自发回来，再询问花园是期待还是负担。活动后的感受只作为用户当时的主观反馈。" },
      ],
      next: "下一轮先记录操作卡点、放弃原因与自发回访，再决定是否增加提醒或奖励。",
      links: [{ label: "功能说明与源码", url: "https://github.com/anyan001121-dot/mood-diary-app" }],
    },
    tags: ["JavaScript", "LocalStorage", "Web Audio", "LLM · BYOK"],
    metric: "CARE",
    metricLabel: "轻松记录 · 当下关怀 · 持续回看",
    lead: "轻松记下当下的感受，在心情不好时找到一个可以尝试的小行动。",
    star: {
      situation: "项目从学业、工作与生活压力下的情绪记录需求出发。我想做一个轻松就能留下感受的工具，让记录本身少一点负担，并让用户在心情不好时获得具体的支持。",
      task: "降低单次记录的门槛，让用户愿意持续回来；低落时提供可选择的行动，积累记录后再帮助用户回看情绪与生活事件之间的联系。",
      action: "用五档心情和简短记录作为入口，以植物图鉴与随机事件增加探索的趣味，鼓励持续记录。用户心情低落时可进入关怀流程，选择正念、呼吸或书写等活动，并留下行动后的主观感受；另设可选的“小萤”AI 陪聊。",
      result: "已上线可体验的记录、关怀与花园功能，包含正念与呼吸模块、植物图鉴、随机事件，以及 7／30 天趋势回看。后续计划接入 API，结合长期记录提示情绪与事件的可能关联，供用户回看与确认；这项能力仍在规划中，记录意愿与关怀效果也仍待验证。",
    },
    steps: [
      { label: "轻松记一下", description: "点选最接近当下的感受，再按意愿补充事件或文字，不要求先写一篇完整日记。" },
      { label: "找一个小行动", description: "心情不好时提供可选择的支持，包括正念、呼吸和书写。用户可以尝试，也可以暂时不做。" },
      { label: "给下次记录一点期待", description: "通过植物图鉴与随机事件增加探索感。它们是鼓励用户回来记录的设计，是否有效仍需使用反馈。" },
      { label: "长期关联分析 · 规划中", description: "计划在用户选择并授权后，将选定记录交给 API 辅助整理，提示情绪与生活事件可能共同出现的模式，并回到原始记录核对。现有趋势回看和可选 AI 陪聊不等同于这项能力。" },
    ],
    tone: "garden",
    preview: "mood-diary",
    url: "https://github.com/anyan001121-dot/mood-diary-app",
    liveUrl: "https://anyan001121-dot.github.io/mood-diary-app/",
    linkLabel: "体验心情日记",
  },
];
