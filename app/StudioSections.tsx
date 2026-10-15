"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Project } from "./projects";
import MoodDiaryPreview from "./MoodDiaryPreview";

type Group = "all" | "ai" | "data";
const productOrder = [0, 8, 2, 1];
const dataOrder = [3, 4, 6, 7, 5];
const chapterNames = ["问题从哪里来", "我想解决什么", "我是怎么做的", "最后得到了什么"];
const chapterKeys = ["situation", "task", "action", "result"] as const;
const mono = (n: number) => String(n).padStart(2, "0");

// Animate once as an exhibit enters view; content stays visible without the observer.
function useExhibitEntrance(group: Group) {
  const floor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!floor.current || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('has-entered');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    floor.current.querySelectorAll('.exhibit').forEach(node => {
      node.classList.add('will-enter');
      observer.observe(node);
    });
    return () => observer.disconnect();
  }, [group]);
  return floor;
}

function moveExhibit(e: PointerEvent<HTMLButtonElement>) {
  if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--look-x', `${((e.clientX - box.left) / box.width - .5) * 24}px`);
  e.currentTarget.style.setProperty('--look-y', `${((e.clientY - box.top) / box.height - .5) * 18}px`);
}

function resetExhibit(e: PointerEvent<HTMLButtonElement>) {
  e.currentTarget.style.setProperty('--look-x', '0px');
  e.currentTarget.style.setProperty('--look-y', '0px');
}

function IndexPreview({ project }: { project: Project }) {
  return <div className={`index-preview preview-${project.preview}`} key={project.title} aria-hidden="true">
    <div className="index-preview-art">
      {project.preview === 'aybot' ? <img src="./photos/project-flat-v1/aybot.png" alt="" loading="lazy"/> : project.preview === 'quiz' ? <img className="index-screen" src="./photos/beisen-quiz-home.png" alt="" loading="lazy"/> : <div className="index-signal"><i/><i/><i/><strong>{project.metric}</strong><span>{project.metricLabel}</span></div>}
    </div>
    <div className="index-preview-note"><span>{project.year} / {project.award ? 'AWARDED' : 'PROJECT'}</span><p>{project.lead}</p></div>
  </div>;
}

