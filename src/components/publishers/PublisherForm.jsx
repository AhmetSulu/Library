import { useState, useEffect } from 'react';

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1500;

export default function PublisherForm({ initialData, onSubmit, isSubmitting = false }) {
  // State declarations for managing form data and validation
  const [formData, setFormData] = useState({
    name: '',
    establishmentYear: CURRENT_YEAR,
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Populate form when initial data is provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        establishmentYear: initialData.establishmentYear || CURRENT_YEAR,
        address: initialData.address || ''
      });
    }
  }, [initialData]);

  // Validate individual form fields
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Publisher name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 100) return 'Name must be less than 100 characters';
        return '';

      case 'establishmentYear':
        const year = parseInt(value);
        if (!year) return 'Establishment year is required';
        if (year < MIN_YEAR) return `Year must be after ${MIN_YEAR}`;
        if (year > CURRENT_YEAR) return 'Year cannot be in the future';
        return '';

      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 5) return 'Address must be at least 5 characters';
        if (value.trim().length > 200) return 'Address must be less than 200 characters';
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
      address: formData.address.trim(),
      establishmentYear: parseInt(formData.establishmentYear)
    });
  };

  // Reset form to initial state
  const handleReset = () => {
    setFormData(initialData || {
      name: '',
      establishmentYear: CURRENT_YEAR,
      address: ''
    });
    setErrors({});
    setIsDirty(false);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {/* Form fields */}
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
        <label htmlFor="establishmentYear" className="form-label">
          Establishment Year <span className="error-text">*</span>
        </label>
        <input
          type="number"
          id="establishmentYear"
          name="establishmentYear"
          value={formData.establishmentYear}
          onChange={handleChange}
          min={MIN_YEAR}
          max={CURRENT_YEAR}
          className={`form-input ${errors.establishmentYear ? 'error' : ''}`}
          disabled={isSubmitting}
          required
        />
        {errors.establishmentYear && (
          <div className="error-text">{errors.establishmentYear}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="address" className="form-label">
          Address <span className="error-text">*</span>
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`form-input ${errors.address ? 'error' : ''}`}
          rows="4"
          disabled={isSubmitting}
          required
        />
        {errors.address && (
          <div className="error-text">{errors.address}</div>
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
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Publisher' : 'Create Publisher')}
        </button>
      </div>
    </form>
  );
}