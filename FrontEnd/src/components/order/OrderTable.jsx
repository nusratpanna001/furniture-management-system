import { Eye, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Table from '../ui/Table';
import Button from '../ui/Button';
import StatusPill from './StatusPill';
import { usePagination } from '../../hooks/usePagination';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ORDER_STATUS } from '../../lib/constants';

function OrderTable({ orders, loading, onStatusChange }) {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const { paginatedData, currentPage, totalPages, nextPage, prevPage, goToPage } = usePagination(orders);

  const handleStatusChange = (orderId, newStatus) => {
    if (onStatusChange) {
      onStatusChange(orderId, newStatus);
    }
    setOpenMenuId(null);
  };

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
      render: (row) => (
        <div className="relative">
          <div className="flex items-center gap-2">
            <StatusPill status={row.status} />
            <button
              onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical size={16} className="text-gray-600" />
            </button>
          </div>
          
          {/* Dropdown Menu */}
          {openMenuId === row.id && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-1">
                <button
                  onClick={() => handleStatusChange(row.id, ORDER_STATUS.PENDING)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  Pending
                </button>
                <button
                  onClick={() => handleStatusChange(row.id, ORDER_STATUS.IN_PROGRESS)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  In Progress
                </button>
                <button
                  onClick={() => handleStatusChange(row.id, ORDER_STATUS.DELIVERED)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Delivered
                </button>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/orders/${row.id}`)}
          >
            View
          </Button>
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
