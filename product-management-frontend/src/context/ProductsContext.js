// src/context/ProductsContext.js
'use client';
import { createContext, useState, useContext } from 'react';


export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProducts = async (page = 1, limit = 10, id = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = id 
      ? `http://localhost:8080/products/${id}`
      : `http://localhost:8080/products?page=${page}&limit=${limit}`;
      const headers = {
        'Content-Type': 'application/json'
      };
      const response = await fetch(url, { credentials: 'include', headers });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      // Append all fields except image
      formData.append('name', productData.name);
      formData.append('description', productData.description || '');
      formData.append('productTypeId', productData.productTypeId?.toString());
      formData.append('openingStock', productData.openingStock?.toString());
      formData.append('reorderLevel', productData.reorderLevel?.toString());
      formData.append('measurementUnit', productData.measurementUnit);

      // Append image if exists
      if (productData.image) {
        formData.append('image', productData.image);
      }

      const response = await fetch('http://localhost:8080/products', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to delete product');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProductTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/products/types/all', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch product types');
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add these to your ProductsContext.js
  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/products/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: productData, // FormData object
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductsContext.Provider value={{
      loading,
      error,
      getProducts,
      createProduct,
      updateProduct,
      deleteProduct,
      getProductTypes,
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);