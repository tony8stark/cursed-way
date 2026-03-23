import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { NPCS, drawNPCPortrait, type NPCDef } from "../../engine/npcs";
import { useGameStore } from "../../engine/state";
import { useT, useLocaleStore } from "../../i18n";
import type { NPCMeeting } from "../../engine/types";

interface Props {
  onClose: () => void;
}

const CATEGORY_ORDER: NPCDef["category"][] = [
  "merchant",
  "pirate",
  "official",
  "mystic",
  "crew",
  "civilian",
  "supernatural",
];

const CATEGORY_ICONS: Record<NPCDef["category"], string> = {
  merchant: "🪙",
  pirate: "🏴‍☠️",
  official: "⚓",
  mystic: "🔮",
  crew: "⛵",
  civilian: "🏠",
  supernatural: "👻",
};

const CATEGORY_LABELS: Record<NPCDef["category"], Record<"uk" | "en", string>> = {
  merchant: { uk: "Торговці", en: "Merchants" },
  pirate: { uk: "Пірати", en: "Pirates" },
  official: { uk: "Чиновники", en: "Officials" },
  mystic: { uk: "Містики", en: "Mystics" },
  crew: { uk: "Екіпаж", en: "Crew" },
  civilian: { uk: "Цивільні", en: "Civilians" },
  supernatural: { uk: "Надприродні", en: "Supernatural" },
};

const ALL_NPCS = Object.values(NPCS);
const TOTAL_NPCS = ALL_NPCS.length;

/** NPC portrait: sprite image with fallback to canvas pixel art */
function NPCPortrait({ npc, met, size = 48 }: { npc: NPCDef; met: boolean; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasSprite = !!npc.spritePath;

  // Canvas fallback for NPCs without sprites
  useEffect(() => {
    if (hasSprite) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scale = 3;
    ctx.clearRect(0, 0, 30, 36);
    if (met) {
      drawNPCPortrait(ctx, npc.portrait, 0, 0, scale);
    } else {
      const { pixels } = npc.portrait;
      for (let row = 0; row < pixels.length; row++) {
        const cols = pixels[row];
        for (let col = 0; col < cols.length; col++) {
          if (cols[col] < 0) continue;
          ctx.fillStyle = "#2a2a4a";
          ctx.fillRect(col * scale, row * scale, scale, scale);
        }
      }
    }
  }, [npc, met, hasSprite]);

  if (hasSprite) {
    return (
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <img
          src={npc.spritePath}
          alt={npc.name.en}
          style={{
            width: size,
            height: size,
            imageRendering: "pixelated",
            filter: met ? "none" : "brightness(0.15) saturate(0)",
            opacity: met ? 1 : 0.5,
          }}
        />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={30}
      height={36}
      className={`pixelated flex-shrink-0 ${!met ? "opacity-40" : ""}`}
      style={{ imageRendering: "pixelated" }}
    />
  );
}

export function NPCJournal({ onClose }: Props) {
  const state = useGameStore(s => s.state);
  const locale = useLocaleStore(s => s.locale);
  const t = useT();

  const meetings = state?.npcMeetings ?? [];
  const meetingMap = useMemo(() => {
    const map = new Map<string, NPCMeeting>();
    for (const m of meetings) {
      if (!map.has(m.npcId)) map.set(m.npcId, m);
    }
    return map;
  }, [meetings]);

  const metCount = meetingMap.size;

  // Group NPCs by category
  const grouped = useMemo(() => {
    const groups = new Map<NPCDef["category"], NPCDef[]>();
    for (const cat of CATEGORY_ORDER) {
      groups.set(cat, []);
    }
    for (const npc of ALL_NPCS) {
      groups.get(npc.category)?.push(npc);
    }
    return groups;
  }, []);

  let itemIndex = 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#0e0e2a] border border-white/10 rounded-lg p-5 max-w-[540px] w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <span className="font-game text-[12px] text-[#f0c040]">{t("npcJournal")}</span>
          <span className="font-game text-[9px] text-white/40">
            {t("npcsMet").replace("{0}", String(metCount)).replace("{1}", String(TOTAL_NPCS))}
          </span>
        </div>

        {CATEGORY_ORDER.map(cat => {
          const npcs = grouped.get(cat);
          if (!npcs || npcs.length === 0) return null;
          return (
            <div key={cat} className="mb-4 last:mb-0">
              <div className="font-game text-[8px] text-white/30 mb-2 uppercase tracking-wider">
                {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat][locale]}
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {npcs.map(npc => {
                  const meeting = meetingMap.get(npc.id);
                  const met = !!meeting;
                  const idx = itemIndex++;
                  return (
                    <motion.div
                      key={npc.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className={`flex items-center gap-3 rounded px-3 py-2 border ${
                        met
                          ? "bg-[#f0c040]/[0.04] border-[#f0c040]/15"
                          : "bg-white/[0.01] border-white/5"
                      }`}
                    >
                      <NPCPortrait npc={npc} met={met} />
                      <div className="flex-1 min-w-0">
                        <div className={`font-game text-[9px] ${met ? "text-[#e8dcc8]" : "text-white/20"}`}>
                          {met ? `${npc.icon} ${npc.name[locale]}` : t("npcUnknown")}
                        </div>
                        <div className={`font-game text-[7px] mt-0.5 ${met ? "text-white/40" : "text-white/10"}`}>
                          {met ? npc.title[locale] : "???"}
                        </div>
                        {met && meeting && (
                          <div className="font-game text-[7px] mt-0.5 text-white/25">
                            {t("npcMetOn")
                              .replace("{day}", String(meeting.day))
                              .replace("{where}", meeting.encounterTitle)}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <button
          onClick={onClose}
          className="mt-4 w-full font-game text-[10px] text-white/40 hover:text-white/70 transition-colors py-2"
        >
          {t("close")}
        </button>
      </motion.div>
    </motion.div>
  );
}
