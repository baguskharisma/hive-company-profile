import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/admin/admin-layout';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Product, InsertProduct } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { ProductForm } from '@/components/admin/product-form';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Package2, Layers } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Define column type compatible with our DataTable
type Column<T> = {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5
    }
  })
};

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
  const columns = [
    {
      accessorKey: 'name' as keyof Product,
      header: 'Name',
      cell: (item: Product) => (
        <div className="font-medium">{item.name}</div>
      ),
    },
    {
      accessorKey: 'category' as keyof Product,
      header: 'Category',
      cell: (item: Product) => (
        <Badge variant="outline" className="bg-gray-50">{item.category}</Badge>
      ),
    },
    {
      accessorKey: 'price' as keyof Product,
      header: 'Price',
      cell: (item: Product) => (
        <div className="font-medium text-primary">{item.price}</div>
      ),
    },
    {
      accessorKey: 'featured' as keyof Product,
      header: 'Featured',
      cell: (item: Product) => (
        <div>
          {item.featured ? (
            <Badge variant="default" className="bg-primary text-white">Featured</Badge>
          ) : (
            <Badge variant="outline" className="text-gray-500">No</Badge>
          )}
        </div>
      ),
    },
  ];
  
  // Define actions for each row
  const actions = (item: Product) => (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-primary/10 hover:text-primary transition-colors"
        onClick={() => {
          setCurrentProduct(item);
          setIsDialogOpen(true);
        }}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-destructive/10 hover:text-destructive transition-colors"
        onClick={() => {
          setProductToDelete(item);
          setIsDeleteDialogOpen(true);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
  
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
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package2 className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold">Products Management</h1>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => {
                setCurrentProduct(null);
                setIsDialogOpen(true);
              }}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus size={16} />
              Add New Product
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <h3 className="text-2xl font-bold mt-1">{products.length}</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-lg">
                <Layers className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <h3 className="text-2xl font-bold mt-1">{new Set(products.map(p => p.category)).size}</h3>
              </div>
              <div className="bg-secondary/10 p-2 rounded-lg">
                <Layers className="h-5 w-5 text-secondary" />
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Featured Products</p>
                <h3 className="text-2xl font-bold mt-1">{products.filter(p => p.featured).length}</h3>
              </div>
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Layers className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden"
        >
          <DataTable
            columns={columns}
            data={products}
            isLoading={isLoading}
            searchColumn="name"
            actions={actions}
          />
        </motion.div>
        
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