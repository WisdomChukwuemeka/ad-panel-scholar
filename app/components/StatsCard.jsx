export default function StatsCard({ title, value, change }) {
  return (
    <div className="stats-card">
      <h3>{title}</h3>
      <div className="value">{value}</div>
      <span className="change">{change}</span>
    </div>
  );
}