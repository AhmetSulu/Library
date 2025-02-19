import { useState, useEffect } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import AuthorForm from './AuthorForm';
import { useAuthors } from '../../contexts/LibraryContext';
import { useUI } from '../../contexts/UIContext';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorAlert } from '../error/ErrorAlert';
import Spinner from '../common/Spinner';
import Toast from '../common/Toast';

export default function Authors() {
  // Context hooks for data management
  const {
    items: authors,
    isLoading: isLoadingAuthors,
    fetchItems: fetchAuthors,
    createItem: createAuthor,
    updateItem: updateAuthor,
    deleteItem: deleteAuthor
  } = useAuthors();

  const { showToast, toast } = useUI();
  const { error, handleError, clearError } = useErrorHandler();

  // Component state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingAuthorId, setDeletingAuthorId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Table column definitions with custom date formatting
  const columns = [
    { key: 'name', label: 'Name' },
    { 
      key: 'birthDate', 
      label: 'Birth Date',
      render: (author) => {
        const date = new Date(author.birthDate);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    },
    { key: 'country', label: 'Country' }
  ];

  // Load authors data on component mount
  useEffect(() => {
    const loadAuthors = async () => {
      try {
        await fetchAuthors();
        clearError();
      } catch (err) {
        handleError(err, 'Failed to fetch authors');
      }
    };

    loadAuthors();
  }, [fetchAuthors, handleError, clearError]);

  // Handle author creation
  const handleCreate = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      await createAuthor(data);
      await fetchAuthors();
      setIsModalOpen(false);
      showToast('Author created successfully', 'success');
      clearError();
    } catch (err) {
      handleError(err, 'Failed to create author');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle author update
  const handleUpdate = async (id, data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await updateAuthor(id, data);
      await fetchAuthors();
      setIsModalOpen(false);
      setSelectedAuthor(null);
      showToast('Author updated successfully', 'success');
      clearError();
    } catch (err) {
      handleError(err, 'Failed to update author');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle author deletion
  const handleDelete = async () => {
    if (!deletingAuthorId || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await deleteAuthor(deletingAuthorId);
      await fetchAuthors();
      showToast('Author deleted successfully', 'success');
      clearError();
    } catch (err) {
      handleError(err, 'Failed to delete author');
    } finally {
      setIsConfirmModalOpen(false);
      setDeletingAuthorId(null);
      setIsSubmitting(false);
    }
  };

  if (isLoadingAuthors) {
    return <Spinner />;
  }

  return (
    <div className="authors-page">
      {/* Page header and add button */}
      <div className="page-header">
        <h1>Authors</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setSelectedAuthor(null);
            setIsModalOpen(true);
            clearError();
          }}
          disabled={isSubmitting}
        >
          Add Author
        </button>
      </div>

      {/* Error display section */}
      {error && (
        <ErrorAlert 
          error={error}
          onRetry={async () => {
            clearError();
            await fetchAuthors();
          }}
        />
      )}

      {/* Authors data table */}
      <Table
        columns={columns}
        data={authors}
        onEdit={(author) => {
          setSelectedAuthor(author);
          setIsModalOpen(true);
          clearError();
        }}
        onDelete={(id) => {
          setDeletingAuthorId(id);
          setIsConfirmModalOpen(true);
          clearError();
        }}
      />

      {/* Add/Edit author modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAuthor(null);
          clearError();
        }}
        title={selectedAuthor ? 'Edit Author' : 'Add Author'}
      >
        <AuthorForm
          initialData={selectedAuthor}
          onSubmit={selectedAuthor ? 
            (data) => handleUpdate(selectedAuthor.id, data) : 
            handleCreate}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setDeletingAuthorId(null);
          clearError();
        }}
        title="Confirm Deletion"
      >
        <div className="confirm-modal-content">
          <p>Are you sure you want to delete this author?</p>
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

      {/* Toast notifications */}
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