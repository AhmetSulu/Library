import { useState, useEffect } from 'react';

export default function CategoryForm({ initialData, onSubmit, isSubmitting = false }) {
  // State declarations for managing form data and validation
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Populate form when initial data is provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  // Validate individual form fields
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Category name is required';
        if (value.trim().length < 2) return 'Category name must be at least 2 characters';
        if (value.trim().length > 50) return 'Category name must be less than 50 characters';
        return '';

      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.trim().length < 5) return 'Description must be at least 5 characters';
        if (value.trim().length > 500) return 'Description must be less than 500 characters';
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

  // Handle input changes and validate
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

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim()
    });
  };

  // Reset form to initial state
  const handleReset = () => {
    setFormData(initialData || {
      name: '',
      description: ''
    });
    setErrors({});
    setIsDirty(false);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {/* Form fields */}
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Category Name <span className="error-text">*</span>
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
        <label htmlFor="description" className="form-label">
          Description <span className="error-text">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`form-input ${errors.description ? 'error' : ''}`}
          rows="4"
          disabled={isSubmitting}
          required
        />
        {errors.description && (
          <div className="error-text">{errors.description}</div>
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
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Category' : 'Create Category')}
        </button>
      </div>
    </form>
  );
}