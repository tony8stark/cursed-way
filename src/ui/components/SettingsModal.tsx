import { useState } from "react";
import { motion } from "framer-motion";
import { audioManager } from "../../audio/audio-manager";
import { useT, useLocaleStore, type Locale } from "../../i18n";

interface Props {
  onClose: () => void;
}

export function SettingsModal({ onClose }: Props) {
  const [musicVol, setMusicVol] = useState(audioManager.getMusicVolume());
  const [sfxVol, setSfxVol] = useState(audioManager.getSfxVolume());
  const t = useT();
  const { locale, setLocale } = useLocaleStore();

  const languages: { code: Locale; label: string }[] = [
    { code: "uk", label: "Українська" },
    { code: "en", label: "English" },
  ];

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
        className="bg-[#0e0e2a] border border-white/10 rounded-lg p-5 max-w-[400px] w-full"
      >
        <div className="font-game text-[12px] text-[#f0c040] mb-5">{t("settings")}</div>

        <div className="space-y-5">
          {/* Language */}
          <div>
            <label className="font-game text-[8px] text-white/50 block mb-2">
              {t("language")}
            </label>
            <div className="flex gap-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLocale(lang.code)}
                  className={`font-game text-[9px] px-3 py-1.5 rounded border transition-all duration-200 ${
                    locale === lang.code
                      ? "border-[#f0c040] text-[#f0c040] bg-[#f0c040]/10"
                      : "border-white/10 text-white/30 hover:text-white/50 hover:border-white/30"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Music */}
          <div>
            <label className="font-game text-[8px] text-white/50 block mb-2">
              {t("music")}: {Math.round(musicVol * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVol * 100}
              onChange={e => {
                const v = Number(e.target.value) / 100;
                setMusicVol(v);
                audioManager.setMusicVolume(v);
              }}
              className="w-full accent-[#f0c040] h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
            />
          </div>

          {/* SFX */}
          <div>
            <label className="font-game text-[8px] text-white/50 block mb-2">
              {t("sfx")}: {Math.round(sfxVol * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={sfxVol * 100}
              onChange={e => {
                const v = Number(e.target.value) / 100;
                setSfxVol(v);
                audioManager.setSfxVolume(v);
                audioManager.playSFX("click");
              }}
              className="w-full accent-[#40c0f0] h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full font-game text-[10px] text-white/40 hover:text-white/70 transition-colors py-2 border border-white/10 rounded hover:border-white/30"
        >
          {t("close")}
        </button>
      </motion.div>
    </motion.div>
  );
}
