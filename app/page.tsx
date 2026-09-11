"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import WarpText from "./WarpText";

const fitCards = [
  {
    no: "01",
    title: "先把问题问清楚",
    tag: "PRODUCT LOGIC",
    detail: "模糊需求先拆成四件事：谁在用、什么时候用、需要什么结果、怎么验证。XMind 用来理清这条线。",
  },
  {
    no: "02",
    title: "先做一个能用的版本",
    tag: "AI × EXPERIENCE",
    detail: "RAG 知识助手、FocusFlow 和刷题台都从可交互版本开始。Codex 与 Claude Code 加快实现，关键判断和结果仍由人工核对。",
  },
  {
    no: "03",
    title: "相关不等于因果",
    tag: "CAUSAL INFERENCE",
    detail: "实验设计课程成绩 A2。分析时先用 SQL 核对口径，再用回归、GLM 或 GAM 检查关系，避免把同时发生误当成因果。",
  },
  {
    no: "04",
    title: "把分歧说清楚",
    tag: "COMMUNICATION",
    detail: "辩论队经历练出来的是听、追问和现场总结。项目讨论中先确认分歧，再把下一步和负责人说清楚。",
  },
];

type IdentityWord = {
  label: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotate: number;
  accent?: boolean;
};

const identitySeedWords: IdentityWord[] = [
  { label: "ENTP", x: 42, y: 8, dx: -278, dy: -205, rotate: -8, accent: true },
  { label: "实验设计", x: 56, y: 11, dx: 210, dy: -210, rotate: 6, accent: true },
  { label: "英国", x: 31, y: 18, dx: -330, dy: -120, rotate: -11 },
  { label: "因果推断", x: 60, y: 20, dx: 305, dy: -115, rotate: 9, accent: true },
  { label: "大数据", x: 24, y: 29, dx: -360, dy: -28, rotate: -6 },
  { label: "统计学", x: 47, y: 28, dx: -125, dy: -120, rotate: 5, accent: true },
  { label: "AI 工具", x: 67, y: 31, dx: 355, dy: -34, rotate: 8 },
  { label: "数模竞赛", x: 36, y: 39, dx: -280, dy: 55, rotate: -8 },
  { label: "回归模型", x: 57, y: 40, dx: 242, dy: 32, rotate: 5, accent: true },
  { label: "时间序列", x: 75, y: 42, dx: 365, dy: 72, rotate: 12 },
  { label: "推理", x: 27, y: 51, dx: -355, dy: 135, rotate: -12 },
  { label: "辩论", x: 50, y: 51, dx: -65, dy: 155, rotate: 7 },
  { label: "产品", x: 69, y: 53, dx: 315, dy: 150, rotate: -7 },
  { label: "摇滚", x: 23, y: 63, dx: -300, dy: 245, rotate: -9, accent: true },
  { label: "数据挖掘", x: 44, y: 62, dx: -125, dy: 275, rotate: 6, accent: true },
  { label: "单机游戏", x: 65, y: 65, dx: 248, dy: 255, rotate: 10 },
  { label: "摄影", x: 38, y: 74, dx: -238, dy: 345, rotate: -6 },
  { label: "RAG", x: 56, y: 75, dx: 105, dy: 342, rotate: 7 },
  { label: "LangChain", x: 45, y: 85, dx: -30, dy: 420, rotate: -3 },
  { label: "预测模型", x: 70, y: 82, dx: 325, dy: 360, rotate: 9, accent: true },
  { label: "数据分析", x: 30, y: 86, dx: -260, dy: 420, rotate: -8, accent: true },
  { label: "Python", x: 50, y: 91, dx: 20, dy: 438, rotate: 4 },
  { label: "SQL", x: 63, y: 89, dx: 185, dy: 420, rotate: -5, accent: true },
  { label: "R", x: 77, y: 72, dx: 385, dy: 285, rotate: 10 },
  { label: "AI 产品", x: 17, y: 73, dx: -390, dy: 295, rotate: -11, accent: true },
  { label: "Hadoop", x: 81, y: 24, dx: 392, dy: -92, rotate: 8 },
  { label: "旅行", x: 15, y: 45, dx: -402, dy: 82, rotate: -7 },
  { label: "大数据架构", x: 84, y: 60, dx: 405, dy: 205, rotate: 12 },
];

const PARTICLE_COUNT = 184;

const identityWords = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
  const seed = identitySeedWords[index % identitySeedWords.length];
  return {
    ...seed,
    key: `${seed.label}-${index}`,
    rotate: seed.rotate + ((index * 17) % 11) - 5,
  };
});

const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#_";

class TextScramble {
  element: HTMLElement;
  original: string;
  frame = 0;
  animationFrame = 0;

  constructor(element: HTMLElement) {
    this.element = element;
    this.original = element.textContent ?? "";
    if (!element.getAttribute("aria-label") && this.original.trim()) {
      element.setAttribute("aria-label", this.original.trim());
    }
  }

  play(delay = 0) {
    window.cancelAnimationFrame(this.animationFrame);
    const characters = Array.from(this.original);
    const startedAt = performance.now() + delay;
    const duration = 1500;

    const update = (now: number) => {
      if (now < startedAt) {
        this.animationFrame = window.requestAnimationFrame(update);
        return;
      }

      const progress = Math.min(1, (now - startedAt) / duration);
      const resolved = Math.floor(characters.length * progress);
      this.element.textContent = characters
        .map((character, index) => {
          if (/\s/.test(character) || index < resolved) return character;
          const noiseIndex = (index * 13 + this.frame * 7) % SCRAMBLE_CHARS.length;
          return SCRAMBLE_CHARS[noiseIndex];
        })
        .join("");
      this.frame += 1;

      if (progress < 1) this.animationFrame = window.requestAnimationFrame(update);
      else this.element.textContent = this.original;
    };

    this.animationFrame = window.requestAnimationFrame(update);
  }

  destroy() {
    window.cancelAnimationFrame(this.animationFrame);
    this.element.textContent = this.original;
  }
}

function TypewriterText({ text, active }: { text: string; active: boolean }) {
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    let typingTimer: number | undefined;
    const startTimer = window.setTimeout(() => {
      setVisibleLength(0);
      if (!active) return;
      typingTimer = window.setInterval(() => {
        setVisibleLength((length) => {
          if (length >= text.length) {
            if (typingTimer) window.clearInterval(typingTimer);
            return text.length;
          }
          return length + 1;
        });
      }, 18);
    }, 0);

    return () => {
      window.clearTimeout(startTimer);
      if (typingTimer) window.clearInterval(typingTimer);
    };
  }, [active, text]);

  return (
    <p className="typewriter-copy">
      {text.slice(0, visibleLength)}
      {active && visibleLength < text.length && <span className="typing-caret" aria-hidden="true">▋</span>}
    </p>
  );
}

