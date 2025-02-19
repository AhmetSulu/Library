import { useState, useEffect } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import CategoryForm from './CategoryForm';
import { useCategories } from '../../contexts/LibraryContext';
import { useUI } from '../../contexts/UIContext';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorAlert } from '../error/ErrorAlert';
import Spinner from '../common/Spinner';
import Toast from '../common/Toast';

export default function Categories() {
  // Data and methods from contexts and custom hooks
  const {
    items: categories,
    isLoading,
    fetchItems: fetchCategories,
    createItem: createCategory,
    updateItem: updateCategory,
    deleteItem: deleteCategory
  } = useCategories();

  const { showToast, toast } = useUI();
  const { error, handleError, clearError } = useErrorHandler();

  // Component state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Table column definitions
  const columns = [
    { key: 'name', label: 'Name' },
    { 
      key: 'description', 
      label: 'Description',
      render: (category) => category.description || '-'
    }
  ];

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        await fetchCategories();
        clearError();
      } catch (err) {
        handleError(err, 'Failed to fetch categories');
      }
    };

    loadCategories();
  }, [fetchCategories, handleError, clearError]);

  // Handle category creation
  const handleCreate = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await createCategory(data);
      await fetchCategories();
      setIsModalOpen(false);
      showToast('Category created successfully', 'success');
      clearError();
    } catch (err) {
      handleError(err, 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle category update
  const handleUpdate = async (id, data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await updateCategory(id, data);
      await fetchCategories();
      setIsModalOpen(false);
      setSelectedCategory(null);
      showToast('Category updated successfully', 'success');
      clearError();
    } catch (err) {
      handleError(err, 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle category deletion
  const handleDelete = async () => {
    if (!deletingCategoryId || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await deleteCategory(deletingCategoryId);
      await fetchCategories();
      showToast('Category deleted successfully', 'success');
      clearError();
    } catch (err) {
      handleError(err, 'Failed to delete category');
    } finally {
      setIsConfirmModalOpen(false);
      setDeletingCategoryId(null);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="categories-page">
      {/* Page header and add button */}
      <div className="page-header">
        <h1>Categories</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
            clearError();
          }}
          disabled={isSubmitting}
        >
          Add Category
        </button>
      </div>

      {/* Error display */}
      {error && (
        <ErrorAlert 
          error={error}
          onRetry={async () => {
            clearError();
            await fetchCategories();
          }}
        />
      )}

      {/* Categories table */}
      <Table
        columns={columns}
        data={categories}
        onEdit={(category) => {
          setSelectedCategory(category);
          setIsModalOpen(true);
          clearError();
        }}
        onDelete={(id) => {
          setDeletingCategoryId(id);
          setIsConfirmModalOpen(true);
          clearError();
        }}
      />

      {/* Add/Edit modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
          clearError();
        }}
        title={selectedCategory ? 'Edit Category' : 'Add Category'}
      >
        <CategoryForm
          initialData={selectedCategory}
          onSubmit={selectedCategory ? 
            (data) => handleUpdate(selectedCategory.id, data) : 
            handleCreate}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setDeletingCategoryId(null);
          clearError();
        }}
        title="Confirm Deletion"
      >
        <div className="confirm-modal-content">
          <p>Are you sure you want to delete this category?</p>
          <div className="confirm-modal-actions">
            <button 
              className="btn btn-danger" 
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setIsConfirmModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => showToast(false)}
        />
      )}
    </div>
  );
}