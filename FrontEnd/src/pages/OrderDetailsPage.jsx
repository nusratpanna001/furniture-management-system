import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusPill from '../components/order/StatusPill';
import Table from '../components/ui/Table';
import { useToast } from '../contexts/ToastContext';
import { mockService } from '../lib/mockData';
import { formatCurrency, formatDate } from '../lib/utils';
import { ORDER_STATUS } from '../lib/constants';

function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const response = await mockService.orders.get(id);
      setOrder(response.data);
    } catch (err) {
      error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (newStatus) => {
    setOrder({ ...order, status: newStatus });
    success(`Order status updated to ${newStatus}`);
  };

  const timelineSteps = [
    { status: ORDER_STATUS.PENDING, icon: Package, label: 'Order Placed' },
    { status: ORDER_STATUS.IN_PROGRESS, icon: Truck, label: 'Processing' },
    { status: ORDER_STATUS.DELIVERED, icon: CheckCircle, label: 'Delivered' },
  ];

  const getStepStatus = (stepStatus) => {
    const statusOrder = [ORDER_STATUS.PENDING, ORDER_STATUS.IN_PROGRESS, ORDER_STATUS.DELIVERED];
    const currentIndex = statusOrder.indexOf(order?.status);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (order?.status === ORDER_STATUS.CANCELLED) return 'cancelled';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const itemColumns = [
    {
      header: 'Product',
      render: (row) => <span className="font-medium">{row.productName}</span>,
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
    },
    {
      header: 'Unit Price',
      render: (row) => formatCurrency(row.price),
    },
    {
      header: 'Total',
      render: (row) => <span className="font-semibold">{formatCurrency(row.price * row.quantity)}</span>,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-amber-700" />
      </div>
    );
  }

  if (!order) {
    return (
      <Card>
        <p className="text-center text-gray-600">Order not found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/orders')} icon={<ArrowLeft size={20} />}>
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
            <p className="text-gray-600">{formatDate(order.createdAt, 'long')}</p>
          </div>
        </div>
        <StatusPill status={order.status} />
      </div>

      {/* Timeline */}
      <Card title="Order Timeline">
        <div className="flex items-center justify-between">
          {timelineSteps.map((step, index) => {
            const Icon = step.icon;
            const status = getStepStatus(step.status);

            return (
              <div key={index} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      status === 'completed'
                        ? 'bg-green-500 text-white'
                        : status === 'current'
                        ? 'bg-amber-500 text-white'
                        : status === 'cancelled'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900">{step.label}</p>
                </div>
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`flex-1 h-1 ${
                      status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <Card title="Customer Information">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{order.customerEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{order.customerPhone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Delivery Address</p>
              <p className="font-medium">{order.deliveryAddress}</p>
            </div>
          </div>
        </Card>

        {/* Payment Info */}
        <Card title="Payment Information">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-medium capitalize">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-amber-700">{formatCurrency(order.total)}</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card title="Quick Actions">
          <div className="space-y-3">
            {order.status === ORDER_STATUS.PENDING && (
              <Button
                className="w-full"
                onClick={() => updateStatus(ORDER_STATUS.IN_PROGRESS)}
              >
                Mark as In Progress
              </Button>
            )}
            {order.status === ORDER_STATUS.IN_PROGRESS && (
              <Button
                className="w-full"
                variant="success"
                onClick={() => updateStatus(ORDER_STATUS.DELIVERED)}
              >
                Mark as Delivered
              </Button>
            )}
            {order.status !== ORDER_STATUS.CANCELLED && order.status !== ORDER_STATUS.DELIVERED && (
              <Button
                className="w-full"
                variant="danger"
                onClick={() => updateStatus(ORDER_STATUS.CANCELLED)}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Order Items */}
      <Card title="Order Items">
        <Table columns={itemColumns} data={order.items || []} />
        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-amber-700">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default OrderDetailsPage;
