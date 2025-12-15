import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema } from '../../lib/formSchemas';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

function OrderForm({ initialData, onSubmit, onCancel, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: initialData || {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      deliveryAddress: '',
      paymentMethod: 'cash',
      notes: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Customer Name"
          placeholder="John Doe"
          error={errors.customerName?.message}
          required
          {...register('customerName')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="customer@example.com"
          error={errors.customerEmail?.message}
          required
          {...register('customerEmail')}
        />

        <Input
          label="Phone"
          type="tel"
          placeholder="+880-1234-567890"
          error={errors.customerPhone?.message}
          required
          {...register('customerPhone')}
        />

        <Select
          label="Payment Method"
          options={[
            { value: 'cash', label: 'Cash' },
            { value: 'card', label: 'Card' },
            { value: 'online', label: 'Online Payment' },
          ]}
          error={errors.paymentMethod?.message}
          required
          {...register('paymentMethod')}
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2 text-sm">
          Delivery Address <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none"
          rows={3}
          placeholder="Enter full delivery address"
          {...register('deliveryAddress')}
        />
        {errors.deliveryAddress && (
          <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress.message}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2 text-sm">Notes</label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none"
          rows={3}
          placeholder="Additional notes (optional)"
          {...register('notes')}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading} disabled={loading}>
          {initialData ? 'Update Order' : 'Create Order'}
        </Button>
      </div>
    </form>
  );
}

export default OrderForm;
