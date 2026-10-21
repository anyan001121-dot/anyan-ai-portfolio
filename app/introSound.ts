/*
 * Beat-locked music for the 12-second opening reel, synthesised with Web Audio (no files).
 * Grid: 120 BPM, beat b lands at b × 0.5s, 24 beats = six bars, one bar per shot.
 *
 * Arrangement (A minor, Am – F – C – G per bar):
 *   drums  — four-on-the-floor kick with a click transient, clap on 2 and 4,
 *            sixteenth hats with accents, open hat on every off-beat;
 *   bass   — off-beat saw bass on the bar's root, ducked by every kick (pump);
 *   cuts   — a half-beat riser into every bar downbeat, then sub boom + crash + chord stab;
 *   drops  — half a beat of silence before the ink shot (beat 16) and before 安颜 lands
 *            (beat 23), with a two-beat riser into the last one;
 *   cues   — one pitched hit per on-screen action, all in key.
 */

const BEAT = 0.5;
const BEATS = 24;
const BAR_ROOTS = [55, 43.65, 65.41, 49, 55, 43.65]; // A1 F1 C2 G1 A1 F1
const BAR_CHORDS = [
  [220, 261.63, 329.63], // Am
  [174.61, 220, 261.63], // F
  [196, 261.63, 329.63], // C
  [196, 246.94, 293.66], // G
  [220, 261.63, 329.63], // Am
  [174.61, 220, 261.63], // F
];
const DROPS = [16, 23]; // beats preceded by half a beat of silence

type Bus = { ctx: AudioContext; drums: AudioNode; music: GainNode; fx: AudioNode; noise: AudioBuffer };

function env(ctx: AudioContext, t: number, peak: number, attack: number, decay: number) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  return gain;
}

function tone(ctx: AudioContext, out: AudioNode, t: number, freq: number, peak: number, decay: number, type: OscillatorType = "sine", endFreq?: number, glide?: number) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + (glide ?? decay));
  const gain = env(ctx, t, peak, 0.003, decay);
  osc.connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + decay + 0.05);
}

function noise({ ctx, noise: buffer }: Bus, out: AudioNode, t: number, peak: number, decay: number, filter: BiquadFilterType, freq: number, endFreq?: number, q = 0.8, attack = 0.002) {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const biquad = ctx.createBiquadFilter();
  biquad.type = filter;
  biquad.Q.value = q;
  biquad.frequency.setValueAtTime(freq, t);
  if (endFreq) biquad.frequency.exponentialRampToValueAtTime(endFreq, t + attack + decay);
  const gain = env(ctx, t, peak, attack, decay);
  src.connect(biquad).connect(gain).connect(out);
  src.start(t);
  src.stop(t + attack + decay + 0.05);
}

// ---------------- drums ----------------
const kick = (b: Bus, t: number, peak = 0.95) => {
  tone(b.ctx, b.drums, t, 190, peak, 0.34, "sine", 44, 0.11);
  noise(b, b.drums, t, 0.18, 0.012, "highpass", 3200); // click
  // Sidechain pump: everything melodic ducks under the kick and breathes back.
  b.music.gain.setValueAtTime(0.32, t);
  b.music.gain.linearRampToValueAtTime(1, t + 0.22);
};
const clap = (b: Bus, t: number) => {
  [0, 0.011, 0.023].forEach((d, i) => noise(b, b.drums, t + d, i === 2 ? 0.34 : 0.22, i === 2 ? 0.16 : 0.03, "bandpass", 1700, undefined, 1.2));
  tone(b.ctx, b.drums, t, 210, 0.16, 0.09, "triangle", 160);
};
const hat = (b: Bus, t: number, peak: number) => noise(b, b.drums, t, peak, 0.028, "highpass", 8500);
const openHat = (b: Bus, t: number) => noise(b, b.drums, t, 0.07, 0.13, "highpass", 7200);
const crash = (b: Bus, t: number) => noise(b, b.fx, t, 0.12, 1.3, "highpass", 4800);

