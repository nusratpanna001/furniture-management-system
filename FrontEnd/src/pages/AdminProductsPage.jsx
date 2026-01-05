import { useEffect, useState } from 'react';
import ProductList from '../components/product/ProductList';
import { api } from '../lib/apiClient';
import ProductForm from '../components/product/ProductForm';
import { useToast } from '../contexts/ToastContext';
import { useDashboard } from '../contexts/DashboardContext';

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [perPage, setPerPage] = useState(100); // Show all products by default
  const { success, error } = useToast();
  const { triggerDashboardRefresh } = useDashboard();

  useEffect(() => {
    loadProducts();
  }, [currentPage, perPage]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products?per_page=${perPage}&page=${currentPage}`);
      setProducts(response.data || []);
      if (response.meta) {
        setTotalPages(response.meta.last_page);
        setTotalProducts(response.meta.total);
      }
    } catch (err) {
      error('Failed to load products');
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    console.log('=== EDITING PRODUCT ===');
    console.log('Product to edit:', product);
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
      
      // API interceptor returns response.data, so check response.success
      if (response.success !== false) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        success('Product deleted successfully!');
        await loadProducts(); // Refresh the list
        console.log('Triggering dashboard refresh after delete');
        triggerDashboardRefresh(); // Update dashboard KPIs
      } else {
        error(response.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Product deletion error:', err);
      console.error('Error response:', err.response);
      error(err.message || 'Failed to delete product');
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
        <div>
          <h1 className="text-2xl font-bold">Products (Admin)</h1>
          <p className="text-sm text-gray-600 mt-1">Total: {totalProducts} products</p>
        </div>
        <button
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium shadow"
          onClick={() => setShowModal(true)}
        >
          + Add Product
        </button>
      </div>
      <ProductList products={products} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

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
                  console.log('=== FORM SUBMIT START ===');
                  console.log('editingProduct:', editingProduct);
                  console.log('Is this an UPDATE?', !!editingProduct);
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
                    
                    // Add image file if exists, otherwise keep existing image URL
                    if (formData.imageFile) {
                      data.append('image', formData.imageFile);
                      console.log('Adding new image file');
                    } else if (formData.imageUrl) {
                      data.append('image_url', formData.imageUrl);
                      console.log('Adding image URL:', formData.imageUrl);
                    } else if (editingProduct?.image_url) {
                      // Preserve existing image when updating without new image
                      data.append('image_url', editingProduct.image_url);
                      console.log('Preserving existing image:', editingProduct.image_url);
                    }
                    
                    // Log all form data entries
                    console.log('FormData contents:');
                    for (let pair of data.entries()) {
                      console.log(pair[0], ':', pair[1]);
                    }
                    
                    console.log('FormData prepared');
                    
                    if (editingProduct) {
                      console.log('=== UPDATE PATH ===');
                      console.log('Updating product ID:', editingProduct.id);
                      // Update existing product - use POST with _method for FormData
                      data.append('_method', 'PUT');
                      console.log('Calling updateWithFormData API...');
                      const response = await api.products.updateWithFormData(editingProduct.id, data);
                      console.log('Update API response:', response);
                      const updatedProduct = response.data || response;
                      console.log('Updated product extracted:', updatedProduct);
                      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
                      success('Product updated successfully!');
                    } else {
                      console.log('=== CREATE PATH ===');
                      // Create new product
                      const response = await api.products.create(data);
                      console.log('Product created successfully:', response);
                      const newProduct = response.data || response;
                      setProducts(prev => [...prev, newProduct]);
                      success('Product created successfully!');
                    }
                    handleCloseModal();
                    await loadProducts(); // Refresh the list
                    console.log('Triggering dashboard refresh after create/update');
                    triggerDashboardRefresh(); // Update dashboard KPIs
                  } catch (err) {
                    console.error('Product save error:', err);
                    console.error('Error details:', {
                      message: err.message,
                      status: err.status,
                      data: err.data
                    });
                    const errorMsg = err.data?.message || err.message || `Failed to ${editingProduct ? 'update' : 'create'} product`;
                    error(errorMsg);
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
