"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import SiteIntro from "./SiteIntro";
import "./ImpactHero.css";

// The 8s opening reel (SiteIntro) plays once per tab session and hands off onto this poster.
const INTRO_KEY = "anyan-reel-intro-v1";

export default function ImpactHero({ onIntroCompleteChange }: { onIntroCompleteChange: (complete: boolean) => void }) {
  const [cartoon, setCartoon] = useState(false);
  const [reel, setReel] = useState<"gate" | "play" | null>(null);
  const [handoff, setHandoff] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const handoffTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const greetingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playing = reel !== null;

  const finishIntro = useCallback(() => {
    setReel(null);
    onIntroCompleteChange(true);
    try { sessionStorage.setItem(INTRO_KEY, "seen"); } catch { /* Storage is optional. */ }
    // The reel ends on this exact poster; the portrait and copy then step in.
    setHandoff(true);
    if (handoffTimer.current) clearTimeout(handoffTimer.current);
    handoffTimer.current = setTimeout(() => setHandoff(false), 1300);
  }, [onIntroCompleteChange]);

  // Replay is itself a click, so the reel can skip the gate and start with sound.
  const playIntro = useCallback(() => {
    setReel("play");
    onIntroCompleteChange(false);
  }, [onIntroCompleteChange]);

  // Decide before the first paint, so the poster never flashes ahead of the gate.
  useLayoutEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(INTRO_KEY) === "seen"; } catch { /* Storage is optional. */ }
    const deepLink = window.location.hash !== "" && window.location.hash !== "#top";
    if (seen || deepLink) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads sessionStorage, which only exists on the client
    setReel("gate");
    onIntroCompleteChange(false);
  }, [onIntroCompleteChange]);

  useEffect(() => () => {
    if (handoffTimer.current) clearTimeout(handoffTimer.current);
    if (greetingTimer.current) clearTimeout(greetingTimer.current);
  }, []);

  const heroName = useCallback(() => nameRef.current, []);

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
    <section id="top" className={`impact-hero${playing ? " is-reeling" : handoff ? " is-handoff" : ""}`} data-portrait={cartoon ? "cartoon" : "photo"} aria-label="安颜的个人主页">
      <div
        className="impact-stage"
        ref={stageRef}
        onPointerMove={movePortrait}
        onPointerLeave={() => {
          stageRef.current?.style.setProperty("--poster-x", "0px");
          stageRef.current?.style.setProperty("--poster-y", "0px");
        }}
      >
        <h1 className="impact-name" ref={nameRef} aria-label="安颜 · Yan An"><span>安</span><span>颜</span></h1>
        <figure className="impact-portrait">
          <div className="impact-portrait-motion">
            <img className="impact-photo" src="./photos/portrait-outline.webp" width="1207" height="1303" fetchPriority="high" alt="安颜的描边人像照片" aria-hidden={cartoon} />
            <img className="impact-cartoon" src="./photos/guide-actions-v2/present.png" width="164" height="280" decoding="async" alt="黑白简约风格的小安" aria-hidden={!cartoon} />
          </div>
        </figure>
        <div className="impact-copy">
          <p className="impact-eyebrow">STATISTICS × AI PRODUCT</p>
          <p className="impact-statement">研究数据，<br />也做产品。</p>
          <a className="impact-contact" href="mailto:anyan001121@gmail.com">联系我 ↗</a>
        </div>
        <button type="button" className={`impact-mascot${greeting ? " is-greeting" : ""}`} onClick={greet} aria-label="让小人打个招呼">
          <img src="./photos/guide-actions-v2/present.png" width="164" height="280" alt="" />
          <span className="impact-hello" aria-hidden="true">嗨，这是我！</span>
        </button>
        <button type="button" className="impact-switch" onClick={() => setCartoon((current) => !current)} aria-pressed={cartoon} aria-label={cartoon ? "切换回真人照片" : "切换为小安"}>
          <small>ANOTHER ME</small><strong>{cartoon ? "真实的我" : "小安"}</strong><span aria-hidden="true">↗</span>
        </button>
        <p className="impact-caption" aria-live="polite"><span>{cartoon ? "02 / XIAO AN" : "01 / THE REAL ME"}</span><span>PORTFOLIO · 2026</span></p>
      </div>
      <div className="impact-foot">
        <div><em>Ideas into things.</em><a href="#work">进入我的作品 ↗</a></div>
        <button type="button" onClick={playIntro} disabled={playing} className="impact-replay">重播开场 ↗</button>
      </div>
      {reel && createPortal(<SiteIntro key={reel} startPlaying={reel === "play"} heroName={heroName} onDone={finishIntro} />, document.body)}
    </section>
  );
}
