import React, { useState } from 'react';
import { cn } from '../../lib/utils';

function Table({ columns, data, onRowClick, className }) {
  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalRows = data.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className={cn('overflow-x-auto', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <label htmlFor="rowsPerPage" className="text-sm text-gray-600">Rows per page:</label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
            className="border rounded px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50, 100].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <button
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn(
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex + (page - 1) * rowsPerPage}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'hover:bg-gray-50 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                      column.cellClassName
                    )}
                  >
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
