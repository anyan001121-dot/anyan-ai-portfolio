"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Project, ProjectId } from "./projects";
import { entries, skills, skillIds, worksFor, projectsFor, type SkillId } from "./skillMap";
import ProjectMaterials from "./ProjectMaterials";
import "./SkillExhibit.css";

type Selection = { skill: SkillId; project: ProjectId; frame: number };
const initial: Selection = { skill: "product", project: "focus", frame: 0 };
const number = (n: number) => String(n).padStart(2, "0");

function fromAddress(): Selection {
  if (typeof window === "undefined") return initial;
  const params = new URLSearchParams(window.location.search);
  const skill = skillIds.find(id => id === params.get("skill")) ?? initial.skill;
  const choices = projectsFor(skill);
  const project = choices.find(id => id === params.get("project")) ?? choices[0];
  const page = Number(params.get("frame"));
  const frame = entries[project].frames?.findIndex((f, i) => (f.linkPage ?? i + 1) === page) ?? -1;
  return { skill, project, frame: Math.max(0, frame) };
}

export default function SkillExhibit({ projects, onOpen }: { projects: Project[]; onOpen: (index: number) => void }) {
  const [choice, setChoice] = useState(fromAddress);
  const [related, setRelated] = useState<ProjectId | null>(null);
  const { skill, project, frame } = choice;
  const group = skills[skill];
  const ids = projectsFor(skill);
  const item = entries[project];
  const index = projects.findIndex(p => p.id === project);
  const record = projects[index];
  const plate = item.frames?.[frame];
  const body = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const host = useRef<HTMLImageElement>(null);
  const previous = useRef<Map<string, DOMRect> | null>(null);

  useEffect(() => {
    const restore = () => { previous.current = null; setChoice(fromAddress()); setRelated(null); };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  function select(next: Selection) {
    if (next.skill === skill && next.project === project && next.frame === frame) return;
    if (next.skill !== skill && body.current) {
      previous.current = new Map(Array.from(body.current.querySelectorAll<HTMLButtonElement>("[data-work]"),
        node => [node.dataset.work!, node.getBoundingClientRect()]));
      setRelated(null);
    }
    if ((next.skill !== skill || next.project !== project) && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      host.current?.animate([{ rotate: "0deg" }, { rotate: "-5deg", offset: .45 }, { rotate: "0deg" }], { duration: 380 });
    }
    const url = new URL(window.location.href);
    url.hash = "skills";
    url.searchParams.set("skill", next.skill);
    url.searchParams.set("project", next.project);
    if (next.frame) url.searchParams.set("frame", String(entries[next.project].frames?.[next.frame]?.linkPage ?? next.frame + 1));
    else url.searchParams.delete("frame");
    window.history.pushState(null, "", url);
    setChoice(next);
  }

  function chooseSkill(next: SkillId) {
    const works = projectsFor(next);
    const keep = works.includes(project);
    select({ skill: next, project: keep ? project : works[0], frame: keep ? frame : 0 });
  }

  useLayoutEffect(() => {
    const section = body.current;
    if (!section) return;
    const selected = section.querySelector<HTMLElement>('[data-skill][aria-pressed="true"]')!;
    const card = section.querySelector<HTMLElement>('[data-work][aria-pressed="true"]')!;
    const draw = () => {
      const origin = section.getBoundingClientRect();
      const a = selected.getBoundingClientRect(), b = card.getBoundingClientRect();
      const x = a.right - origin.left, y = a.top + a.height / 2 - origin.top;
      const end = b.left - origin.left, tip = b.top - origin.top + b.height / 2;
      const bend = Math.max(20, (end - x) * .48);
      line.current?.setAttribute("d", `M${x} ${y} C${x + bend} ${y} ${end - bend} ${tip} ${end} ${tip}`);
    };
    draw();
    const observer = new ResizeObserver(draw);
    [section, selected, card].forEach(node => observer.observe(node));
    const old = previous.current;
    previous.current = null;
    const animations: Animation[] = [];
    if (old && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.dataset.settling = "true";
      section.querySelectorAll<HTMLElement>("[data-work]").forEach(node => {
        const before = old.get(node.dataset.work!), after = node.getBoundingClientRect();
        const x = before ? before.left - after.left : 0;
        const y = before ? before.top - after.top : 10;
        animations.push(node.animate([{ translate: `${x}px ${y}px`, opacity: before ? 1 : .45 }, { translate: "0 0", opacity: 1 }],
          { duration: 440, easing: "cubic-bezier(.2,.76,.2,1)" }));
      });
    }
    let active = true;
    Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
      if (active) { draw(); delete section.dataset.settling; }
    });
    return () => { active = false; observer.disconnect(); animations.forEach(animation => animation.cancel()); delete section.dataset.settling; };
  }, [skill, project]);

  return <section className="skill-exhibit" id="skills" aria-labelledby="ex-title">
    <header className="ex-heading">
      <div><span className="ex-kicker">PROJECT NOTES</span><h3 id="ex-title">能力与作品<span className="work-title-dot">.</span></h3><p>选一个方向，看看我具体做了什么。</p></div>
      <img ref={host} src="./photos/portrait-cartoon-simple.webp" width="102" height="110" alt="" loading="lazy" />
    </header>
    <div className="ex-stage" ref={body}>
      <div className="ex-choices" role="group" aria-label="按能力看项目">
        {skillIds.map((id, i) => <button type="button" key={id} data-skill={id} aria-pressed={id === skill}
          data-related={related !== null && related in worksFor(id)} onClick={() => chooseSkill(id)}
          onKeyDown={e => {
            const key = e.key;
            if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(key)) return;
            e.preventDefault();
            const step = key === "ArrowDown" || key === "ArrowRight" ? 1 : -1;
            const next = key === "Home" ? 0 : key === "End" ? skillIds.length - 1 : (i + step + skillIds.length) % skillIds.length;
            body.current?.querySelector<HTMLButtonElement>(`[data-skill="${skillIds[next]}"]`)?.focus();
            chooseSkill(skillIds[next]);
          }}><span>{skills[id].name}</span><small>{number(projectsFor(id).length)}</small></button>)}
      </div>
      <svg className="ex-wire" aria-hidden="true"><path ref={line}/></svg>
      <div className="ex-cards" role="group" aria-label={group.name + "相关作品"}>
        {ids.map((id, i) => {
          const info = entries[id];
          const p = projects.find(candidate => candidate.id === id)!;
          return <button type="button" key={id} data-work={id} className="ex-card" aria-pressed={id === project}
            onPointerEnter={() => setRelated(id)} onPointerLeave={() => setRelated(null)}
            onFocus={() => setRelated(id)} onBlur={() => setRelated(null)}
            onClick={() => select({skill, project:id, frame: id === project ? frame : 0})}>
            <span className="ex-marker" aria-hidden="true">
              {info.cover ? <img src={info.cover} alt="" loading="lazy"/> : id === "qar" ?
                <img src="./photos/project-flat-v1/qar-plane.png" alt="" loading="lazy"/> :
                <span className="ex-metric">{p.metric}</span>}
            </span>
            <span className="ex-project-text"><small>{number(i + 1)} / {p.year}</small><strong>{info.title}</strong><span className="ex-subtitle">{p.subtitle}</span></span>
            <span className="ex-card-foot"><span className="sr-only">{id === project ? "正在看" : "看我的工作"}</span><span aria-hidden="true">{id === project ? "↓" : "↗"}</span></span>
          </button>;
        })}
      </div>
    </div>
    <div className="ex-work">
      <div className="ex-work-copy"><small className="ex-kicker">{group.name} / 我的工作</small><h4>{item.title}</h4>
        <p>{worksFor(skill)[project]}</p><small className="ex-status">{item.status}</small></div>
      <div className="ex-methods"><small className="ex-kicker">用到的方法</small><p>{record.brief.method}</p>
        <button type="button" onClick={() => onOpen(index)}>看完整项目 ↗</button>
        {(record.liveUrl || record.url) && <a href={project === "olist" ? record.url : record.liveUrl || record.url} target="_blank" rel="noreferrer">
          {project === "olist" ? "看原始分析" : record.liveUrl ? "打开应用" : "看源码"} ↗</a>}</div>
    </div>
    <ProjectMaterials project={record} frame={frame} onSelect={n => select({...choice, frame:n})} />
    {project === "olist" && <div className="ex-sql"><small className="ex-kicker">先按订单算金额 · SQL 摘编</small><pre><code>{"SELECT order_id, SUM(price + freight_value) AS order_amount\nFROM ods_order_items GROUP BY order_id;"}</code></pre></div>}
    <details className="ex-process" key={skill + project}><summary>我怎么做的</summary><ol>{item.process.map(step => <li key={step}>{step}</li>)}</ol></details>
    <span className="sr-only" role="status">{group.name}，{item.title}{plate ? "，" + plate.label : ""}。</span>
  </section>;
}
