import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Product } from '@shared/schema';
import { Monitor, Database, Layout as LayoutIcon, BarChart4, Users, Calendar, ChevronRight } from 'lucide-react';

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
      
      {/* Hero Section */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="font-poppins font-bold text-4xl md:text-5xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Products
            </motion.h1>
            <motion.p 
              className="font-manrope text-lg text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Powerful solutions to streamline your business operations and elevate your digital experience
            </motion.p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[float_10s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[float_8s_ease-in-out_infinite]"></div>
      </section>
      
      {/* Products Gallery */}
      <div className="container py-12 space-y-8 relative z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-center mb-10">
              <TabsList className="bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="all" className="px-4 py-2 rounded-md">All Products</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="px-4 py-2 rounded-md">{category}</TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <Card className="group overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary/10">
                          <CardHeader className="pb-0">
                            <div className="flex justify-between items-center mb-2">
                              <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                {categoryIcons[product.category] || categoryIcons.default}
                              </div>
                              <Badge variant="outline" className="bg-gray-50 group-hover:bg-secondary/20 transition-colors duration-300">
                                {product.category}
                              </Badge>
                            </div>
                            <CardTitle className="text-xl font-bold mt-4 group-hover:text-primary transition-colors duration-300">
                              {product.name}
                            </CardTitle>
                            <CardDescription className="text-base mt-2">{product.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="py-4 flex-grow">
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Key Features:</div>
                              <ul className="space-y-2">
                                {product.features.slice(0, 3).map((feature, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="mt-4 text-sm font-medium">
                              Price: <span className="text-primary font-bold">{product.price}</span>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0 flex gap-2">
                            <Button asChild variant="default" className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                              <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">Try Demo</a>
                            </Button>
                            <Button asChild variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors duration-300">
                              <Link href={`/products/${product.id}`}>Learn More</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* CTA Section */}
        <motion.div 
          className="text-center py-16 mt-16 bg-gray-50 rounded-2xl px-6 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl font-bold mb-4 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Need Custom Software Solutions?
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto mb-8 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            We can develop tailored solutions designed specifically for your business requirements.
            Contact us to discuss your needs and get started on your digital transformation journey.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <Button asChild size="lg" className="px-8 bg-primary hover:bg-primary/90 transition-all duration-300 hover:-translate-y-1">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-[float_6s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-[float_8s_ease-in-out_infinite]"></div>
        </motion.div>
      </div>
      
      <Footer />
    </>
  );
}