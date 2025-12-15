import { useEffect, useState } from 'react';
import ProductList from '../components/product/ProductList';
import { mockService } from '../lib/mockData';
import ProductForm from '../components/product/ProductForm';

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    mockService.products.list().then(res => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

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
      <ProductList products={products} loading={loading} onEdit={() => {}} onDelete={() => {}} />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-0 w-full max-w-sm relative" style={{height: '90vh', maxHeight: '650px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div className="p-6" style={{height: '100%', overflowY: 'auto'}}>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setShowModal(false)}
              aria-label="Close"
              style={{ zIndex: 10 }}
            >
              &times;
            </button>
            <div className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Add Product</h2>
              <ProductForm
                onSubmit={form => {
                  setProducts(prev => [...prev, form]);
                  setShowModal(false);
                }}
                onCancel={() => setShowModal(false)}
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
