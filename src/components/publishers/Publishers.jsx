import { useState, useEffect } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import PublisherForm from './PublisherForm';
import { usePublishers } from '../../contexts/LibraryContext';
import { useUI } from '../../contexts/UIContext';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorAlert } from '../error/ErrorAlert';
import Spinner from '../common/Spinner';
import Toast from '../common/Toast';

export default function Publishers() {
  // Data and methods from contexts and custom hooks
  const {
    items: publishers,
    isLoading: isLoadingPublishers,
    fetchItems: fetchPublishers,
    createItem: createPublisher,
    updateItem: updatePublisher,
    deleteItem: deletePublisher
  } = usePublishers();

  const { showToast, toast } = useUI();
  const { error, handleError, clearError } = useErrorHandler();

  // Component state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingPublisherId, setDeletingPublisherId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Table column definitions
  const columns = [
    { key: 'name', label: 'Name' },
    { 
      key: 'establishmentYear', 
      label: 'Establishment Year',
      render: (publisher) => publisher.establishmentYear || '-'
    },
    { 
      key: 'address', 
      label: 'Address',
      render: (publisher) => publisher.address || '-'
    }
  ];

  // Load publishers on component mount
  useEffect(() => {
    const loadPublishers = async () => {
      try {
        await fetchPublishers();
        clearError();
      } catch (err) {
        handleError(err, 'Failed to fetch publishers');
      }
    };

    loadPublishers();
  }, [fetchPublishers, handleError, clearError]);

  // Handle publisher creation
  const handleCreate = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await createPublisher(data);
      await fetchPublishers();
      setIsModalOpen(false);
      showToast('Publisher created successfully', 'success');
      clearError();
    } catch (err) {
      handleError(err, 'Failed to create publisher');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle publisher update
  const handleUpdate = async (id, data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await updatePublisher(id, data);
      await fetchPublishers();
      setIsModalOpen(false);
      setSelectedPublisher(null);
      showToast('Publisher updated successfully', 'success');
      clearError();
    } catch (err) {
      handleError(err, 'Failed to update publisher');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle publisher deletion
  const handleDelete = async () => {
    if (!deletingPublisherId || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await deletePublisher(deletingPublisherId);
      await fetchPublishers();
      showToast('Publisher deleted successfully', 'success');
      clearError();
    } catch (err) {
      handleError(err, 'Failed to delete publisher');
    } finally {
      setIsConfirmModalOpen(false);
      setDeletingPublisherId(null);
      setIsSubmitting(false);
    }
  };

  if (isLoadingPublishers) {
    return <Spinner />;
  }

  return (
    <div className="publishers-page">
      {/* Page header and add button */}
      <div className="page-header">
        <h1>Publishers</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setSelectedPublisher(null);
            setIsModalOpen(true);
            clearError();
          }}
          disabled={isSubmitting}
        >
          Add Publisher
        </button>
      </div>

      {/* Error display */}
      {error && (
        <ErrorAlert 
          error={error}
          onRetry={async () => {
            clearError();
            await fetchPublishers();
          }}
        />
      )}

      {/* Publishers table */}
      <Table
        columns={columns}
        data={publishers}
        onEdit={(publisher) => {
          setSelectedPublisher(publisher);
          setIsModalOpen(true);
          clearError();
        }}
        onDelete={(id) => {
          setDeletingPublisherId(id);
          setIsConfirmModalOpen(true);
          clearError();
        }}
      />

      {/* Add/Edit modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPublisher(null);
          clearError();
        }}
        title={selectedPublisher ? 'Edit Publisher' : 'Add Publisher'}
      >
        <PublisherForm
          initialData={selectedPublisher}
          onSubmit={selectedPublisher ? 
            (data) => handleUpdate(selectedPublisher.id, data) : 
            handleCreate}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setDeletingPublisherId(null);
          clearError();
        }}
        title="Confirm Deletion"
      >
        <div className="confirm-modal-content">
          <p>Are you sure you want to delete this publisher?</p>
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