/* eslint-disable @next/next/no-img-element */
import "./MoodDiaryPreview.css";

const panels = [
  { label: "01 / LEAVE A FEELING", title: "每一种心情，\n都可以留在这里。" },
  { label: "02 / A LITTLE CARE", title: "今天好像有点难熬。", detail: "不急着马上好起来。现在你更希望我怎么陪你？" },
  { label: "03 / CARE MEMORY", title: "记住上次的小小帮助。", detail: "同类情境再次出现时，轻量提示曾带来“好一点”反馈的行动。" },
];

export default function MoodDiaryPreview({ step }: { step: number }) {
  const panel = panels[step] ?? panels[0];

  return (
    <figure className="mood-preview" aria-label="心情日记产品流程演示">
      <div className="mood-preview-bar"><span>心情日记</span><small>MOOD GARDEN</small></div>
      <div className="mood-preview-scene" data-step={step}>
        <div className="mood-preview-flowers" aria-hidden="true">
          <img src="./photos/mood-diary/tulip.webp" width="160" height="160" loading="lazy" alt="" />
          <img src="./photos/mood-diary/low-flower.webp" width="160" height="160" loading="lazy" alt="" />
          <img src="./photos/mood-diary/sunflower.webp" width="160" height="160" loading="lazy" alt="" />
        </div>
        <div className="mood-preview-panel" key={step}>
          <small>{panel.label}</small>
          <h4>{panel.title}</h4>
          {panel.detail && <p>{panel.detail}</p>}
          {step === 0 && <div className="mood-preview-feelings"><span>很好</span><span>不错</span><span>一般</span><span>低落</span><span>很糟</span></div>}
          {step === 1 && <div className="mood-preview-choices"><span>陪我缓一下</span><span>我想说说</span><small>也可以，今天先不做什么。</small></div>}
          {step === 2 && <div className="mood-preview-memory"><small>流程示例 · 工作／学业</small><span>写下来 <i aria-hidden="true">→</i> 好一点</span></div>}
        </div>
      </div>
      <figcaption><span>流程演示 · 使用项目原素材</span><span>{String(step + 1).padStart(2, "0")} / 03</span></figcaption>
    </figure>
  );
}
