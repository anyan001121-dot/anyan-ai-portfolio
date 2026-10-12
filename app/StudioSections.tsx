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

function CurvedArrow({ shelf = false }: { shelf?: boolean }) {
  return <svg className="curved-arrow" viewBox="0 0 100 80" fill="none" aria-hidden="true"><path d={shelf ? "M14 9 C8 51 45 68 85 48 M68 42 Q79 45 85 48 Q81 58 75 63" : "M86 12 C78 48 37 19 18 65 M16 45 Q16 57 18 65 Q28 62 37 61"} stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function PetalMark() {
  return <svg viewBox="0 0 90 90" fill="none" aria-hidden="true">{[0,60,120,180,240,300].map(angle => <ellipse key={angle} cx="45" cy="25" rx="8.5" ry="16" stroke="currentColor" strokeWidth="2" transform={`rotate(${angle} 45 45)`}/>)}<circle cx="45" cy="45" r="5" fill="currentColor"/></svg>;
}

function ExhibitArt({ project }: { project: Project }) {
  if (project.preview === "focusflow") return <div className="focus-art" aria-hidden="true">
    <div className="focus-orbit" /><span className="floating-note note-one">还有好多事……</span><span className="floating-note note-two">先从这一件开始。</span>
    <div className="focus-console"><div className="console-top"><span>● ● ●</span><small>FOCUSFLOW / TODAY</small></div><p>把脑子里的事，<br />放到这里。</p><div className="task-slip"><i>01</i>找到下一小步<span>↗</span></div><div className="task-slip faded"><i>02</i>剩下的，稍后再想<span>＋</span></div><div className="console-bottom"><span className="timer-ring">25:00</span><small>ONE THING<br />AT A TIME.</small></div></div>
    <span className="art-caption">交互概念示意 / AI 专注助手</span>
  </div>;
  if (project.preview === "mood-diary") return <div className="garden-art" aria-hidden="true"><span className="garden-label">HOW ARE YOU, REALLY?</span><div className="garden-sun"/><img src="./photos/mood-diary/sunflower.webp" alt="" loading="lazy"/><img src="./photos/mood-diary/tulip.webp" alt="" loading="lazy"/><img src="./photos/mood-diary/low-flower.webp" alt="" loading="lazy"/><span className="garden-note">今天的心情，也值得被接住。</span></div>;
  if (project.title.startsWith("QAR")) return <div className="radar-art" aria-hidden="true"><div className="radar-rings"><i/><b/><span>✧</span><span>+</span><span>+</span></div><div className="flight-mark"><svg viewBox="0 0 150 120" fill="none"><path d="M8 104 C-1 75 40 95 57 68 S67 29 100 29" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 7" opacity=".55"/><path d="M90 28 Q108 24 135 12 Q127 35 121 58 L109 40 Z M109 40 L134 13" fill="#f9e4ca" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></div><span className="radar-coordinate">QAR / SIGNAL FOUND</span><strong>85<small>%</small></strong><span className="radar-caption">测试集准确率</span><span className="award-stamp">MATHORCUP<br/>全国二等奖</span></div>;
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
      <header className="case-heading"><p>{project.subtitle}</p><h2 id="case-title">{project.title}</h2><p>{project.lead}</p>{project.award && <strong className="case-award">✳ {project.award}</strong>}<div className="case-tags">{project.tags.map(t => <span key={t}>{t}</span>)}</div></header>
      <div className={`case-visual case-${project.preview}`}>
        {project.preview === "mood-diary" ? <><MoodDiaryPreview step={previewStep} /><div className="mood-demo-controls" aria-label="切换心情日记流程演示">{["种下心情", "即时关怀", "反馈与记忆"].map((label, i) => <button type="button" key={label} aria-pressed={previewStep === i} onClick={() => setPreviewStep(i)}>{mono(i + 1)} {label}</button>)}</div></> : project.preview === "focusflow" ? <img src="./photos/focusflow-preview.png" alt="FocusFlow 真实产品界面" /> : project.preview === "aybot" ? <img src="./photos/aybot-coze-workflow.jpg" alt="AYBot 的 Coze 工作流"/> : project.preview === "quiz" ? <img src="./photos/beisen-quiz-home.png" alt="北森刷题台真实界面"/> : <><ExhibitArt project={project}/><p>指标来自项目结果；图形为展示示意。</p></>}
      </div>
      <div className="case-reading"><div className="chapter-tabs" role="tablist" aria-label="项目叙事章节">{chapterNames.map((name, i) => <button id={`chapter-tab-${i}`} role="tab" type="button" key={name} aria-selected={chapter === i} aria-controls="case-chapter" tabIndex={chapter === i ? 0 : -1} onClick={() => setChapter(i)} onKeyDown={(e) => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) { e.preventDefault(); const next = e.key === "Home" ? 0 : e.key === "End" ? 3 : (i + (e.key === "ArrowRight" ? 1 : 3)) % 4; setChapter(next); document.getElementById(`chapter-tab-${next}`)?.focus(); } }}><small>{mono(i + 1)}</small>{name}</button>)}</div>
        <div id="case-chapter" role="tabpanel" aria-labelledby={`chapter-tab-${chapter}`} className="chapter-text" key={`${project.title}-${chapter}`}><span>{mono(chapter + 1)}</span><p>{project.star[chapterKeys[chapter]]}</p></div>
        {project.steps && <div className="case-process"><p>从输入到结果 / EXPERIENCE FLOW</p>{project.steps.map((step, i) => <details key={step.label}><summary><small>{mono(i + 1)}</small>{step.label}<span>＋</span></summary><p>{step.description}</p></details>)}</div>}
        {project.overturn && <aside className="case-rethink"><p>↺ 一个被证据改变的判断</p><del>{project.overturn.before}</del><p>{project.overturn.evidence}</p><strong>{project.overturn.after}</strong></aside>}
        <div className="case-actions">{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">{project.linkLabel || "打开在线体验"} ↗</a>}{project.url && <a href={project.url} target="_blank" rel="noreferrer">查看项目源码 ↗</a>}<button type="button" onClick={onClose}>收起档案，继续逛 ↙</button></div>
      </div>
    </div>}
  </dialog>;
}

