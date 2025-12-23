import { useEffect, useState } from 'react';
import ProductList from '../components/product/ProductList';
import { api } from '../lib/apiClient';
import ProductForm from '../components/product/ProductForm';
import { useToast } from '../contexts/ToastContext';

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { success, error } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await api.products.list();
      setProducts(response.data || []);
    } catch (err) {
      error('Failed to load products');
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    try {
      console.log('Deleting product:', productId);
      const response = await api.products.delete(productId);
      console.log('Delete response:', response);
      
      if (response.data.success !== false) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        success('Product deleted successfully!');
        await loadProducts(); // Refresh the list
      } else {
        error(response.data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Product deletion error:', err);
      console.error('Error response:', err.response);
      error(err.response?.data?.message || err.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products (Admin)</h1>
        <button
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium shadow"
          onClick={() => setShowModal(true)}
        >
          + Add Product
        </button>
      </div>
      <ProductList products={products} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-0 w-full max-w-sm relative" style={{height: '90vh', maxHeight: '650px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div className="p-6" style={{height: '100%', overflowY: 'auto'}}>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={handleCloseModal}
              aria-label="Close"
              style={{ zIndex: 10 }}
            >
              &times;
            </button>
            <div className="pt-6">
              <h2 className="text-lg font-semibold mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <ProductForm
                initialData={editingProduct ? {
                  name: editingProduct.name,
                  category: editingProduct.category,
                  material: editingProduct.material,
                  size: editingProduct.size,
                  price: editingProduct.price,
                  stock: editingProduct.stock,
                  description: editingProduct.description,
                  imageUrl: editingProduct.image_url,
                  image_url: editingProduct.image_url
                } : null}
                onSubmit={async (formData) => {
                  console.log('Submitting product data:', formData);
                  setLoading(true);
                  try {
                    // Create FormData for file upload
                    const data = new FormData();
                    data.append('name', formData.name);
                    data.append('category', formData.category);
                    data.append('material', formData.material);
                    data.append('size', formData.size);
                    data.append('price', parseFloat(formData.price));
                    data.append('stock', parseInt(formData.stock));
                    data.append('description', formData.description || '');
                    
                    // Add image file if exists, otherwise use URL
                    if (formData.imageFile) {
                      data.append('image', formData.imageFile);
                    } else if (formData.imageUrl) {
                      data.append('image_url', formData.imageUrl);
                    }
                    
                    console.log('FormData prepared');
                    
                    if (editingProduct) {
                      // Update existing product
                      const response = await api.products.update(editingProduct.id, data);
                      console.log('Product updated successfully:', response);
                      setProducts(prev => prev.map(p => p.id === editingProduct.id ? response.data.data : p));
                      success('Product updated successfully!');
                    } else {
                      // Create new product
                      const response = await api.products.create(data);
                      console.log('Product created successfully:', response);
                      setProducts(prev => [...prev, response.data.data]);
                      success('Product created successfully!');
                    }
                    handleCloseModal();
                    await loadProducts(); // Refresh the list
                  } catch (err) {
                    console.error('Product save error:', err);
                    error(err.message || `Failed to ${editingProduct ? 'update' : 'create'} product`);
                  } finally {
                    setLoading(false);
                  }
                }}
                onCancel={handleCloseModal}
              />
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;
