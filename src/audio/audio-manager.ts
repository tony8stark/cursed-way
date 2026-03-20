import type { SceneId } from "../engine/types";

type SFXType = "click" | "coin" | "curse" | "wave" | "splash" | "thunder" | "crewLoss" | "encounter";

const SFX_CONFIG: Record<SFXType, { frequency: number; duration: number; type: OscillatorType; gain: number; sweep?: number }> = {
  click: { frequency: 800, duration: 0.05, type: "square", gain: 0.15 },
  coin: { frequency: 1200, duration: 0.12, type: "sine", gain: 0.2, sweep: 2400 },
  curse: { frequency: 180, duration: 0.4, type: "sawtooth", gain: 0.1, sweep: 60 },
  wave: { frequency: 200, duration: 0.3, type: "sine", gain: 0.08 },
  splash: { frequency: 0, duration: 0, type: "sine", gain: 0 }, // handled by playSplash()
  thunder: { frequency: 80, duration: 0.5, type: "sawtooth", gain: 0.25, sweep: 30 },
  crewLoss: { frequency: 400, duration: 0.25, type: "triangle", gain: 0.12, sweep: 150 },
  encounter: { frequency: 220, duration: 0.15, type: "triangle", gain: 0.1, sweep: 120 },
};

// Procedural ambient configs per scene
interface AmbientConfig {
  baseFreq: number;
  modFreq: number;
  modDepth: number;
  filterFreq: number;
  gain: number;
  type: OscillatorType;
  lfoRate: number;
  noiseGain: number;
  // Second layer
  baseFreq2?: number;
  type2?: OscillatorType;
  gain2?: number;
}

const AMBIENT: Record<string, AmbientConfig> = {
  open_sea: {
    baseFreq: 80, modFreq: 0.08, modDepth: 15, filterFreq: 400,
    gain: 0.06, type: "sine", lfoRate: 0.12, noiseGain: 0.02,
    baseFreq2: 120, type2: "sine", gain2: 0.03,
  },
  storm: {
    baseFreq: 55, modFreq: 0.3, modDepth: 20, filterFreq: 800,
    gain: 0.08, type: "sawtooth", lfoRate: 0.5, noiseGain: 0.06,
    baseFreq2: 90, type2: "triangle", gain2: 0.04,
  },
  island: {
    baseFreq: 140, modFreq: 0.06, modDepth: 8, filterFreq: 600,
    gain: 0.04, type: "sine", lfoRate: 0.08, noiseGain: 0.01,
    baseFreq2: 210, type2: "sine", gain2: 0.02,
  },
  cave: {
    baseFreq: 65, modFreq: 0.04, modDepth: 10, filterFreq: 300,
    gain: 0.05, type: "sine", lfoRate: 0.06, noiseGain: 0.03,
    baseFreq2: 98, type2: "triangle", gain2: 0.02,
  },
  combat: {
    baseFreq: 70, modFreq: 0.8, modDepth: 25, filterFreq: 1200,
    gain: 0.07, type: "sawtooth", lfoRate: 1.5, noiseGain: 0.04,
    baseFreq2: 105, type2: "square", gain2: 0.03,
  },
  ethereal: {
    baseFreq: 110, modFreq: 0.03, modDepth: 30, filterFreq: 500,
    gain: 0.05, type: "sine", lfoRate: 0.04, noiseGain: 0.015,
    baseFreq2: 165, type2: "sine", gain2: 0.03,
  },
  port: {
    baseFreq: 100, modFreq: 0.05, modDepth: 5, filterFreq: 500,
    gain: 0.04, type: "triangle", lfoRate: 0.1, noiseGain: 0.01,
  },
  underwater: {
    baseFreq: 75, modFreq: 0.07, modDepth: 20, filterFreq: 350,
    gain: 0.06, type: "sine", lfoRate: 0.05, noiseGain: 0.025,
    baseFreq2: 113, type2: "sine", gain2: 0.03,
  },
  kraken: {
    baseFreq: 45, modFreq: 0.5, modDepth: 30, filterFreq: 600,
    gain: 0.08, type: "sawtooth", lfoRate: 0.8, noiseGain: 0.05,
    baseFreq2: 68, type2: "triangle", gain2: 0.04,
  },
};

