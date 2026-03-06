import { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [url, setUrl] = useState('')
  const [fetcherType, setFetcherType] = useState('static')
  const [cssSelector, setCssSelector] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${API_URL}/api/v1/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          fetcher_type: fetcherType,
          css_selector: cssSelector || null,
          headless: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to scrape')
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header>
        <h1>Scrapling Web Interface</h1>
        <p>Effortless web scraping with multiple fetcher types</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">URL to Scrape</label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fetcher">Fetcher Type</label>
          <select
            id="fetcher"
            value={fetcherType}
            onChange={(e) => setFetcherType(e.target.value)}
          >
            <option value="static">Static (Fast HTTP)</option>
            <option value="dynamic">Dynamic (Browser)</option>
            <option value="stealthy">Stealthy (Anti-bot)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="selector">CSS Selector (Optional)</label>
          <input
            id="selector"
            type="text"
            value={cssSelector}
            onChange={(e) => setCssSelector(e.target.value)}
            placeholder=".quote .text"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Scraping...' : 'Scrape'}
        </button>
      </form>

      {error && (
        <div className="error">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result">
          <h3>Results</h3>
          <div className="result-meta">
            <p><strong>Status:</strong> {result.success ? 'Success' : 'Failed'}</p>
            <p><strong>URL:</strong> {result.url}</p>
            <p><strong>Fetcher:</strong> {result.fetcher_type}</p>
          </div>

          {result.data && result.data.length > 0 && (
            <div className="elements">
              <h4>Extracted Elements ({result.data.length})</h4>
              {result.data.map((element, index) => (
                <div key={index} className="element">
                  <strong>Element {index + 1}</strong>
                  <p className="element-text">{element.text}</p>
                  {element.attributes && Object.keys(element.attributes).length > 0 && (
                    <details>
                      <summary>Attributes</summary>
                      <pre>{JSON.stringify(element.attributes, null, 2)}</pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          {result.full_html && (
            <details>
              <summary>Full HTML</summary>
              <pre className="html-content">{result.full_html.substring(0, 5000)}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  )
}

export default App
