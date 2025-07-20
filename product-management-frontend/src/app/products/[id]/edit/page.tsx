'use client';
import { useContext, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthContext } from '../../../../context/AuthContext';
import { ProductsContext } from '../../../../context/ProductsContext';

interface ProductType {
  id: string;
  name: string;
  description: string;
}

const MEASUREMENT_UNITS = [
  { value: 'kg', label: 'Kilogram' },
  { value: 'g', label: 'Gram' },
  { value: 'l', label: 'Liter' },
  { value: 'ml', label: 'Milliliter' },
  { value: 'piece', label: 'Piece' },
  { value: 'box', label: 'Box' },
  { value: 'pack', label: 'Pack' }
];

interface FormData {
  name: string;
  description: string;
  productTypeId: string;
  currentStock: string;
  openingStock: string;
  reorderLevel: string;
  measurementUnit: string;
  image: File | null;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, authLoading } = useContext(AuthContext);
  const { loading, error, getProducts, updateProduct, getProductTypes } = useContext(ProductsContext);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    productTypeId: '',
    currentStock: '0.00',
    openingStock: '0.00',
    reorderLevel: '0.00',
    measurementUnit: 'piece',
    image: null
  });

  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && params?.id) {
      loadProductAndTypes();
    }
  }, [isAuthenticated, params?.id]);

  const loadProductAndTypes = async () => {
    try {
      const types = await getProductTypes();
      setProductTypes(types);

      const data = await getProducts(1, 1, params.id as string);
      if (data) {
        setFormData({
          name: data.name,
          description: data.description || '',
          productTypeId: data.productType?.id || '',
          currentStock: data.currentStock,
          openingStock: data.openingStock,
          reorderLevel: data.reorderLevel,
          measurementUnit: data.measurementUnit,
          image: null
        });
        setCurrentImage(data.imagePath ? `http://localhost:8080/uploads/${data.imagePath}` : null);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      router.push('/products');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
      setCurrentImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('productTypeId', formData.productTypeId);
      formDataToSend.append('currentStock', formData.currentStock);
      formDataToSend.append('openingStock', formData.openingStock);
      formDataToSend.append('reorderLevel', formData.reorderLevel);
      formDataToSend.append('measurementUnit', formData.measurementUnit);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await updateProduct(params.id as string, formDataToSend);
      router.push(`/products/${params.id}`);
    } catch (err) {
      console.error('Product update failed:', err);
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
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Edit Product</h2>
            <button
              onClick={() => router.push(`/products/${params.id}`)}
              className="btn btn-outline-light btn-sm"
            >
              Back to View
            </button>
          </div>
        </div>

        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <div className="mb-3">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt="Current product"
                      className="img-fluid rounded mb-2"
                      style={{ maxHeight: '300px' }}
                    />
                  ) : (
                    <div className="bg-light d-flex justify-content-center align-items-center rounded mb-2"
                      style={{ height: '300px' }}>
                      <span>No Image Available</span>
                    </div>
                  )}
                  <label htmlFor="image" className="form-label">Product Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="productTypeId" className="form-label">Product Type</label>
                    <select
                      className="form-select"
                      id="productTypeId"
                      name="productTypeId"
                      value={formData.productTypeId}
                      onChange={handleChange}
                    >
                      <option value="">Select a type</option>
                      {productTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="measurementUnit" className="form-label">Measurement Unit</label>
                    <select
                      className="form-select"
                      id="measurementUnit"
                      name="measurementUnit"
                      value={formData.measurementUnit}
                      onChange={handleChange}
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

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="currentStock" className="form-label">Current Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      id="currentStock"
                      name="currentStock"
                      value={formData.currentStock}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="openingStock" className="form-label">Opening Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      id="openingStock"
                      name="openingStock"
                      value={formData.openingStock}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="reorderLevel" className="form-label">Reorder Level</label>
                    <input
                      type="number"
                      className="form-control"
                      id="reorderLevel"
                      name="reorderLevel"
                      value={formData.reorderLevel}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                type="button"
                onClick={() => router.push(`/products/${params.id}`)}
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
                    Updating...
                  </>
                ) : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}