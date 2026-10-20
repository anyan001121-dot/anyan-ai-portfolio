"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createIntroSound, type IntroSound } from "./introSound";
import "./SiteIntro.css";

/*
 * 12-second opening reel.
 * Grid: 120 BPM → one beat = 0.5s; six shots of exactly one bar (4 beats) each.
 * Every shot follows the same rhythm — the cut and the big word on beat 1,
 * then one action per beat — and the hand-off to the hero lands on beat 24, a downbeat.
 * One accent element (the site's title-dot colour) — "the thread" — travels through
 * every shot: the period after "signal", the mean line, the strike through
 * CORRELATION, the periods after SHIPPED, MATTERS and Yan An, then blooms into the
 * poster behind 安颜.
 * Sync: CSS shots, the thread, the bloom and the audio are all pinned to one start
 * time (`zero`, on the page's clock), snapped to the gate's pulse so the beat never breaks.
 */

const BEAT = 500;
const BEATS = 24;
const TOTAL_MS = BEAT * BEATS;
const LEAD_MS = 180; // let the first frame render before beat 0
const EASE = "cubic-bezier(.16, 1, .3, 1)";
const STAGE_ZOOM = 0.04; // ambient push-in over beats 0–22 (SiteIntro.css), so no frame ever sits still

const at = (beat: number, extra?: Record<string, string | number>) => ({ "--b": beat, ...extra }) as CSSProperties;

/** Per-letter reveal: the whole word starts on its beat, letters ripple 12ms apart. */
function Letters({ text, beat }: { text: string; beat: number }) {
  return (
    <span className="ri-letters">
      {Array.from(text).map((character, index) => (
        <span className="ri-fx ri-letter" style={at(beat, { "--i": index })} key={index}>
          {character === " " ? " " : character}
        </span>
      ))}
    </span>
  );
}

/** Invisible period whose position the thread lands on. */
const Dot = ({ id }: { id: string }) => <span className="ri-dot-anchor" data-anchor={id}>.<i /></span>;

function Shot({ from, tone = "paper", last = false, children }: { from: number; tone?: "paper" | "ink"; last?: boolean; children: ReactNode }) {
  return (
    <section className={`ri-shot ri-${tone}${last ? " ri-last" : ""}`} style={{ "--from": from } as CSSProperties}>
      <div className="ri-shot-inner">{children}</div>
    </section>
  );
}

type Box = { x: number; y: number; w: number; h: number; o: number };

