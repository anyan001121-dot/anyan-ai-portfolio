"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import "./ImpactHero.css";

const INTRO_KEY = "anyan-poster-intro-v1";
const INTRO_DURATION = 2100;

export default function ImpactHero({ onIntroCompleteChange }: { onIntroCompleteChange: (complete: boolean) => void }) {
  const [cartoon, setCartoon] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const introTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const greetingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finishIntro = useCallback(() => {
    if (introTimer.current) clearTimeout(introTimer.current);
    introTimer.current = null;
    setPlaying(false);
    onIntroCompleteChange(true);
    try { sessionStorage.setItem(INTRO_KEY, "seen"); } catch { /* Storage is optional. */ }
  }, [onIntroCompleteChange]);

  const playIntro = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (introTimer.current) clearTimeout(introTimer.current);
    setPlaying(true);
    onIntroCompleteChange(false);
    introTimer.current = setTimeout(finishIntro, INTRO_DURATION);
  }, [finishIntro, onIntroCompleteChange]);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(INTRO_KEY) === "seen"; } catch { /* Storage is optional. */ }
    const deepLink = window.location.hash !== "" && window.location.hash !== "#top";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = !seen && !deepLink && !reduceMotion ? setTimeout(playIntro, 0) : null;
    return () => {
      if (start) clearTimeout(start);
      if (introTimer.current) clearTimeout(introTimer.current);
      if (greetingTimer.current) clearTimeout(greetingTimer.current);
    };
  }, [playIntro]);

  useEffect(() => {
    if (!playing) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") finishIntro(); };
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => { if (motion.matches) finishIntro(); };
    window.addEventListener("keydown", onKey);
    motion.addEventListener("change", onMotion);
    return () => {
      window.removeEventListener("keydown", onKey);
      motion.removeEventListener("change", onMotion);
    };
  }, [playing, finishIntro]);

  const movePortrait = (event: PointerEvent<HTMLDivElement>) => {
    if (playing || event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--poster-x", `${((event.clientX - bounds.left) / bounds.width - 0.5) * 12}px`);
    event.currentTarget.style.setProperty("--poster-y", `${((event.clientY - bounds.top) / bounds.height - 0.5) * 8}px`);
  };

  const greet = () => {
    if (greetingTimer.current) clearTimeout(greetingTimer.current);
    setGreeting(true);
    greetingTimer.current = setTimeout(() => setGreeting(false), 1400);
  };

  return (
    <section id="top" className={`impact-hero${playing ? " is-opening" : ""}`} data-portrait={cartoon ? "cartoon" : "photo"} aria-label="安颜的个人主页">
      <div
        className="impact-stage"
        ref={stageRef}
        onPointerMove={movePortrait}
        onPointerLeave={() => {
          stageRef.current?.style.setProperty("--poster-x", "0px");
          stageRef.current?.style.setProperty("--poster-y", "0px");
        }}
      >
        <h1 className="impact-name" aria-label="安颜 · Yan An"><span>安</span><span>颜</span></h1>
        <figure className="impact-portrait">
          <div className="impact-portrait-motion">
            <img className="impact-photo" src="./photos/portrait-outline.webp" width="1207" height="1303" fetchPriority="high" alt="安颜的描边人像照片" aria-hidden={cartoon} />
            <img className="impact-cartoon" src="./photos/portrait-cartoon.webp" width="1207" height="1303" decoding="async" alt="安颜的卡通人像" aria-hidden={!cartoon} />
          </div>
        </figure>
        <div className="impact-copy">
          <p className="impact-eyebrow">STATISTICS × AI PRODUCT<br />ANALYTICAL MIND. CURIOUS EYES.</p>
          <p className="impact-statement">严谨地想，<br />自由地看。</p>
          <a className="impact-contact" href="mailto:anyan001121@gmail.com">联系我 ↗</a>
        </div>
        <button type="button" className={`impact-mascot${greeting ? " is-greeting" : ""}`} onClick={greet} aria-label="让小人打个招呼">
          <img src="./photos/guide-actions-v2/present.png" width="164" height="280" alt="" />
          <span className="impact-hello" aria-hidden="true">嗨，这是我！</span>
        </button>
        <button type="button" className="impact-switch" onClick={() => setCartoon((current) => !current)} aria-pressed={cartoon} aria-label={cartoon ? "切换回真人照片" : "切换为卡通人像"}>
          <small>ANOTHER ME</small><strong>{cartoon ? "真实的我" : "卡通的我"}</strong><span aria-hidden="true">↗</span>
        </button>
        <p className="impact-caption" aria-live="polite"><span>{cartoon ? "02 / MY CARTOON SELF" : "01 / THE REAL ME"}</span><span>PORTFOLIO · 2026</span></p>
      </div>
      <div className="impact-foot">
        <div><em>Ideas into things.</em><span>从判断，到行动。</span><a href="#work">进入我的作品 ↗</a></div>
        <button type="button" onClick={playIntro} disabled={playing} className="impact-replay">重播开场 ↗</button>
      </div>
      {playing && <>
        <div className="impact-shutter impact-shutter-top" aria-hidden="true" />
        <div className="impact-shutter impact-shutter-bottom" aria-hidden="true" />
        <div className="impact-intro-mark" aria-hidden="true">AY.<span>AN YAN — MORE THAN ONE SIDE</span></div>
        <button className="impact-skip" type="button" onClick={finishIntro}>跳过开场 ↗</button>
      </>}
    </section>
  );
}
