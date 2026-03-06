import './ErrorState.css';

function ErrorState({ error, onDismiss }) {
  return (
    <div className="error-state">
      <div className="error-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3"/>
          <path d="M32 20v16M32 44h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
      <h3>Oops! Something went wrong</h3>
      <p className="error-message">{error}</p>
      <button className="btn-dismiss" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  );
}

export default ErrorState;
