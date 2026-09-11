"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

const fitCards = [
  {
    no: "01",
    title: "先把问题问对",
    tag: "PRODUCT LOGIC",
    detail: "拿到一句模糊需求时，我会先用 XMind 理清用户是谁、在什么情况下使用、结果怎么验证，再决定往下做什么。",
  },
  {
    no: "02",
    title: "先把 AI 做出来",
    tag: "AI × EXPERIENCE",
    detail: "我做过 RAG 知识助手，也会用 Codex 和 Claude Code 快速搭出可交互的原型。检索为什么有效、幻觉怎么减少，我都能讲清楚。",
  },
  {
    no: "03",
    title: "指标要说明代价",
    tag: "DATA FEEDBACK",
    detail: "统计学训练让我习惯先定义指标。除了准确率，我也会看召回、误判，以及每种错误在真实场景里会造成什么影响。",
  },
  {
    no: "04",
    title: "让团队听懂同一件事",
    tag: "COMMUNICATION",
    detail: "做辩论队队长时，我练得最多的是听、追问和当场总结。讨论项目也一样，先找到分歧，再确定下一步由谁做什么。",
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
  { label: "机械设计", x: 56, y: 11, dx: 210, dy: -210, rotate: 6 },
  { label: "英国", x: 31, y: 18, dx: -330, dy: -120, rotate: -11 },
  { label: "杭州", x: 60, y: 20, dx: 305, dy: -115, rotate: 9 },
  { label: "大数据", x: 24, y: 29, dx: -360, dy: -28, rotate: -6 },
  { label: "统计学", x: 47, y: 28, dx: -125, dy: -120, rotate: 5, accent: true },
  { label: "AI 工具", x: 67, y: 31, dx: 355, dy: -34, rotate: 8 },
  { label: "数模竞赛", x: 36, y: 39, dx: -280, dy: 55, rotate: -8 },
  { label: "探索", x: 57, y: 40, dx: 242, dy: 32, rotate: 5, accent: true },
  { label: "脑洞", x: 75, y: 42, dx: 365, dy: 72, rotate: 12 },
  { label: "推理", x: 27, y: 51, dx: -355, dy: 135, rotate: -12 },
  { label: "辩论", x: 50, y: 51, dx: -65, dy: 155, rotate: 7 },
  { label: "产品", x: 69, y: 53, dx: 315, dy: 150, rotate: -7 },
  { label: "摇滚", x: 23, y: 63, dx: -300, dy: 245, rotate: -9, accent: true },
  { label: "音乐", x: 44, y: 62, dx: -125, dy: 275, rotate: 6 },
  { label: "单机游戏", x: 65, y: 65, dx: 248, dy: 255, rotate: 10 },
  { label: "摄影", x: 38, y: 74, dx: -238, dy: 345, rotate: -6 },
  { label: "RAG", x: 56, y: 75, dx: 105, dy: 342, rotate: 7 },
  { label: "LangChain", x: 45, y: 85, dx: -30, dy: 420, rotate: -3 },
  { label: "游戏", x: 70, y: 82, dx: 325, dy: 360, rotate: 9 },
  { label: "数据分析", x: 30, y: 86, dx: -260, dy: 420, rotate: -8, accent: true },
  { label: "Python", x: 50, y: 91, dx: 20, dy: 438, rotate: 4 },
  { label: "SQL", x: 63, y: 89, dx: 185, dy: 420, rotate: -5 },
  { label: "R", x: 77, y: 72, dx: 385, dy: 285, rotate: 10 },
  { label: "AI 产品", x: 17, y: 73, dx: -390, dy: 295, rotate: -11, accent: true },
  { label: "创意", x: 81, y: 24, dx: 392, dy: -92, rotate: 8 },
  { label: "旅行", x: 15, y: 45, dx: -402, dy: 82, rotate: -7 },
  { label: "电影", x: 84, y: 60, dx: 405, dy: 205, rotate: 12 },
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

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#_";

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
    lead: "把一团乱麻的任务，整理成几分钟内就能动手的第一步。",
    detail: "我围绕注意力与任务管理困难，做了 Brain Dump、任务拆解、专注计时、中断暂存和断点恢复。LangGraph 负责控制流程，系统会参考实际用时和预估用时调整后续任务的大小，数据保存在本地 SQLite。",
    opinion: "我把每周成功启动任务数设为核心指标，同时记录启动耗时、完成率和恢复成功率。我希望 AI 少说一点，让用户少费一点力气，尽快开始。",
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
    lead: "把分散的测评题，整理成随时能练、练完有反馈的刷题流程。",
    detail: "收录言语理解 321 题、资料分析 254 题和图形推理 152 题，支持快速小测、顺序或随机练习、错题与收藏筛选，并用答题卡和成绩报告串起完整反馈。学习记录只保存在用户自己的浏览器中。",
    opinion: "重点不是把题堆在页面上，而是缩短“找到薄弱项—马上练习—看到结果—回看错题”的路径。",
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
    lead: "让知识助手先找依据，再回答问题。",
    detail: "A1 用五个节点串起检索与回答，召回知识库 Top 3 片段，再补充 arXiv 的实时信息，最低匹配度设为 0.14。A2 会按关键词整理 10 条新闻并定时推送。",
    opinion: "这个项目让我开始在意回答从哪里来。语气再自然，如果没有可信来源和可追溯的上下文，也很难让人放心。",
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
    detail: "PCA 把着陆 G 值的 10 项数据压缩成 1 个主成分，保留 90% 以上的信息。随机森林筛出 5 项关键指标，LOF 与 SVM 组合后的预警准确度达到 0.85。",
    opinion: "降维让数据更容易计算和解释。最终留下的指标，应该让一线人员看得懂，也知道接下来要做什么。",
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
    lead: "把分散的数据放到同一个框架里，研究市场增长和双碳目标。",
    detail: "GM(1,1) 的后验差比值为 0.002，平均相对误差为 1.983%。Cobb-Douglas 岭回归 R² 为 0.973，模型估计 2025 年达到碳峰值、2055 年实现碳中和。",
    opinion: "一个预测值很难单独支持决策。我更想知道哪些因素推动了变化，以及这个解释是否站得住。",
    tone: "acid",
    preview: "metric",
  },
  {
    year: "2026",
    title: "电影商业成功预测",
    subtitle: "数据挖掘项目",
    tags: ["R", "SVM", "Random Forest", "AUC"],
    metric: "AUC .769",
    metricLabel: "随机森林",
    lead: "同一批数据，在不同业务目标下需要不同的模型。",
    detail: "我只使用上映前变量，避免把未来信息带进模型。比较 7 类模型后，SVM 的正类召回率为 45.5%，随机森林的 AUC 为 0.769，前者更适合寻找机会，后者更适合控制误判。",
    opinion: "漏掉一部可能成功的电影，与错判一部电影的成本不同。选指标之前，得先说清楚更不能接受哪一种错误。",
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
    detail: "BMI 每增加 1 kg/m²，血糖约升高 1.2%，HDL 约降低 1.4%；女性 HDL 约高 20%。分析还发现，SNP 面板与血糖存在整体关联。",
    opinion: "看到显著结果后，我还会继续检查它是否稳健、能解释多少差异，以及换到样本外还能不能成立。",
    tone: "lavender",
    preview: "metric",
  },
];

