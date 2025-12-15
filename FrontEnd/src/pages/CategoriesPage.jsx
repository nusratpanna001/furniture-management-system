import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { CATEGORIES } from '../lib/constants';

function CategoriesPage() {
  const [categories, setCategories] = useState([...CATEGORIES]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  const handleAdd = () => {
    if (!categoryName.trim()) return;
    setCategories([...categories, categoryName.trim()]);
    setCategoryName('');
    setShowModal(false);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat);
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (!categoryName.trim()) return;
    setCategories(categories.map((cat) => (cat === editingCategory ? categoryName.trim() : cat)));
    setEditingCategory(null);
    setCategoryName('');
    setShowModal(false);
  };

  const handleDelete = (cat) => {
    if (!window.confirm(`Delete category "${cat}"?`)) return;
    setCategories(categories.filter((c) => c !== cat));
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingCategory(null);
    setCategoryName('');
  };

  return (
    <div className="space-y-6">
      <Card
        title="Categories Management"
        subtitle="Manage your product categories"
        actions={
          <Button onClick={() => setShowModal(true)} icon={<Plus size={20} />}>Add Category</Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-700">{categories.length}</p>
            <p className="text-gray-600 mt-1">Total Categories</p>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Categories List</h2>
        <ul className="divide-y divide-gray-200">
          {categories.map((cat, idx) => (
            <li key={cat + idx} className="flex items-center justify-between py-3">
              <span className="font-medium text-gray-900">{cat}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" icon={<Edit size={16} />} onClick={() => handleEdit(cat)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" icon={<Trash2 size={16} />} onClick={() => handleDelete(cat)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Modal isOpen={showModal} onClose={handleModalClose} title={editingCategory ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <Input
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g. Coffee Table"
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={handleModalClose}>Cancel</Button>
            <Button size="sm" onClick={editingCategory ? handleUpdate : handleAdd} className="bg-amber-600 text-white">
              {editingCategory ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CategoriesPage;