const projects = [
  {
    year: "2026",
    title: "FocusFlow",
    subtitle: "AI 执行功能助手",
    tags: ["LangGraph", "Streamlit", "SQLite", "LLM"],
    metric: "≤ 3",
    metricLabel: "即时优先项",
    lead: "把杂乱任务整理成三件以内、可以马上开始的小事。",
    star: {
      situation: "任务一多，最难的往往不是完成，而是不知道先做哪一步。",
      task: "把杂乱输入转成少量、可立即执行的步骤，并支持中断后继续。",
      action: "LangGraph 负责 Brain Dump、任务拆解、计时、暂存和恢复；SQLite 保存本地记录，任务时长会按实际用时继续调整。",
      result: "每轮只给 3 个以内的优先项，并记录启动耗时、完成率和恢复成功率，用来判断产品是否真的有用。",
    },
    tone: "focus",
    preview: "focusflow",
    url: "https://github.com/anyan001121-dot/focusflow",
  },
  {
    year: "2026",
    title: "北森刷题台",
    subtitle: "校招测评练习产品",
    tags: ["Vanilla JS", "LocalStorage", "Quiz UX", "GitHub Pages"],
    metric: "727",
    metricLabel: "道题 · 三大模块",
    lead: "727 道测评题，放进一套随时能练、练完能复盘的流程。",
    star: {
      situation: "备考校招测评时，727 道题分散在三个模块，练习和复盘需要来回切换。",
      task: "做一套从选题、答题到错题回看的完整刷题流程。",
      action: "用原生 JS 与 LocalStorage 实现快速小测、顺序/随机练习、答题卡、收藏、错题筛选和成绩报告。",
      result: "收录言语 321 题、资料 254 题、图形 152 题；进度、错题和收藏均保存在本地，可直接在线使用。",
    },
    tone: "quiz",
    preview: "quiz",
    url: "https://github.com/anyan001121-dot/beisen-quiz",
    liveUrl: "https://anyan001121-dot.github.io/beisen-quiz/",
  },
  {
    year: "2024",
    title: "AYBot",
    subtitle: "RAG 知识检索助手",
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
    subtitle: "MathorCup 全国二等奖",
    tags: ["PCA", "Random Forest", "LOF", "SVM"],
    metric: "0.85",
    metricLabel: "预警准确度",
    lead: "从一组复杂的飞行参数里，找出值得持续监测的信号。",
    award: "MathorCup 数学建模挑战赛全国二等奖",
    star: {
      situation: "QAR 底层时间序列包含 100+ 项高频飞行参数，数据量大、噪声多，异常信号分散在不同机场与飞行阶段。",
      task: "完成数据质量治理、关键指标筛选与危险飞行标注，形成可用于飞员评估和实时预警的分析链路。",
      action: "以箱线图、缺失值处理和 Cronbach’s α 检验清洗数据；PCA 缓解高维计算压力，随机森林筛出着陆 G 值等 5 项核心特征；再用 LOF 无监督标注离群飞行，并训练 Sigmoid 核 SVM。",
      result: "测试集预警准确率达到 0.85；ADF 检验与超限热力图进一步定位机场、飞行阶段和超限类型的交叉风险，项目获 MathorCup 全国二等奖。",
    },
    tone: "blue",
    preview: "metric",
  },
  {
    year: "2023",
    title: "新能源汽车与双碳",
    subtitle: "长三角数学建模二等奖",
    tags: ["GM(1,1)", "Regression", "Ridge"],
    metric: "R² .973",
    metricLabel: "岭回归拟合",
    lead: "把市场、能源和碳排放数据放在一起，看清增长来自哪里。",
    award: "长三角数学建模竞赛二等奖",
    star: {
      situation: "新能源市场、能源消费与碳排放数据来自不同口径，难以直接比较。",
      task: "评估新能源汽车增长与双碳目标之间的关系，并推演关键时间节点。",
      action: "用多元回归识别充电桩、原油产量与居民消费水平等关键驱动因素，再结合 GM(1,1) 与 Cobb-Douglas 岭回归验证预测与拟合表现。",
      result: "后验差比值 0.002、平均相对误差 1.983%、R² 0.973；项目获长三角数学建模竞赛二等奖。",
    },
    tone: "acid",
    preview: "metric",
  },
  {
    year: "2026",
    title: "电影商业成功预测",
    subtitle: "IMDb 数据挖掘小组项目",
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
    title: "血糖与 HDL 关联因素",
    subtitle: "统计学硕士论文",
    tags: ["HC3", "GAM", "Lasso", "BMA"],
    metric: "N 3,808",
    metricLabel: "参与者",
    lead: "用 3,808 名参与者的数据，检查血糖与 HDL 的临床和遗传关联。",
    star: {
      situation: "血糖和 HDL 同时受到临床、生活方式与遗传因素影响，变量之间也存在相关性。",
      task: "基于 3,808 名参与者识别稳定关联，并评估 SNP 面板的整体贡献。",
      action: "结合 HC3、GLM/GAM、Lasso 与 BMA，并通过共线性检查精简候选位点。",
      result: "BMI 每增加 1 kg/m²，血糖约升 1.2%、HDL 约降 1.4%；女性 HDL 约高 20%，并发现 SNP 面板与血糖存在整体关联。",
    },
    tone: "lavender",
    preview: "metric",
  },
];

type ProjectGroup = "ai" | "data";

const projectGroups: Record<ProjectGroup, number[]> = {
  ai: [0, 1, 2],
  data: [3, 4, 5, 6],
};

const guideSections = [
  { id: "top", name: "首页" },
  { id: "work", name: "项目" },
  { id: "self", name: "个人关键词" },
  { id: "fit", name: "方法与工具" },
  { id: "about", name: "屏幕之外" },
] as const;

