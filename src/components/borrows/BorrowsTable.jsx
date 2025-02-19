import { useMemo } from 'react';

const BorrowsTable = ({ columns, data = [], onReturn, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      
      if (!a.returnDate && b.returnDate) return -1;
      if (a.returnDate && !b.returnDate) return 1;
      
      
      if (!a.returnDate && !b.returnDate) {
        return new Date(b.borrowingDate) - new Date(a.borrowingDate);
      }
      
      
      return new Date(b.returnDate) - new Date(a.returnDate);
    });
  }, [data]);

  if (!data.length) {
    return (
      <div className="table-container">
        <div className="no-data-message">
          No borrowing records found
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th className="text-center">STATUS</th>
            <th className="text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr key={item.id} className={!item.returnDate ? 'active-row' : ''}>
              {columns.map(column => (
                <td key={`${item.id}-${column.key}`}>
                  {column.render ? column.render(item) : 
                    column.key === 'borrowingDate' || column.key === 'returnDate' ? 
                      formatDate(item[column.key]) : item[column.key] || '-'}
                </td>
              ))}
              <td className="text-center">
                <span className={`status-badge ${item.returnDate ? 'status-completed' : 'status-active'}`}>
                  {item.returnDate ? 'Completed' : 'Active'}
                </span>
              </td>
              <td className="text-center">
                <div className="action-buttons">
                  {!item.returnDate ? (
                    <button
                      onClick={() => onReturn(item)}
                      className="btn btn-primary"
                      title="Return this book"
                      type="button"
                    >
                      Return
                    </button>
                  ) : (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="btn btn-danger"
                      title="Delete this record"
                      type="button"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowsTable;