import { useState, useEffect, useCallback } from "react";

interface Props {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypewriterText({ text, speed = 30, className, onComplete }: Props) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    let timeout: number;

    const tick = () => {
      if (i >= text.length) {
        setDone(true);
        onComplete?.();
        return;
      }
      i++;
      setDisplayed(text.slice(0, i));

      // Slow down on punctuation
      const ch = text[i - 1];
      const delay = ".!?".includes(ch) ? speed * 6 : ",;:".includes(ch) ? speed * 3 : speed;
      timeout = window.setTimeout(tick, delay);
    };

    timeout = window.setTimeout(tick, speed);
    return () => clearTimeout(timeout);
  }, [text, speed, onComplete]);

  const skip = useCallback(() => {
    if (!done) {
      setDisplayed(text);
      setDone(true);
      onComplete?.();
    }
  }, [done, text, onComplete]);

  return (
    <span className={className} onClick={skip} style={{ cursor: done ? "default" : "pointer" }}>
      {displayed}
      {!done && <span className="animate-pulse">▌</span>}
    </span>
  );
}
