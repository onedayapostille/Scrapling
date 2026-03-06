# Scrapling Studio - Premium SaaS Dashboard

A modern, professional web interface for the Scrapling web scraping platform.

## Overview

Scrapling Studio is a complete web scraping dashboard that provides real-time API integration with the Scrapling backend. It features a modular component architecture with a polished UI design suitable for production deployment.

## Features

### Core Functionality
- **Real Backend Integration**: Direct API connection to Scrapling backend (not a mockup)
- **Three Scraping Modes**: Fast (HTTP-only), Dynamic (browser automation), Stealth (anti-bot bypass)
- **Comprehensive Data Extraction**: Metadata, headings, links, images, tables, text, markdown, HTML
- **URL Validation**: Client-side validation before submission
- **Request Lifecycle Management**: Proper loading, success, and error states
- **History Tracking**: Recent scraping runs stored in localStorage (last 20 runs)
- **Export Functionality**: Download results as JSON or CSV

### User Interface

#### Main Components
1. **Header** - Branding with "Scrapling Studio" title and "Pro" badge
2. **URL Input** - Large, prominent input field with validation and clear button
3. **Options Panel**:
   - Mode selector with icons and descriptions
   - Optional CSS/XPath selector inputs
   - Extraction options grid with 8 toggles
4. **Results Display**:
   - Stats cards showing key metrics (response time, counts)
   - 10 result tabs for different data views
   - Export buttons for JSON/CSV download
5. **Sidebar** - Recent runs history with timestamps and quick access

#### Result Tabs
- **Overview**: Page information, summary, and statistics
- **Metadata**: Title, description, Open Graph, Twitter Card data
- **Headings**: Hierarchical display of H1-H6 tags
- **Links**: All page links with external indicators
- **Images**: Grid display with previews and metadata
- **Tables**: Formatted table data with captions
- **Text**: Extracted text content with word count
- **Markdown**: Markdown-formatted content (if available)
- **Raw HTML**: Complete HTML source code
- **JSON**: Full API response in JSON format

### Design System

**Color Palette**:
- Primary gradient: Purple-blue (#667eea → #764ba2)
- Success: Green (#48bb78)
- Info: Blue (#4299e1)
- Warning: Orange (#ed8936)
- Error: Red (#fc8181)
- Neutral: Gray scale

**Typography**:
- System fonts for optimal performance
- Clear hierarchy with 3 font weights
- Responsive sizing

**Layout**:
- Responsive breakpoints (768px, 1024px)
- Sidebar collapses on mobile
- Grid-based content organization
- Proper spacing system (8px base)

## Technical Architecture

### Component Structure

```
frontend/src/
├── App.jsx                      # Main application with state management
├── App.css                      # Global app styles
├── components/
│   ├── Header.jsx/css          # Top header with branding
│   ├── Sidebar.jsx/css         # History sidebar
│   ├── UrlInput.jsx/css        # URL input field
│   ├── OptionsPanel.jsx/css    # Mode and extraction options
│   ├── StatsCards.jsx/css      # Statistics display
│   ├── EmptyState.jsx/css      # Initial empty state
│   ├── LoadingState.jsx/css    # Loading animation
│   ├── ErrorState.jsx/css      # Error display
│   └── ResultsTabs.jsx/css     # Tabbed results viewer
└── main.jsx                     # React entry point
```

### State Management

The main App component manages all application state:

```javascript
// Core state
const [url, setUrl] = useState('');
const [mode, setMode] = useState('static');
const [cssSelector, setCssSelector] = useState('');
const [xpathSelector, setXpathSelector] = useState('');

// Extraction options
const [extractionOptions, setExtractionOptions] = useState({
  metadata: true,
  headings: true,
  links: true,
  images: true,
  tables: true,
  text: true,
  markdown: false,
  raw_html: false
});

// UI state
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [result, setResult] = useState(null);
const [activeTab, setActiveTab] = useState('overview');
const [history, setHistory] = useState([]);
```

### API Integration

**Environment Configuration**:
```bash
VITE_API_URL=http://localhost:8000
```

**Endpoints Used**:
- `POST /api/v1/scrape` - Basic scraping with selector
- `POST /api/v1/extract` - Comprehensive data extraction

**Request Flow**:
1. Validate URL on client side
2. Build request payload with selected options
3. Send POST request to appropriate endpoint
4. Handle loading state during request
5. Display results or error on response
6. Save successful runs to history

### Data Flow

1. **User Input** → State update
2. **Form Submit** → URL validation
3. **API Request** → Loading state
4. **Response** → Parse and display
5. **History Update** → LocalStorage sync
6. **Tab Navigation** → Content switching
7. **Export** → File download

## Usage

### Starting the Application

**Development**:
```bash
cd frontend
npm install
npm run dev
```

**Production**:
```bash
npm run build
# Serve the dist/ directory
```

### Making a Scraping Request

1. Enter a URL in the large input field
2. Select scraping mode (Fast/Dynamic/Stealth)
3. (Optional) Add CSS or XPath selector
4. Toggle extraction options as needed
5. Click "Start Scraping"
6. View results in tabbed interface
7. Export data if needed

### Viewing History

- Click any item in the sidebar to reload that request
- Use "Clear All" to remove all history
- Delete individual items with the trash icon

## Key Features Implementation

### URL Validation
```javascript
const validateUrl = (urlString) => {
  try {
    const urlObj = new URL(urlString);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};
```

### Request Handling
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateUrl(url)) {
    setError('Please enter a valid HTTP or HTTPS URL');
    return;
  }

  setLoading(true);
  setError(null);
  setResult(null);

  try {
    const response = await fetch(`${API_URL}/api/v1/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setResult(data);
    addToHistory(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Export Functionality
```javascript
const exportJSON = () => {
  const dataStr = JSON.stringify(result, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `scrapling-${Date.now()}.json`;
  link.click();
};
```

## Performance Considerations

- **Code Splitting**: Component-based architecture enables tree-shaking
- **Lazy Loading**: Images use loading="lazy" attribute
- **Local Storage**: History persisted for quick access
- **Responsive Design**: Mobile-optimized layouts
- **CSS Optimization**: Minimal, focused stylesheets per component

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Features

- URL validation before submission
- No sensitive data stored in localStorage
- CORS headers properly handled
- Input sanitization on backend
- HTTPS recommended for production

## Deployment

### Docker
```bash
docker build -t scrapling-frontend -f frontend/Dockerfile frontend/
docker run -p 3000:80 scrapling-frontend
```

### Environment Variables
Create `.env` file:
```bash
VITE_API_URL=https://api.yourdomain.com
VITE_APP_TITLE=Scrapling Studio
```

### Nginx Configuration
Included in `frontend/nginx.conf`:
- Gzip compression
- SPA routing
- API proxying
- Cache headers

## Future Enhancements

Potential features for future versions:
- User authentication and saved profiles
- Scheduled scraping jobs
- Advanced proxy configuration
- Custom extraction rules builder
- Webhook notifications
- Team collaboration features
- API key management
- Usage analytics dashboard

## Credits

Built on top of the [Scrapling](https://github.com/D4Vinci/Scrapling) web scraping framework.

**Tech Stack**:
- React 18
- Vite
- Vanilla CSS3
- FastAPI (backend)
- Python 3.11+

## License

BSD-3-Clause License - See LICENSE file

---

**Project Status**: Production Ready

This dashboard provides a complete, deployment-ready interface for the Scrapling web scraping platform with real backend integration and a professional user experience.
