interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
}

export class ParticleSystem {
  particles: Particle[] = [];

  emit(count: number, config: {
    x: number; y: number;
    w?: number; h?: number;
    vxRange?: [number, number]; vyRange?: [number, number];
    life?: number; size?: number;
    color?: string; alpha?: number;
  }) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: config.x + Math.random() * (config.w ?? 0),
        y: config.y + Math.random() * (config.h ?? 0),
        vx: lerp(config.vxRange?.[0] ?? -0.5, config.vxRange?.[1] ?? 0.5),
        vy: lerp(config.vyRange?.[0] ?? -1, config.vyRange?.[1] ?? -0.5),
        life: config.life ?? 60,
        maxLife: config.life ?? 60,
        size: config.size ?? 2,
        color: config.color ?? "#fff",
        alpha: config.alpha ?? 0.6,
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      const t = p.life / p.maxLife;
      ctx.globalAlpha = p.alpha * t;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  clear() {
    this.particles = [];
  }
}

function lerp(a: number, b: number): number {
  return a + Math.random() * (b - a);
}
