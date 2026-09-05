import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Navigate } from "react-router-dom";
import { fetchLeaderboard } from "../api/stubs";
import { useQuiz } from "../context/QuizContext";
import ResultSummary from "../components/ResultSummary";
import LeaderboardPreview from "../components/LeaderboardPreview";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import "./ResultScreen.css";

const POLL_MS = 3500;

export default function ResultScreen() {
  const { participant, result, setResult } = useQuiz();
  const [board, setBoard] = useState(null);
  const [pollingError, setPollingError] = useState(false);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const celebrated = useRef(false);

  const loadBoard = useCallback(async () => {
    if (!participant) return;
    try {
      const data = await fetchLeaderboard(participant.sessionId || "aug2026", participant.id);
      setBoard(data);
      setPollingError(false);
      if (data.participant) {
        setResult((prev) =>
          prev
            ? {
                ...prev,
                rank: data.participant.rank,
                totalParticipants: data.participant.totalParticipants,
                score: data.participant.score ?? prev.score,
              }
            : prev
        );
      }
    } catch {
      setPollingError(true);
    } finally {
      setLoadingBoard(false);
    }
  }, [participant, setResult]);

  const hasResult = Boolean(result);

  useEffect(() => {
    if (!hasResult || !participant) return undefined;
    loadBoard();
    const id = setInterval(loadBoard, POLL_MS);
    return () => clearInterval(id);
  }, [loadBoard, hasResult, participant]);

  useEffect(() => {
    if (!result || celebrated.current) return;
    celebrated.current = true;
    const pct = result.total > 0 ? result.correct / result.total : 0;
    if (pct >= 0.85) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.35 },
        colors: ["#c9a227", "#0b1f3a", "#14b8a6"],
        disableForReducedMotion: true,
      });
    } else if (pct >= 0.7) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.4 },
        colors: ["#c9a227", "#123056"],
        disableForReducedMotion: true,
      });
    }
  }, [result]);

  if (!participant || !result) {
    return <Navigate to="/" replace />;
  }

  const top = (board?.top || []).map((row) => ({
    ...row,
    name: row.isSelf ? participant.name : row.name,
  }));

  return (
    <div className="screen result-screen">
      <ResultSummary
        name={participant.name}
        correct={result.correct}
        total={result.total}
        score={result.score}
        timeTakenSec={result.timeTakenSec}
        rank={result.rank}
        totalParticipants={result.totalParticipants}
      />

      <div className="result-board-block">
        {loadingBoard && !board ? (
          <LoadingState message="Fetching live ranks…" />
        ) : pollingError && !board ? (
          <ErrorState
            title="Leaderboard offline"
            message="We’ll keep trying. Your score is already recorded."
            onRetry={loadBoard}
          />
        ) : (
          <>
            <LeaderboardPreview entries={top} selfName={participant.name} />
            {pollingError ? (
              <p className="result-poll-warn">Live updates paused — retrying…</p>
            ) : (
              <p className="result-poll-hint">Rank updates every few seconds</p>
            )}
          </>
        )}
      </div>

      <p className="result-thanks">Thanks for playing the NSE Financial Literacy Quiz.</p>
    </div>
  );
}