const ideas: Record<string, string[]> = {
  知识: [
    "先检索可信材料，再生成带来源的回答。证据不够时，直接说明还缺什么，请用户补充上下文。",
    "把长文档整理成主题卡片和追问线索。用户可以先看结论，也可以随时回到原文核对。",
  ],
  数据: [
    "把异常波动解释成三个问题：发生了什么，可能是什么原因，下一步该看哪里。指标口径和计算路径始终保留。",
    "根据业务目标推荐指标，同时摆出误判与漏判的代价，让团队知道这个模型为什么值得选。",
  ],
  出行: [
    "参考日历、路况和用户状态，只在合适的时候给出提醒。每条主动推荐都能解释，也能关闭。",
    "把路线、天气和兴趣点整理成一份可修改的行程建议，最后怎么走仍由用户决定。",
  ],
  创作: [
    "从一句模糊灵感生成几种方向不同的初稿，同时写出各自的假设，方便用户比较和修改。",
    "把文字、图片和音乐偏好整理成风格板，再根据每轮反馈慢慢收窄方向，直到页面或内容可以制作。",
  ],
};

export default function Home() {
  const [musicOpen, setMusicOpen] = useState(false);
  const [photosOn, setPhotosOn] = useState(true);
  const [identityOpen, setIdentityOpen] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);
  const [openFit, setOpenFit] = useState<string | null>(null);
  const [hoveredFit, setHoveredFit] = useState<string | null>(null);
  const [openProject, setOpenProject] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const glyphCanvasRef = useRef<HTMLCanvasElement>(null);
  const wordCloudRef = useRef<HTMLButtonElement>(null);
  const hudReadoutRef = useRef<HTMLOutputElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const heroPortraitRef = useRef<HTMLElement>(null);
  const [scene, setScene] = useState("知识");
  const [ideaIndex, setIdeaIndex] = useState(0);

  const currentIdea = useMemo(() => {
    const pool = ideas[scene];
    return pool[ideaIndex % pool.length];
  }, [scene, ideaIndex]);

  useEffect(() => {
    const canvas = glyphCanvasRef.current;
    const container = wordCloudRef.current;
    if (!canvas || !container) return;
    let entryFrame = 0;

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
      if (!canvas || !container) return;
      const bounds = container.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const maskWidth = Math.max(1, Math.round(bounds.width));
      const maskHeight = Math.max(1, Math.round(bounds.height));
      canvas.width = maskWidth;
      canvas.height = maskHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
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
      const particles = Array.from(container.querySelectorAll<HTMLElement>(".identity-word"));
      const centerX = maskWidth / 2;
      const centerY = maskHeight / 2;
      let scatterSeed = 0x51f15e;
      const scatterRandom = () => {
        scatterSeed = (scatterSeed * 1664525 + 1013904223) >>> 0;
        return scatterSeed / 4294967296;
      };
      particles.forEach((particle, index) => {
        const point = candidates[Math.floor((index / particles.length) * candidates.length)] ?? { x: centerX, y: centerY };
        const angle = scatterRandom() * Math.PI * 2;
        const force = 90 + scatterRandom() * 210;
        const explodeX = Math.cos(angle) * force + (scatterRandom() - 0.5) * 390;
        const explodeY = 95 + scatterRandom() * 310 + Math.sin(angle) * force * 0.28;
        const burstX = explodeX * (0.22 + scatterRandom() * 0.28);
        const liftY = -(55 + scatterRandom() * 165);
        const explodeScale = 0.82 + scatterRandom() * 0.62;
        const side = index % 4;
        const spawnX = side === 0 ? -maskWidth * 0.95 : side === 1 ? maskWidth * 0.95 : ((index * 37) % 180) - 90;
        const spawnY = side === 2 ? -maskHeight * 0.9 : side === 3 ? maskHeight * 0.9 : ((index * 29) % 160) - 80;

        particle.style.setProperty("--base-x", `${(point.x / maskWidth) * 100}%`);
        particle.style.setProperty("--base-y", `${(point.y / maskHeight) * 100}%`);
        particle.style.setProperty("--spawn-x", `${spawnX.toFixed(1)}px`);
        particle.style.setProperty("--spawn-y", `${spawnY.toFixed(1)}px`);
        particle.style.setProperty("--explode-x", `${explodeX.toFixed(1)}px`);
        particle.style.setProperty("--explode-y", `${explodeY.toFixed(1)}px`);
        particle.style.setProperty("--burst-x", `${burstX.toFixed(1)}px`);
        particle.style.setProperty("--lift-y", `${liftY.toFixed(1)}px`);
        const explodeRotation = -118 + scatterRandom() * 236;
        particle.style.setProperty("--explode-r", `${explodeRotation.toFixed(1)}deg`);
        particle.style.setProperty("--burst-r", `${(explodeRotation * 0.35).toFixed(1)}deg`);
        particle.style.setProperty("--explode-scale", explodeScale.toFixed(2));
        particle.style.setProperty("--fall-duration", `${Math.round(760 + scatterRandom() * 520)}ms`);
        particle.style.setProperty("--fall-delay", `${Math.round(scatterRandom() * 170)}ms`);
      });

    }

    initParticles();
    const observer = new ResizeObserver(initParticles);
    observer.observe(container);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const entranceObserver = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      entryFrame = window.requestAnimationFrame(() => {
        entryFrame = window.requestAnimationFrame(() => setParticlesReady(true));
      });
      entranceObserver.disconnect();
    }, { threshold: reduceMotion ? 0 : 0.22 });
    if (reduceMotion) {
      entryFrame = window.requestAnimationFrame(() => setParticlesReady(true));
    } else {
      entranceObserver.observe(container);
    }
    return () => {
      window.cancelAnimationFrame(entryFrame);
      observer.disconnect();
      entranceObserver.disconnect();
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
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(available > 0 ? Math.min(100, (window.scrollY / available) * 100) : 0);
    };
    const sections = ["top", "fit", "work", "play", "about"]
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

  const toggleFit = (key: string) => setOpenFit((current) => current === key ? null : key);
  const activeProject = projects[openProject];
  const activeProjectUrl = "url" in activeProject ? activeProject.url : undefined;
  const activeProjectLiveUrl = "liveUrl" in activeProject ? activeProject.liveUrl : undefined;
  const selectAdjacentProject = (direction: number) => {
    setOpenProject((current) => (current + direction + projects.length) % projects.length);
  };

  return (
    <main className={"site" + (photosOn ? " photos-on" : "")}>
      <div ref={cursorDotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={cursorRingRef} className="cursor-ring" aria-hidden="true" />
      <header className="topbar">
        <span className="scroll-progress" style={{ "--scroll-progress": `${scrollProgress}%` } as CSSProperties} aria-hidden="true" />
        <a className="wordmark magnetic" href="#top" aria-label="返回首页">AY<span>·</span></a>
        <nav aria-label="页面导航">
          <a className={(activeSection === "top" ? "active " : "") + "magnetic"} href="#top" data-scramble>ME</a>
          <a className={(activeSection === "fit" ? "active " : "") + "magnetic"} href="#fit" data-scramble>WHY / TOOLS</a>
          <a className={(activeSection === "work" ? "active " : "") + "magnetic"} href="#work" data-scramble>WORK</a>
          <a className={(activeSection === "play" ? "active " : "") + "magnetic"} href="#play" data-scramble>PLAY</a>
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

      <section
        className="hero"
        id="top"
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
          event.currentTarget.style.setProperty("--my", `${event.clientY - bounds.top}px`);
        }}
      >
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
          <p className="hero-statement">把想法做成体验。</p>
          <p className="hero-role">STATISTICS × AI × PRODUCT</p>
          <p className="intro">用统计理清问题，用 AI 原型把想法落地。</p>
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
            <div className="depth-layer hero-person-layer" data-speed="4" aria-hidden="true">
              <img className="hero-cutout" src="./photos/hero-cutout-v2.webp" alt="" />
            </div>
            <span className="portrait-cut-line" aria-hidden="true" />
            <span className="portrait-cut-note" aria-hidden="true">BREAK THE FRAME</span>
          </div>
          <figcaption className="hero-portrait-caption"><span>01 / 02 · PORTRAIT</span><span>LONDON</span></figcaption>
          <span className="portrait-hint">HOVER / 突破边框 ↗</span>
        </figure>
        <a className="scroll-note" href="#self">SCROLL / 认识我 ↓</a>
      </section>

      {musicOpen && (
        <aside className="music-card" aria-label="背景音乐说明">
          <button onClick={() => setMusicOpen(false)} aria-label="关闭音乐卡片">×</button>
          <p>NOW PLAYING IN MY HEAD</p>
          <strong>Tender / Blur</strong>
          <span>浏览器不会自动播放。点击可前往正版音源。</span>
          <a href="https://open.spotify.com/search/Blur%20Tender" target="_blank" rel="noreferrer">在 Spotify 打开 ↗</a>
        </aside>
      )}

      <section className="self-map section" id="self">
        <div className="self-map-copy">
          <p className="section-index mono-label" data-scramble>01 / ME · IDENTITY MAP</p>
          <h2>很多关键词，<br />拼成现在的
            <button
              className="identity-trigger magnetic"
              type="button"
              onPointerEnter={() => setIdentityOpen(true)}
              onPointerLeave={() => setIdentityOpen(false)}
              onFocus={() => setIdentityOpen(true)}
              onBlur={() => setIdentityOpen(false)}
              onClick={() => setIdentityOpen((current) => !current)}
              aria-label={identityOpen ? "收拢个人关键词" : "炸开个人关键词"}
            >「我」</button>。
          </h2>
          <p>移动到左侧「我」或右侧字形上，看看这些词从哪里来。</p>
          <div className="education-list" aria-label="教育背景">
            <p>EDUCATION / 受教育经历</p>
            <article>
              <span>2025.09 - 2026.12</span>
              <strong>格拉斯哥大学 · 英国</strong>
              <small>统计学硕士</small>
            </article>
            <article>
              <span>2020.09 - 2024.07</span>
              <strong>浙江农林大学</strong>
              <small>数据科学与大数据技术学士</small>
            </article>
          </div>
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

      <section className="fit section" id="fit">
        <div className="section-heading">
          <p className="section-index">02 / WHY ME &amp; TOOLS</p>
          <h2>从模糊想法，<br />走到一套<em>可验证的体验。</em></h2>
          <p className="section-note">默认只留结论。Hover 后，思考过程会像终端一样逐字出现。</p>
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
            <p>工具不是标签，是从信息到原型再到验证的一条工作流。</p>
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
      </section>

      <section className="work section" id="work">
        <div className="section-heading compact-heading">
          <p className="section-index">03 / SELECTED WORK</p>
          <h2>我的项目</h2>
        </div>
        <div className="project-showcase">
          <div className="project-rail-head">
            <p className="mono-label" data-scramble>A / PRODUCT & AI&nbsp;&nbsp;·&nbsp;&nbsp;B / DATA MODELLING</p>
            <span>HOVER / TAP TO EXPLORE</span>
          </div>
          <div className="project-rail" role="tablist" aria-label="选择项目">
            {projects.map((project, index) => (
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
                <small>{index < 3 ? "PRODUCT" : "DATA"} / {String(index + 1).padStart(2, "0")}</small>
                <strong>{project.title}</strong>
                <span>{project.metric}</span>
              </button>
            ))}
          </div>

          <article className={`project-stage ${activeProject.tone}`} key={activeProject.title}>
            <div className="project-stage-copy">
              <div className="project-stage-meta">
                <span>{String(openProject + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
                <span>{activeProject.year}</span>
                <span>{activeProject.subtitle}</span>
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
                <figure className="project-window aybot-window" aria-label="AYBot 检索增强生成流程预览">
                  <div className="project-window-bar" aria-hidden="true"><span /><span /><span /><small>aybot.flow</small></div>
                  <div className="project-window-body rag-flow" aria-hidden="true">
                    <div className="rag-query">ASK<br /><b>问题</b></div><i>→</i>
                    <div className="rag-node">SEARCH<br /><b>检索</b></div><i>→</i>
                    <div className="rag-node rag-top">TOP 3<br /><b>召回</b></div><i>→</i>
                    <div className="rag-answer">ANSWER<br /><b>回答</b></div>
                  </div>
                  <figcaption>RAG FLOW / TRACEABLE CONTEXT</figcaption>
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

            <div className="project-stage-detail">
              <p>{activeProject.detail}</p>
              <strong>{activeProject.opinion}</strong>
            </div>
            <div className="project-stage-controls" aria-label="切换项目">
              <button type="button" onClick={() => selectAdjacentProject(-1)} aria-label="上一个项目">←</button>
              <span>{String(openProject + 1).padStart(2, "0")}</span>
              <button type="button" onClick={() => selectAdjacentProject(1)} aria-label="下一个项目">→</button>
            </div>
          </article>
        </div>
      </section>

      <section className="play section" id="play">
        <div className="play-copy">
          <p className="section-index">04 / PLAY · PROTOTYPE</p>
          <h2>来玩一个<br /><em>AI 灵感实验。</em></h2>
          <p>选一个场景。我会把抽象的 AI 能力整理成一条可以继续讨论和验证的产品思路。</p>
          <div className="scene-options" role="group" aria-label="选择 AI 应用场景">
            {Object.keys(ideas).map((item) => (
              <button className={scene === item ? "active" : ""} onClick={() => { setScene(item); setIdeaIndex(0); }} key={item}>{item}</button>
            ))}
          </div>
          <button className="generate-button" onClick={() => setIdeaIndex(ideaIndex + 1)}>再生成一个灵感 <span>✦</span></button>
        </div>
        <div className="prototype-shell">
          <div className="prototype-top"><span>AI IDEA LAB</span><i /><i /><i /></div>
          <div className="prototype-screen">
            <p className="screen-label">SCENE / {scene}</p>
            <blockquote>{currentIdea}</blockquote>
            <div className="screen-foot">
              <span>输入：场景 × 意图 × 上下文</span>
              <span>输出：可控、可解释、可退出</span>
            </div>
          </div>
          <p className="prototype-note">每条灵感都可以继续写成 PRD、画成流程，再配上验证指标。</p>
        </div>
      </section>

      <section className="about section" id="about">
        <div className="photo-collage">
          <figure className="portrait-frame"><img src="./photos/athens-portrait.webp" alt="安颜在雅典的旅行照片" /><figcaption>ATHENS / light & structure</figcaption></figure>
          <figure className="landscape-frame"><img src="./photos/london-shadow.webp" alt="安颜拍摄的伦敦街景与人物剪影" /><figcaption>LONDON / people & city</figcaption></figure>
          <figure className="eye-frame"><img src="./photos/london-eye.webp" alt="安颜拍摄的伦敦眼与蓝天" /><figcaption>LONDON EYE / system & motion</figcaption></figure>
          <figure className="winter-portrait-frame"><img src="./photos/winter-coast-portrait.jpg" alt="安颜在冬日海岸的侧面人像" /><figcaption>WINTER COAST / wind & silence</figcaption></figure>
          <figure className="camera-frame"><img src="./photos/winter-coast-camera.jpg" alt="安颜在海岸拍摄的背影" /><figcaption>BEHIND THE LENS / looking closely</figcaption></figure>
        </div>
        <div className="about-copy">
          <p className="section-index">05 / OFF SCREEN &amp; TALK</p>
          <h2>屏幕之外，<br />我喜欢<em>响一点、怪一点、真一点。</em></h2>
          <div className="interest-list">
            <article><span>ROCK</span><h3>摇滚</h3><p>我喜欢摇滚的直白和张力。Blur 的 Tender 是我想放进这个页面的歌，温柔，但不软弱。</p></article>
            <article><span>ART</span><h3>艺术与建筑</h3><p>看建筑时，我会注意材质、比例和光线。做页面时，这些观察常常会自己跑回来。</p></article>
            <article><span>PHOTO</span><h3>摄影</h3><p>页面里的照片都由我拍摄或出镜。旅行时，我喜欢找画面里的结构和留白，也看人怎么待在环境里。</p></article>
            <article><span>ENTP</span><h3>辩论与表达</h3><p>我做过学院辩论队队长，带领 10 余人组织赛事。一个想法先拿出来讨论，通常比自己闷头打磨更有意思。</p></article>
          </div>
          <div className="offscreen-cta">
            <p>如果你也在寻找一个能把分析、创意与行动连起来的人。</p>
            <a className="resume-orbit magnetic" href="./安颜-简历.pdf" download>
              <span>DOWNLOAD RESUME</span>
              <small>获取简历 · 2026 届</small>
            </a>
            <a className="offscreen-mail magnetic" href="mailto:anyan001121@gmail.com">anyan001121@gmail.com ↗</a>
          </div>
        </div>
      </section>
    </main>
  );
}