export function WorkGallery({ projects, group, onGroupChange, surprise, onCursorHostChange }: { projects: Project[]; group: Group; onGroupChange: (g: Group) => void; surprise: number; onCursorHostChange: (host: HTMLDialogElement | null) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
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
  return <section className="workshop" id="work" aria-labelledby="work-title">
    <div className="studio-section-top"><span>01 / THE PROJECT PLAYGROUND</span><span>IDEAS → EXPERIMENTS → THINGS</span></div>
    <div className="workshop-heading"><h2 id="work-title">好奇心，<br/>做成了<em>这些。</em><span className="heading-asterisk" aria-hidden="true"><PetalMark/></span></h2><div className="workshop-intro"><span className="hand-arrow" aria-hidden="true"><CurvedArrow/></span><p>有解决小麻烦的工具，<br/>也有追问大问题的研究。<br/>挑一件，打开看看。</p><span className="explore-count">已翻阅 {mono(seen.length)} / {mono(projects.length)} 件作品</span></div></div>
    <div className="workshop-controls"><div className="exhibit-filters" aria-label="筛选作品">{([['all','全部作品'],['ai','AI 与产品'],['data','数据与研究']] as const).map(([key, label]) => <button type="button" key={key} aria-pressed={group === key} onClick={() => onGroupChange(key)}>{label}<span>{key === "all" ? "09" : key === "ai" ? "04" : "05"}</span></button>)}</div><span>点击作品 · 翻开完整过程 ↗</span></div>
    <div className={`exhibit-floor floor-${group}`} key={group}>
      {featured.map((index, position) => { const p = projects[index]; return <button type="button" className={`exhibit exhibit-${p.tone} exhibit-position-${position}`} key={p.title} onClick={() => open(index)} aria-label={`打开项目：${p.title}`}><div className="exhibit-topline"><span>{productOrder.includes(index) ? 'PRODUCT EXPERIMENT' : 'DATA INVESTIGATION'}</span><span>{p.year} ↗</span></div><ExhibitArt project={p}/><div className="exhibit-caption"><div><small>{p.award ? "获奖研究 / AWARD WINNER" : "想法 → 可交互原型"}</small><h3>{p.title}</h3><p>{p.preview === "focusflow" ? "让临时的想法有地方去，让眼前的任务继续。" : p.preview === "mood-diary" ? "把一次心情，种成一朵花。" : p.lead}</p></div><span className="exhibit-open">↗</span></div>{seen.includes(index) && <span className="seen-mark">已翻阅 ✓</span>}</button>; })}
    </div>
    <div className="archive-shelf"><div className="archive-intro"><span>KEEP EXPLORING</span><h3>桌上还有<br/><em>一些想法。</em></h3><p>从知识检索到行业研究，<br/>每份档案里都有一次尝试。</p><span className="shelf-doodle" aria-hidden="true"><CurvedArrow shelf/></span></div><div className="archive-files">{archive.map((index, i) => { const p=projects[index]; return <button type="button" className={`archive-file file-${productOrder.includes(index) ? "product" : "data"}`} key={p.title} onClick={() => open(index)} style={{'--file-i':i} as CSSProperties}><span className="file-tab">{productOrder.includes(index) ? 'BUILD' : 'RESEARCH'} / {mono(i+1)}</span><span className="file-content"><span><small>{p.year}{p.award ? ' · 获奖项目' : ''}</small><strong>{p.title}</strong><span>{p.subtitle}</span></span><b>{seen.includes(index) ? '✓' : '↗'}</b></span></button>; })}</div></div>
    <CaseFile project={selected === null ? null : projects[selected]} onClose={() => setSelected(null)} onCursorHostChange={onCursorHostChange}/>
  </section>;
}

const methods = [
  { verb:'拆问题', title:'先问，究竟卡在哪里？', note:'我习惯先明确场景、目标和约束，再决定用什么工具。', example:'FocusFlow：临时输入应该被记住，但不应该直接改变正在做的任务。', tools:['场景拆解','流程设计','指标定义'], artifact:<div className="lab-notes"><span>新的想法</span><b>↘</b><span>Later List 暂存</span><i>当前任务保持不变 ↗</i></div> },
  { verb:'找证据', title:'把“我觉得”变成可检验的问题。', note:'清洗数据、统一口径，再比较不同场景；模型结果需要解释，也需要检验。', example:'MathorCup：从高维飞行数据中筛出 5 项关键指标，用测试集验证预警效果。', tools:['SQL / Python / R','统计建模','交叉验证'], artifact:<div className="lab-bars" aria-label="分析流程示意，非真实数据图"><span style={{height:'35%'}}>数据</span><span style={{height:'58%'}}>筛选</span><span style={{height:'78%'}}>验证</span><span style={{height:'94%'}}>解释</span></div> },
  { verb:'做出来', title:'让想法尽快有一个可用的样子。', note:'用 AI 辅助拆任务、写代码和调试，把规则、模型与外部工具连接起来。', example:'Coze：串联提问、检索、上下文补充、生成和结构化输出，完成知识检索原型。', tools:['Claude Code / Codex','Agent / Workflow','RAG / API'], artifact:<div className="lab-flow"><span>QUERY</span><b>↓</b><span>RETRIEVE + CONTEXT</span><b>↓</b><span>ANSWER ↗</span></div> },
  { verb:'再推敲', title:'好用，也要能应对不顺利的时候。', note:'检查异常情况和结论边界，让下一次修改有具体依据。', example:'FocusFlow：覆盖超时、限流和解析失败的降级流程，密钥失效时明确提示。', tools:['案例测试','异常边界','迭代复盘'], artifact:<div className="lab-checks"><span>✓ 正常调用</span><span>↳ 超时 / 限流 → 基础建议</span><span>↳ 密钥失效 → 明确提示</span><b>下一轮，再好一点。 ↺</b></div> },
];
export function MethodLab() {
  const [step,setStep]=useState(0);
  const current=methods[step];
  return <section id="fit" className="method-lab" aria-labelledby="lab-title"><div className="studio-section-top"><span>03 / INSIDE MY WORKBENCH</span><span>THINK / MAKE / REPEAT</span></div><div className="lab-layout"><div className="lab-heading"><h2 id="lab-title">想法很快。<br/><em>落地要认真。</em></h2><p>本科两年完成四年学分。<br/>习惯快速进入陌生问题，<br/>也愿意为一个细节反复验证。</p><img src="./photos/guide-actions-v2/write.png" width="150" height="210" alt="正在写笔记的小安" loading="lazy"/></div><div className="lab-machine"><div className="machine-top"><span>AY / THINKING MACHINE</span><span className="machine-light"/></div><div className="machine-tabs" role="tablist" aria-label="探索工作方法">{methods.map((m,i)=><button role="tab" type="button" id={`method-tab-${i}`} aria-selected={step===i} aria-controls="method-panel" tabIndex={step===i?0:-1} key={m.verb} onClick={()=>setStep(i)} onKeyDown={e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?3:(i+(e.key==='ArrowRight'?1:3))%4;setStep(next);document.getElementById(`method-tab-${next}`)?.focus();}}}><span>{mono(i+1)}</span>{m.verb}</button>)}</div><div className="machine-display" id="method-panel" role="tabpanel" aria-labelledby={`method-tab-${step}`}><div className="machine-art" key={step}>{current.artifact}</div><div className="machine-copy"><small>STEP {mono(step+1)} / 04</small><h3>{current.title}</h3><p>{current.note}</p><div className="machine-tools">{current.tools.map(t=><span key={t}>{t}</span>)}</div></div></div><div className="machine-example"><span>项目中的一次实践 ↳</span><p>{current.example}</p></div><div className="machine-bottom"><span>转动下一步，看看我怎么想。</span><button type="button" onClick={()=>setStep((step+1)%4)} aria-label="切换到下一种工作方法">↻</button></div></div></div></section>;
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
 const current=photos[photo];
 const interests=[{key:'debate',title:'辩论',symbol:'“ ”',text:'曾任学院辩论队队长，带领 10 余人团队、统筹百人规模赛事。辩论让我习惯先听清分歧，再整理证据，把想法讲明白。',detail:'2022 校争鸣杯全程最佳辩手'}, {key:'music',title:'摇滚',symbol:'↯',text:'喜欢摇滚的直白和张力。Blur 的 Tender 温柔，但不软弱。',detail:'ON REPEAT / TENDER — BLUR'}, {key:'game',title:'游戏',symbol:'✥',text:'主机、掌机、手游都玩。比起通关数量，更喜欢琢磨故事怎么讲、系统怎么设计。',detail:'PLAYER MODE / ALWAYS CURIOUS'}, {key:'art',title:'艺术',symbol:'✳',text:'喜欢高迪自由的曲线，也喜欢高更大胆的色彩。会留意不同创作者如何用自己的方式理解世界。',detail:'LOOK CLOSELY / THINK FREELY'}];
 const selected=interests.find(i=>i.key===interest)!;
 return <section id="about" className="photo-desk" aria-labelledby="offscreen-title"><div className="studio-section-top"><span>04 / A LITTLE OFF SCREEN</span><span>COLLECTING MOMENTS, TOO.</span></div><div className="photo-layout"><div className="photo-intro"><h2 id="offscreen-title">不只会<br/>盯着<em>屏幕。</em></h2><p>我的灵感，也来自<br/>路过的风景、听过的歌，<br/>和一场认真的争论。</p><span className="photo-handnote">点照片，翻到背面 ↗</span></div><div className="photo-stack-wrap" id="offscreen-gallery"><div className="photo-stack" onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();select(photo-1);}if(e.key==='ArrowRight'){e.preventDefault();select(photo+1);}}}><div className="photo-underprint"><img src={`./photos/${photos[(photo+1)%photos.length].src}`} alt="" loading="lazy"/></div><button type="button" className={`photo-print${flipped?' is-flipped':''}`} onClick={()=>setFlipped(!flipped)} aria-label={flipped?'查看照片正面':'翻看照片背面的笔记'} aria-pressed={flipped}><span className="photo-front" aria-hidden={flipped}><img src={`./photos/${current.src}`} alt={current.title} loading="lazy"/><span><b>{current.place}</b><small>{mono(photo+1)} / 05</small></span></span><span className="photo-back" aria-hidden={!flipped}><small>A NOTE FROM THE OTHER SIDE</small><strong>{current.title}</strong><span>{current.note}</span><em>安颜 / travel notes</em></span></button><span className="photo-tape" aria-hidden="true"/></div><div className="photo-controls"><button type="button" onClick={()=>select(photo-1)} aria-label="上一张旅行照片">←</button><span>{current.place}</span><button type="button" onClick={()=>select(photo+1)} aria-label="下一张旅行照片">→</button></div></div></div>
 <div className="pocket-notes" id="interest-debate"><div className="pocket-heading"><span>IN MY POCKET</span><h3>随身携带的，<br/>另一些我。</h3></div><div className="interest-switches" aria-label="选择兴趣">{interests.map(i=><button type="button" key={i.key} aria-pressed={interest===i.key} onClick={()=>setInterest(i.key)}><span>{i.symbol}</span>{i.title}</button>)}</div><div className="interest-note" key={interest}><small>{selected.detail}</small><p>{selected.text}</p>{interest==='music'&&<a href="https://open.spotify.com/search/Blur%20Tender" target="_blank" rel="noreferrer">去听这首歌 ↗</a>}</div></div>
 <footer className="studio-footer"><div><span>THANKS FOR WANDERING BY.</span><h2>下一件有趣的事，<br/><em>一起做？</em></h2></div><div className="footer-contact"><a href="mailto:anyan001121@gmail.com">来聊聊 <span>↗</span></a><button type="button" onClick={async()=>{try{await navigator.clipboard.writeText('anyan001121@gmail.com');setCopied(true);if(copyTimer.current)clearTimeout(copyTimer.current);copyTimer.current=setTimeout(()=>setCopied(false),2500);}catch{window.location.href='mailto:anyan001121@gmail.com';}}}>{copied?'邮箱已复制 ✓':'anyan001121@gmail.com ⧉'}</button><span role="status" className="sr-only">{copied?'邮箱已复制':''}</span></div><div className="footer-bottom"><span>© 2026 安颜 / BUILT WITH CURIOSITY</span><a href="#top">再看一眼开场 ↑</a></div></footer></section>;
}

