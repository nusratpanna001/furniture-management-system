import { useState, useEffect } from 'react';
import { Download, TrendingUp, Package, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { mockService } from '../lib/mockData';
import { api } from '../lib/apiClient';
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
      // Try backend API first
      try {
        const res = await api.reports.dashboard();
        // api client returns data directly via interceptor
        const payload = res?.data ?? res;
        setReportData(payload);
        console.log('Report data loaded from backend:', payload);
      } catch (apiErr) {
        // Fallback to mock data if backend fails
        console.warn('Backend API failed, using mock data:', apiErr);
        const dashboard = await mockService.reports.dashboard();
        setReportData(dashboard.data);
      }
    } catch (err) {
      console.error('Failed to load report data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format) => {
    if (format === 'csv') {
      exportToCSV();
    } else if (format === 'pdf') {
      exportToPDF();
    }
    success(`Report exported as ${format.toUpperCase()}`);
  };

  const exportToCSV = () => {
    let csvContent = '';
    
    // Top Selling Products Section
    csvContent += 'Top Selling Products\n';
    csvContent += 'Rank,Product,Sales,Revenue\n';
    reportData?.topProducts?.forEach((product, idx) => {
      csvContent += `${idx + 1},${product.name},${product.sales},${product.revenue}\n`;
    });
    
    csvContent += '\n\n';
    
    // Low Stock Alert Section
    csvContent += 'Low Stock Alert\n';
    csvContent += 'Product,Category,Current Stock,Price\n';
    reportData?.lowStockProducts?.forEach((product) => {
      csvContent += `${product.name},${product.category},${product.stock},${product.price}\n`;
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // Create a simple HTML content for PDF
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #B45309; border-bottom: 2px solid #B45309; padding-bottom: 10px; }
          h2 { color: #D97706; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #F59E0B; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .summary { margin-bottom: 30px; display: flex; justify-content: space-between; }
          .summary-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Reports & Analytics</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        
        <div class="summary">
          <div class="summary-card">
            <strong>Total Revenue:</strong><br/>
            ${formatCurrency(reportData?.kpis.totalRevenue || 0)}
          </div>
          <div class="summary-card">
            <strong>Total Orders:</strong><br/>
            ${reportData?.kpis.totalOrders || 0}
          </div>
          <div class="summary-card">
            <strong>Total Products:</strong><br/>
            ${reportData?.kpis.totalProducts || 0}
          </div>
          <div class="summary-card">
            <strong>Low Stock Items:</strong><br/>
            ${reportData?.kpis.lowStockItems || 0}
          </div>
        </div>
        
        <h2>Top Selling Products</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Product</th>
              <th>Sales</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${reportData?.topProducts?.map((product, idx) => `
              <tr>
                <td>#${idx + 1}</td>
                <td>${product.name}</td>
                <td>${product.sales}</td>
                <td>${formatCurrency(product.revenue)}</td>
              </tr>
            `).join('') || '<tr><td colspan="4">No data available</td></tr>'}
          </tbody>
        </table>
        
        <h2>Low Stock Alert</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${reportData?.lowStockProducts?.map((product) => `
              <tr>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.stock}</td>
                <td>${formatCurrency(product.price)}</td>
              </tr>
            `).join('') || '<tr><td colspan="4">No data available</td></tr>'}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Create a new window and print
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const topProductsColumns = [
    { header: 'Rank', render: (row) => <Badge variant="info">#{row.rank}</Badge> },
    { header: 'Product', accessor: 'name' },
    { header: 'Sales', accessor: 'sales' },
    { header: 'Revenue', render: (row) => formatCurrency(row.revenue) },
  ];

  // Add rank to top products
  const topProductsWithRank = (reportData?.topProducts || []).map((product, idx) => ({
    ...product,
    rank: idx + 1,
  }));

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
      <div className="space-y-6">
        {/* Top Products Table */}
        <Card title="Top Selling Products" subtitle="Ranked by total sales">
          <Table columns={topProductsColumns} data={topProductsWithRank} />
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
