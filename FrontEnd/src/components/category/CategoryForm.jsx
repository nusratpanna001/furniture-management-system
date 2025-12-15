import { useState } from 'react';
import Button from '../ui/Button';

function CategoryForm({ onSubmit, initialData = {} }) {
  const [form, setForm] = useState({
    name: initialData.name || '',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Category Name" className="border px-3 py-2 rounded w-full" required />
      <Button type="submit" className="bg-amber-700 text-white">Save Category</Button>
    </form>
  );
}

export default CategoryForm;
