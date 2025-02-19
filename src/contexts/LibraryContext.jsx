import { createContext, useContext, useMemo } from 'react';
import { useCRUD } from '../hooks/useCRUD';
import { 
  booksAPI, 
  authorsAPI, 
  publishersAPI, 
  categoriesAPI, 
  borrowsAPI 
} from '../services/api';

const LibraryContext = createContext(null);

const LibraryProvider = ({ children }) => {
  const books = useCRUD(booksAPI);
  const authors = useCRUD(authorsAPI);
  const publishers = useCRUD(publishersAPI);
  const categories = useCRUD(categoriesAPI);
  const borrows = useCRUD(borrowsAPI);

  const value = useMemo(() => ({
    books,
    authors,
    publishers,
    categories,
    borrows
  }), [books, authors, publishers, categories, borrows]);

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};

const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

export const useBooks = () => {
  const { books } = useLibrary();
  return useMemo(() => books, [books]);
};

export const useAuthors = () => {
  const { authors } = useLibrary();
  return useMemo(() => authors, [authors]);
};

export const usePublishers = () => {
  const { publishers } = useLibrary();
  return useMemo(() => publishers, [publishers]);
};

export const useCategories = () => {
  const { categories } = useLibrary();
  return useMemo(() => categories, [categories]);
};

export const useBorrows = () => {
  const { borrows } = useLibrary();
  return useMemo(() => borrows, [borrows]);
};

export {
  LibraryProvider,
  useLibrary
};