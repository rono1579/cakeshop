import { useEffect, useState, useCallback } from 'react';
import { Cake, cakes as staticCakes } from '@/data/cakes';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useCakes = () => {
  const [cakes, setCakes] = useState<Cake[]>(staticCakes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCakes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/cakes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('Failed to fetch cakes from API, falling back to static data');
        setCakes(staticCakes);
        return;
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setCakes(data);
      } else {
        setCakes(staticCakes);
      }
    } catch (err) {
      console.warn('Error fetching cakes from API, falling back to static data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cakes');
      setCakes(staticCakes);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCakes();
  }, [fetchCakes]);

  return { cakes, loading, error, refetch: fetchCakes };
};
