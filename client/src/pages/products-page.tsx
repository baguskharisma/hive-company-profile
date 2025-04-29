import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Product } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/layout/page-header';

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Extract unique categories
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  // Filter products by category if activeCategory is set
  const filteredProducts = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Our Products"
        description="Explore our suite of powerful digital solutions designed to help your business grow."
      />

      <Tabs defaultValue="all" className="w-full my-8">
        <TabsList className="mb-8">
          <TabsTrigger value="all" onClick={() => setActiveCategory(null)}>
            All
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory || 'all'} className="mt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="spinner"></div>
              <p className="mt-4 text-gray-500">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading products</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col border-2 hover:border-primary transition-all duration-300 overflow-hidden group">
        <div className="overflow-hidden h-48">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-xl">{product.name}</CardTitle>
            {product.isPopular && (
              <Badge className="bg-primary text-white">Popular</Badge>
            )}
          </div>
          <CardDescription className="text-sm">{product.category}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-700 dark:text-gray-300 mb-4">{product.description}</p>
          <div>
            <h4 className="font-semibold mb-2">Key Features:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {product.features.slice(0, 5).map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
              {product.features.length > 5 && (
                <li className="list-none text-primary font-medium">+ {product.features.length - 5} more features</li>
              )}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-4 border-t">
          <p className="font-bold text-primary">{product.price}</p>
          <Button variant="outline" className="group-hover:bg-primary group-hover:text-white transition-all duration-300">
            Learn More
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}