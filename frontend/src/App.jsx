import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UrlInput from './components/UrlInput';
import OptionsPanel from './components/OptionsPanel';
import ResultsTabs from './components/ResultsTabs';
import StatsCards from './components/StatsCards';
import EmptyState from './components/EmptyState';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [url, setUrl] = useState('');
  const [fetcherType, setFetcherType] = useState('static');
  const [cssSelector, setCssSelector] = useState('');
  const [xpathSelector, setXpathSelector] = useState('');
  const [headless, setHeadless] = useState(true);

  const [options, setOptions] = useState({
    metadata: true,
    headings: true,
    links: true,
    images: true,
    tables: false,
    text: true,
    markdown: false,
    raw_html: false
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const savedHistory = localStorage.getItem('scraplingHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const saveToHistory = (scrapeResult) => {
    const historyItem = {
      id: Date.now(),
      url: scrapeResult.url,
      fetcher_type: scrapeResult.fetcher_type,
      timestamp: new Date().toISOString(),
      success: scrapeResult.success,
      stats: {
        headings: scrapeResult.extracted?.headings?.length || 0,
        links: scrapeResult.extracted?.links?.length || 0,
        images: scrapeResult.extracted?.images?.length || 0,
        tables: scrapeResult.extracted?.tables?.length || 0,
        word_count: scrapeResult.extracted?.word_count || 0,
        response_time: scrapeResult.response_time_ms
      }
    };
    const newHistory = [historyItem, ...history.slice(0, 19)];
    setHistory(newHistory);
    localStorage.setItem('scraplingHistory', JSON.stringify(newHistory));
  };

  const validateUrl = (urlString) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid HTTP or HTTPS URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = cssSelector || xpathSelector ? '/api/v1/scrape' : '/api/v1/extract';

      const requestBody = {
        url,
        fetcher_type: fetcherType,
        css_selector: cssSelector || null,
        xpath_selector: xpathSelector || null,
        headless,
        extract_metadata: options.metadata,
        extract_links: options.links,
        extract_images: options.images,
        extract_headings: options.headings,
        extract_tables: options.tables
      };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Request failed');
      }

      setResult(data);
      saveToHistory(data);
      setActiveTab('overview');
    } catch (err) {
      console.error('Scraping error:', err);
      setError(err.message || 'Failed to connect to the server');
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
    setResult(null);
    setError(null);
  };

  const deleteHistoryItem = (id) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('scraplingHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('scraplingHistory');
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scrapling-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (!result?.extracted) return;

    let csv = '';

    if (result.extracted.links?.length > 0) {
      csv += 'Links\n';
      csv += 'URL,Text,Title\n';
      result.extracted.links.forEach(link => {
        csv += `"${link.href}","${(link.text || '').replace(/"/g, '""')}","${(link.title || '').replace(/"/g, '""')}"\n`;
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
    link.download = `scrapling-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleOption = (key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="app-container">
      <Sidebar
        history={history}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLoadHistory={loadFromHistory}
        onDeleteItem={deleteHistoryItem}
        onClearAll={clearHistory}
      />

      <div className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
        <Header />

        <div className="dashboard">
          <form onSubmit={handleSubmit} className="scraping-form">
            <UrlInput
              url={url}
              onChange={setUrl}
              onClear={handleClear}
              disabled={loading}
            />

            <OptionsPanel
              fetcherType={fetcherType}
              onFetcherChange={setFetcherType}
              cssSelector={cssSelector}
              onCssSelectorChange={setCssSelector}
              xpathSelector={xpathSelector}
              onXpathSelectorChange={setXpathSelector}
              headless={headless}
              onHeadlessChange={setHeadless}
              options={options}
              onToggleOption={toggleOption}
              disabled={loading}
            />

            <div className="form-actions">
              <button
                type="submit"
                className="btn-analyze"
                disabled={loading || !url.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M19 9.5C19 14.194 15.194 18 10.5 18C5.806 18 2 14.194 2 9.5C2 4.806 5.806 1 10.5 1C15.194 1 19 4.806 19 9.5Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M16 16L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Analyze
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn-clear"
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </form>

          {error && <ErrorState error={error} onDismiss={() => setError(null)} />}

          {loading && <LoadingState />}

          {!loading && !error && !result && <EmptyState />}

          {!loading && result && result.success && (
            <div className="results-container">
              <StatsCards result={result} />

              <div className="results-panel">
                <div className="results-header">
                  <h2>Results</h2>
                  <div className="export-actions">
                    <button className="btn-export" onClick={exportJSON}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M14 10v4H2v-4M8 2v9M8 11l3-3M8 11L5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Export JSON
                    </button>
                    <button className="btn-export" onClick={exportCSV}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M14 10v4H2v-4M8 2v9M8 11l3-3M8 11L5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Export CSV
                    </button>
                  </div>
                </div>

                <ResultsTabs
                  result={result}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>
            </div>
          )}

          {!loading && result && !result.success && (
            <ErrorState
              error={result.error || 'Scraping failed'}
              onDismiss={() => setResult(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
