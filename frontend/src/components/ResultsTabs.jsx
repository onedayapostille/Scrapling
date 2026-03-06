import React from 'react';
import './ResultsTabs.css';

const ResultsTabs = ({ result, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'metadata', label: 'Metadata', icon: '🏷️' },
    { id: 'headings', label: 'Headings', icon: '📑' },
    { id: 'links', label: 'Links', icon: '🔗' },
    { id: 'images', label: 'Images', icon: '🖼️' },
    { id: 'tables', label: 'Tables', icon: '📊' },
    { id: 'text', label: 'Text', icon: '📝' },
    { id: 'markdown', label: 'Markdown', icon: '📄' },
    { id: 'html', label: 'Raw HTML', icon: '💻' },
    { id: 'json', label: 'JSON', icon: '{ }' }
  ];

  const renderOverview = () => (
    <div className="overview-content">
      <div className="overview-section">
        <h3>Page Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">URL:</span>
            <span className="info-value">{result.url}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span className="info-value status-success">{result.status_code || 'Success'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Fetcher:</span>
            <span className="info-value">{result.fetcher_type}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Response Time:</span>
            <span className="info-value">{result.response_time_ms}ms</span>
          </div>
        </div>
      </div>

      {result.extracted?.metadata?.title && (
        <div className="overview-section">
          <h3>Page Summary</h3>
          <div className="page-summary">
            <h4>{result.extracted.metadata.title}</h4>
            {result.extracted.metadata.description && (
              <p className="description">{result.extracted.metadata.description}</p>
            )}
          </div>
        </div>
      )}

      <div className="overview-section">
        <h3>Content Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">{result.extracted?.headings?.length || 0}</span>
            <span className="stat-label">Headings</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{result.extracted?.links?.length || 0}</span>
            <span className="stat-label">Links</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{result.extracted?.images?.length || 0}</span>
            <span className="stat-label">Images</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{result.extracted?.tables?.length || 0}</span>
            <span className="stat-label">Tables</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{result.extracted?.word_count || 0}</span>
            <span className="stat-label">Words</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetadata = () => {
    const metadata = result.extracted?.metadata;
    if (!metadata) {
      return <div className="empty-tab">No metadata available</div>;
    }

    return (
      <div className="metadata-content">
        <div className="metadata-section">
          <h3>Basic Information</h3>
          <div className="metadata-list">
            {metadata.title && (
              <div className="metadata-item">
                <span className="metadata-key">Title:</span>
                <span className="metadata-value">{metadata.title}</span>
              </div>
            )}
            {metadata.description && (
              <div className="metadata-item">
                <span className="metadata-key">Description:</span>
                <span className="metadata-value">{metadata.description}</span>
              </div>
            )}
            {metadata.canonical && (
              <div className="metadata-item">
                <span className="metadata-key">Canonical URL:</span>
                <span className="metadata-value">{metadata.canonical}</span>
              </div>
            )}
          </div>
        </div>

        {(metadata.og_title || metadata.og_description || metadata.og_image) && (
          <div className="metadata-section">
            <h3>Open Graph</h3>
            <div className="metadata-list">
              {metadata.og_title && (
                <div className="metadata-item">
                  <span className="metadata-key">OG Title:</span>
                  <span className="metadata-value">{metadata.og_title}</span>
                </div>
              )}
              {metadata.og_description && (
                <div className="metadata-item">
                  <span className="metadata-key">OG Description:</span>
                  <span className="metadata-value">{metadata.og_description}</span>
                </div>
              )}
              {metadata.og_image && (
                <div className="metadata-item">
                  <span className="metadata-key">OG Image:</span>
                  <span className="metadata-value">{metadata.og_image}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {(metadata.twitter_card || metadata.twitter_title || metadata.twitter_description) && (
          <div className="metadata-section">
            <h3>Twitter Card</h3>
            <div className="metadata-list">
              {metadata.twitter_card && (
                <div className="metadata-item">
                  <span className="metadata-key">Card Type:</span>
                  <span className="metadata-value">{metadata.twitter_card}</span>
                </div>
              )}
              {metadata.twitter_title && (
                <div className="metadata-item">
                  <span className="metadata-key">Title:</span>
                  <span className="metadata-value">{metadata.twitter_title}</span>
                </div>
              )}
              {metadata.twitter_description && (
                <div className="metadata-item">
                  <span className="metadata-key">Description:</span>
                  <span className="metadata-value">{metadata.twitter_description}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHeadings = () => {
    const headings = result.extracted?.headings;
    if (!headings || headings.length === 0) {
      return <div className="empty-tab">No headings found</div>;
    }

    return (
      <div className="headings-content">
        {headings.map((heading, index) => (
          <div key={index} className={`heading-item level-${heading.level}`}>
            <span className="heading-level">{heading.level}</span>
            <span className="heading-text">{heading.text}</span>
            {heading.id && <span className="heading-id">#{heading.id}</span>}
          </div>
        ))}
      </div>
    );
  };

  const renderLinks = () => {
    const links = result.extracted?.links;
    if (!links || links.length === 0) {
      return <div className="empty-tab">No links found</div>;
    }

    return (
      <div className="links-content">
        {links.map((link, index) => (
          <div key={index} className="link-item">
            <div className="link-header">
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="link-url">
                {link.href}
              </a>
              {link.is_external && <span className="link-badge external">External</span>}
            </div>
            {link.text && <div className="link-text">{link.text}</div>}
            {link.title && <div className="link-title">{link.title}</div>}
          </div>
        ))}
      </div>
    );
  };

  const renderImages = () => {
    const images = result.extracted?.images;
    if (!images || images.length === 0) {
      return <div className="empty-tab">No images found</div>;
    }

    return (
      <div className="images-content">
        <div className="images-grid">
          {images.map((image, index) => (
            <div key={index} className="image-card">
              <div className="image-preview">
                <img src={image.src} alt={image.alt || 'Image'} loading="lazy" />
              </div>
              <div className="image-info">
                {image.alt && <div className="image-alt">{image.alt}</div>}
                <a href={image.src} target="_blank" rel="noopener noreferrer" className="image-src">
                  {image.src}
                </a>
                {image.width && image.height && (
                  <div className="image-dimensions">{image.width} × {image.height}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTables = () => {
    const tables = result.extracted?.tables;
    if (!tables || tables.length === 0) {
      return <div className="empty-tab">No tables found</div>;
    }

    return (
      <div className="tables-content">
        {tables.map((table, tableIndex) => (
          <div key={tableIndex} className="table-wrapper">
            {table.caption && <div className="table-caption">{table.caption}</div>}
            <div className="table-scroll">
              <table className="data-table">
                {table.headers && table.headers.length > 0 && (
                  <thead>
                    <tr>
                      {table.headers.map((header, headerIndex) => (
                        <th key={headerIndex}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {table.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderText = () => {
    const text = result.extracted?.text_content;
    if (!text) {
      return <div className="empty-tab">No text content available</div>;
    }

    return (
      <div className="text-content">
        <div className="text-stats">
          <span>Word count: {result.extracted?.word_count || 0}</span>
          <span>Character count: {text.length}</span>
        </div>
        <pre className="text-display">{text}</pre>
      </div>
    );
  };

  const renderMarkdown = () => {
    const markdown = result.markdown || result.extracted?.markdown;
    if (!markdown) {
      return <div className="empty-tab">Markdown format not available</div>;
    }

    return (
      <div className="markdown-content">
        <pre className="markdown-display">{markdown}</pre>
      </div>
    );
  };

  const renderHTML = () => {
    const html = result.html || result.raw_html;
    if (!html) {
      return <div className="empty-tab">Raw HTML not available</div>;
    }

    return (
      <div className="html-content">
        <pre className="html-display">{html}</pre>
      </div>
    );
  };

  const renderJSON = () => {
    return (
      <div className="json-content">
        <pre className="json-display">{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'metadata':
        return renderMetadata();
      case 'headings':
        return renderHeadings();
      case 'links':
        return renderLinks();
      case 'images':
        return renderImages();
      case 'tables':
        return renderTables();
      case 'text':
        return renderText();
      case 'markdown':
        return renderMarkdown();
      case 'html':
        return renderHTML();
      case 'json':
        return renderJSON();
      default:
        return <div className="empty-tab">Select a tab to view content</div>;
    }
  };

  return (
    <div className="results-tabs">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ResultsTabs;
