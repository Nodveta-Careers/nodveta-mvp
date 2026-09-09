const StatBar = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <div className="nm-stat-bar fadeInUp animate-in zoom-in-95 duration-300">
      {items.map((item) => (
        <div key={item.label} className="nm-stat-item">
          <span className="nm-stat-label">{item.label}</span>
          <span className={`nm-stat-value ${item.highlight ? "text-nodemeta-teal" : ""}`}>
            {item.value ?? "—"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatBar;
