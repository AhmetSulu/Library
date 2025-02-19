import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  FileText, 
  Package, 
  LibraryBig,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import LibraryHeroSVG from '../assets/library-hero.svg';
import { 
  booksAPI, 
  authorsAPI, 
  borrowsAPI 
} from '../services/api';
import Spinner from "../components/common/Spinner";
import Toast from "../components/common/Toast";

// Stat Card Component
const StatCard = ({ icon: Icon, value, label }) => (
  <div className="stat-card">
    <Icon size={48} color="var(--primary)" />
    <div>
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  </div>
);

// Book Card Component
const BookCard = ({ book }) => (
  <div className="book-card">
    <div className="book-cover">
      <BookOpen size={64} color="var(--primary-light)" />
    </div>
    <div className="book-details">
      <h3>{book.name}</h3>
      <p>{book.author?.name || 'Unknown Author'}</p>
      <div className="book-info">
        <span className="book-year">{book.publicationYear}</span>
        <span className="book-stock">Stock: {book.stock}</span>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [recentBooks, setRecentBooks] = useState([]);
  const [libraryStats, setLibraryStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalBorrows: 0,
    activeLoans: 0
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [booksResponse, authorsResponse, borrowsResponse] = await Promise.all([
        booksAPI.getAll(),
        authorsAPI.getAll(),
        borrowsAPI.getAll()
      ]);

      // Aktif ödünç sayısını hesapla
      const activeLoans = borrowsResponse.data.filter(b => !b.returnDate).length;

      setLibraryStats({
        totalBooks: booksResponse.data.length,
        totalAuthors: authorsResponse.data.length,
        totalBorrows: borrowsResponse.data.length,
        activeLoans
      });

      // Kitapları sırala ve stok durumunu kontrol et
      const sortedBooks = booksResponse.data
        .sort((a, b) => new Date(b.createdAt || b.publicationYear) - new Date(a.createdAt || a.publicationYear))
        .filter(book => book.stock > 0);

      setRecentBooks(sortedBooks);
      
      if (sortedBooks.length === 0) {
        showToast('No books found', 'warning');
      }
    } catch (err) {
      setError(err);
      showToast('Failed to load library statistics', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(recentBooks.length / booksPerPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const nextPage = () => !isLastPage && setCurrentPage(prev => prev + 1);
  const prevPage = () => !isFirstPage && setCurrentPage(prev => prev - 1);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = recentBooks.slice(indexOfFirstBook, indexOfLastBook);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Data</h2>
        <p>{error.message}</p>
        <button onClick={fetchStats} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Digital Library Management System</h1>
            <p>Managing your books has never been easier</p>
            <div className="hero-actions">
              <Link to="/books" className="btn btn-primary">
                View Books
              </Link>
              <Link to="/borrows" className="btn btn-secondary">
                Borrow Management
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src={LibraryHeroSVG} alt="Library Management System" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="library-stats">
        <StatCard 
          icon={BookOpen} 
          value={libraryStats.totalBooks} 
          label="Total Books" 
        />
        <StatCard 
          icon={Users} 
          value={libraryStats.totalAuthors} 
          label="Total Authors" 
        />
        <StatCard 
          icon={FileText} 
          value={libraryStats.totalBorrows} 
          label="Total Borrows" 
        />
        <StatCard 
          icon={LibraryBig} 
          value={libraryStats.activeLoans} 
          label="Active Loans" 
        />
      </div>

      {/* Features */}
      <div className="features-grid">
        <div className="feature-card">
          <BookOpen size={36} color="var(--primary)" />
          <h3>Book Management</h3>
          <p>Easily add, update, and track your books</p>
        </div>
        <div className="feature-card">
          <Users size={36} color="var(--primary)" />
          <h3>Author Management</h3>
          <p>Keep author information up-to-date and organized</p>
        </div>
        <div className="feature-card">
          <Package size={36} color="var(--primary)" />
          <h3>Category System</h3>
          <p>Categorize and classify your books</p>
        </div>
        <div className="feature-card">
          <LibraryBig size={36} color="var(--primary)" />
          <h3>Borrowing Operations</h3>
          <p>Manage book borrowing and return processes</p>
        </div>
      </div>

      {/* Recently Added Books */}
      <div className="recent-books-section">
        <div className="recent-books-header">
          <h2>Recently Added Books</h2>
          {recentBooks.length > 0 && (
            <div className="pagination-controls">
              <button 
                onClick={prevPage} 
                disabled={isFirstPage}
                className="pagination-btn"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="pagination-info">
                Page {currentPage} / {totalPages}
              </span>
              <button 
                onClick={nextPage} 
                disabled={isLastPage}
                className="pagination-btn"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
        
        <div className="recent-books-grid">
          {currentBooks.length > 0 ? (
            currentBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))
          ) : (
            <div className="no-books-message">
              <p>No books available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
}