import { useEffect, useRef, useState } from "react";
import "./TimerBar.css";

/**
 * @param {"question" | "quiz"} mode - per-question or full-quiz countdown
 * @param {number} durationSec
 * @param {boolean} running
 * @param {string|number} resetKey - change to restart timer
 * @param {(remaining: number) => void} [onTick]
 * @param {() => void} [onExpire]
 * @param {"linear" | "circular"} [variant]
 */
export default function TimerBar({
  mode = "question",
  durationSec = 30,
  running = true,
  resetKey,
  onTick,
  onExpire,
  variant = "linear",
}) {
  const [remaining, setRemaining] = useState(durationSec);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onExpireRef.current = onExpire;
    onTickRef.current = onTick;
  }, [onExpire, onTick]);

  useEffect(() => {
    setRemaining(durationSec);
    expiredRef.current = false;
  }, [durationSec, resetKey, mode]);

  useEffect(() => {
    if (!running) return undefined;

    const id = setInterval(() => {
      setRemaining((prev) => {
        const next = Math.max(0, prev - 0.1);
        onTickRef.current?.(next);
        if (next <= 0 && !expiredRef.current) {
          expiredRef.current = true;
          onExpireRef.current?.();
        }
        return next;
      });
    }, 100);

    return () => clearInterval(id);
  }, [running, resetKey]);

  const pct = durationSec > 0 ? (remaining / durationSec) * 100 : 0;
  const urgency =
    pct <= 20 ? "danger" : pct <= 45 ? "warning" : "ok";

  const display = formatTime(remaining);

  if (variant === "circular") {
    const r = 18;
    const c = 2 * Math.PI * r;
    const offset = c * (1 - pct / 100);
    return (
      <div className={`timer-circular timer-${urgency}`} aria-label={`${display} remaining`}>
        <svg viewBox="0 0 44 44" className="timer-svg" aria-hidden="true">
          <circle cx="22" cy="22" r={r} className="timer-track" />
          <circle
            cx="22"
            cy="22"
            r={r}
            className="timer-fill"
            style={{ strokeDasharray: c, strokeDashoffset: offset }}
          />
        </svg>
        <span className="timer-circular-text">{Math.ceil(remaining)}</span>
      </div>
    );
  }

  return (
    <div className={`timer-bar timer-${urgency}`} aria-label={`${display} remaining`}>
      <div className="timer-bar-top">
        <span className="timer-bar-label">{mode === "quiz" ? "Time left" : "Time"}</span>
        <span className="timer-bar-value">{display}</span>
      </div>
      <div className="timer-bar-track">
        <div className="timer-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function formatTime(sec) {
  const s = Math.max(0, Math.ceil(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m > 0) return `${m}:${String(r).padStart(2, "0")}`;
  return `${r}s`;
}
