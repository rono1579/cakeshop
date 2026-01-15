import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Mail, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CustomersTableProps {
  orders: any[];
  loading: boolean;
}

const CustomersTable = ({ orders, loading }: CustomersTableProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Extract unique customers
  const customersMap = new Map<string, any>();
  orders.forEach((order) => {
    const key = order.customerEmail;
    if (!customersMap.has(key)) {
      customersMap.set(key, {
        email: order.customerEmail,
        name: order.customerName,
        phone: order.customerPhone,
        orders: [],
        totalSpent: 0,
      });
    }
    const customer = customersMap.get(key)!;
    customer.orders.push(order);
    customer.totalSpent += order.totalAmount;
  });

  const customers = Array.from(customersMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);

  if (loading && customers.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-muted-foreground">No customers found</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cake-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Orders</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Total Spent</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index} className="border-b hover:bg-cake-50/50 transition">
                <td className="px-6 py-3">
                  <p className="font-medium">{customer.name}</p>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {customer.orders.length}
                  </span>
                </td>
                <td className="px-6 py-3 font-semibold">
                  Ksh {customer.totalSpent.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(customer);
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

      {/* Customer Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCustomer?.name}</DialogTitle>
            <DialogDescription>Customer Profile & Order History</DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="font-medium">{selectedCustomer.orders.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lifetime Value</p>
                  <p className="text-xl font-bold text-cake-600">
                    Ksh {selectedCustomer.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Order</p>
                  <p className="font-medium">
                    Ksh {Math.round(selectedCustomer.totalSpent / selectedCustomer.orders.length).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Order History</h3>
                <div className="space-y-3">
                  {selectedCustomer.orders.map((order: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm">{order.orderNumber}</p>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            order.orderStatus === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.orderStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">{order.items.length}</span> item(s) - Ksh{' '}
                        <span className="font-semibold">{order.totalAmount.toLocaleString()}</span>
                      </p>
                      {order.items.length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Items: {order.items.map((item: any) => item.name).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/5 p-3 rounded">
                    <p className="text-xs text-muted-foreground">Most Recent Order</p>
                    <p className="font-medium">
                      {new Date(
                        Math.max(...selectedCustomer.orders.map((o: any) => new Date(o.createdAt).getTime()))
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-primary/5 p-3 rounded">
                    <p className="text-xs text-muted-foreground">Customer Since</p>
                    <p className="font-medium">
                      {new Date(
                        Math.min(...selectedCustomer.orders.map((o: any) => new Date(o.createdAt).getTime()))
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomersTable;
