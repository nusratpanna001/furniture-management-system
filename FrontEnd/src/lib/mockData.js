import { ORDER_STATUS } from '../lib/constants';

// Mock Products
export const mockProducts = [
  {
    id: '1',
    name: 'Platinum Velvet Accent Chair',
    category: 'Chair',
    material: 'Fabric',
    size: 'Medium',
    price: 244.99,
    stock: 15,
    description: 'Elegant velvet accent chair with platinum finish',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: 'Classic Wooden Dining Set',
    category: 'Dining Set',
    material: 'Wood',
    size: 'Large',
    price: 529.99,
    stock: 8,
    description: 'Solid wood dining set with 6 chairs',
    imageUrl: 'https://images.unsplash.com/photo-1600585154208-04e8e6ed9a3b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    name: 'Comfort Craft Sofa',
    category: 'Sofa',
    material: 'Leather',
    size: 'Extra Large',
    price: 699.99,
    stock: 5,
    description: 'Premium leather sofa with comfort craft design',
    imageUrl: 'https://images.unsplash.com/photo-1616627566495-d1bca3c91b7f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    name: 'Modern Bed Frame',
    category: 'Bed',
    material: 'Wood',
    size: 'Large',
    price: 449.99,
    stock: 12,
    description: 'Contemporary wooden bed frame',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '5',
    name: 'Oak Bookshelf',
    category: 'Shelf',
    material: 'Wood',
    size: 'Large',
    price: 189.99,
    stock: 20,
    description: 'Sturdy oak bookshelf with 5 shelves',
    imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '6',
    name: 'Elegant Dressing Table',
    category: 'Dressing Table',
    material: 'Wood',
    size: 'Medium',
    price: 299.99,
    stock: 7,
    description: 'Elegant dressing table with mirror',
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
  },
];

// Mock Orders
export const mockOrders = [
  {
    id: '1001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+880-1234-567890',
    deliveryAddress: '123 Main St, Dhaka, Bangladesh',
    status: ORDER_STATUS.DELIVERED,
    paymentMethod: 'card',
    total: 1474.97,
    createdAt: new Date('2025-10-15'),
    items: [
      { productId: '1', productName: 'Platinum Velvet Accent Chair', quantity: 2, price: 244.99 },
      { productId: '2', productName: 'Classic Wooden Dining Set', quantity: 1, price: 529.99 },
      { productId: '4', productName: 'Modern Bed Frame', quantity: 1, price: 449.99 },
    ],
  },
  {
    id: '1002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '+880-1234-567891',
    deliveryAddress: '456 Oak Ave, Chittagong, Bangladesh',
    status: ORDER_STATUS.IN_PROGRESS,
    paymentMethod: 'cash',
    total: 699.99,
    createdAt: new Date('2025-10-20'),
    items: [
      { productId: '3', productName: 'Comfort Craft Sofa', quantity: 1, price: 699.99 },
    ],
  },
  {
    id: '1003',
    customerName: 'Bob Wilson',
    customerEmail: 'bob@example.com',
    customerPhone: '+880-1234-567892',
    deliveryAddress: '789 Pine Rd, Sylhet, Bangladesh',
    status: ORDER_STATUS.PENDING,
    paymentMethod: 'online',
    total: 489.98,
    createdAt: new Date('2025-10-25'),
    items: [
      { productId: '5', productName: 'Oak Bookshelf', quantity: 2, price: 189.99 },
    ],
  },
];

// Mock Suppliers
export const mockSuppliers = [
  {
    id: '1',
    name: 'WoodCraft Suppliers Ltd.',
    email: 'contact@woodcraft.com',
    phone: '+880-1700-000001',
    address: 'Industrial Area, Dhaka, Bangladesh',
    contactPerson: 'Ahmed Khan',
    notes: 'Primary supplier for wooden furniture',
  },
  {
    id: '2',
    name: 'Fabric & Upholstery Co.',
    email: 'info@fabricco.com',
    phone: '+880-1700-000002',
    address: 'Textile District, Chittagong, Bangladesh',
    contactPerson: 'Sarah Rahman',
    notes: 'Supplier for fabric and upholstery materials',
  },
  {
    id: '3',
    name: 'Metal Works Inc.',
    email: 'sales@metalworks.com',
    phone: '+880-1700-000003',
    address: 'Manufacturing Zone, Gazipur, Bangladesh',
    contactPerson: 'Kamal Hossain',
    notes: 'Supplier for metal frames and hardware',
  },
];

