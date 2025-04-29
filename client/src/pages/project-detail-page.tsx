import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, User, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Project } from "@shared/schema";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const projectId = parseInt(id);
  
  const { data: project, isLoading, isError } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !isNaN(projectId),
  });
  
  const { data: relatedProjects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    select: (data) => data.filter(p => p.id !== projectId).slice(0, 3),
    enabled: !isNaN(projectId),
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
  
  if (isError || !project) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
                <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
                <Link href="/showcase">
                  <Button className="bg-primary text-white">Back to Showcase</Button>
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
      
      {/* Project Header */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/showcase">
              <Button variant="outline" className="mb-6 flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Showcase
              </Button>
            </Link>
            
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium inline-flex items-center mb-4">
              <Tag className="h-3 w-3 mr-1" /> {project.category}
            </span>
            
            <h1 className="font-poppins font-bold text-4xl md:text-5xl mb-6">{project.title}</h1>
            
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-600">Client: {project.client}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-600">
                  Date: {new Date(project.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Project Image */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </motion.div>
        </div>
      </section>
      
      {/* Project Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <motion.div 
                className="md:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="font-poppins font-bold text-3xl mb-6">Project Overview</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="mb-6">{project.description}</p>
                  <p>
                    Working closely with {project.client}, our team delivered a comprehensive {project.category.toLowerCase()} solution 
                    that addressed their specific business needs and exceeded their expectations. The project involved extensive research, 
                    strategic planning, and creative execution to ensure optimal results.
                  </p>
                  
                  <h3 className="font-poppins font-bold text-2xl mt-8 mb-4">The Challenge</h3>
                  <p>
                    {project.client} came to us with the challenge of {project.category === "Web Design" 
                      ? "creating a modern, user-friendly website that would effectively showcase their products and services while providing an excellent user experience." 
                      : project.category === "Mobile Apps" 
                      ? "developing an intuitive mobile application that would streamline their operations and enhance customer engagement." 
                      : "refreshing their brand identity to better reflect their company values and appeal to their target audience."}
                  </p>
                  
                  <h3 className="font-poppins font-bold text-2xl mt-8 mb-4">Our Approach</h3>
                  <p>
                    We started with a thorough discovery phase to understand the client's objectives, target audience, and competitive landscape. 
                    Based on these insights, we developed a strategic plan that outlined the key elements of the project and established clear metrics for success.
                  </p>
                  <p>
                    Our team of experts then worked collaboratively to implement the solution, ensuring that every aspect of the project was executed with precision and creativity.
                  </p>
                  
                  <h3 className="font-poppins font-bold text-2xl mt-8 mb-4">The Results</h3>
                  <p>
                    The completed project has delivered significant value to {project.client}, including:
                  </p>
                  <ul>
                    <li>Increased engagement and conversion rates</li>
                    <li>Enhanced brand visibility and recognition</li>
                    <li>Improved user experience and satisfaction</li>
                    <li>Streamlined operations and processes</li>
                  </ul>
                </div>
              </motion.div>
              
              <motion.div 
                className="md:col-span-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="bg-background rounded-xl p-6 sticky top-24">
                  <h3 className="font-poppins font-bold text-xl mb-6">Project Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm">Category</p>
                      <p className="font-medium">{project.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Client</p>
                      <p className="font-medium">{project.client}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Date</p>
                      <p className="font-medium">
                        {new Date(project.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Services</p>
                      <p className="font-medium">
                        {project.category === "Web Design" 
                          ? "UI/UX Design, Web Development, SEO" 
                          : project.category === "Mobile Apps" 
                          ? "Mobile App Design, iOS & Android Development" 
                          : "Logo Design, Brand Guidelines, Messaging"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center">
                      View Live Project <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Projects */}
      {relatedProjects && relatedProjects.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-poppins font-bold text-3xl mb-8">Similar Projects</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {relatedProjects.map((relatedProject, index) => (
                  <motion.div 
                    key={relatedProject.id}
                    className="group relative overflow-hidden rounded-xl shadow-lg card-hover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <img 
                      src={relatedProject.imageUrl} 
                      alt={relatedProject.title} 
                      className="w-full h-64 object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                      <span className="text-secondary font-medium mb-2">{relatedProject.category}</span>
                      <h3 className="text-white text-xl font-poppins font-bold mb-1">{relatedProject.title}</h3>
                      <p className="text-gray-300 mb-4">{relatedProject.description}</p>
                      <Link href={`/showcase/${relatedProject.id}`}>
                        <a className="inline-flex items-center font-medium text-white">
                          View Case Study
                          <ArrowLeft className="ml-2 rotate-180 group-hover:translate-x-1 transition-transform" size={16} />
                        </a>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
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
              Ready to start your own project?
            </motion.h2>
            <motion.p 
              className="font-manrope text-lg text-white/80 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Let's discuss how we can help you achieve similar results for your business.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="#contact">
                <Button size="lg" className="bg-white text-primary font-poppins font-medium px-8 py-3 rounded-lg transition-all hover:-translate-y-1 hover:bg-secondary">
                  Start a Project
                </Button>
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
