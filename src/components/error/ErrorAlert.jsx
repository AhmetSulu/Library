import { AlertCircle, RefreshCw } from 'lucide-react';

export function ErrorAlert({ 
  error,    // Error object containing message and optional details
  onRetry   // Optional callback function to retry the failed operation
}) {
  // Don't render anything if no error is provided
  if (!error) return null;

  return (
    // Wrapper div with ARIA role for accessibility
    <div className="error-banner" role="alert">
      {/* Error content container */}
      <div className="error-content">
        {/* Error icon section */}
        <div className="error-icon">
          <AlertCircle size={24} />
        </div>
        {/* Error message section */}
        <div className="error-message">
          {/* Display error message or fallback to generic message */}
          <p>{error?.message || 'An unexpected error occurred'}</p>
          {/* Display additional error details if available */}
          {error?.details && (
            <p className="error-details">{error.details}</p>
          )}
        </div>
      </div>
      {/* Conditional retry button */}
      {onRetry && (
        <button 
          onClick={onRetry}
          className="btn btn-primary"
          title="Try to load data again"
        >
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}