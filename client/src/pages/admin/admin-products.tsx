import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/admin/admin-layout';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Product, InsertProduct } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { ProductForm } from '@/components/admin/product-form';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function AdminProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // State for managing product creation and editing
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  // Add product mutation
  const addMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const res = await apiRequest('POST', '/api/products', data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create product');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Product created',
        description: 'The product has been created successfully',
      });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertProduct> }) => {
      const res = await apiRequest('PUT', `/api/products/${id}`, data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update product');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Product updated',
        description: 'The product has been updated successfully',
      });
      setIsDialogOpen(false);
      setCurrentProduct(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/products/${id}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete product');
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Product deleted',
        description: 'The product has been deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Handle form submission
  const handleSubmit = (data: InsertProduct) => {
    if (currentProduct) {
      updateMutation.mutate({ id: currentProduct.id, data });
    } else {
      addMutation.mutate(data);
    }
  };
  
  // Table columns definition
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.category}</Badge>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
    },
    {
      accessorKey: 'featured',
      header: 'Featured',
      cell: ({ row }) => (
        <div>
          {row.original.featured ? (
            <Badge variant="default">Featured</Badge>
          ) : (
            <Badge variant="outline">No</Badge>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setCurrentProduct(row.original);
              setIsDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setProductToDelete(row.original);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  
  // If user is not authenticated or not an admin, show a message
  if (!user || !user.isAdmin) {
    return (
      <AdminLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p>You do not have permission to access this page.</p>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Products Management</h1>
          <Button onClick={() => {
            setCurrentProduct(null);
            setIsDialogOpen(true);
          }}>
            Add New Product
          </Button>
        </div>
        
        {/* Products Table */}
        <DataTable
          columns={columns}
          data={products}
          isLoading={isLoading}
          searchColumn="name"
        />
        
        {/* Add/Edit Product Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{currentProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={currentProduct}
              onSubmit={handleSubmit}
              isSubmitting={addMutation.isPending || updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the product "{productToDelete?.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => productToDelete && deleteMutation.mutate(productToDelete.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}