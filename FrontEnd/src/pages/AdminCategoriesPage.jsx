import { useEffect, useState } from 'react';
import CategoryForm from '../components/category/CategoryForm';
import { api } from '../lib/apiClient';

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.categories
      .list()
      .then((res) => {
        setCategories(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to load categories', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (formData) => {
    try {
      // Validate name field
      if (!formData.name || formData.name.trim() === '') {
        alert('Category name is required');
        return;
      }

      // Create FormData for file upload
      const data = new FormData();
      data.append('name', formData.name.trim());
      
      // Add image file if exists, otherwise use URL
      if (formData.imageFile) {
        data.append('image', formData.imageFile);
      } else if (formData.image) {
        data.append('image_url', formData.image);
      }
      
      const res = await api.categories.create(data);
      setCategories((prev) => [...prev, res.data]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to create category', err);
      alert(err.message || 'Failed to create category');
    }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setShowEditModal(true);
  };

  const handleUpdate = async (formData) => {
    if (!editingCategory) return;
    try {
      console.log('=== UPDATE CATEGORY DEBUG ===');
      console.log('1. Editing category:', editingCategory);
      console.log('2. Form data received from CategoryForm:', formData);
      console.log('3. formData.name value:', formData.name);
      console.log('4. formData.name type:', typeof formData.name);
      console.log('5. Is name empty?', !formData.name || formData.name.trim() === '');
      
      // Validate name field
      if (!formData.name || formData.name.trim() === '') {
        console.error('NAME IS EMPTY! Cannot proceed.');
        alert('Category name is required');
        return;
      }

      // Create FormData for file upload
      const data = new FormData();
      data.append('_method', 'PUT'); // Laravel needs this for FormData PUT requests
      data.append('name', formData.name.trim());
      
      // Add image file if exists, otherwise preserve existing image
      if (formData.imageFile) {
        data.append('image', formData.imageFile);
        console.log('6. Adding new image file:', formData.imageFile.name);
      } else if (formData.imageUrl) {
        data.append('image_url', formData.imageUrl);
        console.log('6. Adding image URL:', formData.imageUrl);
      } else if (editingCategory?.image) {
        // Preserve existing image when updating without new image
        data.append('image_url', editingCategory.image);
        console.log('6. Preserving existing image:', editingCategory.image);
      }
      
      // Log FormData contents
      console.log('7. FormData contents being sent to backend:');
      for (let pair of data.entries()) {
        console.log('   ', pair[0], ':', pair[1]);
      }
      
      console.log('8. Making API call to update category...');
      const res = await api.categories.update(editingCategory.id, data);
      console.log('9. Update SUCCESS! Response:', res);
      setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? res.data : c)));
      setShowEditModal(false);
      setEditingCategory(null);
    } catch (err) {
      console.error('10. Update FAILED!', err);
      console.error('11. Error response data:', err.response?.data);
      console.error('12. Error response status:', err.response?.status);
      alert(err.response?.data?.message || err.message || 'Failed to update category');
    }
  };

  const handleDelete = async (cat) => {
    if (!confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;
    try {
      await api.categories.delete(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    } catch (err) {
      console.error('Failed to delete category', err);
      alert(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories (Admin)</h1>
        <button
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium shadow"
          onClick={() => setShowAddModal(true)}
        >
          + Add Category
        </button>
      </div>

      <CategoryList categories={categories} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setShowAddModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Add Category</h2>
            <CategoryForm onSubmit={handleAdd} />
          </div>
        </div>
      )}

      {showEditModal && editingCategory && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => {
            setShowEditModal(false);
            setEditingCategory(null);
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => {
                setShowEditModal(false);
                setEditingCategory(null);
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
            <CategoryForm initialData={editingCategory} onSubmit={handleUpdate} />
          </div>
        </div>
      )}
    </div>
  );

  function CategoryList({ categories, loading, onEdit, onDelete }) {
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((cat, idx) => (
                <tr key={cat.id || idx}>
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">
                    {(() => {
                      const backendUrl = 'http://127.0.0.1:8000';
                      let imageSrc = null;
                      
                      if (cat.image || cat.image_url) {
                        const imageUrl = cat.image || cat.image_url;
                        if (imageUrl.startsWith('http')) {
                          imageSrc = imageUrl;
                        } else {
                          imageSrc = `${backendUrl}/${imageUrl}`;
                        }
                      }
                      
                      return imageSrc ? (
                        <img 
                          src={imageSrc} 
                          alt={cat.name} 
                          className="w-16 h-10 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No Image</div>
                      );
                    })()}
                    <div className="w-16 h-10 bg-gray-100 rounded items-center justify-center text-xs text-gray-400" style={{display: 'none'}}>No Image</div>
                  </td>
                  <td className="px-4 py-2 font-semibold">{cat.name || cat}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => onEdit(cat)} className="text-blue-600 hover:underline mr-2">Edit</button>
                    <button onClick={() => onDelete(cat)} className="text-red-600 hover:underline">Delete</button>
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