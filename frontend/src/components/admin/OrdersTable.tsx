import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useOrdersApi } from '@/hooks/use-orders-api';
import { Badge } from '@/components/ui/badge';

interface OrdersTableProps {
  orders: any[];
  loading: boolean;
  onOrdersUpdated: () => void;
}

const OrdersTable = ({ orders, loading, onOrdersUpdated }: OrdersTableProps) => {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { updateOrderStatus, loading: apiLoading } = useOrdersApi();

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter((order) => order.orderStatus === filterStatus);

  const handleStatusChange = async (orderNumber: string, newStatus: string) => {
    setUpdatingOrder(orderNumber);
    const result = await updateOrderStatus(orderNumber, newStatus);
    if (result) {
      onOrdersUpdated();
    }
    setUpdatingOrder(null);
  };

  const handlePaymentStatusChange = async (orderNumber: string, newStatus: string) => {
    setUpdatingOrder(orderNumber);
    const result = await updateOrderStatus(orderNumber, undefined, newStatus);
    if (result) {
      onOrdersUpdated();
    }
    setUpdatingOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Filter */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filter by status:</span>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cake-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Order #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Order Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Payment Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id || order.orderNumber} className="border-b hover:bg-cake-50/50 transition">
                  <td className="px-6 py-3 font-medium text-sm">{order.orderNumber}</td>
                  <td className="px-6 py-3">
                    <div>
                      <p className="font-medium text-sm">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 font-medium">Ksh {order.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-3">
                    <Select
                      value={order.orderStatus}
                      onValueChange={(value) => handleStatusChange(order.orderNumber, value)}
                      disabled={updatingOrder === order.orderNumber}
                    >
                      <SelectTrigger className="w-32 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-3">
                    <Select
                      value={order.paymentStatus}
                      onValueChange={(value) => handlePaymentStatusChange(order.orderNumber, value)}
                      disabled={updatingOrder === order.orderNumber}
                    >
                      <SelectTrigger className="w-28 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetails(true);
                      }}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order Number: {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Shipping Address</p>
                <p className="font-medium">
                  {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}{' '}
                  {selectedOrder.shippingAddress.zipCode}
                </p>
              </div>

              {/* Items */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Order Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">
                        Qty: {item.quantity} × Ksh {item.price.toLocaleString()} = Ksh{' '}
                        {(item.quantity * item.price).toLocaleString()}
                      </p>
                      {item.customization && Object.keys(item.customization).length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Customization: {Object.entries(item.customization)
                            .filter(([, v]) => v)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Special Notes</p>
                  <p className="bg-gray-50 p-3 rounded text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold">Total Amount</p>
                  <p className="text-2xl font-bold text-cake-600">
                    Ksh {selectedOrder.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrdersTable;
