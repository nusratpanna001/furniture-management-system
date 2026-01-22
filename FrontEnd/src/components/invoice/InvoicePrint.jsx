import React from 'react';
import { formatCurrency, formatDate } from '../../lib/utils';

const InvoicePrint = React.forwardRef(({ order }, ref) => {
  if (!order) return null;

  return (
    <div ref={ref} className="p-8 bg-white text-black">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 border-b-2 border-amber-700 pb-4">
        <div>
          <h1 className="text-4xl font-bold text-amber-800 mb-2">INVOICE</h1>
          <p className="text-lg text-gray-700 font-semibold">Furniture Management System</p>
          <p className="text-sm text-gray-600">Premium Furniture Collection</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Order Number</p>
          <p className="text-xl font-bold text-amber-700">#{order.orderNumber || order.order_number || order.id}</p>
          <p className="text-sm text-gray-600 mt-2">Date</p>
          <p className="font-semibold">{formatDate(order.createdAt || order.created_at || new Date())}</p>
        </div>
      </div>

      {/* Customer & Payment Info */}
      <div className="mb-8 grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold text-amber-800 mb-3 text-lg border-b border-gray-300 pb-2">Bill To:</h3>
          <div className="space-y-1">
            <p className="font-semibold text-gray-900">{order.customerName || order.customer_name || 'N/A'}</p>
            <p className="text-gray-700">{order.customerPhone || order.customer_phone || order.phone || 'N/A'}</p>
            <p className="text-gray-700">{order.customerEmail || order.customer_email || order.email || 'N/A'}</p>
            <p className="text-gray-600 text-sm mt-2">{order.deliveryAddress || order.shipping_address || order.address || 'N/A'}</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-amber-800 mb-3 text-lg border-b border-gray-300 pb-2">Payment Info:</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold">{order.paymentMethod || order.payment_method || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status:</span>
              <span className="font-semibold capitalize">{order.paymentStatus || order.payment_status || 'Pending'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Status:</span>
              <span className="font-semibold capitalize">{order.status || 'Pending'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <h3 className="font-bold text-amber-800 mb-3 text-lg">Order Items:</h3>
        <table className="w-full border border-gray-300">
          <thead className="bg-amber-700 text-white">
            <tr>
              <th className="text-left p-3 border-r border-amber-600">#</th>
              <th className="text-left p-3 border-r border-amber-600">Product</th>
              <th className="text-right p-3 border-r border-amber-600">Price</th>
              <th className="text-center p-3 border-r border-amber-600">Qty</th>
              <th className="text-right p-3">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || order.order_items || []).map((item, index) => (
              <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                <td className="p-3 border-r border-gray-300">{index + 1}</td>
                <td className="p-3 border-r border-gray-300">
                  <p className="font-semibold">{item.productName || item.product_name || item.name || 'Product'}</p>
                </td>
                <td className="text-right p-3 border-r border-gray-300">
                  {formatCurrency(item.price || 0)}
                </td>
                <td className="text-center p-3 border-r border-gray-300 font-semibold">
                  {item.quantity || 1}
                </td>
                <td className="text-right p-3 font-semibold">
                  {formatCurrency((item.price || 0) * (item.quantity || 1))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2 border border-gray-300 p-4 rounded-lg bg-gray-50">
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold">{formatCurrency(order.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="text-gray-700">Tax (8%):</span>
              <span className="font-semibold">{formatCurrency(order.tax || 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="text-gray-700">Shipping:</span>
              <span className="font-semibold">{formatCurrency(order.shipping || 0)}</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-amber-700 font-bold text-xl">
              <span className="text-amber-800">Total:</span>
              <span className="text-amber-800">{formatCurrency(order.total || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center">
        <p className="text-amber-800 font-semibold text-lg mb-2">Thank you for your business!</p>
        <p className="text-sm text-gray-600 mb-1">For any queries, please contact us:</p>
        <div className="flex justify-center gap-6 text-sm text-gray-600">
          <span>📧 support@furniture.com</span>
          <span>📞 +880-1234-567890</span>
          <span>🌐 www.furniture.com</span>
        </div>
        <p className="text-xs text-gray-500 mt-4">This is a computer-generated invoice and does not require a signature.</p>
      </div>
    </div>
  );
});

InvoicePrint.displayName = 'InvoicePrint';

export default InvoicePrint;
