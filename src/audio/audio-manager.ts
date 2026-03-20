import { Howl } from "howler";

type SFXType = "click" | "coin" | "curse" | "wave" | "thunder";

const SFX_CONFIG: Record<SFXType, { frequency: number; duration: number; type: OscillatorType; gain: number }> = {
  click: { frequency: 800, duration: 0.05, type: "square", gain: 0.15 },
  coin: { frequency: 1200, duration: 0.12, type: "sine", gain: 0.2 },
  curse: { frequency: 180, duration: 0.4, type: "sawtooth", gain: 0.1 },
  wave: { frequency: 200, duration: 0.3, type: "sine", gain: 0.08 },
  thunder: { frequency: 80, duration: 0.5, type: "sawtooth", gain: 0.25 },
};

class AudioManager {
  private ctx: AudioContext | null = null;
  private musicVolume = 0.3;
  private sfxVolume = 0.5;
  private muted = false;
  private currentMusic: Howl | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    return this.ctx;
  }

  playSFX(type: SFXType) {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const config = SFX_CONFIG[type];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = config.type;
      osc.frequency.setValueAtTime(config.frequency, ctx.currentTime);

      if (type === "coin") {
        osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + config.duration);
      } else if (type === "curse") {
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + config.duration);
      } else if (type === "thunder") {
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + config.duration);
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

  playMusic(src: string) {
    if (this.currentMusic) {
      this.currentMusic.fade(this.musicVolume, 0, 1000);
      const old = this.currentMusic;
      setTimeout(() => old.stop(), 1000);
    }

    this.currentMusic = new Howl({
      src: [src],
      loop: true,
      volume: 0,
    });
    this.currentMusic.play();
    this.currentMusic.fade(0, this.muted ? 0 : this.musicVolume, 1500);
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.fade(this.musicVolume, 0, 1000);
      const old = this.currentMusic;
      setTimeout(() => { old.stop(); old.unload(); }, 1000);
      this.currentMusic = null;
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.currentMusic) {
      this.currentMusic.volume(muted ? 0 : this.musicVolume);
    }
  }

  isMuted() {
    return this.muted;
  }
}

export const audioManager = new AudioManager();
