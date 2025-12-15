import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Product Schema
export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  category: z.string().min(1, 'Please select a category'),
  material: z.string().min(1, 'Please select a material'),
  size: z.string().min(1, 'Please select a size'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  stock: z.coerce.number().int().min(0, 'Stock must be a positive integer'),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

// Order Schema
export const orderSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Valid phone number required'),
  deliveryAddress: z.string().min(10, 'Delivery address is required'),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1),
        price: z.number().min(0),
      })
    )
    .min(1, 'At least one item is required'),
  paymentMethod: z.enum(['cash', 'card', 'online']),
  notes: z.string().optional(),
});

// Supplier Schema
export const supplierSchema = z.object({
  name: z.string().min(2, 'Supplier name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().min(10, 'Address is required'),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  notes: z.string().optional(),
});

// Purchase Schema
export const purchaseSchema = z.object({
  supplierId: z.string().min(1, 'Please select a supplier'),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
        unitPrice: z.coerce.number().min(0, 'Price must be positive'),
      })
    )
    .min(1, 'At least one item is required'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  notes: z.string().optional(),
});

// Search/Filter Schemas
export const productFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  material: z.string().optional(),
  inStock: z.boolean().optional(),
});

export const orderFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  paymentStatus: z.string().optional(),
});
