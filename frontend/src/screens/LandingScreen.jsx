import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createParticipant } from "../api/stubs";
import { useQuiz } from "../context/QuizContext";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import "./LandingScreen.css";

export default function LandingScreen() {
  const navigate = useNavigate();
  const { setParticipant, reset } = useQuiz();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [apiError, setApiError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Please enter at least 2 characters.");
      return;
    }
    if (trimmed.length > 40) {
      setError("Keep your name under 40 characters.");
      return;
    }
    setError("");
    setStatus("loading");
    setApiError("");

    try {
      reset();
      const p = await createParticipant({
        name: trimmed,
        phone: phone.trim() || undefined,
        sessionId: "aug2026",
      });
      setParticipant(p);
      navigate("/scratch");
    } catch {
      setStatus("error");
      setApiError("Couldn’t register you. Event Wi‑Fi can be flaky — please retry.");
    }
  };

  if (status === "loading") {
    return (
      <div className="screen landing-screen">
        <LoadingState message="Getting you in…" subtext="Setting up your spot in the session" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="screen landing-screen">
        <ErrorState
          title="Connection issue"
          message={apiError}
          onRetry={() => setStatus("idle")}
        />
      </div>
    );
  }

  return (
    <div className="screen landing-screen">
      <div className="landing-hero">
        <div className="landing-brand-mark" aria-hidden="true">
          <span className="landing-brand-nse">NSE</span>
        </div>
        <p className="landing-kicker">Financial Literacy Challenge</p>
        <h1 className="landing-title">Test your market smarts</h1>
        <p className="landing-sub">
          20 questions. Live ranks. Scratch your difficulty and jump in — no account needed.
        </p>
      </div>

      <form className="landing-form" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="display-name">Display name</label>
          <input
            id="display-name"
            name="name"
            autoComplete="nickname"
            autoFocus
            maxLength={40}
            placeholder="e.g. Aarav"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
          />
          {error ? <p className="field-error">{error}</p> : null}
        </div>

        <div className="field">
          <label htmlFor="phone">
            Phone <span className="field-optional">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="10-digit mobile"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <p className="field-hint">Only used if organizers need to reach prize winners.</p>
        </div>

        <button type="submit" className="btn btn-accent" disabled={!name.trim()}>
          Continue
        </button>
      </form>

      <p className="landing-footnote">By continuing you join today’s live session.</p>
    </div>
  );
}