export default function Home() {
  const [introLifted, setIntroLifted] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const [photosOn, setPhotosOn] = useState(true);
  const [identityOpen, setIdentityOpen] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);
  const [openFit, setOpenFit] = useState<string | null>(null);
  const [hoveredFit, setHoveredFit] = useState<string | null>(null);
  const [projectGroup, setProjectGroup] = useState<ProjectGroup>("ai");
  const [openProject, setOpenProject] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [guideWalking, setGuideWalking] = useState(false);
  const glyphCanvasRef = useRef<HTMLCanvasElement>(null);
  const wordCloudRef = useRef<HTMLButtonElement>(null);
  const hudReadoutRef = useRef<HTMLOutputElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const heroPortraitRef = useRef<HTMLElement>(null);

  // Site entrance: a brief curtain-lift on first load before the hero settles in.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = window.requestAnimationFrame(() => setIntroLifted(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const timer = window.setTimeout(() => setIntroLifted(true), 1550);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = glyphCanvasRef.current;
    const container = wordCloudRef.current;
    if (!canvas || !container) return;
    const glyphCanvas = canvas;
    const wordCloud = container;
    const friction = 0.82;
    const returnSpring = 0.045;
    const scatterSpring = 0.026;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let entryFrame = 0;
    let inView = reduceMotion;
    let hasEntered = false;
    let pointerActive = false;
    let pointerX = -1000;
    let pointerY = -1000;
    let previousTime = performance.now();
    let wasOpen = false;
    let maskWidth = 0;
    let maskHeight = 0;
    let resizeFrame = 0;

    type WordParticle = {
      element: HTMLElement;
      x: number;
      y: number;
      originX: number;
      originY: number;
      scatterX: number;
      scatterY: number;
      vx: number;
      vy: number;
      phase: number;
      breathSpeed: number;
      breathAmp: number;
    };

    let particleStates: WordParticle[] = [];

    function seededShuffle<T>(items: T[]) {
      let seed = 20260910;
      const random = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      for (let index = items.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
      }
      return items;
    }

    function initParticles() {
      const bounds = wordCloud.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const previousWidth = maskWidth || bounds.width;
      const previousHeight = maskHeight || bounds.height;
      const nextWidth = Math.min(1200, Math.max(1, Math.round(bounds.width)));
      const nextHeight = Math.min(900, Math.max(1, Math.round(bounds.height)));
      if (particleStates.length && nextWidth === maskWidth && nextHeight === maskHeight) return;
      maskWidth = nextWidth;
      maskHeight = nextHeight;
      glyphCanvas.width = maskWidth;
      glyphCanvas.height = maskHeight;
      const context = glyphCanvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;

      context.clearRect(0, 0, maskWidth, maskHeight);
      context.fillStyle = "#ffffff";
      context.textAlign = "center";
      context.textBaseline = "middle";
      const glyphSize = Math.min(maskWidth * 0.79, maskHeight * 0.88);
      context.font = `900 ${glyphSize}px "PingFang SC", "Noto Sans CJK SC", sans-serif`;
      context.fillText("我", maskWidth * 0.51, maskHeight * 0.51);

      const pixels = context.getImageData(0, 0, maskWidth, maskHeight).data;
      const coloredPoints: Array<{ x: number; y: number }> = [];
      const sampleGap = Math.max(3, Math.floor(Math.min(maskWidth, maskHeight) / 145));
      for (let y = 0; y < maskHeight; y += sampleGap) {
        for (let x = 0; x < maskWidth; x += sampleGap) {
          if (pixels[(y * maskWidth + x) * 4 + 3] > 150) coloredPoints.push({ x, y });
        }
      }

      const candidates = seededShuffle(coloredPoints);
      const elements = Array.from(wordCloud.querySelectorAll<HTMLElement>(".identity-word"));
      const centerX = maskWidth / 2;
      const centerY = maskHeight / 2;
      let physicsSeed = 0x51f15e;
      const physicsRandom = () => {
        physicsSeed = (physicsSeed * 1664525 + 1013904223) >>> 0;
        return physicsSeed / 4294967296;
      };
      const oldStates = particleStates;

      particleStates = elements.map((element, index) => {
        const point = candidates[Math.floor((index / elements.length) * candidates.length)] ?? { x: centerX, y: centerY };
        const old = oldStates[index];
        const side = index % 4;
        const spawnX = side === 0 ? -maskWidth * 0.35 : side === 1 ? maskWidth * 1.35 : centerX + (physicsRandom() - 0.5) * maskWidth;
        const spawnY = side === 2 ? -maskHeight * 0.25 : side === 3 ? maskHeight * 1.25 : centerY + (physicsRandom() - 0.5) * maskHeight;
        const state: WordParticle = {
          element,
          x: old ? old.x * (maskWidth / previousWidth) : spawnX,
          y: old ? old.y * (maskHeight / previousHeight) : spawnY,
          originX: point.x,
          originY: point.y,
          scatterX: -maskWidth * 0.55 + physicsRandom() * maskWidth * 2.1,
          scatterY: -maskHeight * 0.45 + physicsRandom() * maskHeight * 1.9,
          vx: old?.vx ?? 0,
          vy: old?.vy ?? 0,
          phase: physicsRandom() * Math.PI * 2,
          breathSpeed: 0.00042 + physicsRandom() * 0.00058,
          breathAmp: 2.5 + physicsRandom() * 3.5,
        };
        if (reduceMotion) {
          state.x = state.originX;
          state.y = state.originY;
        }
        element.style.transform = `translate3d(${state.x.toFixed(2)}px,${state.y.toFixed(2)}px,0) translate(-50%,-50%) rotate(var(--r))`;
        return state;
      });
    }

    function updatePointer(event: PointerEvent) {
      const bounds = wordCloud.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
      pointerActive = true;
    }

    function releasePointer() {
      pointerActive = false;
    }

    function animate(time: number) {
      const delta = Math.min(2, Math.max(0.45, (time - previousTime) / 16.667));
      previousTime = time;

      if (inView && !reduceMotion) {
        const isOpen = wordCloud.classList.contains("is-open");

        if (isOpen && !wasOpen) {
          particleStates.forEach((particle) => {
            const angle = Math.atan2(particle.y - maskHeight / 2, particle.x - maskWidth / 2) + (Math.random() - 0.5) * 1.5;
            const impulse = 12 + Math.random() * 14;
            particle.vx += Math.cos(angle) * impulse;
            particle.vy += Math.sin(angle) * impulse;
          });
        }

        particleStates.forEach((particle) => {
          const targetX = isOpen
            ? particle.scatterX
            : particle.originX + Math.sin(time * particle.breathSpeed + particle.phase) * particle.breathAmp;
          const targetY = isOpen
            ? particle.scatterY
            : particle.originY + Math.cos(time * particle.breathSpeed * 0.83 + particle.phase * 1.7) * particle.breathAmp * 0.72;

          const spring = isOpen ? scatterSpring : returnSpring;
          particle.vx += (targetX - particle.x) * spring * delta;
          particle.vy += (targetY - particle.y) * spring * delta;

          if (pointerActive) {
            let dx = particle.x - pointerX;
            let dy = particle.y - pointerY;
            let distance = Math.hypot(dx, dy);
            if (distance < 0.5) {
              dx = Math.cos(particle.phase);
              dy = Math.sin(particle.phase);
              distance = 1;
            }
            if (distance < 230) {
              const force = 10.4 * Math.exp(-distance / 48) * delta;
              const nx = dx / distance;
              const ny = dy / distance;
              const curl = Math.sin(time * 0.003 + particle.phase) * force * 0.13;
              particle.vx += nx * force - ny * curl;
              particle.vy += ny * force + nx * curl;
            }
          }

          const damping = Math.pow(friction, delta);
          particle.vx *= damping;
          particle.vy *= damping;
          particle.x += particle.vx * delta;
          particle.y += particle.vy * delta;
          particle.element.style.transform = `translate3d(${particle.x.toFixed(2)}px,${particle.y.toFixed(2)}px,0) translate(-50%,-50%) rotate(var(--r))`;
        });

        wasOpen = isOpen;
      }

      animationFrame = window.requestAnimationFrame(animate);
    }

    initParticles();
    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(initParticles);
    });
    observer.observe(wordCloud);
    const entranceObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      inView = entry?.isIntersecting ?? false;
      if (!inView || hasEntered) return;
      hasEntered = true;
      entryFrame = window.requestAnimationFrame(() => setParticlesReady(true));
    }, { threshold: reduceMotion ? 0 : 0.22 });
    if (reduceMotion) {
      entryFrame = window.requestAnimationFrame(() => setParticlesReady(true));
    } else {
      entranceObserver.observe(wordCloud);
    }
    wordCloud.addEventListener("pointermove", updatePointer, { passive: true });
    wordCloud.addEventListener("pointerenter", updatePointer, { passive: true });
    wordCloud.addEventListener("pointerleave", releasePointer);
    animationFrame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(entryFrame);
      window.cancelAnimationFrame(resizeFrame);
      observer.disconnect();
      entranceObserver.disconnect();
      wordCloud.removeEventListener("pointermove", updatePointer);
      wordCloud.removeEventListener("pointerenter", updatePointer);
      wordCloud.removeEventListener("pointerleave", releasePointer);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".section-index, [data-scramble]"));
    const scramblers = elements.map((element) => new TextScramble(element));
    const listeners = scramblers.map((scrambler, index) => {
      const replay = () => scrambler.play();
      scrambler.play(index * 55);
      scrambler.element.addEventListener("pointerenter", replay);
      return { scrambler, replay };
    });
    return () => listeners.forEach(({ scrambler, replay }) => {
      scrambler.element.removeEventListener("pointerenter", replay);
      scrambler.destroy();
    });
  }, []);

  useEffect(() => {
    const container = wordCloudRef.current;
    const output = hudReadoutRef.current;
    if (!container || !output) return;
    const updateHud = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
      const y = Math.max(0, Math.min(bounds.height, event.clientY - bounds.top));
      container.style.setProperty("--hud-x", `${x}px`);
      container.style.setProperty("--hud-y", `${y}px`);
      output.textContent = `[X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}]`;
    };
    const showHud = () => container.classList.add("hud-active");
    const hideHud = () => container.classList.remove("hud-active");
    container.addEventListener("pointermove", updateHud);
    container.addEventListener("pointerenter", showHud);
    container.addEventListener("pointerleave", hideHud);
    return () => {
      container.removeEventListener("pointermove", updateHud);
      container.removeEventListener("pointerenter", showHud);
      container.removeEventListener("pointerleave", hideHud);
    };
  }, []);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!dot || !ring || reduceMotion || !precisePointer) return;

    document.body.classList.add("has-custom-cursor");
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let magneticTarget: HTMLElement | null = null;
    let cursorFrame = 0;

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      dot.classList.add("is-visible");
      ring.classList.add("is-visible");
    };
    const onPointerDown = () => ring.classList.add("is-pressed");
    const onPointerUp = () => ring.classList.remove("is-pressed");
    const animateCursor = () => {
      let targetX = pointerX;
      let targetY = pointerY;
      if (magneticTarget) {
        const bounds = magneticTarget.getBoundingClientRect();
        targetX = bounds.left + bounds.width / 2;
        targetY = bounds.top + bounds.height / 2;
      }
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      const dotPull = magneticTarget ? 0.28 : 0;
      dot.style.transform = `translate3d(${pointerX + (targetX - pointerX) * dotPull - 4}px, ${pointerY + (targetY - pointerY) * dotPull - 4}px, 0)`;
      ring.style.transform = `translate3d(${ringX - 15}px, ${ringY - 15}px, 0) scale(${magneticTarget ? 2 : 1})`;
      cursorFrame = window.requestAnimationFrame(animateCursor);
    };

    const magneticElements = Array.from(document.querySelectorAll<HTMLElement>(".magnetic"));
    const enterHandlers = magneticElements.map((element) => {
      const enter = () => {
        magneticTarget = element;
        ring.classList.add("is-magnetic");
      };
      const leave = () => {
        if (magneticTarget === element) magneticTarget = null;
        ring.classList.remove("is-magnetic");
      };
      element.addEventListener("pointerenter", enter);
      element.addEventListener("pointerleave", leave);
      return { element, enter, leave };
    });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    cursorFrame = window.requestAnimationFrame(animateCursor);
    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.cancelAnimationFrame(cursorFrame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      enterHandlers.forEach(({ element, enter, leave }) => {
        element.removeEventListener("pointerenter", enter);
        element.removeEventListener("pointerleave", leave);
      });
    };
  }, []);

  useEffect(() => {
    const portrait = heroPortraitRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!portrait || reduceMotion || !precisePointer) return;

    const layers = Array.from(portrait.querySelectorAll<HTMLElement>(".depth-layer"));
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let parallaxFrame = 0;

    const onPointerMove = (event: PointerEvent) => {
      const bounds = portrait.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      portrait.classList.add("is-parallax-active");
    };
    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      portrait.classList.remove("is-parallax-active");
    };
    const animateParallax = () => {
      currentX += (targetX - currentX) * 0.085;
      currentY += (targetY - currentY) * 0.085;
      layers.forEach((layer) => {
        const speed = Number(layer.dataset.speed ?? 1);
        layer.style.setProperty("--depth-x", `${(currentX * speed * 5).toFixed(2)}px`);
        layer.style.setProperty("--depth-y", `${(currentY * speed * 3.5).toFixed(2)}px`);
        layer.style.setProperty("--depth-r", `${(currentX * speed * 0.11).toFixed(3)}deg`);
      });
      parallaxFrame = window.requestAnimationFrame(animateParallax);
    };

    portrait.addEventListener("pointermove", onPointerMove, { passive: true });
    portrait.addEventListener("pointerleave", onPointerLeave);
    parallaxFrame = window.requestAnimationFrame(animateParallax);
    return () => {
      window.cancelAnimationFrame(parallaxFrame);
      portrait.removeEventListener("pointermove", onPointerMove);
      portrait.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduceMotion || !precisePointer) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>(".interactive-section"));
    const states = sections.map((section) => ({
      section,
      targetX: section.clientWidth / 2,
      targetY: section.clientHeight / 2,
      currentX: section.clientWidth / 2,
      currentY: section.clientHeight / 2,
      targetNX: 0,
      targetNY: 0,
      currentNX: 0,
      currentNY: 0,
    }));
    let frame = 0;

    const listeners = states.map((state) => {
      const move = (event: PointerEvent) => {
        const bounds = state.section.getBoundingClientRect();
        state.targetX = event.clientX - bounds.left;
        state.targetY = event.clientY - bounds.top;
        state.targetNX = ((state.targetX / bounds.width) - 0.5) * 2;
        state.targetNY = ((state.targetY / bounds.height) - 0.5) * 2;
        state.section.classList.add("pointer-active");
      };
      const leave = () => {
        state.targetX = state.section.clientWidth / 2;
        state.targetY = state.section.clientHeight / 2;
        state.targetNX = 0;
        state.targetNY = 0;
        state.section.classList.remove("pointer-active");
      };
      state.section.addEventListener("pointermove", move, { passive: true });
      state.section.addEventListener("pointerleave", leave);
      return { state, move, leave };
    });

    const animateSections = () => {
      states.forEach((state) => {
        state.currentX += (state.targetX - state.currentX) * 0.1;
        state.currentY += (state.targetY - state.currentY) * 0.1;
        state.currentNX += (state.targetNX - state.currentNX) * 0.075;
        state.currentNY += (state.targetNY - state.currentNY) * 0.075;
        state.section.style.setProperty("--section-x", `${state.currentX.toFixed(2)}px`);
        state.section.style.setProperty("--section-y", `${state.currentY.toFixed(2)}px`);
        state.section.style.setProperty("--section-shift-x", `${(state.currentNX * 4).toFixed(2)}px`);
        state.section.style.setProperty("--section-shift-y", `${(state.currentNY * 3).toFixed(2)}px`);
      });
      frame = window.requestAnimationFrame(animateSections);
    };

    frame = window.requestAnimationFrame(animateSections);
    return () => {
      window.cancelAnimationFrame(frame);
      listeners.forEach(({ state, move, leave }) => {
        state.section.removeEventListener("pointermove", move);
        state.section.removeEventListener("pointerleave", leave);
      });
    };
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(available > 0 ? Math.min(100, (window.scrollY / available) * 100) : 0);
    };
    const sections = ["top", "work", "self", "fit", "about"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-30% 0px -55%", threshold: [0, 0.15, 0.35] },
    );

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    sections.forEach((section) => sectionObserver.observe(section));
    return () => {
      window.removeEventListener("scroll", updateProgress);
      sectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!activeSection || !introLifted) return;
    const startTimer = window.setTimeout(() => setGuideWalking(true), 0);
    const stopTimer = window.setTimeout(() => setGuideWalking(false), 2650);
    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(stopTimer);
    };
  }, [activeSection, introLifted]);

  // Cinematic reveal: each section heading's label + h2 rise through a
  // clip-path curtain once scrolled into view, instead of popping in with
  // everything else. See .curtain-observe / .is-revealed in globals.css.
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".curtain-observe"));
    if (!targets.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => target.classList.add("is-revealed"));
      return;
    }
    const curtainObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          curtainObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );
    targets.forEach((target) => curtainObserver.observe(target));
    return () => curtainObserver.disconnect();
  }, []);

  // Page-to-page transition: each section continuously reports how much of
  // itself is visible via --in-view (0-1), and CSS uses that to settle the
  // section into focus (scale/blur/opacity) as it crosses into place instead
  // of just appearing. Not a one-shot reveal -- this tracks scroll position
  // the whole time, so scrolling back and forth replays it both ways.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const panels = Array.from(document.querySelectorAll<HTMLElement>(".hero, .section"));
    if (!panels.length) return;
    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);
    const focusObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Ratio relative to the viewport, not the section's own height --
          // otherwise a section taller than the viewport (e.g. the last one)
          // can never reach 1 and stays permanently blurred/dim.
          const viewportHeight = entry.rootBounds?.height || window.innerHeight;
          const ratio = viewportHeight > 0
            ? Math.min(1, entry.intersectionRect.height / viewportHeight)
            : entry.intersectionRatio;
          (entry.target as HTMLElement).style.setProperty("--in-view", ratio.toFixed(3));
        });
      },
      { threshold: thresholds },
    );
    panels.forEach((panel) => focusObserver.observe(panel));
    return () => focusObserver.disconnect();
  }, []);

  const toggleFit = (key: string) => setOpenFit((current) => current === key ? null : key);
  const activeProject = projects[openProject];
  const activeProjectUrl = "url" in activeProject ? activeProject.url : undefined;
  const activeProjectLiveUrl = "liveUrl" in activeProject ? activeProject.liveUrl : undefined;
  const activeProjectAward = "award" in activeProject ? activeProject.award : undefined;
  const selectAdjacentProject = (direction: number) => {
    const group = projectGroups[projectGroup];
    const currentPosition = Math.max(0, group.indexOf(openProject));
    setOpenProject(group[(currentPosition + direction + group.length) % group.length]);
  };

  const selectProjectGroup = (group: ProjectGroup) => {
    setProjectGroup(group);
    setOpenProject(projectGroups[group][0]);
  };

  const guideIndex = Math.max(0, guideSections.findIndex((section) => section.id === activeSection));
  const currentGuide = guideSections[guideIndex];
  const nextGuide = guideSections[(guideIndex + 1) % guideSections.length];
  const advanceGuide = () => document.getElementById(nextGuide.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const guidePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--guide-look-x", `${x * 7}px`);
    event.currentTarget.style.setProperty("--guide-look-y", `${y * 4}px`);
    event.currentTarget.style.setProperty("--guide-look-r", `${x * 3}deg`);
  };
  const resetGuidePointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--guide-look-x", "0px");
    event.currentTarget.style.setProperty("--guide-look-y", "0px");
    event.currentTarget.style.setProperty("--guide-look-r", "0deg");
  };

  return (
    <main className={"site" + (photosOn ? " photos-on" : "")}>
      <div className={"site-intro" + (introLifted ? " is-lifted" : "")} aria-hidden="true">
        <span className="site-intro-mark">AY<span>·</span></span>
        <span className="intro-subtext">STATISTICS × CAUSAL INFERENCE × AI PRODUCT</span>
      </div>
      <button
        className={`site-guide magnetic${!introLifted ? " is-entering" : ""}${guideWalking ? " is-walking" : ""}`}
        data-section={currentGuide.id}
        type="button"
        onClick={advanceGuide}
        onPointerMove={guidePointerMove}
        onPointerLeave={resetGuidePointer}
        aria-label={`当前位于${currentGuide.name}，点击前往${nextGuide.name}`}
      >
        <span className="guide-path" aria-hidden="true"><i style={{ "--guide-step": guideIndex } as CSSProperties} /></span>
        <span className="guide-avatar" aria-hidden="true"><i /></span>
      </button>
      <div ref={cursorDotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={cursorRingRef} className="cursor-ring" aria-hidden="true" />
      <header className="topbar">
        <span className="scroll-progress" style={{ "--scroll-progress": `${scrollProgress}%` } as CSSProperties} aria-hidden="true" />
        <a className="wordmark magnetic" href="#top" aria-label="返回首页">AY<span>·</span></a>
        <nav aria-label="页面导航">
          <a className={(activeSection === "top" ? "active " : "") + "magnetic"} href="#top" data-scramble>ME</a>
          <a className={(activeSection === "work" ? "active " : "") + "magnetic"} href="#work" data-scramble>WORK</a>
          <a className={(activeSection === "fit" ? "active " : "") + "magnetic"} href="#fit" data-scramble>WHY / TOOLS</a>
          <a className={(activeSection === "about" ? "active " : "") + "magnetic"} href="#about" data-scramble>OFF SCREEN</a>
        </nav>
        <div className="header-actions">
          <button className="tiny-control photo-toggle" onClick={() => setPhotosOn(!photosOn)}>
            {photosOn ? "照片 ON" : "照片 OFF"}
          </button>
          <button className="music-pill" onClick={() => setMusicOpen(!musicOpen)} aria-expanded={musicOpen}>
            <span className="equalizer" aria-hidden="true"><i /><i /><i /></span>
            TENDER
          </button>
        </div>
      </header>

      <section className="hero interactive-section" id="top">
        <span className="section-pointer-glow" aria-hidden="true" />
        <span className="hero-pulse-field" aria-hidden="true" />
        <span className="hero-ghost-mark" aria-hidden="true">AY</span>
        <div className="hero-copy">
          <p className="eyebrow mono-label" data-scramble>AN YAN / PORTFOLIO · 2026</p>
          <h1 className="hero-name" aria-label="安颜 Yan An">
            <span className="hero-name-cn" aria-hidden="true">
              {Array.from("安颜").map((character, index) => (
                <i style={{ "--char-index": index } as CSSProperties} key={`${character}-${index}`}>
                  {character}
                </i>
              ))}
            </span>
            <span className="hero-name-en" aria-hidden="true">
              {Array.from("Yan An").map((character, index) => (
                <i style={{ "--char-index": index } as CSSProperties} key={`${character}-${index}`}>
                  {character === " " ? "\u00a0" : character}
                </i>
              ))}
            </span>
          </h1>
          <p className="hero-statement">把问题想清楚，把东西做出来。</p>
          <p className="hero-role">STATISTICS × CAUSAL INFERENCE × AI PRODUCT</p>
          <p className="intro">从统计与因果推断出发，用 SQL 核对证据，再把结论做成可以验证的 AI 原型。</p>
          <div className="hero-actions">
            <a className="primary-cta magnetic" href="#work">查看作品 <span>↘</span></a>
            <a className="text-link magnetic" href="mailto:anyan001121@gmail.com">联系我 ↗</a>
          </div>
          <div className="hero-signature" aria-hidden="true">
            <span>CURIOUS</span><i />
            <span>RIGOROUS</span><i />
            <span>EXPRESSIVE</span>
          </div>
        </div>
        <figure ref={heroPortraitRef} className="hero-portrait">
          <div className="hero-portrait-media">
            <div className="depth-layer hero-color-layer" data-speed="1" aria-hidden="true" />
            <div className="depth-layer hero-photo-layer" data-speed="2">
              <div className="hero-scene-window">
                <img className="hero-scene" src="./photos/london-shadow.webp" alt="安颜拍摄的伦敦街景与人物剪影" />
              </div>
            </div>
            <span className="depth-layer hero-name-depth" data-speed="3" aria-hidden="true">Yan An</span>
            <span className="hero-role-depth" aria-hidden="true">STATISTICS</span>
            <div className="depth-layer hero-person-layer" data-speed="4" aria-hidden="true">
              <img className="hero-cutout" src="./photos/hero-cutout-v2.webp" alt="" />
            </div>
          </div>
          <figcaption className="hero-portrait-caption"><span>01 / 02 · PORTRAIT</span><span>LONDON</span></figcaption>
        </figure>
        <a className="scroll-note" href="#work">SCROLL / 看作品 ↓</a>
      </section>

      {musicOpen && (
        <aside className="music-card" aria-label="背景音乐说明">
          <button onClick={() => setMusicOpen(false)} aria-label="关闭音乐卡片">×</button>
          <p>NOW PLAYING IN MY HEAD</p>
          <strong>Tender / Blur</strong>
          <span>页面不会自动播放，点击可前往正版音源。</span>
          <a href="https://open.spotify.com/search/Blur%20Tender" target="_blank" rel="noreferrer">在 Spotify 打开 ↗</a>
        </aside>
      )}

      <section className="work section interactive-section" id="work">
        <span className="section-pointer-glow" aria-hidden="true" />
        <div className="section-heading compact-heading curtain-observe">
          <span className="heading-ghost-num" aria-hidden="true">01</span>
          <p className="section-index">01 / SELECTED WORK</p>
          <h2>我的项目</h2>
        </div>
        <div className="project-showcase">
          <div className="project-modules" aria-label="项目分类">
            <button className={projectGroup === "ai" ? "is-active" : ""} type="button" onClick={() => selectProjectGroup("ai")}>
              <small>MODULE A / 03</small>
              <strong>AI 应用</strong>
              <span>从问题到可交互原型</span>
            </button>
            <button className={projectGroup === "data" ? "is-active" : ""} type="button" onClick={() => selectProjectGroup("data")}>
              <small>MODULE B / 04</small>
              <strong>数据分析</strong>
              <span>从数据到可解释结论</span>
            </button>
          </div>
          <div className="project-rail-head">
            <p className="mono-label" data-scramble>{projectGroup === "ai" ? "AI APPLICATIONS / 交互原型" : "DATA ANALYSIS / 建模与验证"}</p>
            <span>悬停或点击切换项目</span>
          </div>
          <div className="project-rail" role="tablist" aria-label="选择项目">
            {projectGroups[projectGroup].map((index) => {
              const project = projects[index];
              return (
              <button
                className={openProject === index ? "is-active" : ""}
                type="button"
                role="tab"
                aria-selected={openProject === index}
                onMouseEnter={() => setOpenProject(index)}
                onFocus={() => setOpenProject(index)}
                onClick={() => setOpenProject(index)}
                key={project.title}
              >
                <small>{projectGroup === "ai" ? "AI APP" : "DATA"} / {String(projectGroups[projectGroup].indexOf(index) + 1).padStart(2, "0")}</small>
                <strong>{project.title}</strong>
                <span>{project.metric}</span>
                {"award" in project && <em className="project-rail-award">AWARD</em>}
              </button>
            )})}
          </div>

          <article className={`project-stage ${activeProject.tone}`} key={activeProject.title}>
            <div className="project-stage-copy">
              <div className="project-stage-meta">
                <span>{String(projectGroups[projectGroup].indexOf(openProject) + 1).padStart(2, "0")} / {String(projectGroups[projectGroup].length).padStart(2, "0")}</span>
                <span>{activeProject.year}</span>
                <span>{activeProject.subtitle}</span>
                {activeProjectAward && <strong className="project-award">{activeProjectAward}</strong>}
              </div>
              <h3>{activeProject.title}</h3>
              <p className="project-stage-lead">{activeProject.lead}</p>
              <div className="project-tags">{activeProject.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              {(activeProjectLiveUrl || activeProjectUrl) && (
                <div className="project-links">
                  {activeProjectLiveUrl && (
                    <a className="project-link primary" href={activeProjectLiveUrl} target="_blank" rel="noreferrer">
                      打开题库 <span>↗</span>
                    </a>
                  )}
                  {activeProjectUrl && (
                    <a className="project-link" href={activeProjectUrl} target="_blank" rel="noreferrer">
                      查看 GitHub <span>↗</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="project-stage-visual">
              {activeProject.preview === "focusflow" && (
                <figure className="project-window focusflow-window" aria-label="FocusFlow 产品界面预览">
                  <div className="project-window-bar" aria-hidden="true"><span /><span /><span /><small>focusflow.app</small></div>
                  <div className="project-window-body"><img src="./photos/focusflow-preview.png" alt="FocusFlow 的 Brain Dump 任务输入界面" /></div>
                  <figcaption>PRODUCT UI / STREAMLIT</figcaption>
                </figure>
              )}
              {activeProject.preview === "quiz" && (
                <figure className="project-window quiz-window" aria-label="北森刷题台真实产品界面">
                  <div className="project-window-bar" aria-hidden="true"><span /><span /><span /><small>anyan001121-dot.github.io/beisen-quiz</small></div>
                  <a className="project-window-body project-window-click" href={activeProjectLiveUrl} target="_blank" rel="noreferrer" aria-label="打开北森刷题台">
                    <img className="quiz-shot quiz-shot-home" src="./photos/beisen-quiz-home.png" alt="北森刷题台首页，包含快速练习、三个题型模块及练习数据" />
                    <img className="quiz-shot quiz-shot-practice" src="./photos/beisen-quiz-practice.png" alt="北森刷题台答题页，包含题目、选项、计时器与答题卡" />
                    <small className="quiz-view-hint" aria-hidden="true">HOVER / PRACTICE VIEW</small>
                    <span className="project-window-open">进入真实题库 ↗</span>
                  </a>
                  <figcaption>REAL PRODUCT UI / 727 QUESTIONS</figcaption>
                </figure>
              )}
              {activeProject.preview === "aybot" && (
                <figure className="project-window aybot-window" aria-label="AYBot 论文中的系统架构、Coze 工作流和回答界面">
                  <div className="project-window-bar" aria-hidden="true"><span /><span /><span /><small>aybot.flow</small></div>
                  <div className="project-window-body aybot-evidence">
                    <img className="aybot-shot aybot-shot-flow" src="./photos/aybot-architecture.png" alt="AYBot 的检索增强生成架构图" />
                    <img className="aybot-shot aybot-shot-workflow" src="./photos/aybot-coze-workflow.jpg" alt="AYBot 在 Coze 中搭建的五节点工作流" />
                    <img className="aybot-shot aybot-shot-answer" src="./photos/aybot-answer.png" alt="AYBot 结合外部检索结果生成的带来源回答" />
                    <span className="aybot-view-note" aria-hidden="true">HOVER / 查看论文原图</span>
                  </div>
                  <figcaption>THESIS EVIDENCE / ARCHITECTURE · WORKFLOW · ANSWER</figcaption>
                </figure>
              )}
              {activeProject.preview === "metric" && (
                <div className="data-signal" aria-label={`${activeProject.metric} ${activeProject.metricLabel}`}>
                  <div className="signal-grid" aria-hidden="true"><i /><i /><i /><i /><i /></div>
                  <small>MODEL OUTPUT / VALIDATED SIGNAL</small>
                  <b>{activeProject.metric}</b>
                  <span>{activeProject.metricLabel}</span>
                </div>
              )}
            </div>

            <div className="project-star" aria-label={`${activeProject.title} 项目拆解`}>
              {([
                ["context", "项目背景", activeProject.star.situation],
                ["goal", "目标", activeProject.star.task],
                ["action", "解决方法", activeProject.star.action],
                ["result", "项目结果", activeProject.star.result],
              ] as const).map(([key, label, copy]) => (
                <article className={key === "result" ? "is-result" : ""} key={key}>
                  <small>{label}</small>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
            <div className="project-stage-controls" aria-label="切换项目">
              <button type="button" onClick={() => selectAdjacentProject(-1)} aria-label="上一个项目">←</button>
              <span>{String(projectGroups[projectGroup].indexOf(openProject) + 1).padStart(2, "0")} / {String(projectGroups[projectGroup].length).padStart(2, "0")}</span>
              <button type="button" onClick={() => selectAdjacentProject(1)} aria-label="下一个项目">→</button>
            </div>
          </article>
        </div>
      </section>

      <section className="self-map section interactive-section" id="self">
        <span className="section-pointer-glow" aria-hidden="true" />
        <div className="self-map-copy curtain-observe">
          <p className="section-index mono-label" data-scramble>02 / ME · IDENTITY MAP</p>
          <h2>这些关键词，<br />拼成现在的<span className="identity-bracket">「</span>
            <button
              className="identity-trigger magnetic"
              type="button"
              onPointerEnter={() => setIdentityOpen(true)}
              onPointerLeave={() => setIdentityOpen(false)}
              onFocus={() => setIdentityOpen(true)}
              onBlur={() => setIdentityOpen(false)}
              onClick={() => setIdentityOpen((current) => !current)}
              aria-label={identityOpen ? "收拢个人关键词" : "炸开个人关键词"}
            >我</button><span className="identity-bracket">」</span>。
            <span className="identity-trigger-guide" aria-hidden="true"><i />悬停看看</span>
          </h2>
          <div className="education-list" aria-label="教育背景">
            <p>EDUCATION / 受教育经历</p>
            <article>
              <span>2025.09 - 2026.12</span>
              <div><strong>格拉斯哥大学 · 英国</strong><small>统计学硕士</small></div>
            </article>
            <article>
              <span>2020.09 - 2024.07</span>
              <div><strong>浙江农林大学</strong><small>数据科学与大数据技术学士</small></div>
            </article>
          </div>
          <p>悬停时关键词散开，移开后重新聚合。</p>
          <span className="self-map-hint mono-label" data-scramble>HOVER / TAP TO DECONSTRUCT ↗</span>
        </div>
        <div className="self-glyph-stage">
          <button
            ref={wordCloudRef}
            id="word-cloud-container"
            className={`self-glyph magnetic${particlesReady ? " particles-ready" : ""}${identityOpen ? " is-open" : ""}`}
            type="button"
            onClick={() => setIdentityOpen(!identityOpen)}
            aria-pressed={identityOpen}
            aria-label={identityOpen ? "收拢个人关键词" : "展开个人关键词"}
          >
            <canvas ref={glyphCanvasRef} className="particle-mask-canvas" aria-hidden="true" />
            <span className="glyph-code mono-label" data-scramble aria-hidden="true">{`[SELF::01]\n01001101 01000101\n// assembled, never finished`}</span>
            <span className="identity-hud" aria-hidden="true">
              <i className="hud-line hud-line-x" />
              <i className="hud-line hud-line-y" />
              <output ref={hudReadoutRef}>[X: 000.00, Y: 000.00]</output>
            </span>
            {identityWords.map((word, index) => {
              const style = {
                "--r": `${word.rotate}deg`,
                "--delay": `${Math.min(index * 9, 820)}ms`,
                "--explode-delay": `${Math.min(index * 1.6, 145)}ms`,
              } as CSSProperties;
              return (
                <span className={"identity-word" + (word.accent ? " accent" : "")} style={style} key={word.key}>
                  <i>{String(index + 1).padStart(2, "0")}</i>{word.label}
                </span>
              );
            })}
          </button>
        </div>
      </section>

      <section className="fit section interactive-section" id="fit">
        <span className="section-pointer-glow" aria-hidden="true" />
        <div className="section-heading curtain-observe">
          <p className="section-index">03 / WHY ME &amp; TOOLS</p>
          <h2>想法先拆清楚，<br />再做出来<em>验证。</em></h2>
          <p className="section-note">卡片只保留结论。悬停后，可以看到具体做法。</p>
        </div>
        <div className="fit-grid">
          {fitCards.map((card) => (
            <button
              className={"reveal-card" + (openFit === card.no ? " is-open" : "")}
              key={card.no}
              type="button"
              aria-expanded={openFit === card.no}
              onPointerEnter={() => setHoveredFit(card.no)}
              onPointerLeave={() => setHoveredFit(null)}
              onFocus={() => setHoveredFit(card.no)}
              onBlur={() => setHoveredFit(null)}
              onClick={() => toggleFit(card.no)}
            >
              <div className="card-top"><span>{card.no}</span><small>{card.tag}</small></div>
              <h3>{card.title}</h3>
              <p className="hover-hint">HOVER TO REVEAL ↗</p>
              <div className="card-reveal"><TypewriterText text={card.detail} active={hoveredFit === card.no || openFit === card.no} /></div>
            </button>
          ))}
        </div>
        <div className="tool-circuit" aria-label="AI 工作流">
          <div className="circuit-heading">
            <span className="mono-label" data-scramble>[ AI WORKFLOW / LIVE ]</span>
            <p>先理清问题，再找依据、搭原型、看结果。工具服务于这条路径。</p>
          </div>
          <div className="circuit-track">
            {[
              ["01", "XMind", "拆问题"],
              ["02", "NotebookLM", "找依据"],
              ["03", "Codex", "搭原型"],
              ["04", "Claude Code", "迭代"],
              ["05", "Skills", "复用流程"],
              ["06", "Data", "验证结果"],
            ].map(([no, name, note], index) => (
              <article className="circuit-node magnetic" key={name} style={{ "--node-index": index } as CSSProperties}>
                <small>{no}</small>
                <strong>{name}</strong>
                <span>{note}</span>
              </article>
            ))}
            <span className="circuit-pulse" aria-hidden="true" />
          </div>
        </div>
        <div className="warp-showcase">
          <span className="mono-label" data-scramble>[ WEBGL / INTERACTIVE ]</span>
          <div className="warp-stage">
            <WarpText
              text="问题 / 证据 / 原型"
              color="#f4f4f2"
              warpStrength={0.09}
              warpScale={1.6}
              speed={0.5}
              pointerInfluence={0.4}
              pointerStrength={0.4}
              refraction={0.02}
              ripple
              fontSize="clamp(2.2rem, 6.4vw, 5.6rem)"
              fontWeight={700}
              fontFamily='"Helvetica Neue", Helvetica, "PingFang SC", "Noto Sans CJK SC", Arial, sans-serif'
              letterSpacing="-0.04em"
              lineHeight={1}
              style={{ height: "260px" }}
            />
          </div>
          <p className="warp-caption">鼠标移到文字上，看看它怎么变形。这是一个 WebGL 小实验。</p>
        </div>
      </section>

      <section className="offscreen section interactive-section" id="about">
        <span className="section-pointer-glow" aria-hidden="true" />
        <div className="offscreen-stage">
          <div className="offscreen-heading curtain-observe">
            <p className="section-index">04 / OFF SCREEN &amp; TALK</p>
            <h2>屏幕之外，<em>有声音，也有留白。</em></h2>
          </div>
          <div className="offscreen-gallery">
            <figure className="offscreen-photo"><img src="./photos/athens-portrait.webp" alt="安颜在雅典的旅行照片" /><figcaption>ATHENS / light & structure</figcaption></figure>
            <figure className="offscreen-photo"><img src="./photos/york-minster.jpg" alt="安颜拍摄的约克大教堂尖塔" /><figcaption>YORK MINSTER / spires & sky</figcaption></figure>
            <figure className="offscreen-photo"><img src="./photos/pantheon-dome.jpg" alt="安颜拍摄的罗马万神殿穹顶" /><figcaption>PANTHEON / structure & light</figcaption></figure>
            <figure className="offscreen-photo"><img src="./photos/winter-coast-portrait.jpg" alt="安颜在冬日海岸的侧面人像" /><figcaption>WINTER COAST / wind & silence</figcaption></figure>
            <figure className="offscreen-photo"><img src="./photos/winter-coast-camera.jpg" alt="安颜在海岸拍摄的背影" /><figcaption>BEHIND THE LENS / looking closely</figcaption></figure>
          </div>
        </div>
        <div className="offscreen-body">
          <div className="interest-list">
            <article><span>ROCK</span><h3>摇滚</h3><p>喜欢摇滚的直白和张力。Blur 的 Tender 温柔，但不软弱。</p></article>
            <article><span>ART</span><h3>艺术与建筑</h3><p>看建筑，常先注意材质、比例和光线。这些观察也会回到页面设计里。</p></article>
            <article><span>PHOTO</span><h3>摄影</h3><p>这里的照片都由本人拍摄或出镜。旅行时更在意结构、留白，以及人与环境的距离。</p></article>
            <article><span>ENTP</span><h3>辩论与表达</h3><p>曾任学院辩论队队长，带领 10 余人组织赛事。想法拿出来讨论，通常比独自打磨更有效。</p></article>
          </div>
          <div className="offscreen-cta">
            <a className="offscreen-mail magnetic" href="mailto:anyan001121@gmail.com">anyan001121@gmail.com ↗</a>
          </div>
        </div>
      </section>
    </main>
  );
}
