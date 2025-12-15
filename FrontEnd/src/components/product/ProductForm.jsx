import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { productSchema } from '../../lib/formSchemas';
import { CATEGORIES, MATERIALS, SIZES } from '../../lib/constants';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

function ProductForm({ initialData, onSubmit, onCancel, loading }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
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
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setValue('imageUrl', file.name); // Optionally set imageUrl to file name
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        <label className="block text-gray-700 font-semibold mb-2 text-sm">Product Image</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded border" />
          )}
        </div>
        {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
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
        <Button type="submit" size="md" loading={loading} disabled={loading}>
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
