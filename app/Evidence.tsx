"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { Project } from "./projects";
import { skills } from "./skillMap";
import "./Evidence.css";

/** Rolls each digit of a metric up from 0, like an odometer; non-digits stay put. */
export function Odometer({ value }: { value: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <span className={`odo${on ? " is-on" : ""}`} aria-label={value} role="img">
      {Array.from(value).map((character, index) =>
        /\d/.test(character) ? (
          <span className="odo-digit" aria-hidden="true" key={index} style={{ "--d": character, "--i": index } as CSSProperties}>
            <span>{"0123456789".split("").map((n) => <i key={n}>{n}</i>)}</span>
          </span>
        ) : (
          <span className="odo-char" aria-hidden="true" key={index}>{character === " " ? " " : character}</span>
        ),
      )}
    </span>
  );
}

/** Letters flip in one after another whenever the text changes. */
export function FlipText({ text }: { text: string }) {
  return (
    <span className="flip-text" key={text} aria-hidden="true">
      {Array.from(text).map((character, index) => (
        <span key={index} style={{ "--i": index } as CSSProperties}>{character === " " ? " " : character}</span>
      ))}
    </span>
  );
}

/** Live time in Glasgow, so visitors know when a reply is likely. */
export function GlasgowClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => setTime(format.format(new Date()));
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 15000);
    return () => { window.clearTimeout(first); window.clearInterval(timer); };
  }, []);
  const [hh, mm] = time.split(":");
  return (
    <span className="glasgow-clock">
      <i aria-hidden="true" />格拉斯哥 · 现在 {time ? <time>{hh}<b aria-hidden="true">:</b>{mm}</time> : "--:--"}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Skill → evidence map                                               */
/* ------------------------------------------------------------------ */

type Point = { x: number; y: number };
type Geometry = { w: number; h: number; skills: Record<string, Point>; projects: Record<number, Point> };

const curve = (a: Point, b: Point) => {
  const dx = (b.x - a.x) * 0.5;
  return `M${a.x} ${a.y} C${a.x + dx} ${a.y} ${b.x - dx} ${b.y} ${b.x} ${b.y}`;
};

export function SkillMap({ projects, onOpen }: { projects: Project[]; onOpen: (index: number) => void }) {
  const [active, setActive] = useState(skills[0].key);
  const [hovered, setHovered] = useState<number | null>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const body = useRef<HTMLDivElement>(null);
  const skillNodes = useRef<Record<string, HTMLButtonElement | null>>({});
  const projectNodes = useRef<Record<number, HTMLElement | null>>({});

  const skill = skills.find((s) => s.key === active)!;
  const linked = Object.keys(skill.uses).map(Number);
  const hoveredSkills = hovered === null ? [] : skills.filter((s) => hovered in s.uses).map((s) => s.key);

  // Re-measure whenever the layout moves (resize, or rows opening and closing), so the curves follow every frame.
  useLayoutEffect(() => {
    const root = body.current;
    if (!root) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const base = root.getBoundingClientRect();
        const next: Geometry = { w: base.width, h: base.height, skills: {}, projects: {} };
        for (const s of skills) {
          const node = skillNodes.current[s.key];
          if (!node) continue;
          const r = node.getBoundingClientRect();
          next.skills[s.key] = { x: r.right - base.left, y: r.top + r.height / 2 - base.top };
        }
        projects.forEach((_, index) => {
          const node = projectNodes.current[index]?.querySelector(".sm-project-line");
          if (!node) return;
          const r = node.getBoundingClientRect();
          next.projects[index] = { x: r.left - base.left, y: r.top + r.height / 2 - base.top };
        });
        setGeo(next);
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    root.querySelectorAll(".sm-project").forEach((node) => observer.observe(node));
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [projects]);

  const moveSkill = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = skills[(index + keys[event.key] + skills.length) % skills.length];
    setActive(next.key);
    skillNodes.current[next.key]?.focus();
  };

  return (
    <section className="skill-map" aria-labelledby="skill-map-title">
      <header className="sm-head">
        <span>SKILL → EVIDENCE</span>
        <h3 id="skill-map-title">能力地图<span className="work-title-dot">.</span></h3>
        <p>点一个技能，看它在哪些项目里真正用过；悬停在项目上，可以反查它用到的技能。</p>
      </header>

      <div className="sm-body" ref={body} data-active={active}>
        <div className="sm-skills" role="group" aria-label="选择技能">
          {skills.map((s, index) => {
            const count = Object.keys(s.uses).length;
            return (
              <button
                type="button"
                key={s.key}
                ref={(node) => { skillNodes.current[s.key] = node; }}
                className={`sm-skill${active === s.key ? " is-active" : ""}${hoveredSkills.includes(s.key) ? " is-related" : ""}`}
                aria-pressed={active === s.key}
                tabIndex={active === s.key ? 0 : -1}
                onClick={() => setActive(s.key)}
                onKeyDown={(event) => moveSkill(event, index)}
              >
                <small>{s.en}</small>
                <span>{s.name}</span>
                <b aria-label={`${count} 个项目`}>{count}</b>
              </button>
            );
          })}
        </div>

        {geo && (
          <svg className="sm-links" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
            {hovered !== null && hoveredSkills.map((key) => geo.skills[key] && geo.projects[hovered] && (
              <path key={`h-${key}-${hovered}`} className="sm-link is-reverse" d={curve(geo.skills[key], geo.projects[hovered])} pathLength={1} />
            ))}
            {linked.map((index, order) => geo.skills[active] && geo.projects[index] && (
              <path
                key={`${active}-${index}`}
                className="sm-link"
                d={curve(geo.skills[active], geo.projects[index])}
                pathLength={1}
                style={{ "--order": order } as CSSProperties}
              />
            ))}
            {linked.map((index) => geo.projects[index] && (
              <circle key={`dot-${active}-${index}`} className="sm-node" cx={geo.projects[index].x} cy={geo.projects[index].y} r={4} />
            ))}
          </svg>
        )}

        <ol className="sm-projects">
          {projects.map((project, index) => {
            const evidence = skill.uses[index];
            const order = linked.indexOf(index);
            return (
              <li key={project.title}>
                <button
                  type="button"
                  ref={(node) => { projectNodes.current[index] = node; }}
                  className={`sm-project${evidence ? " is-linked" : ""}${hovered === index ? " is-hovered" : ""}`}
                  style={{ "--order": Math.max(order, 0) } as CSSProperties}
                  onPointerEnter={() => setHovered(index)}
                  onPointerLeave={() => setHovered(null)}
                  onFocus={() => setHovered(index)}
                  onBlur={() => setHovered(null)}
                  onClick={() => onOpen(index)}
                  aria-label={`${project.title}${evidence ? `：${evidence}` : ""}。打开项目详情`}
                >
                  <span className="sm-project-line">
                    <small>{project.year}</small>
                    <strong>{project.title}</strong>
                    <span aria-hidden="true">↗</span>
                  </span>
                  <span className="sm-evidence" aria-hidden="true">
                    <span>{evidence ?? ""}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="sm-readout" aria-live="polite">{skill.name} · 用在 {linked.length} 个项目里</p>
    </section>
  );
}
