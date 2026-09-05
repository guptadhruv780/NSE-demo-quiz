import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { assignTier, fetchQuiz } from "../api/stubs";
import { useQuiz } from "../context/QuizContext";
import { TIER_META } from "../data/mockQuestions";
import ScratchCard from "../components/ScratchCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import "./ScratchScreen.css";

export default function ScratchScreen() {
  const navigate = useNavigate();
  const { participant, tier, setTier, setQuiz, setQuizStartedAt } = useQuiz();

  const [optimisticTier, setOptimisticTier] = useState(() => pickOptimistic());
  const [fullyRevealed, setFullyRevealed] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);
  const apiStarted = useRef(false);
  const authoritative = useRef(null);

  useEffect(() => {
    // Keep display in sync when backend returns
    if (tier) setOptimisticTier(tier);
  }, [tier]);

  if (!participant) {
    return <Navigate to="/" replace />;
  }

  const displayTier = tier || optimisticTier;
  const meta = TIER_META[displayTier] || TIER_META.medium;

  const startAssign = async () => {
    if (apiStarted.current) return;
    apiStarted.current = true;
    setAssigning(true);
    setError(null);
    try {
      const res = await assignTier(participant.id);
      authoritative.current = res.tier;
      setTier(res.tier);
      setOptimisticTier(res.tier);
    } catch {
      setError("assign");
      apiStarted.current = false;
    } finally {
      setAssigning(false);
    }
  };

  const retryAssign = () => {
    apiStarted.current = false;
    startAssign();
  };

  const handleStartQuiz = async () => {
    const finalTier = tier || authoritative.current || displayTier;
    setStarting(true);
    setError(null);
    try {
      const quiz = await fetchQuiz(participant.id, finalTier);
      setQuiz(quiz);
      setQuizStartedAt(Date.now());
      navigate("/quiz");
    } catch {
      setError("quiz");
      setStarting(false);
    }
  };

  if (starting) {
    return (
      <div className="screen scratch-screen">
        <LoadingState
          message="Loading your quiz…"
          subtext="Shuffling 20 questions for your tier"
        />
      </div>
    );
  }

  if (error === "assign") {
    return (
      <div className="screen scratch-screen">
        <ErrorState
          title="Couldn’t assign difficulty"
          message="Network hiccup while contacting the server. Scratch again after retrying."
          onRetry={retryAssign}
        />
      </div>
    );
  }

  if (error === "quiz") {
    return (
      <div className="screen scratch-screen">
        <ErrorState
          title="Quiz didn’t load"
          message="We assigned your tier but couldn’t fetch questions. Try again."
          onRetry={handleStartQuiz}
        />
      </div>
    );
  }

  return (
    <div className="screen scratch-screen">
      <header className="scratch-header">
        <p className="scratch-hello">Hey {participant.name}</p>
        <h1 className="scratch-heading">Scratch your card</h1>
        <p className="scratch-lede">
          Reveal your difficulty tier. Drag your finger across the foil — like a real scratch ticket.
        </p>
      </header>

      <div className="scratch-stage">
        <ScratchCard
          displayTier={displayTier}
          onRevealStart={startAssign}
          onFullyRevealed={() => setFullyRevealed(true)}
          disabled={!!error}
        />
      </div>

      <div className="scratch-footer">
        {assigning && !fullyRevealed && (
          <p className="scratch-status" role="status">
            Assigning your difficulty…
          </p>
        )}

        {fullyRevealed && (
          <>
            {assigning ? (
              <p className="scratch-status" role="status">
                Confirming with server…
              </p>
            ) : (
              <div className="scratch-confirm">
                <p className="scratch-confirm-label">Your difficulty</p>
                <p className="scratch-confirm-value" style={{ color: meta.color }}>
                  {meta.label}
                </p>
                <p className="scratch-confirm-sub">{meta.subtitle}</p>
              </div>
            )}

            <button
              type="button"
              className="btn btn-accent"
              onClick={handleStartQuiz}
              disabled={assigning || !tier}
            >
              {assigning ? "Almost ready…" : "Start Quiz"}
            </button>
          </>
        )}

        {!fullyRevealed && !assigning && (
          <p className="scratch-hint text-muted text-center">Scratch about half the card to reveal</p>
        )}
      </div>
    </div>
  );
}

function pickOptimistic() {
  const tiers = ["low", "medium", "high"];
  return tiers[Math.floor(Math.random() * tiers.length)];
}
