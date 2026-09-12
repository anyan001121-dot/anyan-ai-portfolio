import type { CSSProperties } from "react";

type LetterSwap3DProps = {
  text: string;
  className?: string;
  stagger?: number;
  origin?: "first" | "center" | "last";
};

export default function LetterSwap3D({
  text,
  className = "",
  stagger = 0.035,
  origin = "first",
}: LetterSwap3DProps) {
  const letters = [...text];
  const lastIndex = Math.max(letters.length - 1, 0);

  const orderFor = (index: number) => {
    if (origin === "last") return lastIndex - index;
    if (origin === "center") return Math.abs(index - lastIndex / 2);
    return index;
  };

  return (
    <span className={`letter-swap-3d ${className}`.trim()} aria-label={text}>
      {letters.map((letter, index) => (
        <span
          className="letter-swap-3d-char"
          aria-hidden="true"
          key={`${letter}-${index}`}
          style={{ "--letter-delay": `${orderFor(index) * stagger}s` } as CSSProperties}
        >
          <span className="letter-swap-3d-inner">
            <span className="letter-swap-3d-face letter-swap-3d-front">{letter === " " ? "\u00a0" : letter}</span>
            <span className="letter-swap-3d-face letter-swap-3d-back">{letter === " " ? "\u00a0" : letter}</span>
          </span>
        </span>
      ))}
    </span>
  );
}
