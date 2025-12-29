import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { productSchema } from '../../lib/formSchemas';
import { CATEGORIES, MATERIALS, SIZES } from '../../lib/constants';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

function ProductForm({ initialData, onSubmit, onCancel, loading }) {
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image_url || '');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: '',
      category: '',
      material: '',
      size: '',
      price: '',
      stock: '',
      description: '',
      imageUrl: '',
    },
  });

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

  const handleFormSubmit = (data) => {
    console.log('=== FORM SUBMIT HANDLER CALLED ===');
    console.log('Form data:', data);
    console.log('Has initialData?', !!initialData);
    // Include image file in form data
    const formData = {
      ...data,
      imageFile: imageFile,
      imageUrl: imageFile ? null : (initialData?.image_url || imagePreview)
    };
    console.log('Calling onSubmit with formData:', formData);
    onSubmit(formData);
  };

  const handleFormError = (errors) => {
    console.error('=== FORM VALIDATION ERRORS ===');
    console.error('Errors:', errors);
    console.error('Error details:', JSON.stringify(errors, null, 2));
    Object.keys(errors).forEach(key => {
      console.error(`Field "${key}":`, errors[key].message);
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit, handleFormError)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Name"
          placeholder="e.g., Velvet Accent Chair"
          error={errors.name?.message}
          required
          {...register('name')}
        />

        <Select
          label="Category"
          placeholder="Select category"
          options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
          error={errors.category?.message}
          required
          {...register('category')}
        />

        <Select
          label="Material"
          placeholder="Select material"
          options={MATERIALS.map((mat) => ({ value: mat, label: mat }))}
          error={errors.material?.message}
          required
          {...register('material')}
        />

        <Select
          label="Size"
          placeholder="Select size"
          options={SIZES.map((size) => ({ value: size, label: size }))}
          error={errors.size?.message}
          required
          {...register('size')}
        />

        <Input
          label="Price"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.price?.message}
          required
          {...register('price')}
        />

        <Input
          label="Stock Quantity"
          type="number"
          placeholder="0"
          error={errors.stock?.message}
          required
          {...register('stock')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Image
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
        <label className="block text-gray-700 font-semibold mb-2 text-sm">Description</label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none"
          rows={2}
          maxLength={200}
          placeholder="Enter product description (optional)"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-2">
        <Button type="button" variant="secondary" size="md" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          size="md" 
          loading={loading} 
          disabled={loading}
          onClick={() => console.log('=== UPDATE BUTTON CLICKED ===')}
        >
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
