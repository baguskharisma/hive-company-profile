import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Product } from '@shared/schema';
import { Monitor, Database, Layout as LayoutIcon, BarChart4, Users, Calendar } from 'lucide-react';

// Map product category to icon
const categoryIcons: Record<string, React.ReactNode> = {
  'CRM': <Users className="h-5 w-5" />,
  'ERP': <Database className="h-5 w-5" />,
  'CMS': <LayoutIcon className="h-5 w-5" />,
  'Analytics': <BarChart4 className="h-5 w-5" />,
  'Project Management': <Calendar className="h-5 w-5" />,
  'HR': <Users className="h-5 w-5" />,
  'default': <Monitor className="h-5 w-5" />
};

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Extract unique categories for tabs
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Filter products based on active tab
  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(product => product.category === activeTab);

  return (
    <>
      <Header />
      
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful solutions to streamline your business operations
          </p>
        </div>
      </section>
      
      <div className="container py-12 space-y-8">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="all">All Products</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {categoryIcons[product.category] || categoryIcons.default}
                        </div>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <CardTitle className="text-xl font-bold mt-4">{product.name}</CardTitle>
                      <CardDescription className="text-base mt-2">{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="py-4 flex-grow">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Key Features:</div>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {product.features.slice(0, 3).map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 text-sm font-medium">Price: <span className="text-muted-foreground">{product.price}</span></div>
                    </CardContent>
                    <CardFooter className="pt-0 flex gap-2">
                      <Button asChild variant="default" className="w-full">
                        <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">Try Demo</a>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/products/${product.id}`}>Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="text-center pt-8">
          <h2 className="text-2xl font-bold mb-2">Need Custom Software Solutions?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            We can develop tailored solutions designed specifically for your business requirements.
            Contact us to discuss your needs.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
      
      <Footer />
    </>
  );
}