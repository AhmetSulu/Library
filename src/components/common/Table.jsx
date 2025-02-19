export default function Table({ columns, data = [], onEdit, onDelete }) {
  // Display message when no data is available
  if (!data.length) {
    return (
      <div className="table-container">
        <div className="no-data-message">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        {/* Table header */}
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th className="action-header">Actions</th>
          </tr>
        </thead>
        {/* Table body with data rows */}
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              {columns.map(column => (
                <td key={`${item.id}-${column.key}`}>
                  {column.render ? column.render(item) : item[column.key] || '-'}
                </td>
              ))}
              {/* Action buttons */}
              <td className="action-cell">
                <div className="action-buttons">
                  <button 
                    onClick={() => onEdit(item)} 
                    className="btn btn-primary"
                    title="Edit this item"
                    type="button"
                  >
                    Update
                  </button>
                  <button 
                    onClick={() => onDelete(item.id)} 
                    className="btn btn-danger"
                    title="Delete this item"
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}