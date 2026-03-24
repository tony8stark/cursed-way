import { useState, useEffect, useCallback, useRef } from "react";

interface Props {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypewriterText({ text, speed = 30, className, onComplete }: Props) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDisplayed("");
    setDone(false);
    completedRef.current = false;
    let i = 0;

    const complete = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      setDone(true);
      onComplete?.();
    };

    const tick = () => {
      if (i >= text.length) {
        complete();
        return;
      }
      i++;
      setDisplayed(text.slice(0, i));

      // Slow down on punctuation
      const ch = text[i - 1];
      const delay = ".!?".includes(ch) ? speed * 6 : ",;:".includes(ch) ? speed * 3 : speed;
      timeoutRef.current = window.setTimeout(tick, delay);
    };

    timeoutRef.current = window.setTimeout(tick, speed);
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [text, speed, onComplete]);

  const skip = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDisplayed(text);
    if (!completedRef.current) {
      completedRef.current = true;
      setDone(true);
      onComplete?.();
    }
  }, [text, onComplete]);

  return (
    <span className={className} onClick={skip} style={{ cursor: done ? "default" : "pointer" }}>
      {displayed}
      {!done && <span className="animate-pulse">▌</span>}
    </span>
  );
}
