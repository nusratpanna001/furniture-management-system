import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, AlertTriangle, TrendingUp, Home, Users, FileText, Truck, BarChart3, Settings, User, Phone, Info } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { mockService } from '../lib/mockData';
import { api } from '../lib/apiClient';
import { formatCurrency } from '../lib/utils';
import { CATEGORIES } from '../lib/constants';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContext';

function DashboardPage() {
  const { user } = useAuth();
  const { refreshTrigger } = useDashboard();
  // Local category management (mock) - hooks must be at the top
  const [categoriesList, setCategoriesList] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Dashboard refresh triggered, refreshTrigger:', refreshTrigger);
    loadDashboardData();
  }, [refreshTrigger]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Try backend API first
      try {
        const response = await api.reports.dashboard();
        console.log('Raw API response:', response);
        // api client returns response.data via interceptor
        // Backend returns { success: true, data: { kpis, topProducts, etc } }
        // After interceptor, we get { success: true, data: { ... } }
        const payload = response.data || response;
        console.log('Dashboard data payload:', payload);
        setDashboardData(payload);
      } catch (apiErr) {
        // Fallback to mock data if backend fails
        console.warn('Backend API failed, using mock data:', apiErr);
        const response = await mockService.reports.dashboard();
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = [
    {
      title: 'Total Products',
      value: dashboardData?.kpis?.totalProducts || 0,
      icon: Package,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Total Categories',
      value: dashboardData?.kpis?.totalCategories || 0,
      icon: Package,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Total Customers',
      value: dashboardData?.kpis?.totalCustomers || 0,
      icon: Users,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Total Orders',
      value: dashboardData?.kpis.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
    },
    
  ];

  const topProductsColumns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      header: 'Sales',
      accessor: 'sales',
      render: (row) => <Badge variant="info">{row.sales}</Badge>,
    },
    {
      header: 'Revenue',
      render: (row) => <span className="font-semibold text-green-600">{formatCurrency(row.revenue)}</span>,
    },
  ];

  const lowStockColumns = [
    {
      header: 'Product',
      accessor: 'name',
    },
    {
      header: 'Category',
      accessor: 'category',
    },
    {
      header: 'Stock',
      render: (row) => <Badge variant="danger">{row.stock}</Badge>,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-amber-700" />
      </div>
    );
  }

  const adminNavigation = [
    // Core Admin Functions
    { name: 'Categories', path: '/inventory', icon: Package, color: 'bg-gradient-to-r from-amber-500 to-amber-700', description: 'Product categories & inventory' },
    { name: 'Products', path: '/admin/products', icon: Package, color: 'bg-gradient-to-r from-amber-600 to-amber-800', description: 'Furniture catalog management' },
    { name: 'Orders', path: '/orders', icon: ShoppingCart, color: 'bg-gradient-to-r from-amber-500 to-amber-700', description: 'Manage all customer orders' },
    { name: 'Customers', path: '/customers', icon: Users, color: 'bg-gradient-to-r from-amber-600 to-amber-800', description: 'Customer management' }
  ];

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categoriesList.includes(trimmed)) {
      setNewCategory('');
      setShowAddCategory(false);
      return;
    }
    setCategoriesList((prev) => [trimmed, ...prev]);
    setNewCategory('');
    setShowAddCategory(false);
  };


  return (

    <div className="space-y-6">
      {/* Welcome - Only Dashboard */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                  <Icon className={kpi.color} size={24} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card title="Sales Trend" subtitle="Last 30 days">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData?.salesTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#B45309" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Products */}
        <Card title="Top Products" subtitle="Best sellers this month">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData?.topProducts || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />``
              <Tooltip />
              <Bar dataKey="sales" fill="#B45309" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Selling Products and Low Stock Alert stacked */}
      <div className="space-y-6">
        <Card title="Top Selling Products">
          <Table columns={topProductsColumns} data={dashboardData?.topProducts || []} />
        </Card>
        
      </div>
        {/* <Card title="Low Stock Alert">
          <Table columns={lowStockColumns} data={dashboardData?.lowStockProducts || []} />
        </Card> */}
      
      <div className="space-y-6">
        <Card title="Low Stock Alert">
          <Table columns={lowStockColumns} data={dashboardData?.lowStockProducts || []} />
        </Card>

      </div>
    </div>
  );
}

export default DashboardPage;
