import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Service } from "@shared/schema";

export default function ProductsPage() {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  return (
    <>
      <Header />
      
      {/* Services Header */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="font-poppins font-bold text-4xl md:text-5xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Services
            </motion.h1>
            <motion.p 
              className="font-manrope text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We offer a comprehensive range of digital services to help your business thrive in the digital landscape.
            </motion.p>
          </div>
        </div>
      </section>
      
      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services?.map((service, index) => (
                <motion.div 
                  key={service.id}
                  className="bg-white rounded-xl shadow-md p-8 card-hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <i className={`fas fa-${service.icon} text-primary text-2xl`}></i>
                  </div>
                  <h3 className="font-poppins font-bold text-2xl mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="text-primary mr-2 h-5 w-5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="#contact">
                    <a className="inline-flex items-center font-medium text-primary hover:underline">
                      Learn More
                      <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={16} />
                    </a>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-heading text-4xl md:text-5xl mb-4">Our Process</h2>
            <p className="font-manrope text-lg text-gray-600 max-w-2xl mx-auto">
              We follow a proven methodology to ensure your project is delivered on time, on budget, and exceeds your expectations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                number: "01",
                title: "Discovery",
                description: "We start by understanding your business goals, target audience, and project requirements.",
                delay: 0
              },
              {
                number: "02",
                title: "Strategy",
                description: "We develop a comprehensive strategy that outlines the roadmap for your project.",
                delay: 0.1
              },
              {
                number: "03",
                title: "Design & Development",
                description: "Our team creates beautiful designs and builds functional, scalable solutions.",
                delay: 0.2
              },
              {
                number: "04",
                title: "Launch & Support",
                description: "We ensure a smooth launch and provide ongoing support to optimize performance.",
                delay: 0.3
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl p-8 card-hover relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: step.delay }}
                viewport={{ once: true }}
              >
                <div className="absolute -top-6 -left-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white font-poppins font-bold">
                  {step.number}
                </div>
                <h3 className="font-poppins font-bold text-2xl mb-4 mt-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-heading text-4xl md:text-5xl mb-4">What Our Clients Say</h2>
            <p className="font-manrope text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say about working with us.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Working with Pixel Perfect was a game-changer for our business. They delivered a website that not only looks beautiful but also converts visitors into customers.",
                author: "Sarah Johnson",
                position: "CEO, Fashion Brand",
                delay: 0
              },
              {
                quote: "The team at Pixel Perfect went above and beyond to understand our business needs and deliver a solution that exceeded our expectations.",
                author: "Michael Chen",
                position: "CTO, FinTech Startup",
                delay: 0.1
              },
              {
                quote: "Our mobile app developed by Pixel Perfect has received rave reviews from our users. Their attention to detail and focus on user experience made all the difference.",
                author: "Emily Rodriguez",
                position: "Marketing Director, Health Tech",
                delay: 0.2
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-background rounded-xl p-8 shadow-sm border border-gray-100 card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: testimonial.delay }}
                viewport={{ once: true }}
              >
                <div className="mb-6 text-4xl text-primary">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p className="text-gray-600 mb-6 italic">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl mr-4">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-poppins font-bold">{testimonial.author}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
              Ready to start your project?
            </motion.h2>
            <motion.p 
              className="font-manrope text-lg text-white/80 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Let's collaborate to create a digital solution that will help your business grow and succeed.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="#contact">
                <Button size="lg" className="bg-white text-primary font-poppins font-medium px-8 py-3 rounded-lg transition-all hover:-translate-y-1 hover:bg-secondary">
                  Contact Us Now
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
