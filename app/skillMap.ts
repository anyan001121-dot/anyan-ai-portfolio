/*
 * Skill → evidence map. Keys are indexes into `projects` (app/projects.ts);
 * every sentence is condensed from that project's own write-up — only skills
 * the projects actually show are listed.
 */

export type Skill = { key: string; name: string; en: string; uses: Record<number, string> };

export const skills: Skill[] = [
  {
    key: "ml", name: "机器学习", en: "MACHINE LEARNING",
    uses: {
      5: "比较 LDA、决策树、随机森林、SVM、kNN 等 7 类模型；随机森林 AUC 0.769。",
      6: "只用下单时可得特征训练 LightGBM，测试集 Top 10% 差评命中率为基线 2.43 倍。",
      3: "用 LOF 生成离群标签，再训练 Sigmoid 核 SVM 做异常分类。",
    },
  },
  {
    key: "causal", name: "因果推断", en: "CAUSAL INFERENCE",
    uses: {
      6: "用 PSM、IPW 与回归调整比较延迟与按时订单；匹配 110 维协变量后 ATT 估计 +45.05 个百分点。",
    },
  },
  {
    key: "regression", name: "回归建模", en: "REGRESSION",
    uses: {
      7: "HC3 稳健回归与 GLM / GAM：BMI 每增 1 kg/m²，血糖约升 1.2%、HDL 约降 1.4%。",
      4: "用 Cobb-Douglas 岭回归拟合碳排放，样本内 R² 0.973。",
      6: "回归调整作为 PSM、IPW 之外的对照估计。",
    },
  },
  {
    key: "validation", name: "评估与防泄漏", en: "VALIDATION",
    uses: {
      6: "发现卖家历史特征混入未来订单，把 AUC 从 0.932 修正为 0.636。",
      5: "剔除上映后变量防止泄漏，70/30 分层切分，按召回与精确率选模型。",
    },
  },
  {
    key: "feature", name: "特征选择", en: "FEATURE SELECTION",
    uses: {
      3: "用 PCA 与随机森林，从 100+ 项飞行参数中筛出 5 项关键指标。",
      7: "用 Lasso 与 BMA 筛选变量，并通过共线性检查精简候选位点。",
    },
  },
  {
    key: "forecast", name: "时间序列预测", en: "FORECASTING",
    uses: {
      4: "GM(1,1) 推演新能源汽车保有量，历史拟合平均相对误差 1.983%。",
    },
  },
  {
    key: "sql", name: "SQL 与数据口径", en: "SQL · DATA MODELLING",
    uses: {
      6: "用 DuckDB 统一 9 张表的订单粒度，修正一对多 JOIN 带来的 GMV 高估。",
      4: "收集并统一市场、能源与宏观数据的统计口径。",
    },
  },
  {
    key: "python", name: "Python", en: "PYTHON",
    uses: {
      3: "负责 Python 分析代码、整体建模框架与可视化。",
      4: "负责 Python 数据分析、代码实现与可视化。",
      0: "用 LangGraph 串联任务拆解与执行流程，Streamlit 做界面，SQLite 保存状态。",
    },
  },
  {
    key: "r", name: "R", en: "R",
    uses: {
      5: "用 R 完成数据清洗、7 类模型比较、评价指标与 ROC 可视化。",
    },
  },
  {
    key: "llm", name: "LLM 与 RAG", en: "LLM · RAG",
    uses: {
      2: "在 Coze 中拆成 5 个节点：先召回 Top 3 片段，再生成答案，来源可追溯。",
      0: "模型只判断杂念与当前任务是否相关，核心状态由规则控制。",
      8: "可选的“小萤” AI 陪聊，用户使用自己的 API Key。",
    },
  },
  {
    key: "product", name: "产品设计", en: "PRODUCT DESIGN",
    uses: {
      0: "两轮情境走查，修正了完成标准未显示、暂存输入未清空等问题。",
      8: "五档心情作为入口，文字按意愿补充，先让一次记录足够轻。",
      1: "设计从抽题、作答到错题回看的完整练习流程。",
    },
  },
  {
    key: "frontend", name: "前端开发", en: "FRONT-END",
    uses: {
      1: "原生 JS 与 LocalStorage 实现答题卡、收藏、错题筛选与成绩报告。",
      8: "JavaScript 与 Web Audio 实现记录、正念呼吸与植物图鉴。",
    },
  },
];
