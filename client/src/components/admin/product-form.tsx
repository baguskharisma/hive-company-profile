import { useState } from 'react';
import { z } from 'zod';
import { insertProductSchema } from '@shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

// Extend the schema with frontend validations
const productFormSchema = insertProductSchema.extend({
  features: z.array(z.string()).min(1, "Add at least one feature"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: ProductFormValues & { id: number };
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [featureInput, setFeatureInput] = useState('');

  // Default values for the form
  const defaultValues: Partial<ProductFormValues> = {
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    price: product?.price || '',
    features: product?.features || [],
    imageUrl: product?.imageUrl || '',
    isPopular: product?.isPopular || false,
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const res = await apiRequest(
        'POST',
        '/api/products',
        data
      );
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Product created',
        description: 'The product has been created successfully.',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: 'Failed to create product',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const res = await apiRequest(
        'PUT',
        `/api/products/${product?.id}`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Product updated',
        description: 'The product has been updated successfully.',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: 'Failed to update product',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  function onSubmit(data: ProductFormValues) {
    if (product?.id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  }

  function addFeature() {
    if (!featureInput.trim()) return;
    
    const currentFeatures = form.getValues('features') || [];
    form.setValue('features', [...currentFeatures, featureInput.trim()], { shouldValidate: true });
    setFeatureInput('');
  }

  function removeFeature(index: number) {
    const currentFeatures = form.getValues('features') || [];
    form.setValue(
      'features',
      currentFeatures.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{product?.id ? 'Edit' : 'Create'} Product</CardTitle>
        <CardDescription>
          {product?.id
            ? 'Update the information for this product'
            : 'Add a new product to your catalog'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., From $29/month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isPopular"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Mark as Popular
                    </FormLabel>
                    <FormDescription>
                      Popular products will be showcased in the Popular Products section
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features</FormLabel>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Input
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          placeholder="Add a feature"
                        />
                        <Button
                          type="button"
                          onClick={addFeature}
                          className="shrink-0"
                        >
                          Add
                        </Button>
                      </div>
                      <FormMessage />
                      <div className="mt-2">
                        {field.value.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2"
                          >
                            <span>{feature}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFeature(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product?.id ? 'Update Product' : 'Create Product'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}