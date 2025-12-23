import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import OrderTable from '../components/order/OrderTable';
import OrderForm from '../components/order/OrderForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import { useToast } from '../contexts/ToastContext';
import api from '../lib/apiClient';
import { ORDER_STATUS } from '../lib/constants';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const { success, error } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await api.orders.list({ status: statusFilter });
      console.log('Orders loaded:', response.data);
      
      // Map backend fields to frontend format
      const ordersData = (response.data.data || response.data).map(order => ({
        ...order,
        createdAt: order.created_at,
        customerName: order.customer_name,
        customerEmail: order.user?.email || 'N/A',
      }));
      
      setOrders(ordersData);
    } catch (err) {
      console.error('Failed to load orders:', err);
      error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];
    
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.orders.updateStatus(orderId, newStatus);
      success('Order status updated successfully');
      loadOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
      error('Failed to update order status');
    }
  };

  const handleCreate = async (data) => {
    setLoading(true);
    try {
      const newOrder = {
        ...data,
        status: ORDER_STATUS.PENDING,
        total: 0,
        items: [],
        createdAt: new Date(),
      };
      const response = await api.orders.create(newOrder);
      setOrders([...orders, response.data]);
      success('Order created successfully');
      setShowModal(false);
    } catch (err) {
      error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      const response = await api.orders.updateStatus(editingOrder.id, data.status);
      setOrders(orders.map((o) => (o.id === editingOrder.id ? response.data : o)));
      success('Order updated successfully');
      setShowModal(false);
      setEditingOrder(null);
    } catch (err) {
      error('Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (order) => {
    if (!confirm(`Are you sure you want to delete order #${order.id}?`)) return;

    setLoading(true);
    try {
      await api.orders.delete(order.id);
      setOrders(orders.filter((o) => o.id !== order.id));
      success('Order deleted successfully');
    } catch (err) {
      error('Failed to delete order');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card
        title="Orders Management"
        subtitle="Track and manage customer orders"
      />

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-600" />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              ...Object.values(ORDER_STATUS).map((status) => ({
                value: status,
                label: status,
              })),
            ]}
            className="w-64"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
            <p className="text-gray-600 mt-1">Total Orders</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {orders.filter((o) => o.status === ORDER_STATUS.PENDING).length}
            </p>
            <p className="text-gray-600 mt-1">Pending</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {orders.filter((o) => o.status === ORDER_STATUS.IN_PROGRESS).length}
            </p>
            <p className="text-gray-600 mt-1">In Progress</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {orders.filter((o) => o.status === ORDER_STATUS.DELIVERED).length}
            </p>
            <p className="text-gray-600 mt-1">Delivered</p>
          </div>
        </Card>
      </div>

      {/* Order Table */}
      <OrderTable
        orders={filteredOrders}
        loading={loading}
      />

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={editingOrder ? 'Edit Order' : 'Create New Order'}
        size="lg"
      >
        <OrderForm
          initialData={editingOrder}
          onSubmit={editingOrder ? handleUpdate : handleCreate}
          onCancel={handleModalClose}
          loading={loading}
        />
      </Modal>
    </div>
  );
}

export default OrdersPage;
