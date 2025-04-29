import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
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

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5
    }
  })
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = parseInt(id || '');
  
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !isNaN(productId),
  });
  
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container py-20 flex justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error || !product) {
    return (
      <>
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <div className="container py-8 relative mx-auto">
        {/* Back button */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button variant="ghost" size="sm" asChild className="gap-1 hover:bg-primary/5">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </motion.div>
        
        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12 relative">
          <motion.div 
            className="w-full lg:w-2/3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Product heading */}
            <motion.div 
              className="flex items-center gap-3 mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                {categoryIcons[product.category] || categoryIcons.default}
              </div>
              <Badge variant="outline" className="text-sm bg-gray-50">{product.category}</Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl font-bold mb-4 text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {product.name}
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {product.description}
            </motion.p>
            
            {/* Features section */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Key Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feature, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg hover:bg-primary/5 transition-colors"
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                  >
                    <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Screenshots section */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.screenshots.map((screenshot, i) => (
                  <motion.div 
                    key={i} 
                    className="overflow-hidden rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer"
                    whileHover={{ y: -5 }}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                  >
                    <img 
                      src={screenshot} 
                      alt={`${product.name} Screenshot ${i+1}`} 
                      className="w-full h-auto object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Sidebar */}
          <motion.div 
            className="w-full lg:w-1/3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="sticky top-24 shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-100">
              <CardContent className="pt-6">
                <div className="mb-6 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <img 
                      src={product.logo} 
                      alt={`${product.name} Logo`} 
                      className="w-24 h-24 object-contain mx-auto mb-4 rounded-lg border p-2"
                    />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                </div>
                
                <div className="border-t border-b py-6 my-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-600">Price:</span>
                    <span className="text-xl font-bold text-primary">{product.price}</span>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2">
                  <Button className="w-full bg-primary hover:bg-primary/90" size="lg" asChild>
                    <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                      Try Demo
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full hover:bg-gray-50 hover:border-primary hover:text-primary" asChild>
                    <Link href="/contact">
                      Request Info
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Related products */}
        <motion.div 
          className="pb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Other Products You Might Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* This would ideally be populated from a query for related products */}
            <motion.div 
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg transition-all duration-300 group border-2 border-transparent hover:border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {categoryIcons['ERP'] || categoryIcons.default}
                    </div>
                    <Badge variant="outline" className="group-hover:bg-secondary/20 transition-colors duration-300">ERP</Badge>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300">PixelERP</h3>
                  <p className="text-muted-foreground text-sm mb-4">Enterprise resource planning solution for creative businesses</p>
                  <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors duration-300" asChild>
                    <Link href="/products/2">View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg transition-all duration-300 group border-2 border-transparent hover:border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {categoryIcons['CMS'] || categoryIcons.default}
                    </div>
                    <Badge variant="outline" className="group-hover:bg-secondary/20 transition-colors duration-300">CMS</Badge>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300">PixelCMS</h3>
                  <p className="text-muted-foreground text-sm mb-4">Flexible content management system for designers and creators</p>
                  <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors duration-300" asChild>
                    <Link href="/products/3">View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg transition-all duration-300 group border-2 border-transparent hover:border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {categoryIcons['Analytics'] || categoryIcons.default}
                    </div>
                    <Badge variant="outline" className="group-hover:bg-secondary/20 transition-colors duration-300">Analytics</Badge>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300">PixelAnalytics</h3>
                  <p className="text-muted-foreground text-sm mb-4">Advanced analytics platform for measuring digital performance</p>
                  <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors duration-300" asChild>
                    <Link href="/products/4">View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[float_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[float_10s_ease-in-out_infinite]"></div>
      </div>
      <Footer />
    </>
  );
}