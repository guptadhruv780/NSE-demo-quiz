import "./LeaderboardPreview.css";

/**
 * @param {Array<{rank, name, correct, score, isSelf?, participantId?}>} entries
 * @param {string} [selfName]
 */
export default function LeaderboardPreview({ entries = [], selfName = "You" }) {
  if (!entries.length) {
    return (
      <div className="lb-preview lb-empty">
        <p>Leaderboard will appear as people finish…</p>
      </div>
    );
  }

  return (
    <div className="lb-preview">
      <div className="lb-preview-head">
        <h3>Live Top 5</h3>
        <span className="lb-live-dot" aria-hidden="true" />
        <span className="lb-live-label">Live</span>
      </div>
      <ul className="lb-list">
        {entries.map((row) => {
          const name = row.isSelf ? selfName : row.name || "Player";
          return (
            <li
              key={`${row.rank}-${row.participantId || name}`}
              className={`lb-row ${row.isSelf ? "is-self" : ""}`}
            >
              <span className="lb-rank">#{row.rank}</span>
              <span className="lb-name">{name}</span>
              <span className="lb-score">
                {row.correct ?? "—"}/20
                {typeof row.score === "number" ? (
                  <span className="lb-pts">{row.score}</span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
