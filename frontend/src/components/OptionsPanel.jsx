import './OptionsPanel.css';

function OptionsPanel({
  fetcherType,
  onFetcherChange,
  cssSelector,
  onCssSelectorChange,
  xpathSelector,
  onXpathSelectorChange,
  headless,
  onHeadlessChange,
  options,
  onToggleOption,
  disabled
}) {
  const modes = [
    { value: 'static', label: 'Fast', description: 'HTTP-only (fastest)', icon: '⚡' },
    { value: 'dynamic', label: 'Dynamic', description: 'Full browser automation', icon: '🌐' },
    { value: 'stealthy', label: 'Stealth', description: 'Anti-bot bypass', icon: '🥷' }
  ];

  const extractionOptions = [
    { key: 'metadata', label: 'Metadata', description: 'Title, description, OG tags' },
    { key: 'headings', label: 'Headings', description: 'H1-H6 elements' },
    { key: 'links', label: 'Links', description: 'All hyperlinks' },
    { key: 'images', label: 'Images', description: 'Image sources and alt text' },
    { key: 'tables', label: 'Tables', description: 'Table data extraction' },
    { key: 'text', label: 'Text', description: 'Full text content' },
    { key: 'markdown', label: 'Markdown', description: 'Markdown format' },
    { key: 'raw_html', label: 'Raw HTML', description: 'Complete HTML source' }
  ];

  return (
    <div className="options-panel">
      <div className="options-section">
        <h3 className="options-title">Scraping Mode</h3>
        <div className="mode-selector">
          {modes.map((mode) => (
            <label
              key={mode.value}
              className={`mode-option ${fetcherType === mode.value ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
            >
              <input
                type="radio"
                name="fetcher-type"
                value={mode.value}
                checked={fetcherType === mode.value}
                onChange={(e) => onFetcherChange(e.target.value)}
                disabled={disabled}
              />
              <div className="mode-content">
                <span className="mode-icon">{mode.icon}</span>
                <div className="mode-info">
                  <span className="mode-label">{mode.label}</span>
                  <span className="mode-description">{mode.description}</span>
                </div>
              </div>
            </label>
          ))}
        </div>

        {(fetcherType === 'dynamic' || fetcherType === 'stealthy') && (
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={headless}
              onChange={(e) => onHeadlessChange(e.target.checked)}
              disabled={disabled}
            />
            <span>Headless Mode (recommended)</span>
          </label>
        )}
      </div>

      <div className="options-section">
        <h3 className="options-title">Selectors (Optional)</h3>
        <div className="selector-inputs">
          <div className="input-group">
            <label htmlFor="css-selector">CSS Selector</label>
            <input
              id="css-selector"
              type="text"
              value={cssSelector}
              onChange={(e) => onCssSelectorChange(e.target.value)}
              placeholder=".product, #content, h1"
              disabled={disabled}
            />
          </div>
          <div className="input-group">
            <label htmlFor="xpath-selector">XPath Selector</label>
            <input
              id="xpath-selector"
              type="text"
              value={xpathSelector}
              onChange={(e) => onXpathSelectorChange(e.target.value)}
              placeholder="//div[@class='content']"
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      <div className="options-section">
        <h3 className="options-title">Extraction Options</h3>
        <div className="extraction-grid">
          {extractionOptions.map((option) => (
            <label
              key={option.key}
              className={`extraction-option ${options[option.key] ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
            >
              <input
                type="checkbox"
                checked={options[option.key]}
                onChange={() => onToggleOption(option.key)}
                disabled={disabled}
              />
              <div className="extraction-content">
                <span className="extraction-label">{option.label}</span>
                <span className="extraction-description">{option.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OptionsPanel;
