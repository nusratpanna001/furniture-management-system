import { Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Table from '../ui/Table';
import Button from '../ui/Button';
import StatusPill from './StatusPill';
import { usePagination } from '../../hooks/usePagination';
import { formatCurrency, formatDate } from '../../lib/utils';

function OrderTable({ orders, onEdit, onDelete, loading }) {
  const navigate = useNavigate();
  const { paginatedData, currentPage, totalPages, nextPage, prevPage, goToPage } = usePagination(orders);

  const columns = [
    {
      header: 'Order ID',
      accessor: 'id',
      render: (row) => <span className="font-mono text-sm">#{row.id}</span>,
    },
    {
      header: 'Customer',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.customerName}</p>
          <p className="text-sm text-gray-500">{row.customerEmail}</p>
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (row) => <span className="text-sm">{formatDate(row.createdAt)}</span>,
    },
    {
      header: 'Items',
      render: (row) => <span>{row.items?.length || 0} items</span>,
    },
    {
      header: 'Total',
      accessor: 'total',
      render: (row) => <span className="font-semibold">{formatCurrency(row.total)}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusPill status={row.status} />,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/orders/${row.id}`)}
            icon={<Eye size={16} />}
            aria-label="View order"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(row)}
            icon={<Edit size={16} />}
            aria-label="Edit order"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(row)}
            icon={<Trash2 size={16} />}
            className="text-red-600 hover:bg-red-50"
            aria-label="Delete order"
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-amber-700 mx-auto" />
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Table columns={columns} data={paginatedData} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                size="sm"
                variant={currentPage === i + 1 ? 'primary' : 'outline'}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTable;