// Mock Purchases
export const mockPurchases = [
  {
    id: '1',
    supplierId: '1',
    supplierName: 'WoodCraft Suppliers Ltd.',
    purchaseDate: '2025-10-01',
    total: 5000,
    items: [
      { productId: '2', productName: 'Classic Wooden Dining Set', quantity: 10, unitPrice: 300 },
      { productId: '4', productName: 'Modern Bed Frame', quantity: 10, unitPrice: 200 },
    ],
    notes: 'Monthly stock replenishment',
  },
  {
    id: '2',
    supplierId: '2',
    supplierName: 'Fabric & Upholstery Co.',
    purchaseDate: '2025-10-10',
    total: 3000,
    items: [
      { productId: '1', productName: 'Platinum Velvet Accent Chair', quantity: 20, unitPrice: 150 },
    ],
    notes: 'Seasonal collection',
  },
];

// Mock Dashboard Data
export const mockDashboardData = {
  kpis: {
    totalRevenue: 45789.50,
    totalOrders: 156,
    totalProducts: 45,
    lowStockItems: 8,
  },
  salesTrend: [
    { date: 'Oct 1', sales: 1200 },
    { date: 'Oct 5', sales: 1800 },
    { date: 'Oct 10', sales: 2200 },
    { date: 'Oct 15', sales: 1900 },
    { date: 'Oct 20', sales: 2500 },
    { date: 'Oct 25', sales: 2800 },
    { date: 'Oct 30', sales: 3200 },
  ],
  topProducts: [
    { name: 'Comfort Craft Sofa', sales: 45, revenue: 31499.55 },
    { name: 'Classic Wooden Dining Set', sales: 32, revenue: 16959.68 },
    { name: 'Platinum Velvet Accent Chair', sales: 28, revenue: 6859.72 },
  ],
  lowStockProducts: mockProducts.filter(p => p.stock < 10),
};

// Mock Service
export const mockService = {
  categories: {
    list: () => Promise.resolve({ data: [
      { name: 'Bed' },
      { name: 'Sofa' },
      { name: 'Chair' }
    ] })
  },
  products: {
    list: () => Promise.resolve({ data: mockProducts }),
    get: (id) => Promise.resolve({ data: mockProducts.find(p => p.id === id) }),
    create: (data) => Promise.resolve({ data: { id: Date.now().toString(), ...data } }),
    update: (id, data) => Promise.resolve({ data: { id, ...data } }),
    delete: (id) => Promise.resolve({ success: true }),
  },
  orders: {
    list: () => Promise.resolve({ data: mockOrders }),
    get: (id) => Promise.resolve({ data: mockOrders.find(o => o.id === id) }),
    create: (data) => Promise.resolve({ data: { id: Date.now().toString(), ...data } }),
    update: (id, data) => Promise.resolve({ data: { id, ...data } }),
    delete: (id) => Promise.resolve({ success: true }),
  },
  suppliers: {
    list: () => Promise.resolve({ data: mockSuppliers }),
    create: (data) => Promise.resolve({ data: { id: Date.now().toString(), ...data } }),
    update: (id, data) => Promise.resolve({ data: { id, ...data } }),
    delete: (id) => Promise.resolve({ success: true }),
  },
  purchases: {
    list: () => Promise.resolve({ data: mockPurchases }),
    create: (data) => Promise.resolve({ data: { id: Date.now().toString(), ...data } }),
  },
  reports: {
    dashboard: () => Promise.resolve({ data: mockDashboardData }),
    sales: () => Promise.resolve({ data: mockDashboardData.salesTrend }),
    topProducts: () => Promise.resolve({ data: mockDashboardData.topProducts }),
    lowStock: () => Promise.resolve({ data: mockDashboardData.lowStockProducts }),
  },
};
