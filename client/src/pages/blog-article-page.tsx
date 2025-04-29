import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { Calendar, Tag, ArrowLeft, Twitter, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { BlogArticle } from "@shared/schema";

export default function BlogArticlePage() {
  const { id } = useParams();
  const articleId = parseInt(id);
  
  const { data: article, isLoading, isError } = useQuery<BlogArticle>({
    queryKey: [`/api/blog/${articleId}`],
    enabled: !isNaN(articleId),
  });
  
  const { data: relatedArticles } = useQuery<BlogArticle[]>({
    queryKey: ["/api/blog"],
    select: (data) => data.filter(a => a.id !== articleId).slice(0, 3),
    enabled: !isNaN(articleId),
  });
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (isError || !article) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
                <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
                <Link href="/blog">
                  <Button className="bg-primary text-white">Back to Blog</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      {/* Article Header */}
      <section 
        className="py-20 bg-background"
        style={{
          backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.9), rgba(248, 250, 252, 0.9)), url(${article.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/blog">
              <Button variant="outline" className="mb-6 flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Button>
            </Link>
            
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium inline-flex items-center mb-4">
              <Tag className="h-3 w-3 mr-1" /> {article.category}
            </span>
            
            <h1 className="font-poppins font-bold text-4xl md:text-5xl mb-6">{article.title}</h1>
            
            <div className="flex items-center justify-center mb-8">
              <img 
                src={article.authorImageUrl} 
                alt={article.authorName} 
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="text-left">
                <p className="font-medium">{article.authorName}</p>
                <p className="text-gray-500 text-sm flex items-center">
                  <Calendar className="h-3 w-3 mr-1" /> 
                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-auto rounded-xl"
              />
            </motion.div>
            
            <motion.div 
              className="prose prose-lg max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            
            {/* Social Share */}
            <motion.div 
              className="border-t border-b border-gray-200 py-6 my-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">Share this article:</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>
            
            {/* Author Bio */}
            <motion.div 
              className="bg-background rounded-xl p-6 flex items-center my-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <img 
                src={article.authorImageUrl} 
                alt={article.authorName} 
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 className="font-poppins font-bold text-xl mb-2">About {article.authorName}</h3>
                <p className="text-gray-600">
                  {article.authorName} is a seasoned writer with expertise in {article.category.toLowerCase()} and digital trends.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-poppins font-bold text-3xl mb-8">Related Articles</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {relatedArticles.map((relatedArticle, index) => (
                  <motion.div 
                    key={relatedArticle.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md card-hover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <img 
                      src={relatedArticle.imageUrl} 
                      alt={relatedArticle.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                          {relatedArticle.category}
                        </span>
                      </div>
                      <h3 className="font-poppins font-bold text-xl mb-3">{relatedArticle.title}</h3>
                      <p className="text-gray-600 mb-4">{relatedArticle.excerpt}</p>
                      <Link href={`/blog/${relatedArticle.id}`}>
                        <Button variant="link" className="text-primary hover:underline font-medium p-0">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </>
  );
}
