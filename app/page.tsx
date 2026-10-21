"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import ImpactHero from "./ImpactHero";
import { WorkGallery, PhotoDesk, StudioGuide } from "./StudioSections";
import { projects } from "./projects";
import "./Studio.css";
import "./SoftStudio.css";
import "./InteractiveStudio.css";

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
  const shockRef = useRef<HTMLSpanElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [cursorHost, setCursorHost] = useState<HTMLDialogElement | null>(null);
  const cursorPosition = useRef({ x: -1000, y: -1000, visible: false });
  useEffect(() => {
    const canvas = glyphCanvasRef.current;
    const container = wordCloudRef.current;
    if (!canvas || !container) return;
    const glyphCanvas = canvas;
    const wordCloud = container;
    const openFriction = 0.955; // almost no drag while open: the burst glides on and the words drift freely
    const CHARGE_MS = 110; // anticipation: the glyph draws in before it blows
    const WAVE_PX_PER_MS = 1.5; // the shockwave reaches far words later
    let explodeAt = 0;
    let pointerVX = 0;
    let pointerVY = 0;
    let lastPointerTime = 0;
    let originX = 0;
    let originY = 0;
    // Visible screen area in cloud coordinates, taken at each burst: the drift stays where it can be seen.
    let fence = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
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
      vx: number;
      vy: number;
      phase: number;
      breathSpeed: number;
      breathAmp: number;
      rot: number;
      vr: number;
      kickAt: number;
      kickX: number;
      kickY: number;
      kicked: boolean;
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
          vx: old?.vx ?? 0,
          vy: old?.vy ?? 0,
          phase: physicsRandom() * Math.PI * 2,
          breathSpeed: 0.00042 + physicsRandom() * 0.00058,
          breathAmp: 2.5 + physicsRandom() * 3.5,
          rot: old?.rot ?? 0,
          vr: 0,
          kickAt: 0,
          kickX: 0,
          kickY: 0,
          kicked: true,
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
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      // Smoothed pointer velocity (px per 60fps frame): the burst and the wake follow the swipe.
      const now = performance.now();
      if (pointerActive && lastPointerTime) {
        const frames = Math.max(0.5, (now - lastPointerTime) / 16.667);
        pointerVX = pointerVX * 0.55 + ((x - pointerX) / frames) * 0.45;
        pointerVY = pointerVY * 0.55 + ((y - pointerY) / frames) * 0.45;
      }
      lastPointerTime = now;
      pointerX = x;
      pointerY = y;
      pointerActive = true;
    }

    function releasePointer() {
      pointerActive = false;
      lastPointerTime = 0;
    }

    // A mouse sweeping across the cloud bursts it; leaving for a moment lets it gather back into 我.
    let closeTimer = 0;
    function hoverOpen(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      window.clearTimeout(closeTimer);
      updatePointer(event);
      setIdentityOpen(true);
    }
    function hoverClose(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => setIdentityOpen(false), 1200);
    }

    function animate(time: number) {
      const delta = Math.min(2, Math.max(0.45, (time - previousTime) / 16.667));
      previousTime = time;

      if (inView && !reduceMotion) {
        const isOpen = wordCloud.classList.contains("is-open");

        if (isOpen && !wasOpen) {
          // Burst from where the pointer is (or the centre): charge for a beat, then a shockwave
          // travels outward — near words fly first and fastest, far ones a moment later — and tumble.
          originX = pointerActive ? pointerX : maskWidth / 2;
          originY = pointerActive ? pointerY : maskHeight / 2;
          explodeAt = time + CHARGE_MS;
          // Swipe: direction and speed of the pointer as it came in.
          const swipeSpeed = Math.hypot(pointerVX, pointerVY);
          const swipeX = swipeSpeed > 0.4 ? pointerVX / swipeSpeed : 0;
          const swipeY = swipeSpeed > 0.4 ? pointerVY / swipeSpeed : 0;
          const swipeWeight = Math.min(1.6, swipeSpeed / 10);
          const reach = 0.8 + Math.min(0.45, swipeSpeed / 45);
          const box = wordCloud.getBoundingClientRect();
          const scale = box.width / maskWidth || 1; // the cloud is scaled down on phones
          fence = {
            minX: (24 - box.left) / scale,
            maxX: (window.innerWidth - 24 - box.left) / scale,
            minY: (84 - box.top) / scale,
            maxY: (window.innerHeight - 24 - box.top) / scale,
          };
          particleStates.forEach((particle) => {
            const dx = particle.x - originX;
            const dy = particle.y - originY;
            const distance = Math.max(1, Math.hypot(dx, dy));
            // Blend the radial burst with the swipe: a fast sweep throws the words along its path.
            const rx = dx / distance + swipeX * swipeWeight;
            const ry = dy / distance + swipeY * swipeWeight;
            const angle = Math.atan2(ry, rx) + (Math.random() - 0.5) * 0.8;
            // Size each throw to the room on screen: find how far this direction runs before the fence,
            // land between about halfway and nearly the edge, so the words fill the view evenly.
            const ux = Math.cos(angle);
            const uy = Math.sin(angle);
            const room = Math.max(40, Math.min(
              ux > 0 ? (fence.maxX - particle.x) / ux : ux < 0 ? (fence.minX - particle.x) / ux : Infinity,
              uy > 0 ? (fence.maxY - particle.y) / uy : uy < 0 ? (fence.minY - particle.y) / uy : Infinity,
            ));
            const travel = room * (0.45 + Math.random() * 0.5) * reach;
            const impulse = travel * (1 - openFriction); // glide distance under drag f is v / (1 - f)
            particle.kickAt = explodeAt + distance / WAVE_PX_PER_MS;
            particle.kickX = Math.cos(angle) * impulse;
            particle.kickY = Math.sin(angle) * impulse;
            particle.kicked = false;
          });
          shockRef.current?.animate(
            [
              { transform: `translate(${originX}px, ${originY}px) scale(.02)`, opacity: 0.55 },
              { transform: `translate(${originX}px, ${originY}px) scale(1)`, opacity: 0 },
            ],
            { duration: 750, delay: CHARGE_MS, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" },
          );
        }

        if (!isOpen && wasOpen) {
          // Reassemble in a spiral: a sideways push makes the words swirl back into the glyph.
          particleStates.forEach((particle) => {
            const dx = particle.x - maskWidth / 2;
            const dy = particle.y - maskHeight / 2;
            const distance = Math.max(1, Math.hypot(dx, dy));
            particle.vx += (-dy / distance) * 11;
            particle.vy += (dx / distance) * 11;
            particle.vr += (Math.random() - 0.5) * 10;
            particle.kicked = true;
          });
        }

        particleStates.forEach((particle) => {
          if (isOpen && time < explodeAt) {
            // Charge: a quick inward draw towards the burst point.
            particle.vx += (originX - particle.x) * 0.003 * delta;
            particle.vy += (originY - particle.y) * 0.003 * delta;
          } else if (isOpen && !particle.kicked && time >= particle.kickAt) {
            particle.vx += particle.kickX;
            particle.vy += particle.kickY;
            particle.vr += (Math.random() - 0.5) * 32;
            particle.kicked = true;
          }

          if (isOpen) {
            // Free drift — no spring: once kicked, each word rides a slowly turning flow field.
            if (particle.kicked) {
              const flow = Math.sin(particle.x * 0.0042 + time * 0.00023 + particle.phase) + Math.cos(particle.y * 0.0037 - time * 0.00019) * 1.3;
              particle.vx += Math.cos(flow * 1.7) * 0.03 * delta;
              particle.vy += Math.sin(flow * 1.7) * 0.03 * delta;
              particle.vr += Math.sin(time * 0.0007 + particle.phase) * 0.02 * delta;
            }
            // Soft fence at the screen edge: words glide back into view rather than bouncing off it.
            if (particle.x < fence.minX) particle.vx += (fence.minX - particle.x) * 0.002 * delta;
            if (particle.x > fence.maxX) particle.vx += (fence.maxX - particle.x) * 0.002 * delta;
            if (particle.y < fence.minY) particle.vy += (fence.minY - particle.y) * 0.002 * delta;
            if (particle.y > fence.maxY) particle.vy += (fence.maxY - particle.y) * 0.002 * delta;
          } else {
            // Reassemble with an exponential glide (no overshoot) onto the glyph, breathing gently once there.
            const targetX = particle.originX + Math.sin(time * particle.breathSpeed + particle.phase) * particle.breathAmp;
            const targetY = particle.originY + Math.cos(time * particle.breathSpeed * 0.83 + particle.phase * 1.7) * particle.breathAmp * 0.72;
            const glide = 1 - Math.pow(0.92, delta);
            particle.x += (targetX - particle.x) * glide;
            particle.y += (targetY - particle.y) * glide;
          }

          if (isOpen && pointerActive) {
            // Wake: words near a moving pointer are carried along its direction, like stirring water.
            const near = Math.hypot(particle.x - pointerX, particle.y - pointerY);
            if (near < 170) {
              const carry = Math.exp(-near / 70) * 0.09 * delta;
              particle.vx += pointerVX * carry;
              particle.vy += pointerVY * carry;
              particle.vr += (pointerVX - pointerVY) * carry * 0.6;
            }
          }

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

          const damping = Math.pow(isOpen ? openFriction : 0.8, delta);
          particle.vx *= damping;
          particle.vy *= damping;
          particle.x += particle.vx * delta;
          particle.y += particle.vy * delta;
          // Tumble: spin decays, and the extra angle relaxes back to the word's resting tilt.
          particle.rot += particle.vr * delta;
          particle.vr *= Math.pow(0.92, delta);
          particle.rot *= Math.pow(isOpen ? 0.985 : 0.92, delta);
          particle.element.style.transform = `translate3d(${particle.x.toFixed(2)}px,${particle.y.toFixed(2)}px,0) translate(-50%,-50%) rotate(var(--r)) rotate(${particle.rot.toFixed(1)}deg)`;
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
    wordCloud.addEventListener("pointerenter", hoverOpen);
    wordCloud.addEventListener("pointerleave", hoverClose);
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
      wordCloud.removeEventListener("pointerenter", hoverOpen);
      wordCloud.removeEventListener("pointerleave", hoverClose);
      window.clearTimeout(closeTimer);
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

  useLayoutEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!dot || !ring || reduceMotion || !precisePointer) return;

    document.body.classList.add("has-custom-cursor");
    let pointerX = cursorPosition.current.x;
    let pointerY = cursorPosition.current.y;
    let ringX = pointerX;
    let ringY = pointerY;
    let magneticTarget: HTMLElement | null = null;
    let hovering = false;
    let hoverElement: HTMLElement | null = null;
    let cursorFrame = 0;
    dot.classList.toggle("is-visible", cursorPosition.current.visible);
    ring.classList.toggle("is-visible", cursorPosition.current.visible);

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursorPosition.current = { x: pointerX, y: pointerY, visible: true };
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

    // One rule for every interactive element, found live as the pointer moves (so content rendered later,
    // dialogs included, behaves the same): small controls pull the ring in and snap it to their centre;
    // large surfaces such as cards, photos or the word cloud only tint the ring — same size as everywhere else.
    const INTERACTIVE = 'a[href], button:not(:disabled), summary, [role="button"], label, input, select, textarea';
    const setHover = (element: HTMLElement | null) => {
      if (element === hoverElement) return;
      hoverElement = element;
      const bounds = element?.getBoundingClientRect();
      const small = Boolean(bounds && bounds.width <= 160 && bounds.height <= 80);
      magneticTarget = small ? element : null;
      hovering = Boolean(element) && !small;
      ring.classList.toggle("is-magnetic", small);
      ring.classList.toggle("is-hovering", hovering);
    };
    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      setHover((event.target as Element | null)?.closest?.<HTMLElement>(INTERACTIVE) ?? null);
    };
    const onLeaveWindow = (event: PointerEvent) => { if (!event.relatedTarget) setHover(null); };
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onLeaveWindow, { passive: true });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    animateCursor();
    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.cancelAnimationFrame(cursorFrame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onLeaveWindow);
    };
  }, [cursorHost]);

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

  // Deep links (#work, #skills…): the browser looks for the anchor before React has rendered it,
  // so scroll there once the page exists.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || id === "top") return;
    // Jump instantly once layout has settled; a smooth scroll here gets interrupted by the page's own setup.
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" }), 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const sections = ["top", "self", "skills", "work", "contact", "about"] // nested ids first: skills sits inside work, contact inside about
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

  const cursor = <>
    <div ref={cursorDotRef} className="cursor-dot" aria-hidden="true" />
    <div ref={cursorRingRef} className="cursor-ring" aria-hidden="true" />
  </>;

  return (
    <main className="site photos-on">
      {/* The hero already has the big cartoon; the guide joins from the work section on. */}
      <StudioGuide section={activeSection === "skills" ? "work" : activeSection === "contact" ? "about" : activeSection || "top"} hidden={!introLifted || !activeSection || activeSection === "top"} onSurprise={() => { setSurprise((v) => v + 1); document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }); }} />
      {/* Native dialogs live above every z-index; keep the cursor in that same top layer. */}
      {cursorHost ? createPortal(cursor, cursorHost) : cursor}
      <header className={`topbar${!activeSection || activeSection === "top" ? " is-over-poster" : ""}`}>
        <span className="scroll-progress" style={{ "--scroll-progress": `${scrollProgress}%` } as CSSProperties} aria-hidden="true" />
        <a className="wordmark magnetic" href="#top" aria-label="返回首页">AY<span>·</span></a>
        <nav aria-label="页面导航">
          {([["top", "首页"], ["self", "关于"], ["work", "项目"], ["skills", "能力"], ["contact", "联系"]] as const).map(([id, label]) => (
            <a key={id} className={(activeSection === id || (id === "self" && activeSection === "about") ? "active " : "") + "magnetic"} href={`#${id}`}>{label}</a>
          ))}
        </nav>
      </header>

      <ImpactHero onIntroCompleteChange={setIntroLifted} />

      <section className="self-map section interactive-section" id="self">
        <span className="section-pointer-glow" aria-hidden="true" />
        <div className="self-map-copy curtain-observe">
          <p className="section-index mono-label" data-scramble>01 / ABOUT ME</p>
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
            >安颜</button>
            <span className="identity-trigger-guide" aria-hidden="true"><i />悬停看看</span>

          </h2>
          <div className="turning-point" aria-labelledby="turning-point-title">
            <h3 id="turning-point-title">从机械工程，<br />转向数据。</h3>
            <p>读到大二下，我发现自己更想用数字分析问题。尽管老师、辅导员和家人起初并不支持，我还是转入了数据科学与大数据技术专业。</p>
            <div className="turning-point-result"><strong>2<span>年</span></strong><p>修完新专业<br /><b>四年学分</b></p></div>
            <p className="turning-point-awards">转专业后参加多次数学建模竞赛，获得 MathorCup 全国二等奖、长三角二等奖及校赛一等奖。</p>
            <a href="#work" onClick={() => setProjectGroup("data")}>看看我的获奖项目 <span aria-hidden="true">↗</span></a>
          </div>
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
            onClick={(event) => {
              // Mice burst it by sweeping over; taps and the keyboard toggle it.
              if ((event.nativeEvent as PointerEvent).pointerType === "mouse") return;
              setIdentityOpen(!identityOpen);
            }}
            aria-pressed={identityOpen}
            aria-label={identityOpen ? "收拢个人关键词" : "展开个人关键词"}
          >
            <canvas ref={glyphCanvasRef} className="particle-mask-canvas" aria-hidden="true" />
            <span ref={shockRef} className="identity-shock" aria-hidden="true" />
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

      <WorkGallery projects={projects} group={projectGroup} onGroupChange={setProjectGroup} surprise={surprise} onCursorHostChange={setCursorHost} />





      <PhotoDesk />
    </main>
  );
}
