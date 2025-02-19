import { useState, useEffect } from 'react';

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1500;

export default function BookForm({ 
  initialData, 
  authors, 
  publishers, 
  categories, 
  onSubmit,
  isSubmitting = false
}) {
  // State for managing form data with default values
  const [formData, setFormData] = useState({
    name: '',
    publicationYear: CURRENT_YEAR,
    stock: 0,
    author: '',
    publisher: '',
    categories: []
  });

  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Populate form when initial data is provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        publicationYear: initialData.publicationYear || CURRENT_YEAR,
        stock: initialData.stock || 0,
        author: initialData.author?.id || initialData.authorId || '',
        publisher: initialData.publisher?.id || initialData.publisherId || '',
        categories: initialData.categories?.map(cat => cat.id) || []
      });
    }
  }, [initialData]);

  // Validate individual form fields with specific rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Book name is required';
        if (value.length < 2) return 'Book name must be at least 2 characters';
        if (value.length > 100) return 'Book name must be less than 100 characters';
        return '';

      case 'publicationYear':
        const year = parseInt(value);
        if (!year) return 'Publication year is required';
        if (year < MIN_YEAR) return `Publication year must be after ${MIN_YEAR}`;
        if (year > CURRENT_YEAR) return 'Publication year cannot be in the future';
        return '';

      case 'stock':
        if (value < 0) return 'Stock cannot be negative';
        return '';

      case 'author':
        if (!value) return 'Author is required';
        return '';

      case 'publisher':
        if (!value) return 'Publisher is required';
        return '';

      case 'categories':
        if (!value.length) return 'At least one category is required';
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

  // Process form submission with data transformation
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDirty(true);

    if (!validateForm()) {
      return;
    }

    // Transform form data for API submission
    const submissionData = {
      name: formData.name,
      publicationYear: parseInt(formData.publicationYear),
      stock: parseInt(formData.stock),
      author: {
        id: parseInt(formData.author)
      },
      publisher: {
        id: parseInt(formData.publisher)
      },
      categories: formData.categories.map(id => ({ id: parseInt(id) }))
    };
    onSubmit(submissionData);
  };

  // Reset form to initial state
  const handleReset = () => {
    setFormData(initialData || {
      name: '',
      publicationYear: CURRENT_YEAR,
      stock: 0,
      author: '',
      publisher: '',
      categories: []
    });
    setErrors({});
    setIsDirty(false);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {/* Book basic information fields */}
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Name <span className="error-text">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`form-input ${errors.name ? 'error' : ''}`}
          disabled={isSubmitting}
          required
        />
        {errors.name && (
          <div className="error-text">{errors.name}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="publicationYear" className="form-label">
          Publication Year <span className="error-text">*</span>
        </label>
        <input
          type="number"
          id="publicationYear"
          name="publicationYear"
          value={formData.publicationYear}
          onChange={handleChange}
          className={`form-input ${errors.publicationYear ? 'error' : ''}`}
          min={MIN_YEAR}
          max={CURRENT_YEAR}
          disabled={isSubmitting}
          required
        />
        {errors.publicationYear && (
          <div className="error-text">{errors.publicationYear}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="stock" className="form-label">
          Stock <span className="error-text">*</span>
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className={`form-input ${errors.stock ? 'error' : ''}`}
          min="0"
          disabled={isSubmitting}
          required
        />
        {errors.stock && (
          <div className="error-text">{errors.stock}</div>
        )}
      </div>

      {/* Related entity selection fields */}
      <div className="form-group">
        <label htmlFor="author" className="form-label">
          Author <span className="error-text">*</span>
        </label>
        <select
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className={`form-input ${errors.author ? 'error' : ''}`}
          disabled={isSubmitting}
          required
        >
          <option value="">Select Author</option>
          {authors.map(author => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
        {errors.author && (
          <div className="error-text">{errors.author}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="publisher" className="form-label">
          Publisher <span className="error-text">*</span>
        </label>
        <select
          id="publisher"
          name="publisher"
          value={formData.publisher}
          onChange={handleChange}
          className={`form-input ${errors.publisher ? 'error' : ''}`}
          disabled={isSubmitting}
          required
        >
          <option value="">Select Publisher</option>
          {publishers.map(publisher => (
            <option key={publisher.id} value={publisher.id}>
              {publisher.name}
            </option>
          ))}
        </select>
        {errors.publisher && (
          <div className="error-text">{errors.publisher}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="categories" className="form-label">
          Categories <span className="error-text">*</span>
        </label>
        <select
          id="categories"
          name="categories"
          value={formData.categories[0] || ''}
          onChange={(e) => handleChange({
            target: { 
              name: 'categories', 
              value: e.target.value ? [e.target.value] : [] 
            }
          })}
          className={`form-input ${errors.categories ? 'error' : ''}`}
          disabled={isSubmitting}
          required
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categories && (
          <div className="error-text">{errors.categories}</div>
        )}
      </div>

      {/* Form actions */}
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
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Book' : 'Create Book')}
        </button>
      </div>
    </form>
  );
}