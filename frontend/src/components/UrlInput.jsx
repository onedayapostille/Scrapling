import './UrlInput.css';

function UrlInput({ url, onChange, onClear, disabled }) {
  return (
    <div className="url-input-container">
      <label htmlFor="url-input" className="url-label">
        Enter URL to Analyze
      </label>
      <div className="url-input-wrapper">
        <svg className="url-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2"/>
          <path d="M10 6v6M10 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          id="url-input"
          type="url"
          className="url-input"
          value={url}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com"
          disabled={disabled}
          required
        />
        {url && (
          <button
            type="button"
            className="url-clear"
            onClick={onClear}
            disabled={disabled}
            aria-label="Clear URL"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default UrlInput;
