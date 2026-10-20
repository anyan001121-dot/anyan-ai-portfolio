/*
 * Beat-locked sound for the 12-second opening reel, synthesised with Web Audio (no files).
 * Same grid as the visuals: 120 BPM, beat b lands at b × 0.5s, 24 beats.
 * A steady groove keeps the pulse audible — kick on 1 and 3, clap on 2 and 4,
 * a hat on every off-beat — and one cue per on-screen action sits on top.
 */

const BEAT = 0.5;
const BEATS = 24;

type Bus = { ctx: AudioContext; out: AudioNode; noise: AudioBuffer };

function env(ctx: AudioContext, t: number, peak: number, attack: number, decay: number) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  return gain;
}

function tone({ ctx, out }: Bus, t: number, freq: number, peak: number, decay: number, type: OscillatorType = "sine", endFreq?: number) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + decay);
  const gain = env(ctx, t, peak, 0.004, decay);
  osc.connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + decay + 0.05);
}

function noise({ ctx, out, noise: buffer }: Bus, t: number, peak: number, decay: number, filter: BiquadFilterType, freq: number, endFreq?: number, q = 0.8) {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const biquad = ctx.createBiquadFilter();
  biquad.type = filter;
  biquad.Q.value = q;
  biquad.frequency.setValueAtTime(freq, t);
  if (endFreq) biquad.frequency.exponentialRampToValueAtTime(endFreq, t + decay);
  const gain = env(ctx, t, peak, 0.002, decay);
  src.connect(biquad).connect(gain).connect(out);
  src.start(t);
  src.stop(t + decay + 0.05);
}

// ---- groove ----
const kick = (bus: Bus, t: number, peak = 0.75) => tone(bus, t, 150, peak, 0.3, "sine", 45);
const clap = (bus: Bus, t: number) => {
  noise(bus, t, 0.2, 0.11, "bandpass", 1500, undefined, 1.1);
  noise(bus, t + 0.012, 0.12, 0.08, "bandpass", 2400, undefined, 1.1);
};
const hat = (bus: Bus, t: number) => noise(bus, t, 0.045, 0.035, "highpass", 7500);

// ---- cues ----
const sub = (bus: Bus, t: number) => tone(bus, t, 55, 0.35, 1.1, "sine", 38);
const pluck = (bus: Bus, t: number, freq: number, peak = 0.15) => {
  tone(bus, t, freq, peak, 0.36, "triangle");
  tone(bus, t, freq * 2, peak * 0.25, 0.16, "sine");
};
const ping = (bus: Bus, t: number, freq: number, peak = 0.1) => tone(bus, t, freq, peak, 0.7, "sine");
const slash = (bus: Bus, t: number) => noise(bus, t, 0.2, 0.22, "bandpass", 700, 7000, 1.4);
const whoosh = (bus: Bus, t: number) => noise(bus, t, 0.07, 0.3, "bandpass", 300, 2400, 0.9);
const ripple = (bus: Bus, t: number, letters: number) => {
  for (let i = 0; i < letters; i += 1) noise(bus, t + i * 0.012, 0.03, 0.016, "highpass", 4200 + i * 180);
};
const chord = (bus: Bus, t: number, freqs: number[], decay = 2.4) =>
  freqs.forEach((freq, i) => tone(bus, t, freq, 0.07, decay, i % 2 ? "triangle" : "sine"));

// Note names → Hz (A minor / C major pentatonic, so every hit sits together).
const N = { A2: 110, A3: 220, B3: 246.94, C4: 261.63, E4: 329.63, G4: 392, A4: 440, C5: 523.25, E5: 659.25, G5: 783.99, C6: 1046.5, E6: 1318.5, G6: 1568, A6: 1760 };