// ---------------- music ----------------
const bass = (b: Bus, t: number, root: number) => {
  const { ctx } = b;
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(root, t);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(900, t);
  lp.frequency.exponentialRampToValueAtTime(180, t + 0.2);
  const gain = env(ctx, t, 0.26, 0.004, 0.2);
  osc.connect(lp).connect(gain).connect(b.music);
  osc.start(t);
  osc.stop(t + 0.26);
  tone(ctx, b.music, t, root, 0.2, 0.2, "sine"); // sub under the saw
};
const stab = (b: Bus, t: number, chord: number[]) => chord.forEach((f) => {
  tone(b.ctx, b.music, t, f, 0.05, 0.32, "sawtooth");
  tone(b.ctx, b.music, t, f * 2, 0.025, 0.22, "square");
});
const pad = (b: Bus, t: number, chord: number[], length: number) => chord.forEach((f, i) => {
  const { ctx } = b;
  const osc = ctx.createOscillator();
  osc.type = i % 2 ? "triangle" : "sine";
  osc.frequency.setValueAtTime(f, t);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.06, t + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
  osc.connect(gain).connect(b.music);
  osc.start(t);
  osc.stop(t + length + 0.05);
});

// ---------------- fx ----------------
const boom = (b: Bus, t: number) => tone(b.ctx, b.fx, t, 70, 0.55, 1.1, "sine", 32, 0.9);
/** Noise swell that ends exactly on `hit`. */
const riser = (b: Bus, hit: number, length: number, peak = 0.16) =>
  noise(b, b.fx, hit - length, peak, 0.004, "bandpass", 300, 6500, 1.6, length - 0.004);
const pluck = (b: Bus, t: number, freq: number, peak = 0.12) => {
  tone(b.ctx, b.fx, t, freq, peak, 0.3, "triangle");
  tone(b.ctx, b.fx, t, freq * 2, peak * 0.3, 0.14, "sine");
};
const ping = (b: Bus, t: number, freq: number, peak = 0.08) => tone(b.ctx, b.fx, t, freq, peak, 0.6, "sine");
const slash = (b: Bus, t: number) => noise(b, b.fx, t, 0.22, 0.2, "bandpass", 700, 7500, 1.4);
const ripple = (b: Bus, t: number, letters: number) => {
  for (let i = 0; i < letters; i += 1) noise(b, b.fx, t + i * 0.012, 0.035, 0.014, "highpass", 4500 + i * 200);
};

const N = { A3: 220, C4: 261.63, E4: 329.63, G4: 392, A4: 440, C5: 523.25, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, E6: 1318.5, G6: 1568, A6: 1760 };

