import { useState, useEffect } from 'react';
import BorrowsTable from './BorrowsTable';
import BorrowsModal from './BorrowsModal';
import BorrowForm from './BorrowForm';
import { useBorrows, useBooks } from '../../contexts/LibraryContext';
import { useUI } from '../../contexts/UIContext';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorAlert } from '../error/ErrorAlert';
import Spinner from '../common/Spinner';
import Toast from '../common/Toast';

export default function Borrows() {
  // Get borrowing and book data from context
  const {
    items: borrows,
    isLoading: isLoadingBorrows,
    fetchItems: fetchBorrows,
    createItem: createBorrow,
    updateItem: updateBorrow,
    deleteItem: deleteBorrow
  } = useBorrows();

  const {
    items: books,
    isLoading: isLoadingBooks,
    fetchItems: fetchBooks
  } = useBooks();

  // UI and error handling utilities
  const { showToast, toast } = useUI();
  const { error, handleError, clearError } = useErrorHandler();

  // Local state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [deletingBorrowId, setDeletingBorrowId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combined loading state for both borrows and books
  const isLoading = isLoadingBorrows || isLoadingBooks;

  // Table column definitions with custom book name rendering
  const columns = [
    { key: 'borrowerName', label: 'NAME' },
    { key: 'borrowerMail', label: 'EMAIL' },
    { key: 'borrowingDate', label: 'BORROW DATE' },
    { key: 'returnDate', label: 'RETURN DATE' },
    { 
      key: 'book', 
      label: 'BOOK',
      render: (borrow) => borrow.book?.name || 'N/A'
    }
  ];

  // Load initial borrow and book data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchBorrows(),
          fetchBooks()
        ]);
        clearError();
      } catch (err) {
        handleError(err, 'Failed to fetch data');
      }
    };

    fetchInitialData();
  }, [fetchBorrows, fetchBooks, handleError, clearError]);

  // Handle new borrowing creation
  const handleCreate = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await createBorrow(data);
      // Refresh both borrows and books as book stock will change
      await fetchBorrows();
      await fetchBooks();
      setIsModalOpen(false);
      showToast('Book borrowed successfully', 'success');
      clearError();
    } catch (err) {
      handleError(err, 'Failed to borrow book');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle book return
  const handleReturn = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await updateBorrow(selectedBorrow.id, data);
      // Refresh both borrows and books as book stock will change
      await fetchBorrows();
      await fetchBooks();
      setIsModalOpen(false);
      setSelectedBorrow(null);
      showToast('Book returned successfully', 'success');
      clearError();
    } catch (err) {
      handleError(err, 'Failed to return book');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle borrow record deletion
  const handleDelete = async () => {
    if (!deletingBorrowId || isSubmitting) return;
    setIsSubmitting(true);

    // Prevent deletion of active borrows
    const borrowToDelete = borrows.find(b => b.id === deletingBorrowId);
    if (!borrowToDelete?.returnDate) {
      showToast('Cannot delete an active borrow record', 'error');
      setIsDeleteModalOpen(false);
      setDeletingBorrowId(null);
      setIsSubmitting(false);
      return;
    }

    try {
      await deleteBorrow(deletingBorrowId);
      await fetchBorrows();
      showToast('Borrow record deleted successfully', 'success');
      clearError();
    } catch (err) {
      handleError(err, 'Failed to delete borrow record');
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingBorrowId(null);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="page-container">
      {/* Page header with new borrowing button */}
      <div className="page-header">
        <h1>Book Borrowings</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setSelectedBorrow(null);
            setIsModalOpen(true);
            clearError();
          }}
          disabled={isSubmitting}
        >
          New Borrowing
        </button>
      </div>

      {/* Error display */}
      {error && (
        <ErrorAlert 
          error={error}
          onRetry={async () => {
            clearError();
            await fetchBorrows();
          }}
        />
      )}

      {/* Borrowings table with actions */}
      <BorrowsTable 
        columns={columns} 
        data={borrows}
        onReturn={(borrow) => {
          // Prevent returning already returned books
          if (borrow.returnDate) {
            showToast('This book has already been returned', 'error');
            return;
          }
          setSelectedBorrow(borrow);
          setIsModalOpen(true);
          clearError();
        }}
        onDelete={(id) => {
          // Prevent deleting active borrows
          const borrowToDelete = borrows.find(b => b.id === id);
          if (!borrowToDelete?.returnDate) {
            showToast('Cannot delete an active borrow record', 'error');
            return;
          }
          setDeletingBorrowId(id);
          setIsDeleteModalOpen(true);
          clearError();
        }}
      />

      {/* Borrow/Return modal with form */}
      <BorrowsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBorrow(null);
          clearError();
        }}
        title={selectedBorrow ? 'Return Book' : 'New Borrowing'}
      >
        <BorrowForm
          initialData={selectedBorrow}
          books={books.filter(book => book.stock > 0)} // Only show available books
          isReturning={!!selectedBorrow}
          isSubmitting={isSubmitting}
          onSubmit={selectedBorrow ? handleReturn : handleCreate}
        />
      </BorrowsModal>

      {/* Delete confirmation modal */}
      <BorrowsModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingBorrowId(null);
          clearError();
        }}
        title="Confirm Delete"
      >
        <div className="confirm-modal-content">
          <p>Are you sure you want to delete this borrow record?</p>
          <div className="modal-actions">
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      </BorrowsModal>

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