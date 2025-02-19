import { useState, useEffect } from 'react';

// Predefined list of countries for the dropdown
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 
  'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 
  'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 
  'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 
  'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 
  'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 
  'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominican Republic', 
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 
  'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 
  'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 
  'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 
  'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 
  'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 
  'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 
  'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 
  'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 
  'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 
  'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 
  'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 
  'Qatar', 'Republic of the Congo', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 
  'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 
  'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 
  'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 
  'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 
  'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 
  'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
].sort();

// Constants for date validation
const CURRENT_YEAR = new Date().getFullYear();
const MIN_BIRTH_YEAR = 1500;

export default function AuthorForm({ initialData, onSubmit, isSubmitting = false }) {
  // State for managing form data
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    country: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Populate form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Validate individual form fields
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 100) return 'Name must be less than 100 characters';
        return '';
      
      case 'birthDate':
        if (!value) return 'Birth date is required';
        const year = new Date(value).getFullYear();
        if (year > CURRENT_YEAR) return 'Birth date cannot be in the future';
        if (year < MIN_BIRTH_YEAR) return 'Birth date is too old';
        return '';
      
      case 'country':
        if (!value) return 'Country is required';
        if (!COUNTRIES.includes(value)) return 'Please select a valid country';
        return '';
      
      default:
        return '';
    }
  };

  // Validate all form fields before submission
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
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Reset form to initial state
  const handleReset = () => {
    setFormData(initialData || {
      name: '',
      birthDate: '',
      country: ''
    });
    setErrors({});
    setIsDirty(false);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {/* Author name field */}
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

      {/* Birth date field with date constraints */}
      <div className="form-group">
        <label htmlFor="birthDate" className="form-label">
          Birth Date <span className="error-text">*</span>
        </label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          min={`${MIN_BIRTH_YEAR}-01-01`}
          max={`${CURRENT_YEAR}-12-31`}
          className={`form-input ${errors.birthDate ? 'error' : ''}`}
          disabled={isSubmitting}
          required
        />
        {errors.birthDate && (
          <div className="error-text">{errors.birthDate}</div>
        )}
      </div>

      {/* Country selection dropdown */}
      <div className="form-group">
        <label htmlFor="country" className="form-label">
          Country <span className="error-text">*</span>
        </label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className={`form-input ${errors.country ? 'error' : ''}`}
          disabled={isSubmitting}
          required
        >
          <option value="">Select a country</option>
          {COUNTRIES.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.country && (
          <div className="error-text">{errors.country}</div>
        )}
      </div>

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
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Author' : 'Create Author')}
        </button>
      </div>
    </form>
  );
}