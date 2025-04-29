import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Project } from "@shared/schema";

export default function HomePage() {
  const { data: featuredProjects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects/featured"],
  });

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32 md:pt-24 md:pb-40 bg-background">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <motion.h1 
                className="font-poppins font-bold text-4xl md:text-6xl leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                We craft <span className="text-primary">digital</span> experiences that <span className="relative">matter
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-secondary -z-10 opacity-50"></span>
                </span>
              </motion.h1>
              <motion.p 
                className="font-manrope text-lg md:text-xl text-gray-700 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                A forward-thinking creative agency building beautiful, functional
                digital products and experiences that help brands stand out.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link href="/showcase">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-manrope font-medium px-8 py-3 rounded-lg transition-all hover:-translate-y-1">
                    See our work
                  </Button>
                </Link>
                <Link href="#contact">
                  <Button variant="outline" size="lg" className="font-manrope font-medium px-8 py-3 rounded-lg transition-all">
                    Get in touch
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div 
              className="order-1 md:order-2 relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full rotate-[60deg] scale-110 -z-10 opacity-70"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop" 
                alt="Creative team collaboration" 
                className="rounded-xl shadow-xl animate-[float_6s_ease-in-out_infinite]"
              />
              <motion.div 
                className="absolute -bottom-10 -left-8 bg-white p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="font-manrope font-medium">98% Client satisfaction</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="mt-24 md:mt-32">
            <p className="text-center font-manrope text-gray-500 mb-8">Trusted by industry leaders</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center">
              {["COMPANY", "BRAND", "AGENCY", "STUDIO", "GLOBAL"].map((name, i) => (
                <motion.div 
                  key={i} 
                  className="flex justify-center grayscale hover:grayscale-0 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                >
                  <div className="text-3xl font-bold text-gray-300 hover:text-gray-500">{name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-20 w-64 h-64 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[float_8s_ease-in-out_infinite]"></div>
      </section>
      
      {/* Featured Projects Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-heading text-4xl md:text-5xl mb-4 font-poppins font-bold">Featured Projects</h2>
            <p className="font-manrope text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our latest work that showcases our creativity and expertise in delivering exceptional digital solutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {projectsLoading ? (
              <div className="col-span-3 flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              featuredProjects?.map((project, index) => (
                <motion.div 
                  key={project.id}
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:-translate-y-2 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
                    <Link href={`/showcase/${project.id}`}>
                      <a className="inline-flex items-center font-medium text-white">
                        View Case Study
                        <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={16} />
                      </a>
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/showcase">
              <Button variant="outline" className="inline-flex items-center px-8 py-3 border-2 border-gray-200 hover:border-primary text-primary">
                View All Projects
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
          </div>
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
              Ready to bring your ideas to life?
            </motion.h2>
            <motion.p 
              className="font-manrope text-lg text-white/80 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Let's work together to create exceptional digital experiences that help your business grow.
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
                  Get in Touch
                </Button>
              </Link>
              <Link href="/showcase">
                <Button variant="outline" size="lg" className="bg-transparent border-2 border-white text-white font-poppins font-medium px-8 py-3 rounded-lg transition-all hover:bg-white/10">
                  View Our Work
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[float_8s_ease-in-out_infinite]"></div>
      </section>
      
      {/* Services Preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-heading text-4xl md:text-5xl mb-4 font-poppins font-bold">Our Services</h2>
            <p className="font-manrope text-lg text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive range of digital services to help your business thrive in the digital landscape.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "laptop-code",
                title: "Web Development",
                description: "Custom websites and web applications built with cutting-edge technologies."
              },
              {
                icon: "mobile-alt",
                title: "Mobile App Development",
                description: "Native and cross-platform mobile applications for seamless experiences."
              },
              {
                icon: "paint-brush",
                title: "UI/UX Design",
                description: "User-centered design solutions that create intuitive digital experiences."
              }
            ].map((service, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl shadow-md p-8 hover:-translate-y-2 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <i className={`fas fa-${service.icon} text-primary text-2xl`}></i>
                </div>
                <h3 className="font-poppins font-bold text-2xl mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <Link href="/products">
                  <a className="inline-flex items-center font-medium text-primary hover:underline">
                    Learn More
                    <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={16} />
                  </a>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/products">
              <Button variant="outline" className="inline-flex items-center px-8 py-3 border-2 border-gray-200 hover:border-primary text-primary">
                View All Services
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="section-heading text-4xl md:text-5xl mb-6 font-poppins font-bold">Why Choose Us</h2>
              <p className="font-manrope text-lg text-gray-600 mb-8">
                We combine creativity, technical expertise, and strategic thinking to deliver exceptional digital solutions that drive results for our clients.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Experienced Team",
                    description: "Our team of experts has years of experience creating successful digital products."
                  },
                  {
                    title: "Tailored Solutions",
                    description: "We create custom solutions based on your unique business needs and objectives."
                  },
                  {
                    title: "Collaborative Approach",
                    description: "We work closely with you throughout the process to ensure your vision is realized."
                  },
                  {
                    title: "Ongoing Support",
                    description: "We provide continuous support and optimization after launch to ensure long-term success."
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-poppins font-bold text-xl mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1558403194-611308249627?w=800&auto=format&fit=crop" 
                  alt="Creative agency workspace" 
                  className="rounded-xl shadow-xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-secondary p-4 rounded-lg shadow-lg">
                  <p className="font-poppins font-bold text-2xl">10+</p>
                  <p className="font-manrope text-sm">Years Experience</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}
