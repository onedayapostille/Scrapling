import './Sidebar.css';

function Sidebar({ history, isOpen, onToggle, onLoadHistory, onDeleteItem, onClearAll }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const truncateUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={onToggle}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          )}
        </svg>
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
              <path d="M16 8L22 14L16 20L10 14L16 8Z" fill="white"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#667eea"/>
                  <stop offset="1" stopColor="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
            <h2>Scrapling</h2>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="history-section">
            <div className="history-header">
              <h3>Recent Runs</h3>
              {history.length > 0 && (
                <button className="btn-clear-history" onClick={onClearAll} title="Clear all history">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M13 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="history-empty">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                  <path d="M24 16v8l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
                </svg>
                <p>No scraping history yet</p>
              </div>
            ) : (
              <div className="history-list">
                {history.map((item) => (
                  <div key={item.id} className="history-item">
                    <div
                      className="history-item-content"
                      onClick={() => onLoadHistory(item)}
                    >
                      <div className="history-item-header">
                        <span className={`status-dot ${item.success ? 'success' : 'error'}`}></span>
                        <span className="history-url" title={item.url}>
                          {truncateUrl(item.url)}
                        </span>
                      </div>
                      <div className="history-item-meta">
                        <span className="history-mode">{item.fetcher_type}</span>
                        <span className="history-time">{formatTime(item.timestamp)}</span>
                      </div>
                      {item.stats && (
                        <div className="history-stats">
                          <span>{item.stats.links} links</span>
                          <span>{item.stats.images} images</span>
                          <span>{item.stats.response_time}ms</span>
                        </div>
                      )}
                    </div>
                    <button
                      className="history-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      title="Delete"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <a href="https://scrapling.readthedocs.io" target="_blank" rel="noopener noreferrer" className="footer-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v6M8 15v-3M1 8h6M15 8H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Documentation
          </a>
          <a href="https://github.com/D4Vinci/Scrapling" target="_blank" rel="noopener noreferrer" className="footer-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>

      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}
    </>
  );
}

export default Sidebar;
