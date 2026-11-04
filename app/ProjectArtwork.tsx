/* eslint-disable @next/next/no-img-element */
import type { Project } from "./projects";

export default function ExhibitArt({ project }: { project: Project }) {
  if (project.preview === "focusflow") return <div className="focus-art flat-focus" aria-hidden="true">
    <p>开始不了，<br />先做一小步。</p>
    <img src="./photos/project-flat-v1/focusflow.png" width="1448" height="1086" alt="" loading="lazy" decoding="async" />
    <span className="art-caption">ONE THING AT A TIME.</span>
  </div>;
  if (project.preview === "mood-diary") return <div className="garden-art" aria-hidden="true"><span className="garden-label">HOW ARE YOU, REALLY?</span><div className="garden-sun"/><img src="./photos/mood-diary/sunflower.webp" alt="" loading="lazy"/><img src="./photos/mood-diary/tulip.webp" alt="" loading="lazy"/><img src="./photos/mood-diary/low-flower.webp" alt="" loading="lazy"/><span className="garden-note">记录今天的心情。</span></div>;
  if (project.title.startsWith("QAR")) return <div className="radar-art flat-radar" aria-hidden="true">
    <div className="flat-flight-scene">
      <img className="qar-cloud-wide" src="./photos/project-flat-v1/qar-cloud-wide.png" width="1448" height="1086" alt="" loading="lazy" decoding="async" />
      <img className="qar-cloud-small" src="./photos/project-flat-v1/qar-cloud-small.png" width="1448" height="1086" alt="" loading="lazy" decoding="async" />
      <img className="qar-plane" src="./photos/project-flat-v1/qar-plane.png" width="1448" height="1086" alt="" loading="lazy" decoding="async" />
    </div>
    <span className="radar-coordinate">QAR / SIGNAL FOUND</span><strong>5<small>项</small></strong><span className="radar-caption">关键飞行指标</span><span className="award-stamp">MATHORCUP<br/>全国二等奖</span>
  </div>;
  return <div className={`archive-art art-${project.tone}`} aria-hidden="true"><span className="archive-orbit"/><strong>{project.metric}</strong><small>{project.metricLabel}</small><span className="archive-code">{project.year} / RESEARCH NOTES</span></div>;
}
