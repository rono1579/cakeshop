import { useCallback, useState } from 'react';
import { useToast } from './use-toast';

const API_BASE_URL = 'http://localhost:3000/api';

export const useOrdersApi = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/orders`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateOrderStatus = useCallback(
    async (orderNumber: string, orderStatus?: string, paymentStatus?: string) => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/orders/${orderNumber}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...(orderStatus && { orderStatus }),
            ...(paymentStatus && { paymentStatus }),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update order');
        }

        const result = await response.json();
        toast({
          title: 'Success',
          description: 'Order updated successfully',
        });
        return result.data;
      } catch (error) {
        console.error('Error updating order:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to update order',
          variant: 'destructive',
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const fetchOrderByNumber = useCallback(
    async (orderNumber: string) => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/orders/${orderNumber}`);

        if (!response.ok) {
          throw new Error('Order not found');
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error('Error fetching order:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to fetch order',
          variant: 'destructive',
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return {
    fetchOrders,
    updateOrderStatus,
    fetchOrderByNumber,
    loading,
  };
};
