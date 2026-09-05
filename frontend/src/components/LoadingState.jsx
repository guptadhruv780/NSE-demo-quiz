import "./LoadingState.css";

export default function LoadingState({ message = "Loading…", subtext }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true" />
      <p className="loading-message">{message}</p>
      {subtext ? <p className="loading-subtext">{subtext}</p> : null}
    </div>
  );
}
