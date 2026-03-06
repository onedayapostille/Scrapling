import './StatsCards.css';

function StatsCards({ result }) {
  const stats = [
    {
      label: 'Response Time',
      value: `${result.response_time_ms}ms`,
      icon: '⚡',
      color: '#667eea'
    },
    {
      label: 'Headings',
      value: result.extracted?.headings?.length || 0,
      icon: '📑',
      color: '#48bb78'
    },
    {
      label: 'Links',
      value: result.extracted?.links?.length || 0,
      icon: '🔗',
      color: '#4299e1'
    },
    {
      label: 'Images',
      value: result.extracted?.images?.length || 0,
      icon: '🖼️',
      color: '#ed8936'
    },
    {
      label: 'Tables',
      value: result.extracted?.tables?.length || 0,
      icon: '📊',
      color: '#9f7aea'
    },
    {
      label: 'Word Count',
      value: result.extracted?.word_count || 0,
      icon: '📝',
      color: '#38b2ac'
    }
  ];

  return (
    <div className="stats-cards">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="stat-card"
          style={{ '--card-color': stat.color }}
        >
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