/** Thread keyframes, measured from the laid-out shots (stage coordinates). */
function buildThread(stage: HTMLElement, reduce: boolean) {
  const base = stage.getBoundingClientRect();
  const rect = (el: Element) => {
    const r = el.getBoundingClientRect();
    return { left: r.left - base.left, top: r.top - base.top, width: r.width, height: r.height, right: r.right - base.left };
  };
  const dot = (id: string): Box => {
    const anchor = stage.querySelector(`[data-anchor="${id}"]`)!;
    const baseline = anchor.querySelector("i")!.getBoundingClientRect().top - base.top;
    const r = rect(anchor);
    const d = parseFloat(getComputedStyle(anchor).fontSize) * 0.15;
    return { x: r.left + r.width / 2, y: baseline - d / 2, w: d, h: d, o: 1 };
  };
  const above = (b: Box) => ({ ...b, y: b.y - b.w * 5 }); // hovers over its period, then drops in
  const curve = rect(stage.querySelector(".ri-curve")!);
  const lw = Math.max(2.5, (curve.width / 800) * 3.5);
  const peakY = curve.top + curve.height * (6 / 150);
  const baseY = curve.top + curve.height * (148 / 150);
  const mid = curve.left + curve.width / 2;
  const struck = rect(stage.querySelector(".ri-struck")!);
  const t = Math.min(9, Math.max(3, base.width * 0.0055));
  const sy = struck.top + struck.height * 0.53;
  const sl = struck.left - struck.width * 0.02;
  const sr = struck.right + struck.width * 0.02;
  const shipped = dot("shipped");
  const matters = dot("matters");
  const name = dot("name");

  const center: Box = { x: base.width / 2, y: base.height / 2, w: 14, h: 14, o: 1 };
  const steps: [number, Box, "move" | "set"][] = [
    [0, { ...center, w: 0, h: 0, o: 0 }, "move"],                                   // PORTFOLIO lands on it
    [3, { ...dot("signal"), w: 0, h: 0 }, "set"],
    [3, dot("signal"), "move"],                                                      // "signal."
    [4, { x: mid, y: peakY, w: lw * 2.4, h: lw * 2.4, o: 1 }, "move"],               // cut: rides to the peak
    [6, { x: mid, y: (peakY + baseY) / 2, w: lw, h: baseY - peakY, o: 1 }, "move"],  // drops into the mean line
    [8, { x: sl + t, y: sy, w: t * 2, h: t * 2, o: 1 }, "move"],                     // cut: waits at CORRELATION
    [9, { x: (sl + sr) / 2, y: sy, w: sr - sl, h: t, o: 1 }, "move"],                // strikes it out
    [12, above(shipped), "move"],                                                    // cut: hovers
    [14, shipped, "move"],                                                           // becomes the period of SHIPPED.
    [16, above(matters), "move"],                                                    // cut: hovers
    [18, matters, "move"],                                                           // of MATTERS.
    [20, name, "move"],                                                              // cut: of Yan An.
    [22, { ...name, o: 0 }, "set"],                                                  // hands over to the bloom
  ];

  const frames: Keyframe[] = [];
  let last = 0;
  const push = (time: number, b: Box, easing = "linear") => {
    const ms = Math.max(time, last); // a "set" and a "move" can share a beat; keep offsets in order
    last = ms;
    frames.push({
      offset: Math.min(1, ms / TOTAL_MS),
      transform: `translate(${b.x - b.w / 2}px, ${b.y - b.h / 2}px)`,
      width: `${b.w}px`,
      height: `${b.h}px`,
      opacity: b.o,
      easing,
    });
  };
  let current = center;
  push(0, current);
  for (const [beat, next, kind] of steps) {
    const start = beat * BEAT;
    if (kind === "set") {
      push(start, current);
      push(start + 1, next);
    } else if (reduce) {
      // Calmer fallback: no travel — fade out, jump while invisible, fade in.
      push(start, current, "ease");
      push(start + 160, { ...current, o: 0 });
      push(start + 161, { ...next, o: 0 }, "ease");
      push(start + 400, next);
    } else {
      push(start, current, EASE);
      push(start + 380, next);
    }
    current = next;
  }
  push(TOTAL_MS, current);
  return { frames, bloom: name };
}

