import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TagInput } from '@/components/ui/tag-input';
import { Product, insertProductSchema, InsertProduct } from '@shared/schema';
import { Loader2 } from 'lucide-react';

// Extend the schema with validation rules
const formSchema = insertProductSchema.extend({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.string().min(1, 'Price is required'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  demoUrl: z.string().url('Please enter a valid URL'),
  logo: z.string().url('Please enter a valid URL for the logo'),
});

interface ProductFormProps {
  product: Product | null;
  onSubmit: (data: InsertProduct) => void;
  isSubmitting: boolean;
}

export function ProductForm({ product, onSubmit, isSubmitting }: ProductFormProps) {
  const [screenshotInput, setScreenshotInput] = useState('');
  
  // Set default values
  const defaultValues: Partial<InsertProduct> = {
    name: '',
    description: '',
    category: '',
    features: [],
    price: '',
    screenshots: [],
    demoUrl: '',
    logo: '',
    featured: false,
  };

  // Initialize form with product data or default values
  const form = useForm<InsertProduct>({
    resolver: zodResolver(formSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      category: product.category,
      features: product.features,
      price: product.price,
      screenshots: product.screenshots,
      demoUrl: product.demoUrl,
      logo: product.logo,
      featured: product.featured,
    } : defaultValues,
  });

  const handleAddScreenshot = () => {
    if (screenshotInput.trim() && z.string().url().safeParse(screenshotInput).success) {
      const currentScreenshots = form.getValues().screenshots || [];
      form.setValue('screenshots', [...currentScreenshots, screenshotInput]);
      setScreenshotInput('');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
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
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CRM">CRM</SelectItem>
                    <SelectItem value="ERP">ERP</SelectItem>
                    <SelectItem value="CMS">CMS</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                    <SelectItem value="Automation">Automation</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
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
                  className="min-h-32" 
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
                  <Input placeholder="e.g. $99/mo, Contact for pricing" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="demoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Demo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
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
              <FormLabel>Features</FormLabel>
              <FormControl>
                <TagInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add feature and press Enter"
                />
              </FormControl>
              <FormDescription>
                Add key features of the product. Press Enter or click Add after each feature.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="screenshots"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screenshots</FormLabel>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter screenshot URL"
                  value={screenshotInput}
                  onChange={(e) => setScreenshotInput(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddScreenshot}
                >
                  Add
                </Button>
              </div>
              <div className="mt-2 space-y-2">
                {field.value?.map((url, index) => (
                  <div key={index} className="flex items-center p-2 bg-muted rounded-md">
                    <div className="truncate flex-grow">{url}</div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newScreenshots = [...field.value || []];
                        newScreenshots.splice(index, 1);
                        form.setValue('screenshots', newScreenshots);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {!field.value?.length && (
                  <div className="text-sm text-muted-foreground">No screenshots added yet.</div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Featured Product</FormLabel>
                <FormDescription>
                  Featured products are displayed prominently on the homepage.
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

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}