"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type CSSProperties } from "react";

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
    star: {
      situation: "注意力与任务管理困难时，大任务常让“开始”本身变得很难。",
      task: "把杂乱输入转成少量、可立即执行的步骤，并支持中断后继续。",
      action: "用 LangGraph 串联 Brain Dump、任务拆解、专注计时、暂存与恢复；用 SQLite 保存本地记录，并按实际与预计用时调整任务粒度。",
      result: "每轮最多给出 3 个即时优先项，并建立启动耗时、完成率和恢复成功率等验证指标。",
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
    lead: "把分散的测评题，整理成随时能练、练完有反馈的刷题流程。",
    star: {
      situation: "727 道测评题分散在三个模块，选题、练习与复盘路径割裂。",
      task: "设计一套从选题、答题到错题回看的完整静态刷题流程。",
      action: "用原生 JS 与 LocalStorage 实现快速小测、顺序/随机练习、答题卡、收藏、错题筛选和成绩报告。",
      result: "统一收录言语 321 题、资料 254 题、图形 152 题；学习记录保存在本地，可直接在线使用。",
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
    lead: "让知识助手先找依据，再回答问题。",
    star: {
      situation: "通用大模型面对本地资料和最新信息时，容易生成缺少依据的回答。",
      task: "让知识助手先检索证据，再生成可追溯的回答。",
      action: "用 LangChain 与 Coze 搭建五节点流程，召回 Top 3 知识片段并补充 arXiv 实时信息，最低匹配度设为 0.14。",
      result: "形成“检索—筛选—生成—溯源”闭环；扩展模块可按关键词整理并定时推送 10 条新闻。",
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
      situation: "飞行参数维度高、异常信号分散，难以直接形成稳定的监测规则。",
      task: "压缩变量、筛选关键指标，并建立航空安全预警模型。",
      action: "用 PCA 将 10 项着陆 G 值数据压缩为 1 个主成分并保留 90% 以上信息，再以随机森林筛出 5 项指标，组合 LOF 与 SVM。",
      result: "预警准确度达到 0.85，项目获 MathorCup 数学建模挑战赛全国二等奖。",
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
    lead: "把分散的数据放到同一个框架里，研究市场增长和双碳目标。",
    award: "长三角数学建模竞赛二等奖",
    star: {
      situation: "新能源市场、能源消费与碳排放指标分散，缺少统一的预测和解释框架。",
      task: "评估新能源汽车增长与双碳目标之间的关系，并推演关键时间节点。",
      action: "结合 GM(1,1) 与 Cobb-Douglas 岭回归，检验后验差、相对误差和模型拟合表现。",
      result: "后验差比值 0.002、平均相对误差 1.983%、R² 0.973；项目获长三角数学建模竞赛二等奖。",
    },
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
    star: {
      situation: "电影商业判断只能使用上映前信息，且漏判与误判对应不同的业务成本。",
      task: "比较多类模型，并为不同决策偏好选择合适指标。",
      action: "仅保留上映前变量以防止数据泄漏，统一比较 7 类模型，重点评估 SVM 与随机森林。",
      result: "SVM 正类召回率 45.5%，随机森林 AUC 0.769，形成面向机会发现与误判控制的差异化建议。",
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
      situation: "临床、生活方式与遗传因素共同影响血糖和 HDL，变量关系复杂。",
      task: "基于 3,808 名参与者识别稳定关联，并评估 SNP 面板的整体贡献。",
      action: "结合 HC3、GLM/GAM、Lasso 与 BMA，并通过共线性检查精简候选位点。",
      result: "BMI 每增加 1 kg/m²，血糖约升 1.2%、HDL 约降 1.4%；女性 HDL 约高 20%，并发现 SNP 面板与血糖存在整体关联。",
    },
    tone: "lavender",
    preview: "metric",
  },
];

export default function Home() {
  const [introLifted, setIntroLifted] = useState(false);
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

  // Site entrance: a brief curtain-lift on first load before the hero settles in.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = window.requestAnimationFrame(() => setIntroLifted(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const timer = window.setTimeout(() => setIntroLifted(true), 850);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = glyphCanvasRef.current;
    const container = wordCloudRef.current;
    if (!canvas || !container) return;
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
      if (!canvas || !container) return;
      const bounds = container.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const previousWidth = maskWidth || bounds.width;
      const previousHeight = maskHeight || bounds.height;
      maskWidth = Math.max(1, Math.round(bounds.width));
      maskHeight = Math.max(1, Math.round(bounds.height));
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
      const elements = Array.from(container.querySelectorAll<HTMLElement>(".identity-word"));
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
      const bounds = container.getBoundingClientRect();
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
        const isOpen = container.classList.contains("is-open");

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
    const observer = new ResizeObserver(initParticles);
    observer.observe(container);
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
      entranceObserver.observe(container);
    }
    container.addEventListener("pointermove", updatePointer, { passive: true });
    container.addEventListener("pointerenter", updatePointer, { passive: true });
    container.addEventListener("pointerleave", releasePointer);
    animationFrame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(entryFrame);
      observer.disconnect();
      entranceObserver.disconnect();
      container.removeEventListener("pointermove", updatePointer);
      container.removeEventListener("pointerenter", updatePointer);
      container.removeEventListener("pointerleave", releasePointer);
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
    const sections = ["top", "fit", "work", "about"]
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
    const thresholds = Array.from({ length: 41 }, (_, i) => i / 40);
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
    setOpenProject((current) => (current + direction + projects.length) % projects.length);
  };

  return (
    <main className={"site" + (photosOn ? " photos-on" : "")}>
      <div className={"site-intro" + (introLifted ? " is-lifted" : "")} aria-hidden="true">
        <span className="site-intro-mark">AY<span>·</span></span>
      </div>
      <div ref={cursorDotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={cursorRingRef} className="cursor-ring" aria-hidden="true" />
      <header className="topbar">
        <span className="scroll-progress" style={{ "--scroll-progress": `${scrollProgress}%` } as CSSProperties} aria-hidden="true" />
        <a className="wordmark magnetic" href="#top" aria-label="返回首页">AY<span>·</span></a>
        <nav aria-label="页面导航">
          <a className={(activeSection === "top" ? "active " : "") + "magnetic"} href="#top" data-scramble>ME</a>
          <a className={(activeSection === "fit" ? "active " : "") + "magnetic"} href="#fit" data-scramble>WHY / TOOLS</a>
          <a className={(activeSection === "work" ? "active " : "") + "magnetic"} href="#work" data-scramble>WORK</a>
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
            <span className="depth-layer hero-name-depth" data-speed="3" aria-hidden="true">Yan An</span>
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

      <section className="self-map section interactive-section" id="self">
        <span className="section-pointer-glow" aria-hidden="true" />
        <div className="self-map-copy curtain-observe">
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
            <span className="identity-trigger-guide" aria-hidden="true"><i />悬停试试</span>
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
          <p>悬停「我」，关键词会散开；移开后，重新拼回字形。</p>
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

      <section className="work section interactive-section" id="work">
        <span className="section-pointer-glow" aria-hidden="true" />
        <div className="section-heading compact-heading curtain-observe">
          <span className="heading-ghost-num" aria-hidden="true">03</span>
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
                {"award" in project && <em className="project-rail-award">AWARD</em>}
              </button>
            ))}
          </div>

          <article className={`project-stage ${activeProject.tone}`} key={activeProject.title}>
            <div className="project-stage-copy">
              <div className="project-stage-meta">
                <span>{String(openProject + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
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
              <span>{String(openProject + 1).padStart(2, "0")}</span>
              <button type="button" onClick={() => selectAdjacentProject(1)} aria-label="下一个项目">→</button>
            </div>
          </article>
        </div>
      </section>

      <section className="offscreen section interactive-section" id="about">
        <span className="section-pointer-glow" aria-hidden="true" />
        <div className="offscreen-stage">
          <div className="offscreen-heading curtain-observe">
            <p className="section-index">04 / OFF SCREEN &amp; TALK</p>
            <h2>屏幕之外，我喜欢<em>响一点、怪一点、真一点。</em></h2>
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
