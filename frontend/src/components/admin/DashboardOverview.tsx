import { Cake } from '@/data/cakes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShoppingCart, Users, TrendingUp, Package } from 'lucide-react';

interface DashboardOverviewProps {
  cakes: Cake[];
  orders: any[];
}

const DashboardOverview = ({ cakes, orders }: DashboardOverviewProps) => {
  // Calculate metrics
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'delivered').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed').length;
  const totalCakes = cakes.length;
  const bestsellers = cakes.filter((c) => c.bestseller).length;

  // Prepare chart data
  const orderStatusData = [
    { name: 'Pending', value: orders.filter((o) => o.orderStatus === 'pending').length },
    { name: 'Confirmed', value: orders.filter((o) => o.orderStatus === 'confirmed').length },
    { name: 'Preparing', value: orders.filter((o) => o.orderStatus === 'preparing').length },
    { name: 'Ready', value: orders.filter((o) => o.orderStatus === 'ready').length },
    { name: 'Delivered', value: orders.filter((o) => o.orderStatus === 'delivered').length },
  ].filter((item) => item.value > 0);

  const paymentStatusData = [
    { name: 'Pending', value: orders.filter((o) => o.paymentStatus === 'pending').length },
    { name: 'Completed', value: orders.filter((o) => o.paymentStatus === 'completed').length },
    { name: 'Failed', value: orders.filter((o) => o.paymentStatus === 'failed').length },
  ].filter((item) => item.value > 0);

  const topCakes = cakes
    .map((cake) => ({
      name: cake.name,
      orders: orders.filter((o) => o.items?.some((item: any) => item.id === cake.id)).length,
      revenue: orders
        .filter((o) => o.items?.some((item: any) => item.id === cake.id))
        .reduce((sum, order) => {
          const item = order.items.find((i: any) => i.id === cake.id);
          return sum + ((item?.price || 0) * (item?.quantity || 0));
        }, 0),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const COLORS = ['#EC4899', '#14B8A6', '#F59E0B', '#3B82F6', '#8B5CF6'];

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-cake-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {completedOrders} completed, {pendingOrders} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-mint-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From {totalOrders} orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cakes</CardTitle>
            <Package className="h-4 w-4 text-cream-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCakes}</div>
            <p className="text-xs text-muted-foreground">{bestsellers} bestsellers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOrders > 0 ? `Ksh ${Math.round(totalRevenue / totalOrders).toLocaleString()}` : 'Ksh 0'}
            </div>
            <p className="text-xs text-muted-foreground">Per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Current breakdown of all orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80">
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
            <CardDescription>Breakdown of payment statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80">
                <p className="text-muted-foreground">No payment data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Cakes */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Cakes</CardTitle>
          <CardDescription>Most ordered cakes by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          {topCakes.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCakes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => `Ksh ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#EC4899" name="Revenue" />
                <Bar dataKey="orders" fill="#14B8A6" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-80">
              <p className="text-muted-foreground">No cake data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