const guideStops=[{id:'top',name:'首页',pose:'stand',text:'欢迎来我的工作室。点一下小安，让我带你逛逛。'},{id:'work',name:'作品展台',pose:'present',text:'桌上的作品都可以打开。想先看哪个？也可以让我帮你挑。'},{id:'self',name:'关于我',pose:'peek',text:'这些词拼起来是一个“我”。试试把它们打散，再找回喜欢的关键词。'},{id:'fit',name:'思考工作台',pose:'write',text:'拨动工作台上的步骤，可以看到我怎么把问题变成一个原型。'},{id:'about',name:'屏幕之外',pose:'camera',text:'照片背面藏着一句笔记。点击翻面，左右切换，一起去散步。'}];
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
 {open&&<div className="host-menu" id="host-menu" role="region" aria-label="小安的带路菜单"><div className="host-menu-title"><span>小安 / YOUR LITTLE GUIDE</span><button type="button" onClick={()=>setOpen(false)} aria-label="关闭带路菜单">×</button></div><p>{current.text}</p><div className="host-destinations">{guideStops.slice(1).map(s=><button type="button" key={s.id} onClick={()=>{setOpen(false);document.getElementById(s.id)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}}><span>{s.name}</span><small>{visits.includes(s.id)?'✓':'↗'}</small></button>)}</div><div className="host-actions"><button type="button" onClick={()=>{setOpen(false);onSurprise();}}>帮我挑个项目 ↗</button><button type="button" onClick={react}>击个掌 ✧</button></div><button className="host-minimize" type="button" onClick={()=>{setMinimized(true);setOpen(false);setPosition({x:0,y:0});}}>先在旁边休息一会儿 ↘</button></div>}
 <button ref={avatar} type="button" className={`host-avatar${pose==='jump'?' is-jumping':''}${pose==='walk-contact'?' is-walking':''}`} aria-label={minimized?'唤醒小安':'与小安互动（可拖动）'} aria-expanded={open} aria-controls="host-menu" onPointerDown={e=>{if(e.button!==0)return;drag.current={active:true,moved:false,x:position.x,y:position.y,startX:e.clientX,startY:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={move} onPointerUp={e=>{drag.current.active=false;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}} onPointerCancel={()=>{drag.current.active=false;drag.current.moved=true;}} onClick={()=>{if(drag.current.moved){drag.current.moved=false;return;}if(minimized){setMinimized(false);setOpen(true);return;}setOpen(!open);react();}}><img src={`./photos/guide-actions-v2/${minimized?'sit':pose||current.pose}.png`} alt="" width="100" height="150"/><span className="host-shadow"/>{!open&&<span className="host-label">{minimized?'叫醒我':'点我带路 ↗'}</span>}</button>
 </div>;
}
