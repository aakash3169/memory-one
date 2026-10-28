// Exact port of Octomocto's Web Audio API synthesizer (Xs in app.js)

let ctx: AudioContext | null = null;

export function unlockAudio(): void {
  if (typeof window === 'undefined') return;
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  if (!ctx) {
    try {
      ctx = new AudioCtx();
    } catch {
      return;
    }
  }
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

interface EnvelopeOpts {
  start?: number;
  duration: number;
  gain: number;
  attack?: number;
  filter?: number;
  filterEnd?: number;
  filterType?: BiquadFilterType;
}

function connectEnvelope(
  source: AudioScheduledSourceNode & AudioNode,
  { start = 0, duration, gain, attack = 0.005, filter, filterEnd, filterType = 'lowpass' }: EnvelopeOpts
): void {
  if (!ctx) return;
  const now = ctx.currentTime + start;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  let node: AudioNode = source;
  if (filter) {
    const bq = ctx.createBiquadFilter();
    bq.type = filterType;
    bq.frequency.setValueAtTime(filter, now);
    if (filterEnd) {
      bq.frequency.exponentialRampToValueAtTime(filterEnd, now + duration);
    }
    node = node.connect(bq);
  }
  node.connect(g).connect(ctx.destination);
  source.start(now);
  source.stop(now + duration + 0.05);
}

interface ToneOpts extends EnvelopeOpts {
  type?: OscillatorType;
  freq: number;
  freqEnd?: number;
}

function playTone({
  type = 'sine',
  freq,
  freqEnd,
  start = 0,
  duration,
  gain,
  attack = 0.005,
  filter,
  filterEnd,
  filterType = 'lowpass',
}: ToneOpts): void {
  if (!ctx) return;
  const now = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (freqEnd) {
    osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);
  }
  connectEnvelope(osc, { start, duration, gain, attack, filter, filterEnd, filterType });
}

function playNoise({
  start = 0,
  duration,
  gain,
  attack = 0.005,
  filter,
  filterEnd,
  filterType = 'lowpass',
}: EnvelopeOpts): void {
  if (!ctx) return;
  const len = Math.ceil(ctx.sampleRate * (duration + 0.05));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  connectEnvelope(src, { start, duration, gain, attack, filter, filterEnd, filterType });
}

export type MemorySoundName = 'start' | 'flip' | 'match' | 'boom' | 'turn' | 'win' | 'lose' | 'lobby';

const soundBank: Record<MemorySoundName, () => void> = {
  start() {
    [523, 659, 784].forEach((f, i) =>
      playTone({ type: 'triangle', freq: f, start: i * 0.08, duration: 0.12, gain: 0.14 })
    );
    for (const f of [659, 784, 1047]) {
      playTone({ type: 'triangle', freq: f, start: 0.24, duration: 0.5, gain: 0.07, attack: 0.01 });
    }
  },
  flip() {
    playNoise({ duration: 0.06, gain: 0.05, filter: 3000, filterEnd: 1200, filterType: 'bandpass' });
  },
  match() {
    playTone({ freq: 660, duration: 0.12, gain: 0.12, start: 0.15 });
    playTone({ freq: 990, duration: 0.2, gain: 0.12, start: 0.25 });
  },
  boom() {
    playNoise({ duration: 0.6, gain: 0.25, filter: 900, filterEnd: 80, filterType: 'lowpass' });
    playTone({ freq: 110, freqEnd: 40, duration: 0.5, gain: 0.15 });
  },
  turn() {
    playTone({ freq: 784, duration: 0.1, gain: 0.08, start: 0.3 });
    playTone({ freq: 1047, duration: 0.15, gain: 0.08, start: 0.4 });
  },
  win() {
    [523, 659, 784].forEach((f, i) =>
      playTone({ freq: f, start: i * 0.1, duration: 0.2, gain: 0.13 })
    );
    playTone({ freq: 1047, start: 0.3, duration: 0.6, gain: 0.13 });
  },
  lose() {
    playTone({ freq: 659, duration: 0.3, gain: 0.1 });
    playTone({ freq: 523, start: 0.25, duration: 0.6, gain: 0.1 });
  },
  lobby() {
    playTone({ freq: 880, duration: 0.15, gain: 0.1 });
    playTone({ freq: 1319, start: 0.12, duration: 0.35, gain: 0.1 });
  },
};

export function playMemorySound(name: MemorySoundName, muted = false): void {
  if (muted) return;
  unlockAudio();
  if (!ctx) return;
  try {
    soundBank[name]?.();
  } catch {
    // Ignore audio context errors in headless/restricted environments
  }
}