/** One cue per on-screen action; each shot is one bar (4 beats). */
const CUES: Record<number, (bus: Bus, t: number) => void> = {
  0: (b, t) => { sub(b, t); ripple(b, t, 9); },                        // PORTFOLIO
  1: (b, t) => { pluck(b, t, N.C5); whoosh(b, t); },                   // folds up · "I"
  2: (b, t) => pluck(b, t, N.E5),                                      // "find the"
  3: (b, t) => { pluck(b, t, N.G5); ping(b, t, N.G6); },               // "signal." — the dot lands
  4: (b, t) => ripple(b, t, 10),                                       // STATISTICS
  5: (b, t) => tone(b, t, 220, 0.07, 0.42, "sine", 880),               // curve draws · dot rides up
  6: (b, t) => ping(b, t, N.A6, 0.12),                                 // dot drops into the mean line
  7: (b, t) => pluck(b, t, N.A4, 0.11),                                // 统计学硕士
  8: (b, t) => ripple(b, t, 11),                                       // CORRELATION
  9: (b, t) => pluck(b, t, N.E4, 0.12),                                // dot waits at the word
  10: (b, t) => slash(b, t),                                           // struck out
  11: (b, t) => { ripple(b, t, 9); pluck(b, t, N.A3, 0.2); },          // CAUSATION
  12: (b, t) => pluck(b, t, N.C5),                                     // IDEA
  13: (b, t) => { pluck(b, t, N.E5); whoosh(b, t); },                  // PROTOTYPE
  14: (b, t) => { pluck(b, t, N.G5); ping(b, t, N.C6, 0.12); },        // SHIPPED.
  15: (b, t) => pluck(b, t, N.E4, 0.1),                                // 把想法，做成产品
  16: (b, t) => { sub(b, t); pluck(b, t, N.A2, 0.24); },               // cut to ink · ARGUE
  17: (b, t) => pluck(b, t, N.B3, 0.2),                                // LIKE IT
  18: (b, t) => chord(b, t, [N.A3, N.E4, N.A4], 0.8),                  // MATTERS.
  19: (b, t) => pluck(b, t, N.E4, 0.1),                                // 争鸣杯
  20: (b, t) => { ripple(b, t, 6); pluck(b, t, N.E4, 0.14); },         // Yan An.
  21: (b, t) => ping(b, t, N.E6, 0.08),                                // sign line
  22: (b, t) => { sub(b, t); noise(b, t, 0.14, 0.45, "bandpass", 200, 5000, 0.7); }, // the dot blooms
  23: (b, t) => chord(b, t, [N.C4, N.E4, N.G4, N.C5], 2.8),            // 安颜 lands
};

export type IntroSound = {
  /** Schedule everything against `zeroMs`, the performance.now() time of beat 0. */
  start: (zeroMs: number, tries?: number) => void;
  stop: (fadeSeconds?: number) => void;
  context: AudioContext;
};

export function createIntroSound(): IntroSound | null {
  if (typeof window === "undefined" || typeof window.AudioContext === "undefined") return null;
  const ctx = new window.AudioContext({ latencyHint: "interactive" });
  const master = ctx.createGain();
  master.gain.value = 0.7;
  const comp = ctx.createDynamicsCompressor();
  master.connect(comp).connect(ctx.destination);

  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const bus: Bus = { ctx, out: master, noise: buffer };
  let started = false;

  // Map a performance.now() time onto the audio clock *as heard*, so output latency is accounted for.
  // Right after resume() the output timestamp is still empty; the rough fallback is ~40ms off, so wait for it.
  const stamped = () => {
    const stamp = ctx.getOutputTimestamp?.();
    return stamp && stamp.contextTime && stamp.performanceTime ? stamp : null;
  };
  const toAudioTime = (perfMs: number) => {
    const stamp = stamped();
    if (stamp) return stamp.contextTime! + (perfMs - stamp.performanceTime!) / 1000;
    return ctx.currentTime + (perfMs - performance.now()) / 1000 - (ctx.outputLatency || ctx.baseLatency || 0);
  };

  return {
    context: ctx,
    start(zeroMs, tries = 0) {
      if (started) return;
      if (!stamped() && tries < 12) {
        window.setTimeout(() => this.start(zeroMs, tries + 1), 15);
        return;
      }
      started = true;
      const zero = toAudioTime(zeroMs);
      const floor = ctx.currentTime + 0.01;
      const at = (time: number, play: (t: number) => void) => { if (time >= floor) play(time); };
      for (let beat = 0; beat < BEATS; beat += 1) {
        const t = zero + beat * BEAT;
        if (beat % 2 === 0) at(t, (x) => kick(bus, x, beat % 4 === 0 ? 0.8 : 0.55));
        else at(t, (x) => clap(bus, x));
        at(t + BEAT / 2, (x) => hat(bus, x));
        at(t, (x) => CUES[beat]?.(bus, x));
      }
      at(zero + BEATS * BEAT, (x) => kick(bus, x, 0.6)); // the hand-off lands on a downbeat too
    },
    stop(fadeSeconds = 0.3) {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + fadeSeconds);
      window.setTimeout(() => void ctx.close(), fadeSeconds * 1000 + 100);
    },
  };
}
