import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { TIER_META } from "../data/mockQuestions";
import "./ScratchCard.css";

const REVEAL_THRESHOLD = 0.42;
const BRUSH_RADIUS = 28;

/**
 * Premium scratch-card reveal.
 *
 * @param {"low"|"medium"|"high"} displayTier - optimistic or reconciled tier under the foil
 * @param {boolean} revealed
 * @param {() => void} onRevealStart - fire when user first starts scratching (API call)
 * @param {() => void} onFullyRevealed
 * @param {boolean} [disabled]
 */
export default function ScratchCard({
  displayTier = "medium",
  revealed = false,
  onRevealStart,
  onFullyRevealed,
  disabled = false,
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const scratchingRef = useRef(false);
  const startedRef = useRef(false);
  const revealedRef = useRef(false);
  const lastPointRef = useRef(null);
  const lastVibrateRef = useRef(0);
  const [tilting, setTilting] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [localRevealed, setLocalRevealed] = useState(false);

  const meta = TIER_META[displayTier] || TIER_META.medium;
  const done = revealed || localRevealed;

  const drawFoil = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#9aa3ad");
    grad.addColorStop(0.25, "#c5ccd4");
    grad.addColorStop(0.5, "#8e97a1");
    grad.addColorStop(0.75, "#d0d6dc");
    grad.addColorStop(1, "#7a8490");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Metallic speckles
    for (let i = 0; i < 120; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.05 + Math.random() * 0.15})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5);
    }

    // Diagonal shine bands
    ctx.save();
    ctx.globalAlpha = 0.12;
    for (let x = -height; x < width + height; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 14, 0);
      ctx.lineTo(x + 14 + height, height);
      ctx.lineTo(x + height, height);
      ctx.closePath();
      ctx.fillStyle = "#fff";
      ctx.fill();
    }
    ctx.restore();

    // Hint text
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = "700 15px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SCRATCH HERE", width / 2, height / 2 - 10);
    ctx.font = "500 12px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText("Reveal your difficulty", width / 2, height / 2 + 12);
  }, []);

  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!revealedRef.current && !localRevealed) {
      drawFoil();
    }
  }, [drawFoil, localRevealed]);

  useEffect(() => {
    sizeCanvas();
    const onResize = () => {
      if (!revealedRef.current && !localRevealed) sizeCanvas();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [sizeCanvas, localRevealed]);

  useEffect(() => {
    if (revealed && !localRevealed) {
      clearAll();
      setLocalRevealed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches?.[0] || e.changedTouches?.[0];
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const scratchAt = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Context is already scaled by dpr via setTransform, so use CSS coords
    void dpr;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    const last = lastPointRef.current;
    if (last) {
      ctx.lineWidth = BRUSH_RADIUS * 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    lastPointRef.current = { x, y };

    // Haptic micro-feedback (throttled)
    const now = Date.now();
    if (navigator.vibrate && now - lastVibrateRef.current > 80) {
      navigator.vibrate(8);
      lastVibrateRef.current = now;
    }
  };

  const scratchedRatio = () => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const image = ctx.getImageData(0, 0, width, height);
    const data = image.data;
    let transparent = 0;
    // Sample every 4th pixel for performance
    const step = 16;
    let samples = 0;
    for (let i = 3; i < data.length; i += 4 * step) {
      samples++;
      if (data[i] < 128) transparent++;
    }
    return samples ? transparent / samples : 0;
  };

  const fireConfetti = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { x, y },
      colors: ["#c9a227", "#0b1f3a", "#14b8a6", "#ffffff"],
      disableForReducedMotion: true,
    });
    if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
  };

  const clearAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  const completeReveal = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setIsRevealing(true);
    clearAll();
    setLocalRevealed(true);
    fireConfetti();
    setTimeout(() => {
      setIsRevealing(false);
      onFullyRevealed?.();
    }, 450);
  };

  const maybeAutoReveal = () => {
    if (revealedRef.current) return;
    if (scratchedRatio() >= REVEAL_THRESHOLD) {
      completeReveal();
    }
  };

  const onPointerStart = (e) => {
    if (disabled || done || revealedRef.current) return;
    e.preventDefault();
    scratchingRef.current = true;
    setTilting(true);
    if (!startedRef.current) {
      startedRef.current = true;
      onRevealStart?.();
    }
    const p = getPoint(e);
    lastPointRef.current = null;
    scratchAt(p.x, p.y);
  };

  const onPointerMove = (e) => {
    if (!scratchingRef.current || disabled || done) return;
    e.preventDefault();
    const p = getPoint(e);
    scratchAt(p.x, p.y);
  };

  const onPointerEnd = (e) => {
    if (!scratchingRef.current) return;
    e.preventDefault();
    scratchingRef.current = false;
    lastPointRef.current = null;
    setTilting(false);
    maybeAutoReveal();
  };

  return (
    <div
      className={`scratch-card ${tilting ? "is-tilting" : ""} ${done ? "is-revealed" : ""} ${
        isRevealing ? "is-popping" : ""
      }`}
      ref={wrapRef}
    >
      <div className={`scratch-result scratch-result--${meta.key}`} aria-hidden={done ? "false" : "true"}>
        <TierIcon type={meta.icon} />
        <span className="scratch-result-label">{meta.label}</span>
        <span className="scratch-result-title">{meta.title}</span>
        <span className="scratch-result-sub">{meta.subtitle}</span>
      </div>

      {!done && (
        <canvas
          ref={canvasRef}
          className="scratch-foil"
          onMouseDown={onPointerStart}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerEnd}
          onMouseLeave={onPointerEnd}
          onTouchStart={onPointerStart}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerEnd}
          onTouchCancel={onPointerEnd}
          aria-label="Scratch to reveal your difficulty tier"
        />
      )}

      <div className="scratch-frame" aria-hidden="true" />
    </div>
  );
}

function TierIcon({ type }) {
  if (type === "leaf") {
    return (
      <svg className="scratch-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 19C5 19 7 9 19 5C19 5 17 15 5 19Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M5 19C5 19 10 14 12 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "fire") {
    return (
      <svg className="scratch-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3C12 3 8 8 8 12C8 14.5 9.5 17 12 17C14.5 17 16 14.5 16 12C16 10 15 8.5 14 7C15.5 9 17 10.5 17 13C17 16.5 14.5 20 12 20C9.5 20 7 16.5 7 13C7 9 12 3 12 3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg className="scratch-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 2L4 14H12L11 22L20 10H12L13 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
