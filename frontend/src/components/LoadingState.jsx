import './LoadingState.css';

function LoadingState() {
  return (
    <div className="loading-state">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <h3>Analyzing Website...</h3>
      <p>Extracting data from the target URL</p>
      <div className="loading-steps">
        <div className="loading-step active">
          <div className="step-indicator"></div>
          <span>Fetching content</span>
        </div>
        <div className="loading-step">
          <div className="step-indicator"></div>
          <span>Parsing HTML</span>
        </div>
        <div className="loading-step">
          <div className="step-indicator"></div>
          <span>Extracting data</span>
        </div>
      </div>
    </div>
  );
}

export default LoadingState;
