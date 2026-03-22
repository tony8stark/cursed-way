import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules/react") || id.includes("node_modules/framer-motion") || id.includes("node_modules/zustand")) {
            return "vendor";
          }
          if (id.includes("/quests/cursed-galleon/")) {
            return "quest-data";
          }
          if (id.includes("/renderer/location-pools") || id.includes("/renderer/map-generator") || id.includes("/renderer/world-map") || id.includes("/engine/npcs")) {
            return "map-data";
          }
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Black Tide",
        short_name: "Black Tide",
        description: "Pirate text adventure with consequences",
        theme_color: "#0a0a14",
        background_color: "#0a0a14",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
      },
    }),
  ],
});
