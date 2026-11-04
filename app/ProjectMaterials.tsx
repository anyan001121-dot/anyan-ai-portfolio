"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { Project } from "./projects";
import { entries } from "./skillMap";
import ExhibitArt from "./ProjectArtwork";

type Props = { project: Project; frame?: number; onSelect?: (index: number) => void };

export default function ProjectMaterials({ project, frame, onSelect }: Props) {
  const [localFrame, setLocalFrame] = useState(0);
  const item = entries[project.id];
  const index = frame ?? localFrame;
  const frames = item.frames;
  if (!frames?.length) {
    return <figure className="ex-material ex-original" aria-label={item.title + "的项目封面"}>
      <ExhibitArt project={project}/>
      <figcaption><p>{project.metric} · {project.metricLabel}</p><small>{project.id === "qar" ? "QAR 航空安全 · 原项目插画" : "项目结果 · 原主页指标图示"}</small></figcaption>
    </figure>;
  }
  const current = frames[index];
  return <figure className="ex-material" aria-label={item.title + "的项目材料"}>
    <div className="ex-material-head"><span className="ex-kicker">{project.id === "olist" ? "分析图表" : project.id === "mood" ? "花与记录" : "项目素材"}</span>
      <span>{String(index + 1).padStart(2,"0")} / {String(frames.length).padStart(2,"0")}</span></div>
    <div className="ex-pages" role="group" aria-label="选择材料">{frames.map((f,n) =>
      <button type="button" key={f.image} aria-pressed={n === index} onClick={() => (onSelect ?? setLocalFrame)(n)}>{f.label}</button>)}</div>
    <div className="ex-plate"><a href={current.image} target="_blank" rel="noreferrer" aria-label={"打开大图：" + current.label}><img src={current.image} alt={item.title + " · " + current.label} loading="lazy" decoding="async"/></a></div>
    <figcaption><p>{current.caption}</p><small>{current.source || item.source}</small><a href={current.image} target="_blank" rel="noreferrer">看大图 ↗</a></figcaption>
  </figure>;
}
