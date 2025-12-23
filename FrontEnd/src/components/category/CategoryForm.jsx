import { useState } from 'react';
import Button from '../ui/Button';

function CategoryForm({ onSubmit, initialData = {} }) {
  const [form, setForm] = useState({
    name: initialData.name || '',
    image: initialData.image || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData.image || '');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 4MB)
      if (file.size > 4 * 1024 * 1024) {
        alert('File size must be less than 4MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Only JPG, JPEG, PNG, and WebP files are allowed');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const formData = {
      ...form,
      imageFile: imageFile,
      imageUrl: form.image || imagePreview
    };
    onSubmit?.(formData);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
        <input 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          placeholder="Category Name" 
          className="border px-3 py-2 rounded w-full" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Image
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded px-4 py-6 text-center hover:border-amber-500 transition">
          <input
            type="file"
            accept="image/jpg,image/jpeg,image/png,image/webp"
            className="w-full"
            onChange={handleImageChange}
          />
          <p className="text-xs text-gray-500 mt-2">
            JPG, JPEG, PNG, WebP (Max 4MB)
          </p>
        </div>
        {imagePreview && (
          <div className="mt-3 flex justify-center">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-xs max-h-32 rounded border border-gray-300"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Or Image URL (Optional)
        </label>
        <input 
          name="image" 
          value={form.image} 
          onChange={(e) => {
            handleChange(e);
            if (e.target.value && !imageFile) {
              setImagePreview(e.target.value);
            }
          }} 
          placeholder="https://example.com/image.jpg" 
          className="border px-3 py-2 rounded w-full" 
        />
      </div>

      <Button type="submit" className="bg-amber-700 text-white w-full">Save Category</Button>
    </form>
  );
}

export default CategoryForm;
