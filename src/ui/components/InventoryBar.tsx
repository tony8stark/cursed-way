import { ARTIFACTS } from "../../engine/items";
import { ITEM_NAMES, ITEM_DESCRIPTIONS } from "../../engine/items-i18n";
import { useLocaleStore, useT } from "../../i18n";
import type { ArtifactLog } from "../../engine/types";

interface InventoryBarProps {
  inventory: string[];
  artifactLog?: ArtifactLog[];
}

/** Format passive effect as human-readable string */
function formatEffect(
  def: (typeof ARTIFACTS)[string],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: any) => string,
): string | null {
  const parts: string[] = [];

  if (def.passive) {
    const { stat, perDay } = def.passive;
    const statName = t(stat);
    const fmt = (n: number) => n > 0 ? `+${n}` : `${n}`;
    if (Array.isArray(perDay)) {
      const [min, max] = perDay;
      if (min === max) {
        parts.push(`${statName} ${fmt(min)}/day`);
      } else {
        parts.push(`${statName} ${fmt(min)}..${fmt(max)}/day`);
      }
    } else {
      parts.push(`${statName} ${fmt(perDay)}/day`);
    }
  }

  if (def.revealRadius) {
    parts.push(`👁 +${def.revealRadius}`);
  }

  return parts.length > 0 ? parts.join(" | ") : null;
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
        const desc = ITEM_DESCRIPTIONS[id]?.[locale];
        const effect = def ? formatEffect(def, t) : null;
        const logEntry = artifactLog?.find(l => l.itemId === id);

        // Build multi-line tooltip
        const lines: string[] = [name];
        if (desc) lines.push(desc);
        if (effect) lines.push(effect);
        if (logEntry) lines.push(`${t("day")} ${logEntry.day}: ${logEntry.encounterTitle}`);
        const tooltip = lines.join("\n");

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
