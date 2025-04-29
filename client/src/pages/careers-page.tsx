import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ApplicationForm from "@/components/careers/application-form";
import { JobOpening } from "@shared/schema";
import { Briefcase, MapPin, DollarSign } from "lucide-react";

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  const { data: jobs, isLoading } = useQuery<JobOpening[]>({
    queryKey: ["/api/jobs"],
  });

  const handleApplyNow = (job: JobOpening) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
    setTimeout(() => {
      document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <Header />
      
      {/* Careers Header */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="section-heading text-4xl md:text-5xl mb-6">Join Our Team</h1>
              <p className="font-manrope text-lg text-gray-600 mb-8">
                We're always looking for talented individuals who are passionate about creating exceptional digital experiences. 
                Join our team of creative professionals and work on exciting projects for industry-leading clients.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                    <i className="fas fa-lightbulb text-primary text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-xl">Creative Environment</h3>
                    <p className="text-gray-600">Work in a collaborative and innovative space</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                    <i className="fas fa-chart-line text-primary text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-xl">Growth Opportunities</h3>
                    <p className="text-gray-600">Continuous learning and career advancement</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                    <i className="fas fa-users text-primary text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-xl">Diverse Team</h3>
                    <p className="text-gray-600">Inclusive workplace with global perspectives</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop" 
                  alt="Creative team working together" 
                  className="rounded-xl shadow-xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-secondary p-4 rounded-lg shadow-lg">
                  <p className="font-poppins font-bold text-2xl">{jobs?.length || "20"}+</p>
                  <p className="font-manrope text-sm">Open Positions</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Current Openings */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-background rounded-xl p-6 mb-8">
            <h2 className="font-poppins font-bold text-2xl mb-6">Current Openings</h2>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : jobs && jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <motion.div 
                    key={job.id} 
                    className="group bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * job.id }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-poppins font-bold text-xl">{job.title}</h3>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">{job.type}</span>
                    </div>
                    <div className="flex gap-4 text-gray-500 mb-4">
                      <span className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" /> {job.location}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4" /> {job.salary}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="link" 
                        className="text-primary font-medium"
                        onClick={() => setSelectedJob(job === selectedJob ? null : job)}
                      >
                        {job === selectedJob ? "Hide Details" : "View Details"}
                      </Button>
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-white font-medium"
                        onClick={() => handleApplyNow(job)}
                      >
                        Apply Now
                      </Button>
                    </div>
                    
                    {job === selectedJob && (
                      <motion.div 
                        className="mt-4 p-4 bg-gray-50 rounded-lg"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <h4 className="font-poppins font-bold text-lg mb-2">Job Details</h4>
                        <p className="text-gray-600 mb-4">{job.description}</p>
                        
                        <h4 className="font-poppins font-bold text-lg mb-2">Requirements</h4>
                        <ul className="list-disc pl-5 mb-4 text-gray-600">
                          <li>3+ years of experience in a similar role</li>
                          <li>Strong portfolio demonstrating relevant skills</li>
                          <li>Excellent communication and collaboration abilities</li>
                          <li>Ability to work in a fast-paced environment</li>
                        </ul>
                        
                        <h4 className="font-poppins font-bold text-lg mb-2">Benefits</h4>
                        <ul className="list-disc pl-5 mb-4 text-gray-600">
                          <li>Competitive salary and benefits package</li>
                          <li>Flexible work arrangements</li>
                          <li>Professional development opportunities</li>
                          <li>Collaborative and innovative work environment</li>
                        </ul>
                        
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 text-white font-medium mt-2"
                          onClick={() => handleApplyNow(job)}
                        >
                          Apply for this Position
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-poppins font-bold text-xl mb-2">No Open Positions</h3>
                <p className="text-gray-500">
                  We don't have any open positions at the moment. Please check back later or send your resume for future opportunities.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Application Form */}
      <section id="application-form" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-background rounded-xl p-6">
            <h2 className="font-poppins font-bold text-2xl mb-4">
              {selectedJob ? `Apply for ${selectedJob.title}` : "Can't find what you're looking for?"}
            </h2>
            <p className="text-gray-600 mb-6">
              {selectedJob 
                ? "Complete the form below to apply for this position. We'll review your application and get back to you soon."
                : "Send us your resume and we'll contact you when a suitable position becomes available."}
            </p>
            
            <ApplicationForm selectedJob={selectedJob} />
          </div>
        </div>
      </section>
      
      {/* Company Culture */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-heading text-4xl md:text-5xl mb-4">Our Culture</h2>
            <p className="font-manrope text-lg text-gray-600 max-w-2xl mx-auto">
              At Pixel Perfect, we foster a culture of creativity, collaboration, and continuous growth.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "lightbulb",
                title: "Innovation",
                description: "We encourage fresh ideas and creative thinking to solve complex problems.",
                delay: 0
              },
              {
                icon: "users",
                title: "Collaboration",
                description: "We believe in the power of teamwork and diverse perspectives.",
                delay: 0.1
              },
              {
                icon: "star",
                title: "Excellence",
                description: "We strive for excellence in everything we do, delivering high-quality work.",
                delay: 0.2
              },
              {
                icon: "heart",
                title: "Passion",
                description: "We're passionate about our work and dedicated to client success.",
                delay: 0.3
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                className="bg-background rounded-xl p-8 text-center card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: value.delay }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <i className={`fas fa-${value.icon} text-primary text-2xl`}></i>
                </div>
                <h3 className="font-poppins font-bold text-xl mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Gallery */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-heading text-4xl md:text-5xl mb-4">Meet Our Team</h2>
            <p className="font-manrope text-lg text-gray-600 max-w-2xl mx-auto">
              Get to know the talented individuals who make up our creative agency.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { image: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=400&auto=format&fit=crop", name: "Alex Morgan", position: "Creative Director", delay: 0 },
              { image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop", name: "Sarah Johnson", position: "UI/UX Designer", delay: 0.1 },
              { image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop", name: "David Chen", position: "Lead Developer", delay: 0.2 },
              { image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop", name: "Emily Rodriguez", position: "Marketing Specialist", delay: 0.3 },
            ].map((member, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: member.delay }}
                viewport={{ once: true }}
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-6 text-center">
                  <h3 className="font-poppins font-bold text-xl mb-1">{member.name}</h3>
                  <p className="text-gray-500 mb-4">{member.position}</p>
                  <div className="flex justify-center space-x-3">
                    <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}
