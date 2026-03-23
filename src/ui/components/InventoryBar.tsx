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
        const logEntry = artifactLog?.find(l => l.itemId === id);
        const tooltip = logEntry
          ? `${name} (${t("day")} ${logEntry.day}: ${logEntry.encounterTitle})`
          : name;
        const borderColor = def?.rarity === "cursed" ? "#8020c0"
          : def?.rarity === "rare" ? "#f0c040"
          : "#40c0f0";
        return (
          <div
            key={`${id}-${i}`}
            className="w-8 h-8 flex items-center justify-center rounded border"
            style={{
              borderColor,
              background: "rgba(0,0,0,0.4)",
              boxShadow: `0 0 4px ${borderColor}40`,
            }}
            title={tooltip}
          >
            {def?.iconPath ? (
              <img
                src={def.iconPath}
                alt={name}
                className="w-6 h-6"
                style={{ imageRendering: "pixelated" }}
              />
            ) : (
              <span className="text-sm">{def?.icon || "?"}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
