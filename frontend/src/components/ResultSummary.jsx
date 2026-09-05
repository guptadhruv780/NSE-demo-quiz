import { motion } from "framer-motion";
import "./ResultSummary.css";

/**
 * @param {number} correct
 * @param {number} total
 * @param {number} score
 * @param {number} timeTakenSec
 * @param {number} rank
 * @param {number} totalParticipants
 * @param {string} [name]
 */
export default function ResultSummary({
  correct,
  total,
  score,
  timeTakenSec,
  rank,
  totalParticipants,
  name,
}) {
  const pct = total > 0 ? correct / total : 0;
  const celebration =
    pct >= 0.9 ? "high" : pct >= 0.7 ? "mid" : pct >= 0.5 ? "ok" : "low";

  return (
    <motion.div
      className={`result-summary result-${celebration}`}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      <p className="result-eyebrow">{name ? `Nice work, ${name}` : "Quiz complete"}</p>
      <h1 className="result-score-line">
        You scored{" "}
        <span className="result-fraction">
          {correct}/{total}
        </span>
      </h1>
      <motion.p
        className="result-rank"
        key={rank}
        initial={{ opacity: 0.4, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        Rank <strong>#{rank}</strong> of {totalParticipants} so far
      </motion.p>

      <div className="result-stats">
        <div className="result-stat">
          <span className="result-stat-label">Score</span>
          <span className="result-stat-value">{score}</span>
        </div>
        <div className="result-stat">
          <span className="result-stat-label">Correct</span>
          <span className="result-stat-value">
            {correct}/{total}
          </span>
        </div>
        <div className="result-stat">
          <span className="result-stat-label">Time</span>
          <span className="result-stat-value">{formatDuration(timeTakenSec)}</span>
        </div>
      </div>

      {celebration === "high" && (
        <p className="result-cheer">Outstanding — you&apos;re near the top!</p>
      )}
      {celebration === "mid" && (
        <p className="result-cheer">Strong finish — keep an eye on the live board.</p>
      )}
      {celebration === "ok" && (
        <p className="result-cheer">Solid effort — ranks may still shift.</p>
      )}
      {celebration === "low" && (
        <p className="result-cheer">Thanks for playing — every attempt builds literacy.</p>
      )}
    </motion.div>
  );
}

function formatDuration(sec) {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}
