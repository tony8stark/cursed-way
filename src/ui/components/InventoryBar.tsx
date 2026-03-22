import { ARTIFACTS } from "../../engine/items";
import { ITEM_NAMES } from "../../engine/items-i18n";
import { useLocaleStore, useT } from "../../i18n";
import type { ArtifactLog } from "../../engine/types";

interface InventoryBarProps {
  inventory: string[];
  artifactLog?: ArtifactLog[];
}

export function InventoryBar({ inventory, artifactLog }: InventoryBarProps) {
  const locale = useLocaleStore(s => s.locale);
  const t = useT();

  if (inventory.length === 0) return null;

  return (
    <div className="flex gap-1 justify-center my-2 flex-wrap">
      {inventory.map((id, i) => {
        const def = ARTIFACTS[id];
        const name = ITEM_NAMES[id]?.[locale] ?? id;
        // Find acquisition info
        const logEntry = artifactLog?.find(l => l.itemId === id);
        const tooltip = logEntry
          ? `${name} (${t("day")} ${logEntry.day}: ${logEntry.encounterTitle})`
          : name;
        return (
          <div
            key={`${id}-${i}`}
            className="w-7 h-7 flex items-center justify-center rounded border text-sm"
            style={{
              borderColor: def?.rarity === "cursed" ? "#8020c0"
                : def?.rarity === "rare" ? "#f0c040"
                : "#40c0f0",
              background: "rgba(0,0,0,0.3)",
            }}
            title={tooltip}
          >
            {def?.icon || "?"}
          </div>
        );
      })}
    </div>
  );
}
