import './EmptyState.css';

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
          <path d="M60 40v20M60 75h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
          <path d="M80 45L60 60L40 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
        </svg>
      </div>
      <h3>Ready to Scrape</h3>
      <p>Enter a URL above and click Analyze to start extracting data from any website</p>
      <div className="empty-state-features">
        <div className="feature-item">
          <span className="feature-icon">⚡</span>
          <span>Lightning fast</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🎯</span>
          <span>Accurate extraction</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🔒</span>
          <span>Secure & private</span>
        </div>
      </div>
    </div>
  );
}

export default EmptyState;
