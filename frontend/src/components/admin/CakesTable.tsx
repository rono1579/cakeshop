import { useState } from 'react';
import { Cake } from '@/data/cakes';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Star } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCakesApi } from '@/hooks/use-cakes-api';

interface CakesTableProps {
  cakes: Cake[];
  loading: boolean;
  onEdit: (cake: Cake) => void;
  onDelete: () => void;
}

const CakesTable = ({ cakes, loading, onEdit, onDelete }: CakesTableProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { deleteCake } = useCakesApi();

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    await deleteCake(deleteId);
    setDeleting(false);
    setDeleteId(null);
    onDelete();
  };

  if (loading && cakes.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p>Loading cakes...</p>
        </div>
      </div>
    );
  }

  if (cakes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No cakes found</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cake-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Bestseller</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cakes.map((cake) => (
              <tr key={cake.id} className="border-b hover:bg-cake-50/50 transition">
                <td className="px-6 py-3">
                  <img
                    src={cake.image}
                    alt={cake.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                </td>
                <td className="px-6 py-3">
                  <div>
                    <p className="font-medium">{cake.name}</p>
                    <p className="text-xs text-muted-foreground">{cake.id}</p>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <p className="font-medium">Ksh {cake.price.toLocaleString()}</p>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(cake.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm">
                      {cake.rating.toFixed(1)} ({cake.reviews})
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      cake.bestseller
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {cake.bestseller ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(cake)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteId(cake.id)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Cake</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this cake? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CakesTable;
