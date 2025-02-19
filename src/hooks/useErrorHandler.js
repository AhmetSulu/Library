import { useState, useCallback } from 'react';
import { useUI } from '../contexts/UIContext';

export function useErrorHandler() {
  const [error, setError] = useState(null);
  const { showToast } = useUI();

  const parseError = (error) => {
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return 'An unexpected error occurred';
  };

  const handleError = useCallback((error, fallbackMessage = 'An error occurred') => {
    const errorMessage = parseError(error) || fallbackMessage;
    setError(error);
    showToast(errorMessage, 'error');
    console.error('Error details:', {
      message: errorMessage,
      error: error,
      timestamp: new Date().toISOString()
    });
  }, [showToast]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    isError: !!error
  };
}