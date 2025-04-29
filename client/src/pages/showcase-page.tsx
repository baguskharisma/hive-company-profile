import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Project } from "@shared/schema";

export default function ShowcasePage() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });
  
  // Get unique categories
  const categories = projects ? 
    ["All", ...new Set(projects.map(project => project.category))] : 
    ["All"];
  
  // Filter projects by category
  const filteredProjects = projects ? 
    (activeCategory && activeCategory !== "All" ? 
      projects.filter(project => project.category === activeCategory) : 
      projects) : 
    [];
  
  return (
    <>
      <Header />
      
      {/* Showcase Header */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="font-poppins font-bold text-4xl md:text-5xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Work
            </motion.h1>
            <motion.p 
              className="font-manrope text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explore our portfolio of award-winning projects that have helped our clients achieve their goals.
            </motion.p>
          </div>
        </div>
      </section>
      
      {/* Projects Gallery */}
      <section className="py-12 bg-white">
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
          
          {/* Projects Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategory || 'all'}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredProjects.map((project, index) => (
                  <motion.div 
                    key={project.id}
                    className="group relative overflow-hidden rounded-xl shadow-lg hover:-translate-y-2 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    onClick={() => setLocation(`/showcase/${project.id}`)}
                  >
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-80 object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                      <span className="text-secondary font-medium mb-2">{project.category}</span>
                      <h3 className="text-white text-2xl font-poppins font-bold mb-1">{project.title}</h3>
                      <p className="text-gray-300 mb-4">{project.description}</p>
                      <button className="inline-flex items-center font-medium text-white">
                        View Case Study
                        <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2 
              className="font-poppins font-bold text-4xl md:text-5xl text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Have a project in mind?
            </motion.h2>
            <motion.p 
              className="font-manrope text-lg text-white/80 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Let's discuss how we can help you achieve your goals with a custom digital solution.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="#contact">
                <button className="bg-white text-primary font-poppins font-medium px-8 py-3 rounded-lg transition-all hover:-translate-y-1 hover:bg-secondary">
                  Start a Project
                </button>
              </Link>
              <Link href="/products">
                <button className="bg-transparent border-2 border-white text-white font-poppins font-medium px-8 py-3 rounded-lg transition-all hover:bg-white/10">
                  Explore Our Services
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[float_8s_ease-in-out_infinite]"></div>
      </section>
      
      <Footer />
    </>
  );
}
