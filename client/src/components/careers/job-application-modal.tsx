import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { JobOpening } from "@shared/schema";
import ApplicationForm from "./application-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JobApplicationModalProps {
  job: JobOpening | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobApplicationModal({
  job,
  isOpen,
  onClose,
}: JobApplicationModalProps) {
  const [activeTab, setActiveTab] = useState("details");

  // Handle escape key to close modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!job) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-background rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="font-poppins font-bold text-2xl">{job.title}</h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            <Tabs
              defaultValue="details"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="p-4 border-b">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="details">Job Details</TabsTrigger>
                  <TabsTrigger value="apply">Apply Now</TabsTrigger>
                </TabsList>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 160px)" }}>
                <TabsContent value="details" className="p-6 focus:outline-none">
                  <div className="flex flex-wrap gap-4 text-gray-500 mb-6">
                    <span className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {job.type}
                    </span>
                    <span className="flex items-center bg-background px-3 py-1 rounded-full text-sm font-medium">
                      {job.location}
                    </span>
                    <span className="flex items-center bg-background px-3 py-1 rounded-full text-sm font-medium">
                      {job.salary}
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-poppins font-bold text-xl mb-3">Job Description</h3>
                      <p className="text-gray-600">{job.description}</p>
                    </div>

                    <div>
                      <h3 className="font-poppins font-bold text-xl mb-3">Requirements</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>3+ years of experience in a similar role</li>
                        <li>Strong portfolio demonstrating relevant skills</li>
                        <li>Excellent communication and collaboration abilities</li>
                        <li>Ability to work in a fast-paced environment</li>
                        <li>Proficiency with industry-standard tools and technologies</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-poppins font-bold text-xl mb-3">Responsibilities</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>Collaborate with cross-functional teams to define and implement innovative solutions</li>
                        <li>Ensure high-quality deliverables that meet client expectations</li>
                        <li>Stay up-to-date with industry trends and best practices</li>
                        <li>Contribute to a positive and collaborative team environment</li>
                        <li>Participate in client meetings and presentations as needed</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-poppins font-bold text-xl mb-3">Benefits</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>Competitive salary and benefits package</li>
                        <li>Remote work options and flexible schedule</li>
                        <li>Professional development opportunities</li>
                        <li>Collaborative and innovative work environment</li>
                        <li>Regular team events and activities</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button 
                      size="lg" 
                      className="w-full" 
                      onClick={() => setActiveTab("apply")}
                    >
                      Apply for this Position
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="apply" className="p-6 focus:outline-none">
                  <p className="text-gray-600 mb-6">
                    Complete the form below to apply for this position. We'll review your application and get back to you soon.
                  </p>
                  <ApplicationForm 
                    selectedJob={job} 
                    onSuccess={() => {
                      onClose();
                    }}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}