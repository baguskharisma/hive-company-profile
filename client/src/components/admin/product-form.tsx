import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { type Product, type InsertProduct, insertProductSchema } from '@shared/schema';
import { TagInput } from '@/components/ui/tag-input';

// Extends the schema to add validation
const extendedSchema = insertProductSchema.extend({
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  screenshots: z.array(z.string().url('Must be a valid URL')).min(1, 'At least one screenshot is required'),
  demoUrl: z.string().url('Must be a valid URL'),
  logo: z.string().url('Must be a valid URL'),
});

type ProductFormProps = {
  product: Product | null;
  onSubmit: (data: InsertProduct) => void;
  isSubmitting: boolean;
};

export function ProductForm({ product, onSubmit, isSubmitting }: ProductFormProps) {
  const form = useForm<InsertProduct>({
    resolver: zodResolver(extendedSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      features: product.features,
      screenshots: product.screenshots,
      demoUrl: product.demoUrl,
      logo: product.logo,
      featured: product.featured,
    } : {
      name: '',
      description: '',
      category: '',
      price: '',
      features: [],
      screenshots: [],
      demoUrl: '',
      logo: '',
      featured: false,
    },
  });

  return (
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
                  <Input placeholder="Product name" {...field} />
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
                  <Input placeholder="e.g. CRM, ERP, CMS" {...field} />
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
                <Textarea placeholder="Product description" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="e.g. $29/month per user" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features (press Enter after each feature)</FormLabel>
              <FormControl>
                <TagInput
                  placeholder="Add feature..."
                  tags={field.value || []}
                  onTagsChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="screenshots"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screenshots URLs (press Enter after each URL)</FormLabel>
              <FormControl>
                <TagInput
                  placeholder="Add screenshot URL..."
                  tags={field.value || []}
                  onTagsChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="demoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Demo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://demo.example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/logo.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Featured Product</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Featured products will be displayed prominently on the homepage.
                </div>
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
        
        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}