export default function SiteIntro({ startPlaying, heroName, onDone }: { startPlaying: boolean; heroName: () => HTMLElement | null; onDone: (skipped: boolean) => void }) {
  const [phase, setPhase] = useState<"gate" | "play">(startPlaying ? "play" : "gate");
  const [measuring, setMeasuring] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLSpanElement>(null);
  const floodRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const gateDotRef = useRef<HTMLSpanElement>(null);
  const soundRef = useRef<IntroSound | null>(null);
  const wantSoundRef = useRef(true);
  const doneRef = useRef(false);
  const pendingRef = useRef<(() => void) | null>(null);
  const gatePulseRef = useRef<number | null>(null);
  const zeroRef = useRef<number | null>(null);

  const startSound = useCallback(() => {
    const zero = zeroRef.current;
    if (zero === null) return;
    const sound = soundRef.current ?? createIntroSound();
    if (!sound) return;
    soundRef.current = sound;
    void sound.context.resume().then(() => {
      if (soundRef.current !== sound || doneRef.current) return;
      sound.start(zero);
      setSoundOn(true);
    });
  }, []);

  const stopSound = useCallback((fade?: number) => {
    soundRef.current?.stop(fade);
    soundRef.current = null;
    setSoundOn(false);
  }, []);

  const end = useCallback((skipped: boolean) => {
    if (doneRef.current) return;
    doneRef.current = true;
    // A skip cuts the sound; a natural ending lets the last chord ring into the hero.
    if (skipped) stopSound(0.25);
    else window.setTimeout(() => stopSound(1.2), 600);
    setLeaving(true);
    window.setTimeout(() => onDone(skipped), skipped ? 380 : 260);
  }, [onDone, stopSound]);

  const play = useCallback((withSound: boolean) => {
    wantSoundRef.current = withSound;
    // Remember the gate's pulse so beat 0 lands on its grid and the beat never breaks.
    const pulse = gateDotRef.current?.getAnimations()[0]?.startTime;
    gatePulseRef.current = typeof pulse === "number" ? pulse : null;
    if (withSound && !soundRef.current) {
      // Create the audio context inside the click so the browser allows it.
      soundRef.current = createIntroSound();
      void soundRef.current?.context.resume();
    }
    setPhase("play");
  }, []);

  // Take the palette from the live site: hero background, title ink, and the title-dot accent.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const name = heroName();
    if (!root || !name) return;
    const hero = name.closest(".impact-hero");
    const dot = document.querySelector(".work-title-dot");
    if (hero) root.style.setProperty("--ri-poster", getComputedStyle(hero).backgroundColor);
    root.style.setProperty("--ri-ink", getComputedStyle(name).color);
    if (dot) root.style.setProperty("--ri-accent", getComputedStyle(dot).color);
  }, [heroName]);

  // Measure the laid-out shots and the hero title with all animations off.
  useLayoutEffect(() => {
    if (phase !== "play" || !measuring) return;
    window.scrollTo(0, 0);
    const root = rootRef.current;
    const stage = stageRef.current;
    const thread = threadRef.current;
    const flood = floodRef.current;
    if (!root || !stage || !thread || !flood) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      const { frames, bloom } = buildThread(stage, reduce);

      // The final 安颜 copies the hero title's exact boxes and type, so the hand-off is invisible.
      const name = heroName();
      const layer = nameRef.current;
      if (name && layer) {
        Array.from(name.children).forEach((source, index) => {
          const target = layer.children[index] as HTMLElement | undefined;
          if (!target) return;
          const r = source.getBoundingClientRect();
          const cs = getComputedStyle(source);
          Object.assign(target.style, {
            left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`,
            fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight,
            lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, color: cs.color,
          });
        });
      }

      const zoom = 1 + STAGE_ZOOM;
      const fx = window.innerWidth / 2 + (bloom.x - window.innerWidth / 2) * zoom;
      const fy = window.innerHeight / 2 + (bloom.y - window.innerHeight / 2) * zoom;
      const style = getComputedStyle(root);
      const accent = style.getPropertyValue("--ri-accent").trim();
      const poster = style.getPropertyValue("--ri-poster").trim();
      const far = Math.hypot(Math.max(fx, window.innerWidth - fx), Math.max(fy, window.innerHeight - fy));
      pendingRef.current = () => {
        thread.animate(frames, { duration: TOTAL_MS, fill: "both" });
        flood.animate(
          reduce
            ? [{ opacity: 0 }, { opacity: 1 }]
            : [
                // The period blooms: it opens out of the accent and settles into the poster colour.
                { clipPath: `circle(0px at ${fx}px ${fy}px)`, backgroundColor: accent },
                { clipPath: `circle(${far}px at ${fx}px ${fy}px)`, backgroundColor: poster },
              ],
          { duration: 440, delay: 22 * BEAT, easing: reduce ? "ease" : "cubic-bezier(.7,0,.2,1)", fill: "both" },
        );
      };
    } catch {
      // The thread is decoration; if measuring fails the reel still plays without it.
      pendingRef.current = null;
    }
    setMeasuring(false);
  }, [phase, measuring, heroName]);

  // Animations are live now. Pin every one of them — CSS shots, thread, bloom — and the audio to one start time.
  useLayoutEffect(() => {
    if (phase !== "play" || measuring || zeroRef.current !== null) return;
    const root = rootRef.current;
    if (!root) return;
    try {
      pendingRef.current?.();
    } catch {
      // Never let decoration take the page down.
    }
    pendingRef.current = null;
    let zero = Number(document.timeline.currentTime ?? performance.now()) + LEAD_MS;
    const pulse = gatePulseRef.current;
    if (pulse !== null) zero = pulse + Math.ceil((zero - pulse) / BEAT) * BEAT;
    zeroRef.current = zero;
    root.getAnimations({ subtree: true }).forEach((animation) => {
      if (animation.effect?.getTiming().iterations === Infinity) return; // the sound meter keeps its own time
      animation.startTime = zero;
    });
    if (wantSoundRef.current) startSound();
  }, [phase, measuring, startSound]);

  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") end(true);
      else if (phase === "gate" && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        play(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [phase, end, play]);

  useEffect(() => {
    if (phase !== "play") return;
    // Fallback in case animationend never fires (background tab, etc.).
    const timer = window.setTimeout(() => end(false), TOTAL_MS + LEAD_MS + BEAT + 600);
    return () => window.clearTimeout(timer);
  }, [phase, end]);

  useEffect(() => () => {
    soundRef.current?.stop(0.4);
    soundRef.current = null;
  }, []);

  const toggleSound = () => {
    if (soundOn) {
      wantSoundRef.current = false;
      stopSound(0.15);
    } else {
      wantSoundRef.current = true;
      startSound();
    }
  };

  return (
    <div ref={rootRef} className={`reel-intro is-${phase}${measuring ? " is-measuring" : ""}${leaving ? " is-leaving" : ""}`}>
      {phase === "gate" ? (
        <div className="ri-gate">
          <span className="ri-brand">AY · 2026</span>
          <span className="ri-tempo">120 BPM · 12 SEC</span>
          <span className="ri-gate-dot" ref={gateDotRef} aria-hidden="true" />
          {/* The whole screen is the play button; the two quiet options sit above it. */}
          <button className="ri-gate-play" type="button" onClick={() => play(true)}>
            <span>点击开始</span>
            <small>CLICK TO PLAY · 建议开启声音</small>
          </button>
          <div className="ri-gate-alt">
            <button type="button" onClick={() => play(false)}>静音播放 MUTED</button>
            <button type="button" onClick={() => end(true)}>跳过开场 SKIP</button>
          </div>
        </div>
      ) : (
        <>
          <div className="ri-stage" ref={stageRef} aria-hidden="true">
            {/* Bar 1 — PORTFOLIO lands, folds into a label; the hook drops one word per beat */}
            <Shot from={0}>
              <p className="ri-portfolio" style={at(1)}><Letters text="PORTFOLIO" beat={0} /></p>
              <div className="ri-hook-wrap">
                <p className="ri-hook">
                  <span className="ri-fx ri-drop" style={at(1)}>I</span>
                  <span className="ri-fx ri-drop" style={at(2)}>find the</span>
                  <span className="ri-fx ri-drop" style={at(3)}>signal<Dot id="signal" /></span>
                </p>
                <p className="ri-zh ri-hook-zh ri-fx ri-fade" style={at(3)}>在噪声里，找到信号</p>
              </div>
            </Shot>

            {/* Bar 2 — statistics: word · curve · mean line · degree */}
            <Shot from={4}>
              <h2 className="ri-mega"><Letters text="STATISTICS" beat={4} /></h2>
              <svg className="ri-curve" viewBox="0 0 800 150">
                <path
                  className="ri-fx ri-draw"
                  style={at(5)}
                  pathLength={1}
                  d="M0 148 C 220 148, 300 146, 340 96 C 370 56, 382 6, 400 6 C 418 6, 430 56, 460 96 C 500 146, 580 148, 800 148"
                />
              </svg>
              <p className="ri-zh ri-fx ri-rise" style={at(7)}>统计学硕士</p>
              <p className="ri-caption ri-fx ri-fade" style={at(7)}>MSc STATISTICS — UNIVERSITY OF GLASGOW</p>
            </Shot>

            {/* Bar 3 — correlation · struck out · causation · 相关不等于因果 */}
            <Shot from={8}>
              <span className="ri-struck">
                <span className="ri-big ri-dim" style={at(9)}><Letters text="CORRELATION" beat={8} /></span>
              </span>
              <span className="ri-big"><Letters text="CAUSATION" beat={10} /></span>
              <p className="ri-zh ri-fx ri-rise" style={at(11)}>相关，不等于因果</p>
              <p className="ri-caption ri-fx ri-fade" style={at(11)}>CAUSAL INFERENCE — PSM · REGRESSION</p>
            </Shot>

            {/* Bar 4 — idea · prototype · shipped · 把想法做成产品 */}
            <Shot from={12}>
              <p className="ri-label ri-fx ri-fade" style={at(12)}>AI PRODUCT · AI 产品</p>
              <div className="ri-slot">
                <span className="ri-fx ri-swap" style={at(12)}>IDEA</span>
                <span className="ri-fx ri-swap" style={at(13)}>PROTOTYPE</span>
                <span className="ri-fx ri-rise" style={at(14)}>SHIPPED<Dot id="shipped" /></span>
              </div>
              <p className="ri-zh ri-fx ri-rise" style={at(15)}>把想法，做成产品</p>
              <p className="ri-caption ri-fx ri-fade" style={at(15)}>FOCUSFLOW · AYBOT / RAG</p>
            </Shot>

            {/* Bar 5 — the one ink shot, one line per beat */}
            <Shot from={16} tone="ink">
              <p className="ri-lines">
                <span className="ri-fx ri-rise" style={at(16)}>ARGUE</span>
                <span className="ri-fx ri-rise" style={at(17)}>LIKE IT</span>
                <span className="ri-fx ri-rise" style={at(18)}>MATTERS<Dot id="matters" /></span>
              </p>
              <p className="ri-zh ri-fx ri-rise" style={at(19)}>争鸣杯 · 全程最佳辩手</p>
            </Shot>

            {/* Bar 6 — Yan An. · sign · the dot blooms into the poster · 安颜 lands; hand-off on beat 24 */}
            <Shot from={20} last>
              <h1 className="ri-name"><Letters text="Yan An" beat={20} /><Dot id="name" /></h1>
              <p className="ri-sign ri-fx ri-fade" style={at(21)}>统计学 × 因果推断 × AI 产品</p>
            </Shot>

            <span className="ri-thread" ref={threadRef} />
          </div>

          <div className="ri-flood" ref={floodRef} aria-hidden="true" />
          <div className="ri-hero-name" ref={nameRef} aria-hidden="true">
            <span className="ri-fx ri-slam-l" style={at(23)}>安</span>
            <span className="ri-fx ri-slam-r" style={at(23)}>颜</span>
          </div>

          <div className="ri-chrome" aria-hidden="true">
            <span className="ri-brand">AY · 2026</span>
            <span className="ri-tempo">120 BPM</span>
            <span className="ri-beats">
              <i style={at(0)} />
              <i style={at(1)} />
              <i style={at(2)} />
              <i style={at(3)} />
            </span>
            <span
              className="ri-progress"
              onAnimationEnd={(event) => {
                if (event.animationName === "ri-progress") end(false);
              }}
            />
          </div>
          <div className="ri-controls">
            <button className="ri-sound" type="button" onClick={toggleSound} aria-pressed={soundOn}>
              <span className="ri-eq" aria-hidden="true"><i /><i /><i /></span>
              {soundOn ? "SOUND ON" : "SOUND OFF"}
            </button>
            <button className="ri-skip" type="button" onClick={() => end(true)}>
              跳过 SKIP
            </button>
          </div>
        </>
      )}
    </div>
  );
}
