import { useState, useEffect } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import BookForm from './BookForm';
import { 
  useBooks, 
  useAuthors, 
  usePublishers, 
  useCategories 
} from '../../contexts/LibraryContext';
import { useUI } from '../../contexts/UIContext';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorAlert } from '../error/ErrorAlert';
import Spinner from '../common/Spinner';
import Toast from '../common/Toast';

export default function Books() {
  // Data and methods from multiple contexts
  const {
    items: books,
    isLoading: isLoadingBooks,
    fetchItems: fetchBooks,
    createItem: createBook,
    updateItem: updateBook,
    deleteItem: deleteBook
  } = useBooks();

  // Load related entities data
  const { items: authors, isLoading: isLoadingAuthors, fetchItems: fetchAuthors } = useAuthors();
  const { items: publishers, isLoading: isLoadingPublishers, fetchItems: fetchPublishers } = usePublishers();
  const { items: categories, isLoading: isLoadingCategories, fetchItems: fetchCategories } = useCategories();

  const { showToast, toast } = useUI();
  const { error, handleError, clearError } = useErrorHandler();

  // Component state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingBookId, setDeletingBookId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track loading state of all required data
  const isLoading = isLoadingBooks || isLoadingAuthors || isLoadingPublishers || isLoadingCategories;

  // Table column definitions with custom rendering
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'publicationYear', label: 'Publication Year' },
    { 
      key: 'stock', 
      label: 'Stock',
      render: (book) => (
        <span className={book.stock === 0 ? 'error-text' : 'success-text'}>
          {book.stock}
        </span>
      )
    },
    { 
      key: 'author', 
      label: 'Author',
      render: (book) => book.author?.name || 'N/A'
    },
    { 
      key: 'publisher', 
      label: 'Publisher',
      render: (book) => book.publisher?.name || 'N/A'
    },
    {
      key: 'categories',
      label: 'Categories',
      render: (book) => book.categories?.map(cat => cat.name).join(', ') || 'N/A'
    }
  ];

  // Load all required data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Load related entities first
        await Promise.all([
          fetchAuthors(),
          fetchPublishers(),
          fetchCategories()
        ]);
        
        // Then load books
        await fetchBooks();
        clearError();
      } catch (err) {
        handleError(err, 'Failed to fetch data');
      }
    };

    fetchInitialData();
  }, [fetchBooks, fetchAuthors, fetchPublishers, fetchCategories, handleError, clearError]);

  // Handle book creation
  const handleCreate = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      await createBook(data);
      await fetchBooks(); 
      setIsModalOpen(false);
      showToast('Book created successfully', 'success');
      clearError();
    } catch (err) {
      handleError(err, 'Failed to create book');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle book update
  const handleUpdate = async (id, data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await updateBook(id, { id, ...data });
      await fetchBooks(); 
      setIsModalOpen(false);
      setSelectedBook(null);
      showToast('Book updated successfully', 'success');
      clearError();
    } catch (err) {
      handleError(err, 'Failed to update book');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle book deletion
  const handleDelete = async () => {
    if (!deletingBookId || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await deleteBook(deletingBookId);
      await fetchBooks();
      showToast('Book deleted successfully', 'success');
      clearError();
    } catch (err) {
      handleError(err, 'Failed to delete book');
    } finally {
      setIsConfirmModalOpen(false);
      setDeletingBookId(null);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="books-page">
      {/* Page header and add button */}
      <div className="page-header">
        <h1>Books</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setSelectedBook(null);
            setIsModalOpen(true);
            clearError();
          }}
          // Continuing Books.jsx...
          disabled={isSubmitting}
        >
          Add Book
        </button>
      </div>

      {/* Error display section */}
      {error && (
        <ErrorAlert 
          error={error}
          onRetry={async () => {
            clearError();
            await fetchBooks();
          }}
        />
      )}

      {/* Books data table */}
      <Table
        columns={columns}
        data={books}
        onEdit={(book) => {
          setSelectedBook(book);
          setIsModalOpen(true);
          clearError();
        }}
        onDelete={(id) => {
          setDeletingBookId(id);
          setIsConfirmModalOpen(true);
          clearError();
        }}
      />

      {/* Add/Edit book modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBook(null);
          clearError();
        }}
        title={selectedBook ? 'Edit Book' : 'Add Book'}
      >
        <BookForm
          initialData={selectedBook}
          authors={authors}
          publishers={publishers}
          categories={categories}
          onSubmit={selectedBook ? 
            (data) => handleUpdate(selectedBook.id, data) : 
            handleCreate}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setDeletingBookId(null);
          clearError();
        }}
        title="Confirm Deletion"
      >
        <div className="confirm-modal-content">
          <p>Are you sure you want to delete this book?</p>
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