// Run with: npx tsx scripts/gen-icons.ts
// Generates PWA icons as simple canvas-drawn PNGs

import { createCanvas } from "canvas";
import { writeFileSync } from "fs";

function drawIcon(size: number): Buffer {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const s = size / 16; // scale factor

  // Background
  ctx.fillStyle = "#0a0a14";
  ctx.fillRect(0, 0, size, size);

  // Ship hull
  ctx.fillStyle = "#e8dcc8";
  for (let x = 2; x < 14; x++) {
    ctx.fillRect(x * s, 8 * s, s, s);
  }
  ctx.fillStyle = "#6b3e1c";
  for (let x = 3; x < 13; x++) {
    ctx.fillRect(x * s, 9 * s, s, s);
    ctx.fillRect(x * s, 10 * s, s, s);
  }
  ctx.fillStyle = "#c8b898";
  for (let x = 4; x < 12; x++) {
    ctx.fillRect(x * s, 11 * s, s, s);
  }

  // Mast
  ctx.fillStyle = "#6b3e1c";
  ctx.fillRect(7.5 * s, 3 * s, s, 5 * s);

  // Sail
  ctx.fillStyle = "#40c0f0";
  ctx.fillRect(6 * s, 4 * s, s, s);
  ctx.fillRect(5 * s, 5 * s, 4 * s, s);
  ctx.fillRect(5 * s, 6 * s, 5 * s, s);
  ctx.fillRect(6 * s, 7 * s, 4 * s, s);

  // Skull
  ctx.fillStyle = "#f0c040";
  ctx.fillRect(7 * s, 5.5 * s, 2 * s, 2 * s);

  // Water
  ctx.fillStyle = "rgba(30,60,100,0.5)";
  for (let x = 0; x < 16; x++) {
    const y = 12 + Math.sin(x * 0.8) * 0.5;
    ctx.fillRect(x * s, y * s, s, (16 - y) * s);
  }

  return canvas.toBuffer("image/png");
}

try {
  writeFileSync("public/icon-192.png", drawIcon(192));
  writeFileSync("public/icon-512.png", drawIcon(512));
  console.log("Icons generated!");
} catch (e) {
  console.error("Need 'canvas' package: npm install -D canvas");
  console.error(e);
}
