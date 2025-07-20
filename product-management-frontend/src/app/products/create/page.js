// src/app/products/create/page.tsx
'use client';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../../context/AuthContext';
import { ProductsContext } from '../../../context/ProductsContext';

// Static measurement units data
const MEASUREMENT_UNITS = [
  { value: 'kg', label: 'Kilogram' },
  { value: 'g', label: 'Gram' },
  { value: 'l', label: 'Liter' },
  { value: 'ml', label: 'Milliliter' },
  { value: 'piece', label: 'Piece' },
  { value: 'box', label: 'Box' },
  { value: 'pack', label: 'Pack' }
];

export default function CreateProductPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { loading, error, createProduct, getProductTypes } = useContext(ProductsContext);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productTypeId: 0, // Initialize as number
    openingStock: 0,
    currentStock: 0,
    reorderLevel: 0,
    measurementUnit: 'piece',
    image: null
  });

  const [productTypes, setProductTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProductTypes();
    }
  }, [isAuthenticated]);

  const loadProductTypes = async () => {
    try {
      const types = await getProductTypes();
      setProductTypes(types);
    } catch (err) {
      console.error('Failed to load product types:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'productTypeId' || name === 'openingStock' || name === 'reorderLevel'
        ? Number(value)
        : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert numeric fields to numbers
    const numericFields = {
      productTypeId: Number(formData.productTypeId),
      openingStock: Number(formData.openingStock),
      reorderLevel: Number(formData.reorderLevel),
    };

    // Validate numeric fields
    if (isNaN(numericFields.productTypeId)) {
      setError('Please select a valid product type');
      return;
    }

    if (isNaN(numericFields.openingStock)) {
      setError('Opening stock must be a valid number');
      return;
    }

    if (isNaN(numericFields.reorderLevel)) {
      setError('Reorder level must be a valid number');
      return;
    }

    setIsSubmitting(true);

    try {
      await createProduct({
        name: formData.name,
        description: formData.description,
        productTypeId: formData.productTypeId,
        openingStock: formData.openingStock || 0,
        reorderLevel: formData.reorderLevel || 0,
        measurementUnit: formData.measurementUnit,
        image: formData.image
      });
      router.push('/products');
    } catch (err) {
      console.error('Product creation failed:', err);
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Create New Product</h2>
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-12">
                <label htmlFor="name" className="form-label">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-12">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="form-control"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="product_type_id" className="form-label">
                  Product Type *
                </label>
                <select
                  id="productTypeId"
                  name="productTypeId"
                  value={formData.productTypeId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="0">Select a type</option>
                  {productTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="measurementUnit" className="form-label">
                  Measurement Unit *
                </label>
                <select
                  id="measurementUnit"
                  name="measurementUnit"
                  value={formData.measurementUnit}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  {MEASUREMENT_UNITS.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="openingStock" className="form-label">
                  Opening Stock *
                </label>
                <input
                  type="number"
                  id="openingStock"
                  name="openingStock"
                  value={formData.openingStock}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="reorderLevel" className="form-label">
                  Reorder Level *
                </label>
                <input
                  type="number"
                  id="reorderLevel"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-12">
                <label htmlFor="image" className="form-label">
                  Product Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="form-control"
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                onClick={() => router.push('/products')}
                className="btn btn-outline-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="btn btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}