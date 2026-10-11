"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import ImpactHero from "./ImpactHero";
import { WorkGallery, MethodLab, PhotoDesk, StudioGuide } from "./StudioSections";
import { projects } from "./projects";
import "./Studio.css";

type IdentityCategory = "data" | "product" | "expression" | "observe";

type IdentityWord = {
  label: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotate: number;
  accent?: boolean;
  category: IdentityCategory;
};

const identityCategories: { key: IdentityCategory; label: string; hint: string }[] = [
  { key: "data", label: "数据", hint: "统计方法与建模相关作品" },
  { key: "product", label: "产品", hint: "AI 应用与产品类作品" },
  { key: "expression", label: "表达", hint: "辩论与结构化表达经历" },
  { key: "observe", label: "观察", hint: "摄影与生活观察" },
];

const identitySeedWords: IdentityWord[] = [
  { label: "ENTP", x: 42, y: 8, dx: -278, dy: -205, rotate: -8, accent: true, category: "expression" },
  { label: "实验设计", x: 56, y: 11, dx: 210, dy: -210, rotate: 6, accent: true, category: "data" },
  { label: "英国", x: 31, y: 18, dx: -330, dy: -120, rotate: -11, category: "observe" },
  { label: "因果推断", x: 60, y: 20, dx: 305, dy: -115, rotate: 9, accent: true, category: "data" },
  { label: "大数据", x: 24, y: 29, dx: -360, dy: -28, rotate: -6, category: "data" },
  { label: "统计学", x: 47, y: 28, dx: -125, dy: -120, rotate: 5, accent: true, category: "data" },
  { label: "AI 工具", x: 67, y: 31, dx: 355, dy: -34, rotate: 8, category: "product" },
  { label: "数模竞赛", x: 36, y: 39, dx: -280, dy: 55, rotate: -8, category: "data" },
  { label: "回归模型", x: 57, y: 40, dx: 242, dy: 32, rotate: 5, accent: true, category: "data" },
  { label: "时间序列", x: 75, y: 42, dx: 365, dy: 72, rotate: 12, category: "data" },
  { label: "推理", x: 27, y: 51, dx: -355, dy: 135, rotate: -12, category: "expression" },
  { label: "辩论", x: 50, y: 51, dx: -65, dy: 155, rotate: 7, category: "expression" },
  { label: "产品", x: 69, y: 53, dx: 315, dy: 150, rotate: -7, category: "product" },
  { label: "摇滚", x: 23, y: 63, dx: -300, dy: 245, rotate: -9, accent: true, category: "observe" },
  { label: "数据挖掘", x: 44, y: 62, dx: -125, dy: 275, rotate: 6, accent: true, category: "data" },
  { label: "单机游戏", x: 65, y: 65, dx: 248, dy: 255, rotate: 10, category: "observe" },
  { label: "玩家研究", x: 72, y: 67, dx: 312, dy: 275, rotate: -8, accent: true, category: "product" },
  { label: "叙事设计", x: 20, y: 79, dx: -372, dy: 352, rotate: 8, category: "observe" },
  { label: "用户行为", x: 33, y: 69, dx: -264, dy: 308, rotate: -5, accent: true, category: "product" },
  { label: "JRPG", x: 79, y: 51, dx: 390, dy: 138, rotate: 9, category: "observe" },
  { label: "AVG", x: 18, y: 57, dx: -398, dy: 188, rotate: -10, category: "observe" },
  { label: "模拟经营", x: 58, y: 86, dx: 118, dy: 414, rotate: 5, category: "observe" },
  { label: "摄影", x: 38, y: 74, dx: -238, dy: 345, rotate: -6, category: "observe" },
  { label: "RAG", x: 56, y: 75, dx: 105, dy: 342, rotate: 7, category: "product" },
  { label: "LangChain", x: 45, y: 85, dx: -30, dy: 420, rotate: -3, category: "product" },
  { label: "预测模型", x: 70, y: 82, dx: 325, dy: 360, rotate: 9, accent: true, category: "data" },
  { label: "数据分析", x: 30, y: 86, dx: -260, dy: 420, rotate: -8, accent: true, category: "data" },
  { label: "Python", x: 50, y: 91, dx: 20, dy: 438, rotate: 4, category: "data" },
  { label: "SQL", x: 63, y: 89, dx: 185, dy: 420, rotate: -5, accent: true, category: "data" },
  { label: "R", x: 77, y: 72, dx: 385, dy: 285, rotate: 10, category: "data" },
  { label: "AI 产品", x: 17, y: 73, dx: -390, dy: 295, rotate: -11, accent: true, category: "product" },
  { label: "Hadoop", x: 81, y: 24, dx: 392, dy: -92, rotate: 8, category: "data" },
  { label: "旅行", x: 15, y: 45, dx: -402, dy: 82, rotate: -7, category: "observe" },
  { label: "大数据架构", x: 84, y: 60, dx: 405, dy: 205, rotate: 12, category: "data" },
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

type ProjectGroup = "ai" | "data";

export default function Home() {
  const [introLifted, setIntroLifted] = useState(true);
  const [musicOpen, setMusicOpen] = useState(false);
  const [photosOn, setPhotosOn] = useState(true);
  const [identityOpen, setIdentityOpen] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);
  const [projectGroup, setProjectGroup] = useState<ProjectGroup | "all">("all");
  const [surprise, setSurprise] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [activeIdentityCategory, setActiveIdentityCategory] = useState<IdentityCategory | null>(null);
  const glyphCanvasRef = useRef<HTMLCanvasElement>(null);
  const wordCloudRef = useRef<HTMLButtonElement>(null);
  const hudReadoutRef = useRef<HTMLOutputElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
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
    const sections = ["top", "work", "self", "fit", "about"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(available > 0 ? Math.min(100, (window.scrollY / available) * 100) : 0);
      const marker = Math.max(80, window.innerHeight * 0.35);
      const visible = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= marker && bounds.bottom > marker;
      });
      if (visible) setActiveSection(visible.id);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(updateProgress); };
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);
    updateProgress();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
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

  const focusIdentityCategory = (key: IdentityCategory) => {
    if (activeIdentityCategory === key) {
      setActiveIdentityCategory(null);
      return;
    }
    setActiveIdentityCategory(key);
    setIdentityOpen(true);
    // 先留半秒看清关键词高亮，再跳转——否则高亮效果会被滚动直接盖过去，等于白做。
    window.setTimeout(() => {
      if (key === "data" || key === "product") {
        setProjectGroup(key === "data" ? "data" : "ai");
        document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (key === "expression") {
        document.getElementById("interest-debate")?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (key === "observe") {
        document.getElementById("offscreen-gallery")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 550);
  };

  return (
    <main className={"site" + (photosOn ? " photos-on" : "")}>
      <StudioGuide section={activeSection || "top"} hidden={!introLifted} onSurprise={() => { setSurprise((v) => v + 1); document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }); }} />
      <div ref={cursorDotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={cursorRingRef} className="cursor-ring" aria-hidden="true" />
      <header className={`topbar${!activeSection || activeSection === "top" ? " is-over-poster" : ""}`}>
        <span className="scroll-progress" style={{ "--scroll-progress": `${scrollProgress}%` } as CSSProperties} aria-hidden="true" />
        <a className="wordmark magnetic" href="#top" aria-label="返回首页">AY<span>·</span></a>
        <nav aria-label="页面导航">
          <a className={(activeSection === "top" ? "active " : "") + "magnetic"} href="#top" data-scramble>ME</a>
          <a className={(activeSection === "work" ? "active " : "") + "magnetic"} href="#work" data-scramble>PLAY & WORK</a>
          <a className={(activeSection === "fit" ? "active " : "") + "magnetic"} href="#fit" data-scramble>HOW I THINK</a>
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

      <ImpactHero onIntroCompleteChange={setIntroLifted} />

      {musicOpen && (
        <aside className="music-card" aria-label="背景音乐说明">
          <button onClick={() => setMusicOpen(false)} aria-label="关闭音乐卡片">×</button>
          <p>NOW PLAYING IN MY HEAD</p>
          <strong>Tender / Blur</strong>
          <span>页面不会自动播放，点击可前往正版音源。</span>
          <a href="https://open.spotify.com/search/Blur%20Tender" target="_blank" rel="noreferrer">在 Spotify 打开 ↗</a>
        </aside>
      )}

      <WorkGallery projects={projects} group={projectGroup} onGroupChange={setProjectGroup} surprise={surprise} />

      <section className="self-map section interactive-section" id="self">
        <span className="section-pointer-glow" aria-hidden="true" />
        <div className="self-map-copy curtain-observe">
          <p className="section-index mono-label" data-scramble>02 / ME · IDENTITY MAP</p>
          <h2>
            <button
              className="identity-trigger magnetic"
              type="button"
              onPointerEnter={() => setIdentityOpen(true)}
              onPointerLeave={() => setIdentityOpen(false)}
              onFocus={() => setIdentityOpen(true)}
              onBlur={() => setIdentityOpen(false)}
              onClick={() => setIdentityOpen((current) => !current)}
              aria-label={identityOpen ? "收拢个人关键词" : "炸开个人关键词"}
            >我</button>
            <span className="identity-trigger-guide" aria-hidden="true"><i />悬停看看</span>
            <br /><span className="identity-title-rest">不止一个标签。</span>
          </h2>
          <div className="education-list" aria-label="教育背景">
            <p>EDUCATION / 受教育经历</p>
            <article>
              <span>2025.09 - 2027.01（预计）</span>
              <div><strong>格拉斯哥大学 · 英国</strong><small>统计学硕士</small></div>
            </article>
            <article>
              <span>2020.09 - 2024.07</span>
              <div><strong>浙江农林大学</strong><small>数据科学与大数据技术学士</small></div>
            </article>
          </div>
          <p>悬停时关键词散开，移开后重新聚合。</p>
          <span className="self-map-hint mono-label" data-scramble>HOVER / TAP TO DECONSTRUCT ↗</span>
          <div className="identity-categories" role="group" aria-label="按分类探索关键词">
            {identityCategories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                className={"identity-category-btn" + (activeIdentityCategory === cat.key ? " is-active" : "")}
                aria-pressed={activeIdentityCategory === cat.key}
                title={cat.hint}
                onClick={() => focusIdentityCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <div className="self-glyph-stage">
          <button
            ref={wordCloudRef}
            id="word-cloud-container"
            className={`self-glyph magnetic${particlesReady ? " particles-ready" : ""}${identityOpen ? " is-open" : ""}`}
            type="button"
            data-active-category={activeIdentityCategory ?? undefined}
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
                <span
                  className={"identity-word" + (word.accent ? " accent" : "")}
                  style={style}
                  data-category={word.category}
                  key={word.key}
                >
                  <i>{String(index + 1).padStart(2, "0")}</i>{word.label}
                </span>
              );
            })}
          </button>
        </div>
      </section>

      <MethodLab />
      <PhotoDesk />
    </main>
  );
}
