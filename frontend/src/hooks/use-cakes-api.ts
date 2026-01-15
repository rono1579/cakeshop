import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { Cake } from '@/data/cakes';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useCakesApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = async () => {
    try {
      const auth = await import('firebase/auth').then(m => m.getAuth());
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');
      return await user.getIdToken();
    } catch (err) {
      throw new Error('Failed to get auth token');
    }
  };

  const fetchCakes = useCallback(async (): Promise<Cake[]> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cakes`);
      if (!response.ok) throw new Error('Failed to fetch cakes');
      const data = await response.json();
      setError(null);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch cakes';
      setError(message);
      toast({ variant: 'destructive', title: 'Error', description: message });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createCake = useCallback(
    async (cakeData: Omit<Cake, 'createdAt' | 'updatedAt' | '_id'>) => {
      try {
        setLoading(true);
        const token = await getAuthToken();

        const response = await fetch(`${API_URL}/cakes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cakeData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create cake');
        }

        const data = await response.json();
        toast({ title: 'Success', description: 'Cake created successfully' });
        setError(null);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create cake';
        setError(message);
        toast({ variant: 'destructive', title: 'Error', description: message });
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateCake = useCallback(
    async (cakeId: string, cakeData: Partial<Cake>) => {
      try {
        setLoading(true);
        const token = await getAuthToken();

        const response = await fetch(`${API_URL}/cakes/${cakeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cakeData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update cake');
        }

        const data = await response.json();
        toast({ title: 'Success', description: 'Cake updated successfully' });
        setError(null);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update cake';
        setError(message);
        toast({ variant: 'destructive', title: 'Error', description: message });
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCake = useCallback(async (cakeId: string) => {
    try {
      setLoading(true);
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/cakes/${cakeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete cake');
      }

      toast({ title: 'Success', description: 'Cake deleted successfully' });
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete cake';
      setError(message);
      toast({ variant: 'destructive', title: 'Error', description: message });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchCakes,
    createCake,
    updateCake,
    deleteCake,
  };
};