function ExhibitArt({ project }: { project: Project }) {
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

function CaseFile({ project, onClose, onCursorHostChange }: { project: Project | null; onClose: () => void; onCursorHostChange: (host: HTMLDialogElement | null) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [chapter, setChapter] = useState(3);
  const [previewStep, setPreviewStep] = useState(0);
  useEffect(() => {
    const node = dialog.current;
    if (!node || !project) return;
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    setChapter(3);
    setPreviewStep(0);
    node.showModal();
    onCursorHostChange(node);
    node.scrollTop = 0;
    document.body.style.overflow = "hidden";
    return () => { node.close(); onCursorHostChange(null); document.body.style.overflow = oldOverflow; previous?.focus({ preventScroll: true }); };
  }, [project, onCursorHostChange]);
  return <dialog className="case-file" ref={dialog} aria-labelledby="case-title" onCancel={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    {project && <div className="case-paper">
      <div className="case-toolbar"><span>OPEN FILE / {project.year}</span><button type="button" onClick={onClose} aria-label="关闭项目详情">关闭 ×</button></div>
      <header className="case-heading"><p>{project.subtitle}</p><h2 id="case-title">{project.title}</h2><p>{project.lead}</p>{project.stage && <p className="case-stage">{project.stage}</p>}{project.award && <strong className="case-award">✳ {project.award}</strong>}<div className="case-tags">{project.tags.map(t => <span key={t}>{t}</span>)}</div>
        {(project.contribution || project.evidence) && <dl className="case-facts">
          {project.contribution && <div><dt>我的工作</dt><dd>{project.contribution}</dd></div>}
          {project.evidence && <div><dt>当前证据</dt><dd>{project.evidence.summary}</dd></div>}
        </dl>}
        {(project.liveUrl || project.url) && <div className="case-entry-links">
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">{project.linkLabel || "打开在线体验"} ↗</a>}
          {project.url && <a href={project.url} target="_blank" rel="noreferrer">查看项目源码 ↗</a>}
        </div>}
        {project.evidence && <details className="case-proof"><summary>证据与指标口径 <span aria-hidden="true">＋</span></summary>
          <dl>{project.evidence.items.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.text}</dd></div>)}</dl>
          {project.evidence.next && <p className="case-proof-next">{project.evidence.next}</p>}
          {project.evidence.links && <div className="case-proof-links">{project.evidence.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div>}
        </details>}
        {project.research && <details className="case-evidence"><summary>文献与设计依据 · {project.research.title}</summary><p>{project.research.summary}</p><p>{project.research.application}</p><div><a href={project.research.url} target="_blank" rel="noreferrer">查看指南 ↗</a><a href={project.research.notesUrl} target="_blank" rel="noreferrer">项目走查与验证计划 ↗</a></div></details>}
      </header>
      <div className={`case-visual case-${project.preview}`}>
        {project.preview === "mood-diary" ? <><MoodDiaryPreview step={previewStep} /><div className="mood-demo-controls" aria-label="切换心情日记流程演示">{["种下心情", "即时关怀", "反馈与记忆"].map((label, i) => <button type="button" key={label} aria-pressed={previewStep === i} onClick={() => setPreviewStep(i)}>{mono(i + 1)} {label}</button>)}</div></> : project.preview === "focusflow" ? <img src="./photos/focusflow-preview.png" alt="FocusFlow 真实产品界面" /> : project.preview === "aybot" ? <img src="./photos/aybot-coze-workflow.jpg" alt="AYBot 的 Coze 工作流"/> : project.preview === "quiz" ? <img src="./photos/beisen-quiz-home.png" alt="北森刷题台真实界面"/> : <><ExhibitArt project={project}/><p>指标来自项目结果；图形为展示示意。</p></>}
      </div>
      <div className="case-reading">
        {project.decision && <section className="case-decision" aria-label="关键取舍"><p>关键取舍</p><h3>{project.decision.title}</h3><p>{project.decision.detail}</p><small>{project.decision.basis}</small></section>}
        <div className="chapter-tabs" role="tablist" aria-label="项目叙事章节">{chapterNames.map((name, i) => <button id={`chapter-tab-${i}`} role="tab" type="button" key={name} aria-selected={chapter === i} aria-controls="case-chapter" tabIndex={chapter === i ? 0 : -1} onClick={() => setChapter(i)} onKeyDown={(e) => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) { e.preventDefault(); const next = e.key === "Home" ? 0 : e.key === "End" ? 3 : (i + (e.key === "ArrowRight" ? 1 : 3)) % 4; setChapter(next); document.getElementById(`chapter-tab-${next}`)?.focus(); } }}><small>{mono(i + 1)}</small>{name}</button>)}</div>
        <div id="case-chapter" role="tabpanel" aria-labelledby={`chapter-tab-${chapter}`} className="chapter-text" key={`${project.title}-${chapter}`}><span>{mono(chapter + 1)}</span><p>{project.star[chapterKeys[chapter]]}</p></div>
        {project.steps && <div className="case-process"><p>从输入到结果 / EXPERIENCE FLOW</p>{project.steps.map((step, i) => <details key={step.label}><summary><small>{mono(i + 1)}</small>{step.label}<span>＋</span></summary><p>{step.description}</p></details>)}</div>}
        {project.overturn && !project.decision && <aside className="case-rethink"><p>↺ 关键判断</p><del>{project.overturn.before}</del><p>{project.overturn.evidence}</p><strong>{project.overturn.after}</strong></aside>}
        <div className="case-actions">{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">{project.linkLabel || "打开在线体验"} ↗</a>}{project.url && <a href={project.url} target="_blank" rel="noreferrer">查看项目源码 ↗</a>}<button type="button" onClick={onClose}>关闭项目 ↙</button></div>
      </div>
    </div>}
  </dialog>;
}

export function WorkGallery({ projects, group, onGroupChange, surprise, onCursorHostChange }: { projects: Project[]; group: Group; onGroupChange: (g: Group) => void; surprise: number; onCursorHostChange: (host: HTMLDialogElement | null) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [preview, setPreview] = useState<number>(2);
  const floor = useExhibitEntrance(group);
  const [seen, setSeen] = useState<number[]>([]);
  const lastSurprise = useRef(0);
  const open = (index: number) => { setSelected(index); setSeen(s => s.includes(index) ? s : [...s, index]); };
  useEffect(() => {
    if (!surprise || lastSurprise.current === surprise) return;
    lastSurprise.current = surprise;
    const choices = [...productOrder, ...dataOrder];
    const next = choices[(surprise * 5) % choices.length];
    setSelected(next); setSeen(s => s.includes(next) ? s : [...s, next]);
  }, [surprise]);
  const featured = group === "all" ? [0, 8, 3] : group === "ai" ? [0, 8] : [3, 4];
  const archive = group === "all" ? [2, 1, 4, 6, 7, 5] : group === "ai" ? [2, 1] : [6, 7, 5];
  const activePreview = archive.includes(preview) ? preview : archive[0];
  return <section className="workshop" id="work" aria-labelledby="work-title">
    <div className="studio-section-top"><span>01 / SELECTED WORK</span><span>2023 / 2026</span></div>
    <div className="workshop-heading"><h2 id="work-title">做过的项目<span className="work-title-dot">.</span></h2><div className="workshop-intro"><p>AI 产品 · 数据研究</p><span className="explore-count">{mono(projects.length)} PROJECTS</span></div></div>
    <div className="workshop-controls"><div className="exhibit-filters" aria-label="筛选作品">{([['all','全部作品'],['ai','AI 与产品'],['data','数据与研究']] as const).map(([key, label]) => <button type="button" key={key} aria-pressed={group === key} onClick={() => onGroupChange(key)}>{label}<span>{key === "all" ? "09" : key === "ai" ? "04" : "05"}</span></button>)}</div><span>查看项目 ↗</span></div>
    <div ref={floor} className={`exhibit-floor floor-${group}`} key={group}>
      {featured.map((index, position) => { const p = projects[index]; return <button type="button" className={`exhibit exhibit-${p.tone} exhibit-position-${position}`} key={p.title} onPointerMove={moveExhibit} onPointerLeave={resetExhibit} onClick={() => open(index)} aria-label={`打开项目：${p.title}`}><div className="exhibit-topline"><span>{productOrder.includes(index) ? 'AI / PRODUCT' : 'DATA / RESEARCH'}</span><span>{p.year} ↗</span></div><ExhibitArt project={p}/><div className="exhibit-caption"><div><small>{p.award ? "获奖项目" : "产品原型"}</small><h3>{p.title}</h3><p>{p.preview === "focusflow" ? "帮助开始任务，也支持中断后回来。" : p.preview === "mood-diary" ? "轻松记录，在低落时得到一点支持。" : p.lead}</p></div><span className="exhibit-open">↗</span></div>{seen.includes(index) && <span className="seen-mark">已翻阅 ✓</span>}</button>; })}
    </div>
    <div className="archive-shelf"><div className="archive-intro"><span>PROJECT INDEX</span><h3>更多项目</h3><IndexPreview project={projects[activePreview]}/></div><div className="archive-files">{archive.map((index, i) => { const p=projects[index]; return <button type="button" className={`archive-file file-${productOrder.includes(index) ? "product" : "data"}${activePreview === index ? " is-previewing" : ""}`} key={p.title} onPointerEnter={() => setPreview(index)} onFocus={() => setPreview(index)} onClick={() => open(index)} style={{'--file-i':i} as CSSProperties}><span className="file-tab">{productOrder.includes(index) ? 'BUILD' : 'RESEARCH'} / {mono(i+1)}</span><span className="file-content"><span><small>{p.year}{p.award ? ' · 获奖项目' : ''}</small><strong>{p.title}</strong><span>{p.subtitle}</span></span><b>{seen.includes(index) ? '✓' : '↗'}</b></span></button>; })}</div></div>
    <CaseFile project={selected === null ? null : projects[selected]} onClose={() => setSelected(null)} onCursorHostChange={onCursorHostChange}/>
  </section>;
}

const photos=[
 {src:'winter-coast-camera.jpg',place:'WINTER COAST',title:'把镜头转向世界。',note:'喜欢记录人与环境的关系，也喜欢那些容易被忽略的瞬间。'},
 {src:'pantheon-dome.jpg',place:'ROME / PANTHEON',title:'抬头，还有另一种秩序。',note:'建筑里的结构与光，总能让我多停一会儿。'},
 {src:'athens-portrait.webp',place:'ATHENS',title:'在陌生的地方，保持好奇。',note:'旅行时，喜欢观察不同的人如何生活、如何表达自己。'},
 {src:'york-minster.jpg',place:'YORK MINSTER',title:'慢一点，看看细节。',note:'曲线、尖塔、天空。用照片记下当时的视角。'},
 {src:'winter-coast-portrait.jpg',place:'BY THE SEA',title:'给想法一点空白。',note:'屏幕之外，也有海风和不急着回答的问题。'},
];
export function PhotoDesk(){
 const [photo,setPhoto]=useState(0);const [flipped,setFlipped]=useState(false);const [interest,setInterest]=useState('debate');const [copied,setCopied]=useState(false);
 const copyTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(copyTimer.current)clearTimeout(copyTimer.current);},[]);
 const select=(n:number)=>{setPhoto((n+photos.length)%photos.length);setFlipped(false);};
 const swipe=useRef({id:-1,x:0,y:0,dx:0,moved:false});
 const photoMotion=useRef<HTMLDivElement>(null);
 const resetPhotoMotion=()=>{if(photoMotion.current){photoMotion.current.style.removeProperty('--swipe-x');photoMotion.current.style.removeProperty('--swipe-angle');photoMotion.current.classList.remove('is-dragging');}};
 const startSwipe=(e:PointerEvent<HTMLButtonElement>)=>{if(e.button!==0||!e.isPrimary)return;swipe.current={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,moved:false};e.currentTarget.setPointerCapture(e.pointerId);};
 const moveSwipe=(e:PointerEvent<HTMLButtonElement>)=>{
   const d=swipe.current;if(d.id!==e.pointerId)return;
   d.dx=e.clientX-d.x;
   if(!d.moved && Math.abs(e.clientY-d.y)>Math.abs(d.dx)+10){d.id=-1;resetPhotoMotion();return;}
   if(Math.abs(d.dx)>8)d.moved=true;
   if(d.moved && photoMotion.current){const x=Math.max(-150,Math.min(150,d.dx));photoMotion.current.classList.add('is-dragging');photoMotion.current.style.setProperty('--swipe-x',`${x}px`);photoMotion.current.style.setProperty('--swipe-angle',`${x/18}deg`);}
 };
 const endSwipe=(e:PointerEvent<HTMLButtonElement>)=>{const d=swipe.current;if(d.id!==e.pointerId)return;d.id=-1;if(Math.abs(d.dx)>60)select(photo+(d.dx<0?1:-1));resetPhotoMotion();if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);};
 const current=photos[photo];
 const interests=[{key:'debate',title:'辩论',symbol:'“ ”',text:'曾任学院辩论队队长，带领 10 余人团队、统筹百人规模赛事。辩论让我习惯先听清分歧，再整理证据，把想法讲明白。',detail:'2022 校争鸣杯全程最佳辩手'}, {key:'music',title:'摇滚',symbol:'↯',text:'喜欢摇滚的直白和张力。Blur 的 Tender 温柔，但不软弱。',detail:'ON REPEAT / TENDER · BLUR'}, {key:'game',title:'游戏',symbol:'✥',text:'主机、掌机、手游都玩。比起通关数量，更喜欢琢磨故事怎么讲、系统怎么设计。',detail:'PLAYER MODE / ALWAYS CURIOUS'}, {key:'art',title:'艺术',symbol:'✳',text:'喜欢高迪自由的曲线，也喜欢高更大胆的色彩。会留意不同创作者如何用自己的方式理解世界。',detail:'LOOK CLOSELY / THINK FREELY'}];
 const selected=interests.find(i=>i.key===interest)!;
 return <section id="about" className="photo-desk" aria-labelledby="offscreen-title"><div className="studio-section-top"><span>03 / OFF SCREEN</span></div><div className="photo-layout"><div className="photo-intro"><h2 id="offscreen-title">屏幕之外<span className="work-title-dot">.</span></h2><p>旅行、拍照，偶尔辩论。</p><span className="photo-handnote">拖动换一张 · 点击看背面</span></div><div className="photo-stack-wrap" id="offscreen-gallery"><div className="photo-stack" onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();select(photo-1);}if(e.key==='ArrowRight'){e.preventDefault();select(photo+1);}}}><div className="photo-underprint"><img src={`./photos/${photos[(photo+1)%photos.length].src}`} alt="" loading="lazy"/></div><div className="photo-motion" ref={photoMotion}><button type="button" className={`photo-print${flipped?' is-flipped':''}`} onPointerDown={startSwipe} onPointerMove={moveSwipe} onPointerUp={endSwipe} onPointerCancel={()=>{swipe.current.id=-1;swipe.current.moved=true;resetPhotoMotion();}} onLostPointerCapture={()=>{swipe.current.id=-1;resetPhotoMotion();}} onClick={e=>{if(e.detail!==0 && swipe.current.moved){swipe.current.moved=false;return;}setFlipped(!flipped);}} aria-label={flipped?'查看照片正面':'翻看照片背面的笔记'} aria-pressed={flipped}><span className="photo-front" aria-hidden={flipped}><img draggable={false} src={`./photos/${current.src}`} alt={current.title} loading="lazy"/><span><b>{current.place}</b><small>{mono(photo+1)} / 05</small></span></span><span className="photo-back" aria-hidden={!flipped}><small>A NOTE FROM THE OTHER SIDE</small><strong>{current.title}</strong><span>{current.note}</span><em>安颜 / travel notes</em></span></button></div><span className="photo-tape" aria-hidden="true"/></div><div className="photo-controls"><button type="button" onClick={()=>select(photo-1)} aria-label="上一张旅行照片">←</button><span aria-live="polite">{current.place}</span><button type="button" onClick={()=>select(photo+1)} aria-label="下一张旅行照片">→</button></div><div className="photo-contact-sheet" aria-label="选择旅行照片">{photos.map((p,i)=><button type="button" key={p.src} aria-label={`查看照片：${p.place}`} aria-pressed={photo===i} onClick={()=>select(i)}><img src={`./photos/${p.src}`} alt="" loading="lazy"/><span>{mono(i+1)}</span></button>)}</div></div></div>
 <div className="pocket-notes" id="interest-debate"><div className="pocket-heading"><span>A FEW FAVOURITES</span><h3>平时喜欢</h3></div><div className="interest-switches" aria-label="选择兴趣">{interests.map(i=><button type="button" key={i.key} aria-pressed={interest===i.key} onClick={()=>setInterest(i.key)}><span>{i.symbol}</span>{i.title}</button>)}</div><div className="interest-note" key={interest}><small>{selected.detail}</small><p>{selected.text}</p>{interest==='music'&&<a href="https://open.spotify.com/search/Blur%20Tender" target="_blank" rel="noreferrer">去听这首歌 ↗</a>}</div></div>
 <footer className="studio-footer"><div><span>GET IN TOUCH</span><h2>聊聊下一件事<span className="work-title-dot">.</span></h2></div><div className="footer-contact"><a href="mailto:anyan001121@gmail.com">来聊聊 <span>↗</span></a><button type="button" onClick={async()=>{try{await navigator.clipboard.writeText('anyan001121@gmail.com');setCopied(true);if(copyTimer.current)clearTimeout(copyTimer.current);copyTimer.current=setTimeout(()=>setCopied(false),2500);}catch{window.location.href='mailto:anyan001121@gmail.com';}}}>{copied?'邮箱已复制 ✓':'anyan001121@gmail.com ⧉'}</button><span role="status" className="sr-only">{copied?'邮箱已复制':''}</span></div><div className="footer-bottom"><span>© 2026 安颜</span><a href="#top">回到顶部 ↑</a></div></footer></section>;
}

