import { useState, useEffect } from 'react';
import { Download, TrendingUp, Package, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { mockService } from '../lib/mockData';
import { formatCurrency } from '../lib/utils';
import { useToast } from '../contexts/ToastContext';

function ReportsPage() {
  const [reportData, setReportData] = useState(null);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const { success } = useToast();

  useEffect(() => {
    loadReportData();
  }, [period]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const dashboard = await mockService.reports.dashboard();
      setReportData(dashboard.data);
    } catch (err) {
      console.error('Failed to load report data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format) => {
    success(`Exporting report as ${format.toUpperCase()}...`);
    // Placeholder for actual export functionality
  };

  const topProductsColumns = [
    { header: 'Rank', render: (row, idx) => <Badge variant="info">#{idx + 1}</Badge> },
    { header: 'Product', accessor: 'name' },
    { header: 'Sales', accessor: 'sales' },
    { header: 'Revenue', render: (row) => formatCurrency(row.revenue) },
  ];

  const lowStockColumns = [
    { header: 'Product', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Current Stock', render: (row) => <Badge variant="danger">{row.stock}</Badge> },
    { header: 'Price', render: (row) => formatCurrency(row.price) },
  ];

  const CHART_COLORS = ['#B45309', '#D97706', '#F59E0B', '#FBBF24'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-amber-700" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card
        title="Reports & Analytics"
        subtitle="Comprehensive business insights and analytics"
        actions={
          <div className="flex gap-2">
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              options={[
                { value: 'day', label: 'Daily' },
                { value: 'week', label: 'Weekly' },
                { value: 'month', label: 'Monthly' },
              ]}
              className="w-32"
            />
            <Button variant="outline" onClick={() => handleExport('csv')} icon={<Download size={16} />}>
              CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')} icon={<Download size={16} />}>
              PDF
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(reportData?.kpis.totalRevenue || 0)}
              </p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-blue-600">{reportData?.kpis.totalOrders || 0}</p>
            </div>
            <Package className="text-blue-600" size={32} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Products</p>
              <p className="text-2xl font-bold text-amber-600">{reportData?.kpis.totalProducts || 0}</p>
            </div>
            <Package className="text-amber-600" size={32} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-red-600">{reportData?.kpis.lowStockItems || 0}</p>
            </div>
            <AlertCircle className="text-red-600" size={32} />
          </div>
        </Card>
      </div>

      {/* Charts removed as requested */}

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Table */}
        <Card title="Top Selling Products" subtitle="Ranked by total sales">
          <Table columns={topProductsColumns} data={reportData?.topProducts || []} />
        </Card>

        {/* Low Stock Table */}
        <Card title="Low Stock Alert" subtitle="Items requiring restocking">
          <Table columns={lowStockColumns} data={reportData?.lowStockProducts || []} />
        </Card>
      </div>
    </div>
  );
}

export default ReportsPage;