interface AmbientNodes {
  osc1: OscillatorNode;
  osc2: OscillatorNode | null;
  lfo: OscillatorNode;
  noiseSource: AudioBufferSourceNode;
  masterGain: GainNode;
  filter: BiquadFilterNode;
}

class AudioManager {
  private ctx: AudioContext | null = null;
  private musicVolume = 0.3;
  private sfxVolume = 0.5;
  private muted = false;
  private ambientNodes: AmbientNodes | null = null;
  private currentScene: string | null = null;
  private fadeTimeout: ReturnType<typeof setTimeout> | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private createNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
    const rate = ctx.sampleRate;
    const buf = ctx.createBuffer(1, rate * seconds, rate);
    const data = buf.getChannelData(0);
    // Brown noise (smoother than white)
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    return buf;
  }

  playSFX(type: SFXType) {
    if (this.muted) return;
    if (type === "splash") {
      this.playSplash();
      return;
    }
    try {
      const ctx = this.getContext();
      const config = SFX_CONFIG[type];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = config.type;
      osc.frequency.setValueAtTime(config.frequency, ctx.currentTime);

      if (config.sweep) {
        osc.frequency.exponentialRampToValueAtTime(config.sweep, ctx.currentTime + config.duration);
      }

      gain.gain.setValueAtTime(config.gain * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + config.duration);
    } catch {
      // Audio not available
    }
  }

  // Realistic wave splash: filtered white noise burst + low rumble
  private playSplash() {
    try {
      const ctx = this.getContext();
      const t = ctx.currentTime;
      const vol = this.sfxVolume;

      // Layer 1: noise burst through bandpass (splash)
      const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1.6, ctx.sampleRate);
      const noiseData = noiseBuf.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(1200, t);
      bandpass.frequency.exponentialRampToValueAtTime(300, t + 1.2);
      bandpass.Q.setValueAtTime(0.6, t);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0, t);
      noiseGain.gain.linearRampToValueAtTime(0.16 * vol, t + 0.05);
      noiseGain.gain.linearRampToValueAtTime(0.10 * vol, t + 0.4);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(t);
      noise.stop(t + 1.6);

      // Layer 2: low rumble (hull meeting water)
      const rumble = ctx.createOscillator();
      rumble.type = "sine";
      rumble.frequency.setValueAtTime(55, t);
      rumble.frequency.exponentialRampToValueAtTime(30, t + 1.0);

      const rumbleGain = ctx.createGain();
      rumbleGain.gain.setValueAtTime(0.07 * vol, t);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, t + 1.0);

      rumble.connect(rumbleGain);
      rumbleGain.connect(ctx.destination);
      rumble.start(t);
      rumble.stop(t + 1.0);

      // Layer 3: high fizz (foam/spray) - delayed, longer tail
      const fizz = ctx.createBufferSource();
      fizz.buffer = noiseBuf;
      const highpass = ctx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.setValueAtTime(2500, t);
      highpass.Q.setValueAtTime(0.4, t);

      const fizzGain = ctx.createGain();
      fizzGain.gain.setValueAtTime(0, t);
      fizzGain.gain.linearRampToValueAtTime(0.04 * vol, t + 0.15);
      fizzGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

      fizz.connect(highpass);
      highpass.connect(fizzGain);
      fizzGain.connect(ctx.destination);
      fizz.start(t + 0.08);
      fizz.stop(t + 1.0);
    } catch {
      // Audio not available
    }
  }

  playAmbient(scene: SceneId) {
    if (this.currentScene === scene) return;
    this.currentScene = scene;

    const config = AMBIENT[scene] || AMBIENT.open_sea;

    try {
      const ctx = this.getContext();

      // Fade out existing
      if (this.ambientNodes) {
        const old = this.ambientNodes;
        const oldGain = old.masterGain;
        oldGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
        if (this.fadeTimeout) clearTimeout(this.fadeTimeout);
        this.fadeTimeout = setTimeout(() => {
          try {
            old.osc1.stop();
            old.osc2?.stop();
            old.lfo.stop();
            old.noiseSource.stop();
          } catch { /* already stopped */ }
        }, 1600);
      }

      // Master gain
      const masterGain = ctx.createGain();
      const targetGain = this.muted ? 0 : config.gain * this.musicVolume;
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 2);
      masterGain.connect(ctx.destination);

      // Low-pass filter for warmth
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(config.filterFreq, ctx.currentTime);
      filter.Q.setValueAtTime(1, ctx.currentTime);
      filter.connect(masterGain);

      // Main oscillator
      const osc1 = ctx.createOscillator();
      osc1.type = config.type;
      osc1.frequency.setValueAtTime(config.baseFreq, ctx.currentTime);
      const osc1Gain = ctx.createGain();
      osc1Gain.gain.setValueAtTime(1, ctx.currentTime);
      osc1.connect(osc1Gain);
      osc1Gain.connect(filter);

      // LFO for frequency modulation
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(config.lfoRate, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(config.modDepth, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);

      // Second oscillator (harmony layer)
      let osc2: OscillatorNode | null = null;
      if (config.baseFreq2) {
        osc2 = ctx.createOscillator();
        osc2.type = config.type2 || "sine";
        osc2.frequency.setValueAtTime(config.baseFreq2, ctx.currentTime);
        const osc2Gain = ctx.createGain();
        osc2Gain.gain.setValueAtTime(config.gain2 || 0.02, ctx.currentTime);
        osc2.connect(osc2Gain);
        osc2Gain.connect(filter);

        // Slow detune for movement
        const lfo2 = ctx.createOscillator();
        lfo2.type = "sine";
        lfo2.frequency.setValueAtTime(config.modFreq * 0.7, ctx.currentTime);
        const lfo2Gain = ctx.createGain();
        lfo2Gain.gain.setValueAtTime(config.modDepth * 0.5, ctx.currentTime);
        lfo2.connect(lfo2Gain);
        lfo2Gain.connect(osc2.frequency);
        lfo2.start(ctx.currentTime);
      }

      // Noise layer (ocean/wind texture)
      const noiseBuf = this.createNoiseBuffer(ctx, 4);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuf;
      noiseSource.loop = true;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(config.noiseGain, ctx.currentTime);
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.setValueAtTime(config.filterFreq * 0.7, ctx.currentTime);
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      // Start everything
      osc1.start(ctx.currentTime);
      lfo.start(ctx.currentTime);
      osc2?.start(ctx.currentTime);
      noiseSource.start(ctx.currentTime);

      this.ambientNodes = { osc1, osc2, lfo, noiseSource, masterGain, filter };
    } catch {
      // Audio not available
    }
  }

  stopAmbient() {
    if (!this.ambientNodes || !this.ctx) return;
    const ctx = this.ctx;
    const nodes = this.ambientNodes;
    nodes.masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    setTimeout(() => {
      try {
        nodes.osc1.stop();
        nodes.osc2?.stop();
        nodes.lfo.stop();
        nodes.noiseSource.stop();
      } catch { /* already stopped */ }
    }, 1100);
    this.ambientNodes = null;
    this.currentScene = null;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.ambientNodes && this.ctx) {
      const scene = this.currentScene;
      const config = scene ? (AMBIENT[scene] || AMBIENT.open_sea) : AMBIENT.open_sea;
      const target = muted ? 0 : config.gain * this.musicVolume;
      this.ambientNodes.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.3);
    }
  }

  setMusicVolume(vol: number) {
    this.musicVolume = vol;
    if (!this.muted && this.ambientNodes && this.ctx) {
      const scene = this.currentScene;
      const config = scene ? (AMBIENT[scene] || AMBIENT.open_sea) : AMBIENT.open_sea;
      this.ambientNodes.masterGain.gain.linearRampToValueAtTime(config.gain * vol, this.ctx.currentTime + 0.3);
    }
  }

  setSfxVolume(vol: number) {
    this.sfxVolume = vol;
  }

  isMuted() {
    return this.muted;
  }

  getMusicVolume() { return this.musicVolume; }
  getSfxVolume() { return this.sfxVolume; }
}

export const audioManager = new AudioManager();
