import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { BlogArticle } from "@shared/schema";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const { data: articles, isLoading } = useQuery<BlogArticle[]>({
    queryKey: ["/api/blog"],
  });
  
  // Get unique categories
  const categories = articles ? 
    ["All", ...new Set(articles.map(article => article.category))] : 
    ["All"];
  
  // Filter articles by category
  const filteredArticles = articles ? 
    (activeCategory && activeCategory !== "All" ? 
      articles.filter(article => article.category === activeCategory) : 
      articles) : 
    [];

  return (
    <>
      <Header />
      
      {/* Blog Header */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="font-poppins font-bold text-4xl md:text-5xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Blog
            </motion.h1>
            <motion.p 
              className="font-manrope text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Insights, tips, and news from our team of experts to help you stay ahead in the digital landscape.
            </motion.p>
          </div>
        </div>
      </section>
      
      {/* Blog Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex justify-center mb-12">
            <motion.div 
              className="inline-flex flex-wrap justify-center gap-4 bg-gray-100 p-2 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {categories.map((category) => (
                <button 
                  key={category}
                  className={`px-5 py-2 rounded-md font-medium transition-all hover:bg-white hover:shadow-md ${
                    (activeCategory === category) || (!activeCategory && category === "All") ? 
                    'bg-primary text-white' : ''
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>
          
          {/* Articles Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <motion.div 
                  key={article.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md card-hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Tag className="h-3 w-3 mr-1" /> {article.category}
                      </span>
                      <span className="text-gray-500 text-sm ml-3 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" /> 
                        {new Date(article.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="font-poppins font-bold text-xl mb-3">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={article.authorImageUrl} 
                          alt={article.authorName} 
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-sm font-medium">{article.authorName}</span>
                      </div>
                      <Link href={`/blog/${article.id}`}>
                        <Button variant="link" className="text-primary hover:underline font-medium">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {filteredArticles.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found for this category.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-8">
              <h2 className="font-poppins font-bold text-3xl mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-gray-600">
                Stay updated with the latest insights and trends in the digital world.
              </p>
            </div>
            
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-medium px-6">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}
