import React from 'react';

function Sidebar({
  title,
  description,
  enableAllText,
  disableAllText,
  adTitle,
  adText,
  datasets,
  enabledCategories,
  onToggleCategory,
  onEnableAll,
  onDisableAll
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-header">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="sidebar-actions">
          <button type="button" onClick={onEnableAll}>
            {enableAllText}
          </button>
          <button type="button" onClick={onDisableAll}>
            {disableAllText}
          </button>
        </div>

        <div className="category-list">
          {datasets.map((item) => (
            <label key={item.key} className="category-item">
              <input
                type="checkbox"
                checked={enabledCategories[item.key]}
                onChange={() => onToggleCategory(item.key)}
              />
              <span>{item.title}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="sidebar-ad">
        <h3>{adTitle}</h3>
        <p>{adText}</p>
      </div>
    </aside>
  );
}

export default Sidebar;