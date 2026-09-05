import "./ProgressBar.css";

/**
 * @param {number} current - 1-based current question
 * @param {number} total
 */
export default function ProgressBar({ current, total }) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  return (
    <div className="progress-bar-wrap">
      <div className="progress-bar-meta">
        <span className="progress-bar-label">
          Question {current} of {total}
        </span>
        <span className="progress-bar-pct">{Math.round(pct)}%</span>
      </div>
      <div
        className="progress-bar-track"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
      >
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
