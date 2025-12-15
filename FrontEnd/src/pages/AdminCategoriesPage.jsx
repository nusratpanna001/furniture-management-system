import { useEffect, useState } from 'react';
import CategoryForm from '../components/category/CategoryForm';

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Categories (Admin)</h1>
          <button
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium shadow"
            onClick={() => setShowModal(true)}
          >
            + Add Category
          </button>
        </div>
        <CategoryList categories={categories} loading={loading} />

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold mb-4">Add Category</h2>
              <CategoryForm
                onSubmit={form => {
                  setCategories(prev => [...prev, form]);
                  setShowModal(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    );

  function CategoryList({ categories, loading }) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <p>Loading...</p>
        ) : categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((cat, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2 font-semibold">{cat.name || cat}</td>
                  <td className="px-4 py-2">
                    <button className="text-blue-600 hover:underline mr-2">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
}

}

export default AdminCategoriesPage;