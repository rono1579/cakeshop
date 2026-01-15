import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CakesTable from '@/components/admin/CakesTable';
import CakeForm from '@/components/admin/CakeForm';
import OrdersTable from '@/components/admin/OrdersTable';
import DashboardOverview from '@/components/admin/DashboardOverview';
import CustomersTable from '@/components/admin/CustomersTable';
import { useCakesApi } from '@/hooks/use-cakes-api';
import { useOrdersApi } from '@/hooks/use-orders-api';
import { Cake } from '@/data/cakes';

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').filter(Boolean);

const Admin = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const { fetchCakes, loading: cakesLoading } = useCakesApi();
  const { fetchOrders, loading: ordersLoading } = useOrdersApi();
  
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showCakeForm, setShowCakeForm] = useState(false);
  const [editingCake, setEditingCake] = useState<Cake | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setAuthLoading(true);

      if (!user) {
        navigate('/auth?mode=login');
        return;
      }

      try {
        const idTokenResult = await user.getIdTokenResult();
        const hasAdminRole = idTokenResult.claims.admin === true;
        const hasAdminEmail = ADMIN_EMAILS.includes(user.email || '');

        if (!hasAdminRole && !hasAdminEmail) {
          navigate('/');
          return;
        }

        setIsAdmin(true);
        setAuthLoading(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate, auth]);

  useEffect(() => {
    if (isAdmin) {
      loadCakes();
      loadOrders();
    }
  }, [isAdmin]);

  const loadCakes = async () => {
    const data = await fetchCakes();
    setCakes(data);
  };

  const loadOrders = async () => {
    const data = await fetchOrders();
    setOrders(data);
  };

  const handleCakeFormClose = () => {
    setShowCakeForm(false);
    setEditingCake(null);
  };

  const handleCakeAdded = () => {
    handleCakeFormClose();
    loadCakes();
  };

  const handleEditCake = (cake: Cake) => {
    setEditingCake(cake);
    setShowCakeForm(true);
  };

  const handleDeleteCake = async () => {
    await loadCakes();
  };

  const handleOrdersUpdated = () => {
    loadOrders();
  };

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage cakes, orders, and customers</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cakes">Cakes</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <DashboardOverview cakes={cakes} orders={orders} />
            </TabsContent>

            {/* Cakes Tab */}
            <TabsContent value="cakes">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Manage Cakes</h2>
                  <Button
                    onClick={() => {
                      setEditingCake(null);
                      setShowCakeForm(true);
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Cake
                  </Button>
                </div>

                {showCakeForm ? (
                  <CakeForm
                    cake={editingCake}
                    onClose={handleCakeFormClose}
                    onSuccess={handleCakeAdded}
                  />
                ) : (
                  <CakesTable
                    cakes={cakes}
                    loading={cakesLoading}
                    onEdit={handleEditCake}
                    onDelete={handleDeleteCake}
                  />
                )}
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Manage Orders</h2>
                </div>
                <OrdersTable
                  orders={orders}
                  loading={ordersLoading}
                  onOrdersUpdated={handleOrdersUpdated}
                />
              </div>
            </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Customers</h2>
                </div>
                <CustomersTable orders={orders} loading={ordersLoading} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
