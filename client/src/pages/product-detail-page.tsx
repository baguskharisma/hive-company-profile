import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@shared/schema';
import { Monitor, Database, Layout as LayoutIcon, BarChart4, Users, Calendar, ArrowLeft, ChevronRight } from 'lucide-react';

// Map product category to icon
const categoryIcons: Record<string, React.ReactNode> = {
  'CRM': <Users className="h-6 w-6" />,
  'ERP': <Database className="h-6 w-6" />,
  'CMS': <LayoutIcon className="h-6 w-6" />,
  'Analytics': <BarChart4 className="h-6 w-6" />,
  'Project Management': <Calendar className="h-6 w-6" />,
  'HR': <Users className="h-6 w-6" />,
  'default': <Monitor className="h-6 w-6" />
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = parseInt(id);
  
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !isNaN(productId),
  });
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20 flex justify-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
        </div>
      </Layout>
    );
  }
  
  if (error || !product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="w-full lg:w-2/3">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                {categoryIcons[product.category] || categoryIcons.default}
              </div>
              <Badge variant="outline" className="text-sm">{product.category}</Badge>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg text-muted-foreground mb-8">{product.description}</p>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.screenshots.map((screenshot, i) => (
                  <div key={i} className="overflow-hidden rounded-lg shadow-sm border">
                    <img 
                      src={screenshot} 
                      alt={`${product.name} Screenshot ${i+1}`} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-center">
                  <img 
                    src={product.logo} 
                    alt={`${product.name} Logo`} 
                    className="w-24 h-24 object-contain mx-auto mb-4 rounded-lg border p-2"
                  />
                  <h3 className="text-xl font-bold">{product.name}</h3>
                </div>
                
                <div className="border-t border-b py-4 my-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Price:</span>
                    <span className="text-lg font-semibold">{product.price}</span>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2">
                  <Button className="w-full" size="lg" asChild>
                    <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                      Try Demo
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact">
                      Request Info
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="pb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Other Products You Might Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* This would ideally be populated from a query for related products */}
            <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {categoryIcons['ERP'] || categoryIcons.default}
                  </div>
                  <Badge variant="outline">ERP</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">PixelERP</h3>
                <p className="text-muted-foreground text-sm mb-4">Enterprise resource planning solution for creative businesses</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products/2">View Details</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {categoryIcons['CMS'] || categoryIcons.default}
                  </div>
                  <Badge variant="outline">CMS</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">PixelCMS</h3>
                <p className="text-muted-foreground text-sm mb-4">Flexible content management system for designers and creators</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products/3">View Details</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {categoryIcons['Analytics'] || categoryIcons.default}
                  </div>
                  <Badge variant="outline">Analytics</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">PixelAnalytics</h3>
                <p className="text-muted-foreground text-sm mb-4">Advanced analytics platform for measuring digital performance</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products/4">View Details</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}