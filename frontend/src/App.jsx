import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [url, setUrl] = useState('');
  const [fetcherType, setFetcherType] = useState('static');
  const [cssSelector, setCssSelector] = useState('');
  const [xpathSelector, setXpathSelector] = useState('');
  const [headless, setHeadless] = useState(true);
  const [extractMetadata, setExtractMetadata] = useState(true);
  const [extractLinks, setExtractLinks] = useState(true);
  const [extractImages, setExtractImages] = useState(true);
  const [extractHeadings, setExtractHeadings] = useState(true);
  const [extractTables, setExtractTables] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('scrapeHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (scrapeResult) => {
    const historyItem = {
      url: scrapeResult.url,
      fetcher_type: scrapeResult.fetcher_type,
      timestamp: new Date().toISOString(),
      success: scrapeResult.success
    };
    const newHistory = [historyItem, ...history.slice(0, 9)];
    setHistory(newHistory);
    localStorage.setItem('scrapeHistory', JSON.stringify(newHistory));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = cssSelector || xpathSelector ? '/api/v1/scrape' : '/api/v1/extract';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          fetcher_type: fetcherType,
          css_selector: cssSelector || null,
          xpath_selector: xpathSelector || null,
          headless,
          extract_metadata: extractMetadata,
          extract_links: extractLinks,
          extract_images: extractImages,
          extract_headings: extractHeadings,
          extract_tables: extractTables
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Request failed');
      }

      setResult(data);
      saveToHistory(data);
      setActiveTab('overview');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setCssSelector('');
    setXpathSelector('');
    setResult(null);
    setError(null);
  };

  const loadFromHistory = (item) => {
    setUrl(item.url);
    setFetcherType(item.fetcher_type);
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scrape-${Date.now()}.json`;
    link.click();
  };

  const exportCSV = () => {
    if (!result?.extracted) return;

    let csv = '';

    if (result.extracted.links?.length > 0) {
      csv += 'Links\n';
      csv += 'URL,Text\n';
      result.extracted.links.forEach(link => {
        csv += `"${link.href}","${(link.text || '').replace(/"/g, '""')}"\n`;
      });
      csv += '\n';
    }

    if (result.extracted.images?.length > 0) {
      csv += 'Images\n';
      csv += 'URL,Alt Text\n';
      result.extracted.images.forEach(img => {
        csv += `"${img.src}","${(img.alt || '').replace(/"/g, '""')}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scrape-${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>Scrapling Web Interface</h1>
          <p>Professional web scraping with advanced extraction capabilities</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group flex-1">
              <label>URL *</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fetcher Mode</label>
              <select value={fetcherType} onChange={(e) => setFetcherType(e.target.value)}>
                <option value="static">Static (Fast HTTP)</option>
                <option value="dynamic">Dynamic (Full Browser)</option>
                <option value="stealthy">Stealthy (Anti-Bot Bypass)</option>
              </select>
            </div>

            {(fetcherType === 'dynamic' || fetcherType === 'stealthy') && (
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={headless}
                    onChange={(e) => setHeadless(e.target.checked)}
                  />
                  Headless Mode
                </label>
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>CSS Selector (Optional)</label>
              <input
                type="text"
                value={cssSelector}
                onChange={(e) => setCssSelector(e.target.value)}
                placeholder=".product, #content, h1"
              />
            </div>

            <div className="form-group flex-1">
              <label>XPath Selector (Optional)</label>
              <input
                type="text"
                value={xpathSelector}
                onChange={(e) => setXpathSelector(e.target.value)}
                placeholder="//div[@class='content']"
              />
            </div>
          </div>

          <div className="extraction-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={extractMetadata}
                onChange={(e) => setExtractMetadata(e.target.checked)}
              />
              Extract Metadata
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={extractHeadings}
                onChange={(e) => setExtractHeadings(e.target.checked)}
              />
              Extract Headings
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={extractLinks}
                onChange={(e) => setExtractLinks(e.target.checked)}
              />
              Extract Links
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={extractImages}
                onChange={(e) => setExtractImages(e.target.checked)}
              />
              Extract Images
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={extractTables}
                onChange={(e) => setExtractTables(e.target.checked)}
              />
              Extract Tables
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
            <button type="button" onClick={handleClear} className="btn-secondary">
              Clear
            </button>
          </div>
        </form>

        {history.length > 0 && !result && (
          <div className="history">
            <h3>Recent Runs</h3>
            <div className="history-items">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="history-item"
                  onClick={() => loadFromHistory(item)}
                >
                  <span className={`status-badge ${item.success ? 'success' : 'error'}`}>
                    {item.success ? '✓' : '✗'}
                  </span>
                  <span className="history-url">{item.url}</span>
                  <span className="history-mode">{item.fetcher_type}</span>
                  <span className="history-time">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="error">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {result && !result.success && (
          <div className="error">
            <h3>Scraping Failed</h3>
            <p>{result.error || 'Unknown error occurred'}</p>
          </div>
        )}

        {result && result.success && (
          <div className="result">
            <div className="result-header">
              <h3>Results</h3>
              <div className="export-buttons">
                <button onClick={exportJSON} className="btn-export">Export JSON</button>
                <button onClick={exportCSV} className="btn-export">Export CSV</button>
              </div>
            </div>

            <div className="tabs">
              <button
                className={activeTab === 'overview' ? 'active' : ''}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={activeTab === 'metadata' ? 'active' : ''}
                onClick={() => setActiveTab('metadata')}
              >
                Metadata
              </button>
              <button
                className={activeTab === 'headings' ? 'active' : ''}
                onClick={() => setActiveTab('headings')}
              >
                Headings ({result.extracted?.headings?.length || 0})
              </button>
              <button
                className={activeTab === 'links' ? 'active' : ''}
                onClick={() => setActiveTab('links')}
              >
                Links ({result.extracted?.links?.length || 0})
              </button>
              <button
                className={activeTab === 'images' ? 'active' : ''}
                onClick={() => setActiveTab('images')}
              >
                Images ({result.extracted?.images?.length || 0})
              </button>
              {result.extracted?.tables?.length > 0 && (
                <button
                  className={activeTab === 'tables' ? 'active' : ''}
                  onClick={() => setActiveTab('tables')}
                >
                  Tables ({result.extracted.tables.length})
                </button>
              )}
              <button
                className={activeTab === 'text' ? 'active' : ''}
                onClick={() => setActiveTab('text')}
              >
                Text
              </button>
              <button
                className={activeTab === 'html' ? 'active' : ''}
                onClick={() => setActiveTab('html')}
              >
                Raw HTML
              </button>
              <button
                className={activeTab === 'json' ? 'active' : ''}
                onClick={() => setActiveTab('json')}
              >
                JSON
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview">
                  <div className="info-grid">
                    <div className="info-item">
                      <label>URL</label>
                      <value>{result.url}</value>
                    </div>
                    {result.final_url && result.final_url !== result.url && (
                      <div className="info-item">
                        <label>Final URL</label>
                        <value>{result.final_url}</value>
                      </div>
                    )}
                    <div className="info-item">
                      <label>Fetcher</label>
                      <value>{result.fetcher_type}</value>
                    </div>
                    <div className="info-item">
                      <label>Status Code</label>
                      <value>{result.status_code || 'N/A'}</value>
                    </div>
                    <div className="info-item">
                      <label>Response Time</label>
                      <value>{result.response_time_ms}ms</value>
                    </div>
                    <div className="info-item">
                      <label>Word Count</label>
                      <value>{result.extracted?.word_count || 0}</value>
                    </div>
                  </div>

                  {result.extracted?.metadata?.title && (
                    <div className="overview-section">
                      <h4>Page Title</h4>
                      <p>{result.extracted.metadata.title}</p>
                    </div>
                  )}

                  {result.extracted?.metadata?.description && (
                    <div className="overview-section">
                      <h4>Meta Description</h4>
                      <p>{result.extracted.metadata.description}</p>
                    </div>
                  )}

                  <div className="overview-stats">
                    <div className="stat-card">
                      <div className="stat-number">{result.extracted?.headings?.length || 0}</div>
                      <div className="stat-label">Headings</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{result.extracted?.links?.length || 0}</div>
                      <div className="stat-label">Links</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{result.extracted?.images?.length || 0}</div>
                      <div className="stat-label">Images</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{result.extracted?.tables?.length || 0}</div>
                      <div className="stat-label">Tables</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'metadata' && result.extracted?.metadata && (
                <div className="metadata">
                  {Object.entries(result.extracted.metadata).map(([key, value]) => (
                    value && (
                      <div key={key} className="metadata-item">
                        <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong>
                        <span>{value}</span>
                      </div>
                    )
                  ))}
                </div>
              )}

              {activeTab === 'headings' && (
                <div className="headings">
                  {result.extracted?.headings?.length > 0 ? (
                    result.extracted.headings.map((heading, index) => (
                      <div key={index} className={`heading ${heading.level}`}>
                        <span className="heading-level">{heading.level}</span>
                        <span className="heading-text">{heading.text}</span>
                        {heading.id && <span className="heading-id">#{heading.id}</span>}
                      </div>
                    ))
                  ) : (
                    <p className="empty-state">No headings found</p>
                  )}
                </div>
              )}

              {activeTab === 'links' && (
                <div className="links">
                  {result.extracted?.links?.length > 0 ? (
                    <div className="links-list">
                      {result.extracted.links.map((link, index) => (
                        <div key={index} className="link-item">
                          <a href={link.href} target="_blank" rel="noopener noreferrer">
                            {link.text || link.href}
                          </a>
                          {link.title && <span className="link-title">{link.title}</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No links found</p>
                  )}
                </div>
              )}

              {activeTab === 'images' && (
                <div className="images">
                  {result.extracted?.images?.length > 0 ? (
                    <div className="images-grid">
                      {result.extracted.images.map((img, index) => (
                        <div key={index} className="image-item">
                          <img src={img.src} alt={img.alt || 'Image'} loading="lazy" />
                          {img.alt && <p className="image-alt">{img.alt}</p>}
                          <a href={img.src} target="_blank" rel="noopener noreferrer" className="image-link">
                            View Full Size
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No images found</p>
                  )}
                </div>
              )}

              {activeTab === 'tables' && (
                <div className="tables">
                  {result.extracted?.tables?.length > 0 ? (
                    result.extracted.tables.map((table, index) => (
                      <div key={index} className="table-container">
                        <h4>Table {index + 1}</h4>
                        <table>
                          {table.headers.length > 0 && (
                            <thead>
                              <tr>
                                {table.headers.map((header, i) => (
                                  <th key={i}>{header}</th>
                                ))}
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            {table.rows.map((row, i) => (
                              <tr key={i}>
                                {row.map((cell, j) => (
                                  <td key={j}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))
                  ) : (
                    <p className="empty-state">No tables found</p>
                  )}
                </div>
              )}

              {activeTab === 'text' && (
                <div className="text-content">
                  {result.extracted?.text_content ? (
                    <pre>{result.extracted.text_content}</pre>
                  ) : (
                    <p className="empty-state">No text content available</p>
                  )}
                </div>
              )}

              {activeTab === 'html' && (
                <div className="html-content">
                  {result.full_html || result.data ? (
                    <pre>{result.full_html || JSON.stringify(result.data, null, 2)}</pre>
                  ) : (
                    <p className="empty-state">No HTML available</p>
                  )}
                </div>
              )}

              {activeTab === 'json' && (
                <div className="json-content">
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
