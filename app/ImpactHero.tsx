"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import SiteIntro from "./SiteIntro";
import { Odometer } from "./Evidence";
import "./ImpactHero.css";

// The 8s opening reel (SiteIntro) plays once per tab session and hands off onto this poster.
const INTRO_KEY = "anyan-reel-intro-v1";

export default function ImpactHero({ onIntroCompleteChange }: { onIntroCompleteChange: (complete: boolean) => void }) {
  const [cartoon, setCartoon] = useState(true); // the cartoon greets first; the real photo is one click away
  const [reel, setReel] = useState<"gate" | "play" | null>(null);
  const [handoff, setHandoff] = useState(false);
  const [scan, setScan] = useState(0); // bumps on every portrait switch, replays the redraw sweep
  const [rollKey, setRollKey] = useState(0); // re-rolls the evidence numbers once the reel hands off
  const stageRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const handoffTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playing = reel !== null;

  const finishIntro = useCallback(() => {
    setReel(null);
    onIntroCompleteChange(true);
    try { sessionStorage.setItem(INTRO_KEY, "seen"); } catch { /* Storage is optional. */ }
    // The reel ends on this exact poster; the portrait and copy then step in.
    setHandoff(true);
    setRollKey((k) => k + 1);
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
  }, []);

  const heroName = useCallback(() => nameRef.current, []);

  // Depth parallax: each layer reads the pointer offset (-0.5…0.5) at its own depth in CSS.
  const moveDepth = (event: PointerEvent<HTMLDivElement>) => {
    if (playing || event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--px", ((event.clientX - bounds.left) / bounds.width - 0.5).toFixed(3));
    event.currentTarget.style.setProperty("--py", ((event.clientY - bounds.top) / bounds.height - 0.5).toFixed(3));
  };

  // The evidence strip opens project files that live in the work section.
  const openProject = (index: number) => window.dispatchEvent(new CustomEvent("open-project", { detail: index }));

  return (
    <section id="top" className={`impact-hero${playing ? " is-reeling" : handoff ? " is-handoff" : ""}`} data-portrait={cartoon ? "cartoon" : "photo"} aria-label="安颜的个人主页">
      <div
        className="impact-stage"
        ref={stageRef}
        onPointerMove={moveDepth}
        onPointerLeave={() => {
          stageRef.current?.style.setProperty("--px", "0");
          stageRef.current?.style.setProperty("--py", "0");
        }}
      >
        <h1 className="impact-name" ref={nameRef} aria-label="安颜 · Yan An"><span>安</span><span>颜</span></h1>
        <figure className="impact-portrait">
          <div className="impact-portrait-motion">
            <img className="impact-photo" src="./photos/portrait-outline.webp" width="1207" height="1303" decoding="async" alt="安颜的描边人像照片" aria-hidden={cartoon} />
            <img className="impact-cartoon" src="./photos/portrait-cartoon-simple.webp" width="1207" height="1303" fetchPriority="high" alt="安颜的卡通形象：挥手打招呼的小安" aria-hidden={!cartoon} />
            {scan > 0 && <span className="impact-scan" key={scan} aria-hidden="true" />}
          </div>
        </figure>
        <div className="impact-copy">
          <p className="impact-eyebrow">STATISTICS × AI PRODUCT</p>
          <p className="impact-statement">研究数据，<br />也做产品。</p>
          <a className="impact-contact" href="mailto:anyan001121@gmail.com">联系我 ↗</a>
        </div>
        <button type="button" className="impact-switch" onClick={() => { setCartoon((current) => !current); setScan((n) => n + 1); }} aria-pressed={cartoon} aria-label={cartoon ? "切换为真人照片" : "切换回卡通小安"}>
          <small>ANOTHER ME</small><strong>{cartoon ? "真实的我" : "小安"}</strong><span aria-hidden="true">↗</span>
        </button>
        <p className="impact-caption" aria-live="polite"><span>{cartoon ? "01 / XIAO AN" : "02 / THE REAL ME"}</span><span>PORTFOLIO · 2026</span></p>
      </div>
      <div className="impact-foot">
        <div className="impact-evidence" key={rollKey}>
          <em>Ideas into things.</em>
          <button type="button" onClick={() => openProject(3)} aria-label="MathorCup 全国二等奖，打开 QAR 航空安全模型项目">
            <strong>全国二等奖</strong><small>MATHORCUP 数学建模 ↗</small>
          </button>
          <button type="button" onClick={() => openProject(6)} aria-label="Olist 差评预警命中率为基线 2.43 倍，打开项目">
            <strong><Odometer value="2.43×" /></strong><small>OLIST 差评预警 / 基线 ↗</small>
          </button>
          <a href="#work"><strong><Odometer value="09" /></strong><small>个项目 · 进入作品 ↓</small></a>
        </div>
        <button type="button" onClick={playIntro} disabled={playing} className="impact-replay">重播开场 ↗</button>
      </div>
      {reel && createPortal(<SiteIntro key={reel} startPlaying={reel === "play"} heroName={heroName} onDone={finishIntro} />, document.body)}
    </section>
  );
}
