export type TimeOfDay = "dawn" | "day" | "dusk" | "night";
export type WeatherType = "clear" | "overcast" | "foggy" | "rain";

export interface AtmospherePalette {
  sky: string;
  water: string;
  waterHighlight: string;
  accent: string;
}

export interface AtmosphereState {
  time: TimeOfDay;
  weather: WeatherType;
  palette: AtmospherePalette;
}

const PALETTES: Record<TimeOfDay, AtmospherePalette> = {
  dawn: {
    sky: "#2a1a3e",
    water: "#1a2040",
    waterHighlight: "rgba(60,30,50,0.35)",
    accent: "#f0a040",
  },
  day: {
    sky: "#0e1a3a",
    water: "#0a1a3e",
    waterHighlight: "rgba(30,40,70,0.35)",
    accent: "#40c0f0",
  },
  dusk: {
    sky: "#2a1018",
    water: "#1a1028",
    waterHighlight: "rgba(50,20,30,0.35)",
    accent: "#f06040",
  },
  night: {
    sky: "#06060e",
    water: "#04040a",
    waterHighlight: "rgba(15,10,30,0.35)",
    accent: "#4040a0",
  },
};

const WATCH_TO_TIME: TimeOfDay[] = ["dawn", "day", "dusk", "night"];

function getTimeOfDay(day: number, watch?: number): TimeOfDay {
  // If watch is provided, use it directly
  if (watch !== undefined && watch >= 0 && watch <= 3) {
    return WATCH_TO_TIME[watch];
  }
  // Legacy fallback for day-based time
  if (day <= 5) return "dawn";
  if (day <= 10) return "day";
  if (day <= 15) return "dusk";
  return "night";
}

// Simple seeded random from two numbers
function seededRand(a: number, b: number): number {
  let h = (a * 2654435761) ^ (b * 2246822519);
  h = ((h >>> 16) ^ h) * 0x45d9f3b;
  return ((h >>> 16) ^ h) / 0x100000000 + 0.5;
}

function getWeather(day: number, encounterId?: string): WeatherType {
  const seed = encounterId ? encounterId.length + day : day;
  const r = seededRand(day, seed);
  if (r < 0.4) return "clear";
  if (r < 0.65) return "overcast";
  if (r < 0.8) return "foggy";
  return "rain";
}

export function getAtmosphere(day: number, watch?: number, encounterId?: string): AtmosphereState {
  const time = getTimeOfDay(day, watch);
  const weather = getWeather(day, encounterId);
  return {
    time,
    weather,
    palette: PALETTES[time],
  };
}

/** Draw fog overlay on the canvas */
export function drawFogOverlay(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  f: number,
  weather: WeatherType,
) {
  if (weather === "foggy") {
    ctx.fillStyle = `rgba(180,180,200,${0.08 + Math.sin(f * 0.01) * 0.03})`;
    ctx.fillRect(0, 0, W, H);
    // Drifting fog patches
    for (let i = 0; i < 4; i++) {
      const fx = (Math.sin(f * 0.005 + i * 2.1) * 0.5 + 0.5) * W;
      const fy = (Math.cos(f * 0.004 + i * 1.7) * 0.3 + 0.5) * H;
      const r = 40 + Math.sin(f * 0.008 + i) * 15;
      const gd = ctx.createRadialGradient(fx, fy, 0, fx, fy, r);
      gd.addColorStop(0, "rgba(200,200,220,0.12)");
      gd.addColorStop(1, "rgba(200,200,220,0)");
      ctx.fillStyle = gd;
      ctx.fillRect(fx - r, fy - r, r * 2, r * 2);
    }
  } else if (weather === "overcast") {
    ctx.fillStyle = "rgba(100,100,120,0.04)";
    ctx.fillRect(0, 0, W, H);
  }
}
