import { useState, useEffect } from 'react';

export default function BorrowForm({ 
  initialData,
  books,
  onSubmit,
  isReturning = false,
  isSubmitting = false
}) {
  // Initialize form state with default values
  const [formData, setFormData] = useState({
    borrowerName: '',
    borrowerMail: '',
    borrowingDate: new Date().toISOString().split('T')[0], // Today's date as default
    returnDate: '',
    bookForBorrowingRequest: null
  });

  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Populate form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        borrowerName: initialData.borrowerName || '',
        borrowerMail: initialData.borrowerMail || '',
        // Format dates to YYYY-MM-DD for date inputs
        borrowingDate: initialData.borrowingDate ? initialData.borrowingDate.split('T')[0] : new Date().toISOString().split('T')[0],
        returnDate: initialData.returnDate ? initialData.returnDate.split('T')[0] : '',
        // Map book data if available
        bookForBorrowingRequest: initialData.book ? {
          id: initialData.book.id,
          name: initialData.book.name,
          publicationYear: initialData.book.publicationYear,
          stock: initialData.book.stock
        } : null
      });
    }
  }, [initialData]);

  // Field-specific validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'borrowerName':
        if (!value.trim()) return 'Borrower name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > 100) return 'Name must be less than 100 characters';
        return '';

      case 'borrowerMail':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return '';

      case 'borrowingDate':
        if (!value) return 'Borrow date is required';
        if (new Date(value) > new Date()) return 'Borrow date cannot be in the future';
        return '';

      case 'returnDate':
        // Only validate return date when returning a book
        if (isReturning && !value) return 'Return date is required';
        if (value && new Date(value) < new Date(formData.borrowingDate)) {
          return 'Return date must be after borrow date';
        }
        return '';

      case 'bookForBorrowingRequest':
        // Book selection required only for new borrowings
        if (!isReturning && !value) return 'Book selection is required';
        return '';

      default:
        return '';
    }
  };

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes and validate on the fly
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
    
    if (isDirty) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDirty(true);

    if (!validateForm()) {
      return;
    }
    
    // Handle book return
    if (isReturning) {
      const returnData = {
        borrowerName: formData.borrowerName,
        borrowingDate: formData.borrowingDate,
        returnDate: formData.returnDate || new Date().toISOString().split('T')[0]
      };
      onSubmit(returnData);
      return;
    }

    // Handle new borrowing
    if (!initialData) {
      const selectedBook = books.find(b => b.id === parseInt(formData.bookForBorrowingRequest?.id));
      if (!selectedBook) return;

      const newBorrowData = {
        borrowerName: formData.borrowerName.trim(),
        borrowerMail: formData.borrowerMail.trim(),
        borrowingDate: formData.borrowingDate,
        bookForBorrowingRequest: {
          id: selectedBook.id,
          name: selectedBook.name,
          publicationYear: selectedBook.publicationYear,
          stock: selectedBook.stock
        }
      };
      onSubmit(newBorrowData);
    }
  };

  // Reset form to initial state
  const handleReset = () => {
    setFormData({
      borrowerName: '',
      borrowerMail: '',
      borrowingDate: new Date().toISOString().split('T')[0],
      returnDate: '',
      bookForBorrowingRequest: null
    });
    setErrors({});
    setIsDirty(false);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {/* Borrower information fields - only shown when not returning */}
      {!isReturning && (
        <>
          <div className="form-group">
            <label htmlFor="borrowerName" className="form-label">
              Borrower Name <span className="error-text">*</span>
            </label>
            <input
              type="text"
              id="borrowerName"
              name="borrowerName"
              value={formData.borrowerName}
              onChange={handleChange}
              className={`form-input ${errors.borrowerName ? 'error' : ''}`}
              disabled={isSubmitting}
              required
            />
            {errors.borrowerName && (
              <div className="error-text">{errors.borrowerName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="borrowerMail" className="form-label">
              Email <span className="error-text">*</span>
            </label>
            <input
              type="email"
              id="borrowerMail"
              name="borrowerMail"
              value={formData.borrowerMail}
              onChange={handleChange}
              className={`form-input ${errors.borrowerMail ? 'error' : ''}`}
              disabled={isSubmitting || initialData}
              required={!initialData}
            />
            {errors.borrowerMail && (
              <div className="error-text">{errors.borrowerMail}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="borrowingDate" className="form-label">
              Borrow Date <span className="error-text">*</span>
            </label>
            <input
              type="date"
              id="borrowingDate"
              name="borrowingDate"
              value={formData.borrowingDate}
              onChange={handleChange}
              className={`form-input ${errors.borrowingDate ? 'error' : ''}`}
              disabled={isSubmitting}
              max={new Date().toISOString().split('T')[0]}
              required
            />
            {errors.borrowingDate && (
              <div className="error-text">{errors.borrowingDate}</div>
            )}
          </div>
        </>
      )}

      {/* Return date field - only shown when returning */}
      {isReturning && (
        <div className="form-group">
          <label htmlFor="returnDate" className="form-label">
            Return Date <span className="error-text">*</span>
          </label>
          <input
            type="date"
            id="returnDate"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
            className={`form-input ${errors.returnDate ? 'error' : ''}`}
            min={formData.borrowingDate}
            max={new Date().toISOString().split('T')[0]}
            disabled={isSubmitting}
            required
          />
          {errors.returnDate && (
            <div className="error-text">{errors.returnDate}</div>
          )}
        </div>
      )}

      {/* Book selection - only shown for new borrowings */}
      {!initialData && !isReturning && (
        <div className="form-group">
          <label htmlFor="book" className="form-label">
            Book <span className="error-text">*</span>
          </label>
          <select
            id="book"
            name="book"
            value={formData.bookForBorrowingRequest?.id || ''}
            onChange={(e) => {
              const selectedBook = books.find(b => b.id === parseInt(e.target.value));
              handleChange({
                target: {
                  name: 'bookForBorrowingRequest',
                  value: selectedBook ? {
                    id: selectedBook.id,
                    name: selectedBook.name,
                    publicationYear: selectedBook.publicationYear,
                    stock: selectedBook.stock
                  } : null
                }
              });
            }}
            className={`form-input ${errors.bookForBorrowingRequest ? 'error' : ''}`}
            disabled={isSubmitting}
            required
          >
            <option value="">Select Book</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.name} (Stock: {book.stock})
              </option>
            ))}
          </select>
          {errors.bookForBorrowingRequest && (
            <div className="error-text">{errors.bookForBorrowingRequest}</div>
          )}
        </div>
      )}

      {/* Form action buttons */}
      <div className="form-footer">
        <button
          type="button"
          onClick={handleReset}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Reset
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? 'Processing...' 
            : (isReturning ? 'Return Book' : 'Create Borrowing')
          }
        </button>
      </div>
    </form>
  );
}