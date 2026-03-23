import { motion, AnimatePresence } from "framer-motion";
import { ARTIFACTS } from "../../engine/items";
import { ITEM_NAMES, ITEM_DESCRIPTIONS } from "../../engine/items-i18n";
import { useLocaleStore, useT } from "../../i18n";

interface Props {
  itemId: string | null;
  onDone: () => void;
}

export function ItemToast({ itemId, onDone }: Props) {
  const locale = useLocaleStore(s => s.locale);
  const t = useT();
  const def = itemId ? ARTIFACTS[itemId] : null;
  const name = itemId ? ITEM_NAMES[itemId]?.[locale] ?? itemId : "";
  const desc = itemId ? ITEM_DESCRIPTIONS[itemId]?.[locale] : "";

  const borderColor = def?.rarity === "cursed" ? "#8020c0"
    : def?.rarity === "rare" ? "#f0c040"
    : "#40c0f0";

  return (
    <AnimatePresence>
      {itemId && def && (
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 60, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 15 }}
          onAnimationComplete={(anim) => {
            if (anim === "animate" || (typeof anim === "object" && "opacity" in anim)) {
              setTimeout(onDone, 3000);
            }
          }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg shadow-black/40"
          style={{
            background: "rgba(14,14,42,0.95)",
            border: `1px solid ${borderColor}60`,
            boxShadow: `0 0 20px ${borderColor}20`,
          }}
        >
          {def.iconPath ? (
            <img
              src={def.iconPath}
              alt={name}
              className="w-10 h-10"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <span className="text-2xl">{def.icon}</span>
          )}
          <div>
            <div className="font-game text-[8px] mb-1" style={{ color: borderColor }}>
              {t("itemFound")}
            </div>
            <div className="font-game text-[10px] text-[#e8dcc8]">{name}</div>
            {desc && (
              <div className="font-game text-[7px] text-white/40 mt-0.5">{desc}</div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