/** One cue per on-screen action. */
const CUES: Record<number, (b: Bus, t: number) => void> = {
  0: (b, t) => ripple(b, t, 9),                                         // PORTFOLIO
  1: (b, t) => pluck(b, t, N.C5),                                       // "I"
  2: (b, t) => pluck(b, t, N.E5),                                       // "find the"
  3: (b, t) => { pluck(b, t, N.G5); ping(b, t, N.G6); },                // "signal." — the dot lands
  4: (b, t) => ripple(b, t, 10),                                        // STATISTICS
  5: (b, t) => tone(b.ctx, b.fx, t, 330, 0.06, 0.42, "sine", 1320),     // curve draws
  6: (b, t) => ping(b, t, N.A6, 0.1),                                   // mean line drops
  7: (b, t) => pluck(b, t, N.A4),                                       // 统计学硕士
  8: (b, t) => ripple(b, t, 11),                                        // CORRELATION
  9: (b, t) => slash(b, t),                                             // struck out
  10: (b, t) => { ripple(b, t, 9); pluck(b, t, N.A3, 0.16); },          // CAUSATION
  11: (b, t) => pluck(b, t, N.E4),                                      // 相关，不等于因果
  12: (b, t) => pluck(b, t, N.C5),                                      // IDEA
  13: (b, t) => pluck(b, t, N.E5),                                      // PROTOTYPE
  14: (b, t) => { pluck(b, t, N.G5); ping(b, t, N.C6, 0.1); },          // SHIPPED.
  15: (b, t) => pluck(b, t, N.E4),                                      // 把想法，做成产品
  16: (b, t) => pluck(b, t, N.A3, 0.18),                                // ARGUE
  17: (b, t) => pluck(b, t, N.C4, 0.18),                                // LIKE IT
  18: (b, t) => { pluck(b, t, N.E4, 0.18); ping(b, t, N.A5, 0.08); },   // MATTERS.
  19: (b, t) => pluck(b, t, N.G4),                                      // 争鸣杯
  20: (b, t) => ripple(b, t, 6),                                        // Yan An.
  21: (b, t) => ping(b, t, N.E6, 0.07),                                 // sign line
  22: (b, t) => noise(b, b.fx, t, 0.14, 0.22, "bandpass", 200, 5000, 0.7), // the dot blooms (short, so the gap before 安颜 stays silent)
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
  master.gain.value = 0.8;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.ratio.value = 4;
  comp.attack.value = 0.003;
  comp.release.value = 0.12;
  master.connect(comp).connect(ctx.destination);
  const drums = ctx.createGain();
  drums.gain.value = 0.9;
  const music = ctx.createGain();
  const fx = ctx.createGain();
  fx.gain.value = 0.9;
  [drums, music, fx].forEach((bus) => bus.connect(master));

  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 1.5), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const bus: Bus = { ctx, drums, music, fx, noise: buffer };
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
      const silent = (time: number) => DROPS.some((d) => time >= zero + (d - 0.5) * BEAT - 0.001 && time < zero + d * BEAT - 0.001);

      for (let beat = 0; beat < BEATS; beat += 1) {
        const t = zero + beat * BEAT;
        const bar = Math.floor(beat / 4);
        const intro = bar === 0; // bar 1 builds: kick and hats only, the groove arrives on the first cut

        // Drums
        at(t, (x) => kick(bus, x, beat % 4 === 0 ? 1 : 0.85));
        if (!intro && beat % 2 === 1) at(t, (x) => clap(bus, x));
        for (let s = 0; s < 4; s += 1) {
          const ts = t + (s * BEAT) / 4;
          if (silent(ts)) continue;
          if (s === 2 && !intro) at(ts, (x) => openHat(bus, x));
          else at(ts, (x) => hat(bus, x, s === 0 ? 0.06 : 0.035));
        }

        // Bass on the off-beat, ducked by the next kick
        const off = t + BEAT / 2;
        if (!intro && !silent(off)) at(off, (x) => bass(bus, x, BAR_ROOTS[bar]));

        // Every cut: riser into the downbeat, then boom + crash + stab
        if (beat % 4 === 0) {
          if (beat > 0 && !DROPS.includes(beat)) at(t - BEAT / 2, () => riser(bus, t, BEAT / 2));
          if (beat > 0) at(t, (x) => { boom(bus, x); crash(bus, x); stab(bus, x, BAR_CHORDS[bar]); });
        }
        if (DROPS.includes(beat)) at(t, (x) => { boom(bus, x); crash(bus, x); });

        at(t, (x) => CUES[beat]?.(bus, x));
      }

      // Into the drop on the ink shot (beat 16): the half beat before it is silent, so the riser stops short.
      at(zero + 15 * BEAT, () => riser(bus, zero + 15.5 * BEAT, BEAT / 2, 0.12));
      // Into 安颜 landing on beat 23: a two-beat riser, half a beat of silence, then the hit.
      at(zero + 20.5 * BEAT, () => riser(bus, zero + 22.5 * BEAT, BEAT * 2, 0.2));
      at(zero + 23 * BEAT, (x) => { stab(bus, x, [220, 261.63, 329.63, 440]); pad(bus, x, [N.A3, N.C4, N.E4, N.A4], 3); });
      // The hand-off lands on a downbeat too.
      at(zero + BEATS * BEAT, (x) => { kick(bus, x, 0.9); crash(bus, x); });
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
