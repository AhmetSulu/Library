import { useState, useCallback } from 'react';

export const useCRUD = (api) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getAll();
      setItems(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const createItem = useCallback(async (data) => {
    setIsLoading(true);
    try {
      const response = await api.create(data);
      setItems(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const updateItem = useCallback(async (id, data) => {
    setIsLoading(true);
    try {
      const response = await api.update(id, data);
      setItems(prev => prev.map(item => 
        item.id === id ? response.data : item
      ));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const deleteItem = useCallback(async (id) => {
    setIsLoading(true);
    try {
      await api.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return {
    items,
    isLoading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    setItems
  };
};