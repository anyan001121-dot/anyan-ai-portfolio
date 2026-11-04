"use client";

import { useEffect, useState, type CSSProperties } from "react";
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
