import { Edit, Trash2 } from 'lucide-react';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { usePagination } from '../../hooks/usePagination';
import { formatCurrencyBDT } from '../../lib/utils';
import { LOW_STOCK_THRESHOLD } from '../../lib/constants';

function ProductList({ products, onEdit, onDelete, loading }) {
  const { paginatedData, currentPage, totalPages, nextPage, prevPage, goToPage } = usePagination(products);

  const columns = [
    {
      header: 'Image',
      accessor: 'imageUrl',
      render: (row) => (
        <img
          src={row.imageUrl || 'https://via.placeholder.com/100'}
          alt={row.name}
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.name}</p>
          <p className="text-sm text-gray-500">{row.category}</p>
        </div>
      ),
    },
    {
      header: 'Material',
      accessor: 'material',
    },
    {
      header: 'Size',
      accessor: 'size',
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (row) => <span className="font-semibold">{formatCurrencyBDT(row.price)}</span>,
    },
    {
      header: 'Stock',
      accessor: 'stock',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.stock}</span>
          {row.stock < LOW_STOCK_THRESHOLD && (
            <Badge variant="warning" className="text-xs">Low</Badge>
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
            onClick={() => onEdit(row)}
            icon={<Edit size={16} />}
            aria-label="Edit product"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(row)}
            icon={<Trash2 size={16} />}
            className="text-red-600 hover:bg-red-50"
            aria-label="Delete product"
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-amber-700 mx-auto" />
        <p className="mt-4 text-gray-600">Loading products...</p>
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

export default ProductList;
