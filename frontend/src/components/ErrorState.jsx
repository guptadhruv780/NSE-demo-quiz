import "./ErrorState.css";

export default function ErrorState({
  title = "Something went wrong",
  message = "Please check your connection and try again.",
  onRetry,
  retryLabel = "Try again",
}) {
  return (
    <div className="error-state" role="alert">
      <div className="error-icon" aria-hidden="true">
        !
      </div>
      <h2 className="error-title">{title}</h2>
      <p className="error-message">{message}</p>
      {onRetry ? (
        <button type="button" className="btn btn-primary btn-sm error-retry" onClick={onRetry}>
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
