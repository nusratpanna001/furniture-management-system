import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import { useToast } from '../contexts/ToastContext';
import { mockService } from '../lib/mockData';
import { formatCurrency, formatDate } from '../lib/utils';

function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    setLoading(true);
    try {
      const response = await mockService.purchases.list();
      setPurchases(response.data);
    } catch (err) {
      error('Failed to load purchases');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Purchase ID',
      accessor: 'id',
      render: (row) => <span className="font-mono text-sm">#{row.id}</span>,
    },
    {
      header: 'Supplier',
      accessor: 'supplierName',
      render: (row) => <span className="font-semibold">{row.supplierName}</span>,
    },
    {
      header: 'Date',
      accessor: 'purchaseDate',
      render: (row) => <span className="text-sm">{formatDate(row.purchaseDate)}</span>,
    },
    {
      header: 'Items',
      render: (row) => <span>{row.items?.length || 0} items</span>,
    },
    {
      header: 'Total',
      accessor: 'total',
      render: (row) => <span className="font-semibold text-green-600">{formatCurrency(row.total)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <Card
        title="Purchase Management"
        subtitle="Track inventory purchases from suppliers"
        actions={
          <Button icon={<Plus size={20} />}>
            Record Purchase
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{purchases.length}</p>
            <p className="text-gray-600 mt-1">Total Purchases</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(purchases.reduce((sum, p) => sum + p.total, 0))}
            </p>
            <p className="text-gray-600 mt-1">Total Spent</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-600">
              {purchases.reduce((sum, p) => sum + p.items.reduce((s, i) => s + i.quantity, 0), 0)}
            </p>
            <p className="text-gray-600 mt-1">Items Received</p>
          </div>
        </Card>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table columns={columns} data={purchases} />
      </div>
    </div>
  );
}

export default PurchasesPage;
