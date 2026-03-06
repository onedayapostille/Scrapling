import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <h1>Scrapling Studio</h1>
          <span className="header-badge">Pro</span>
        </div>
        <p className="header-subtitle">Professional web scraping with advanced extraction capabilities</p>
      </div>
    </header>
  );
}

export default Header;
