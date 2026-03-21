import { motion } from "framer-motion";
import { FACTIONS, FACTION_IDS, getFactionTier, type FactionId } from "../../engine/factions";
import type { FactionReps } from "../../engine/factions";
import { useLocaleStore } from "../../i18n";

interface Props {
  reps: FactionReps;
}

function FactionRow({ factionId, rep }: { factionId: FactionId; rep: number }) {
  const locale = useLocaleStore(s => s.locale);
  const faction = FACTIONS[factionId];
  const tier = getFactionTier(factionId, rep);

  // Normalize rep from [-10, 10] to [0, 100] for display
  const pct = ((rep + 10) / 20) * 100;

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] w-[16px] text-center">{faction.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-1 mb-0.5">
          <span className="font-game text-[7px] text-white/50 truncate">
            {faction.name[locale]}
          </span>
          <span className="font-game text-[6px] shrink-0" style={{ color: tier.color }}>
            {tier.name[locale]}
          </span>
        </div>
        {/* Rep bar: center = neutral, left = hostile, right = allied */}
        <div className="h-[3px] bg-white/8 rounded overflow-hidden relative">
          {/* Center marker */}
          <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white/15" />
          {/* Rep fill */}
          <motion.div
            initial={false}
            animate={{
              left: rep >= 0 ? "50%" : `${pct}%`,
              width: rep >= 0 ? `${(rep / 10) * 50}%` : `${(50 - pct)}%`,
            }}
            transition={{ duration: 0.4 }}
            className="absolute top-0 h-full rounded"
            style={{ background: tier.color }}
          />
        </div>
      </div>
      <span className="font-game text-[7px] w-[20px] text-right" style={{ color: tier.color }}>
        {rep > 0 ? `+${rep}` : rep}
      </span>
    </div>
  );
}

export function FactionBar({ reps }: Props) {
  return (
    <div className="rounded border border-white/10 bg-black/30 px-2.5 py-2 flex flex-col gap-1.5">
      {FACTION_IDS.map(id => (
        <FactionRow key={id} factionId={id} rep={reps[id]} />
      ))}
    </div>
  );
}