const guideStops=[{id:'top',name:'首页',pose:'stand',text:'欢迎来我的工作室。点一下小安，让我带你逛逛。'},{id:'work',name:'项目',pose:'present',text:'点击项目查看详情，也可以让我帮你挑一个。'},{id:'self',name:'关于我',pose:'peek',text:'这些词拼起来是一个“我”。试试把它们打散，再找回喜欢的关键词。'},{id:'about',name:'屏幕之外',pose:'camera',text:'照片背面藏着一句笔记。点击翻面，左右切换，一起去散步。'}];
export function StudioGuide({section,hidden,onSurprise}:{section:string;hidden:boolean;onSurprise:()=>void}){
 const [open,setOpen]=useState(false);const [pose,setPose]=useState<string|null>(null);const [minimized,setMinimized]=useState(false);const [position,setPosition]=useState({x:0,y:0});
 const [visits,setVisits]=useState<string[]>([]);const host=useRef<HTMLDivElement>(null);const avatar=useRef<HTMLButtonElement>(null);const timer=useRef<ReturnType<typeof setTimeout>|null>(null);const drag=useRef({active:false,moved:false,x:0,y:0,startX:0,startY:0});
 const current=guideStops.find(s=>s.id===section)||guideStops[0];
 useEffect(()=>{setVisits(v=>v.includes(section)?v:[...v,section]);setPose('walk-contact');if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setPose(null),650);return()=>{if(timer.current)clearTimeout(timer.current);};},[section]);
 useEffect(()=>{if(!open)return;const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);avatar.current?.focus();}};const outside=(e:globalThis.PointerEvent)=>{if(!host.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('keydown',key);document.addEventListener('pointerdown',outside);return()=>{document.removeEventListener('keydown',key);document.removeEventListener('pointerdown',outside);};},[open]);
 useEffect(()=>{const reset=()=>setPosition({x:0,y:0});window.addEventListener('resize',reset);return()=>window.removeEventListener('resize',reset);},[]);
 const react=()=>{setPose('jump');if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setPose(null),800);};
 const move=(e:PointerEvent<HTMLButtonElement>)=>{if(!drag.current.active)return;const d=drag.current;const dx=e.clientX-d.startX,dy=e.clientY-d.startY;if(Math.abs(dx)+Math.abs(dy)>8)d.moved=true;if(d.moved){setOpen(false);setPosition({x:Math.min(8,Math.max(-window.innerWidth+130,d.x+dx)),y:Math.min(0,Math.max(-window.innerHeight+185,d.y+dy))});}};
 if(hidden)return null;
 return <div ref={host} className={`studio-guide${open?' menu-open':''}${minimized?' is-mini':''}`} style={{'--host-x':`${position.x}px`,'--host-y':`${position.y}px`} as CSSProperties}>
 {open&&<div className="host-menu" id="host-menu" role="region" aria-label="小安的带路菜单"><div className="host-menu-title"><span>小安 / YOUR LITTLE GUIDE</span><button type="button" onClick={()=>setOpen(false)} aria-label="关闭带路菜单">×</button></div><p>{current.text}</p><div className="host-destinations">{guideStops.slice(1).map(s=><button type="button" key={s.id} onClick={()=>{setOpen(false);document.getElementById(s.id)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}}><span>{s.name}</span><small>{visits.includes(s.id)?'✓':'↗'}</small></button>)}</div><div className="host-actions"><button type="button" onClick={()=>{setOpen(false);onSurprise();}}>帮我挑个项目 ↗</button><button type="button" onClick={react}>击个掌 ✧</button></div><button className="host-minimize" type="button" onClick={()=>{setMinimized(true);setOpen(false);setPosition({x:0,y:0});}}>收起小安 ↘</button></div>}
 <button ref={avatar} type="button" className={`host-avatar${pose==='jump'?' is-jumping':''}${pose==='walk-contact'?' is-walking':''}`} aria-label={minimized?'唤醒小安':'与小安互动（可拖动）'} aria-expanded={open} aria-controls="host-menu" onPointerDown={e=>{if(e.button!==0)return;drag.current={active:true,moved:false,x:position.x,y:position.y,startX:e.clientX,startY:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={move} onPointerUp={e=>{drag.current.active=false;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}} onPointerCancel={()=>{drag.current.active=false;drag.current.moved=true;}} onClick={()=>{if(drag.current.moved){drag.current.moved=false;return;}if(minimized){setMinimized(false);setOpen(true);return;}setOpen(!open);react();}}><img src={`./photos/guide-actions-v2/${minimized?'sit':pose||current.pose}.png`} alt="" width="100" height="150"/><span className="host-shadow"/>{!open&&<span className="host-label">{minimized?'叫醒我':'点我带路 ↗'}</span>}</button>
 </div>;
}
