'use client';
import { useContext, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthContext } from '../../../context/AuthContext';
import { ProductsContext } from '../../../context/ProductsContext';

interface Product {
  id: string;
  name: string;
  description: string;
  productType?: {
    name: string;
    description: string;
  };
  currentStock: string;
  openingStock: string;
  reorderLevel: string;
  measurementUnit: string;
  imagePath?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, authLoading } = useContext(AuthContext);
  const { loading, error, getProducts } = useContext(ProductsContext);

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && params?.id) {
      loadProduct();
    }
  }, [isAuthenticated, params?.id]);

  const loadProduct = async () => {
    try {
      const data = await getProducts(1, 1, params.id as string);
      if (data) {
        setProduct(data);
      } else {
        router.push('/products');
      }
    } catch (err) {
      console.error('Failed to load product:', err);
      router.push('/products');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        {loading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div className="alert alert-danger">
            {error || 'Product not found'}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Product Details</h2>
            <div>
              <button
                onClick={() => router.push(`/products/${product.id}/edit`)}
                className="btn btn-warning btn-sm me-2"
              >
                Edit
              </button>
              <button
                onClick={() => router.push('/products')}
                className="btn btn-secondary btn-sm"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              {product.imagePath ? (
                <img
                  src={`http://localhost:8080/uploads/${product.imagePath}`}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="img-fluid rounded"
                />
              ) : (
                <div className="bg-light d-flex justify-content-center align-items-center rounded"
                  style={{ width: '300px', height: '300px' }}>
                  <span>No Image Available</span>
                </div>
              )}
            </div>
            <div className="col-md-8">
              <h3>{product.name}</h3>
              <p className="text-muted">{product.description || 'No description provided'}</p>
              
              <div className="row mt-4">
                <div className="col-md-6">
                  <h5>Product Information</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Type:</strong> {product.productType?.name || 'N/A'}
                      {product.productType?.description && (
                        <div className="text-muted small">{product.productType.description}</div>
                      )}
                    </li>
                    <li className="list-group-item">
                      <strong>Measurement Unit:</strong> {product.measurementUnit}
                    </li>
                    <li className="list-group-item">
                      <strong>Created At:</strong> {formatDate(product.createdAt)}
                    </li>
                    <li className="list-group-item">
                      <strong>Last Updated:</strong> {formatDate(product.updatedAt)}
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>Stock Information</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Current Stock:</strong> {product.currentStock}
                    </li>
                    <li className="list-group-item">
                      <strong>Opening Stock:</strong> {product.openingStock}
                    </li>
                    <li className="list-group-item">
                      <strong>Reorder Level:</strong> {product.reorderLevel}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}