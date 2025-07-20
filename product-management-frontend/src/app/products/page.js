// src/app/products/page.tsx
'use client';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import { ProductsContext } from '../../context/ProductsContext';
import Link from 'next/link';

export default function ProductsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading} = useContext(AuthContext);
  const { loading: loadingProducts, error, getProducts, deleteProduct } = useContext(ProductsContext);
  const [products, setProducts] = useState([]);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated, pagination.page, pagination.limit]);

  const loadProducts = async () => {
    try {
      const data = await getProducts(pagination.page, pagination.limit);
      setProducts(data.data);
      setPagination(prev => ({ ...prev, total: data.count }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (authLoading || !isAuthenticated) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        <Link href="/dashboard" className="btn btn-primary">
            Dashboard
          </Link>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Products</h5>
          <Link href="/products/create" className="btn btn-primary">
            Add Product
          </Link>
        </div>
        <div className="card-body">
          {loadingProducts ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Current Stock</th>
                      <th>Reorder Level</th>
                      <th>Unit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          {product.imagePath && (
                            <img
                              src={`http://localhost:8080/uploads/${product.imagePath}`}
                              alt={product.name}
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td>{product.productType?.name || 'N/A'}</td>
                        <td>{product.currentStock}</td>
                        <td>{product.reorderLevel}</td>
                        <td>{product.measurementUnit}</td>
                        <td>
                          <Link
                            href={`/products/${product.id}`}
                            className="btn btn-sm btn-info me-2"
                          >
                            View
                          </Link>
                          <Link
                            href={`/products/${product.id}/edit`}
                            className="btn btn-sm btn-warning me-2"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => (
                    <li key={i} className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${pagination.page * pagination.limit >= pagination.total ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </div>
  );
}