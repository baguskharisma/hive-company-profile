import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { JobApplication } from "@shared/schema";
import { Calendar, Download, Mail, MapPin, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { JobOpening } from "@shared/schema";

interface JobApplicationViewProps {
  application: JobApplication;
  onDelete: () => void;
  isDeleting: boolean;
}

export default function JobApplicationView({ application, onDelete, isDeleting }: JobApplicationViewProps) {
  // Fetch job details if jobId is available
  const { data: job } = useQuery<JobOpening>({
    queryKey: ["/api/jobs", application.jobId],
    queryFn: async () => {
      if (!application.jobId) return null;
      const res = await fetch(`/api/jobs/${application.jobId}`);
      if (!res.ok) return null;
      return await res.json();
    },
    enabled: !!application.jobId,
  });

  return (
    <div className="space-y-6">
      {/* Applicant Details */}
      <div>
        <h3 className="text-lg font-medium mb-4">Applicant Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium flex items-center">
              <User className="h-4 w-4 mr-2 text-primary" />
              {application.firstName} {application.lastName}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium flex items-center">
              <Mail className="h-4 w-4 mr-2 text-primary" />
              <a href={`mailto:${application.email}`} className="text-primary hover:underline">
                {application.email}
              </a>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Position Applied For</p>
            <p className="font-medium">{application.position}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Application Date</p>
            <p className="font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      
      {/* Job Details */}
      {job && (
        <div className="p-4 bg-muted rounded-md">
          <h3 className="text-lg font-medium mb-2">Job Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Position</p>
              <p className="font-medium">{job.title}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                {job.location}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium">{job.type}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className={`font-medium inline-flex px-2 py-1 rounded-full text-xs ${job.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {job.active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Resume Section */}
      {application.resumeUrl && (
        <div>
          <h3 className="text-lg font-medium mb-2">Resume</h3>
          <div className="border rounded-md p-4 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                  <i className="fas fa-file-alt text-primary"></i>
                </div>
                <div>
                  <p className="font-medium">{application.firstName}'s Resume</p>
                  <p className="text-sm text-muted-foreground">Click to view or download</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer" download>
                  <Download className="h-4 w-4 mr-2" /> Download
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Cover Letter */}
      {application.coverLetter && (
        <div>
          <h3 className="text-lg font-medium mb-2">Cover Letter</h3>
          <div className="border rounded-md p-4 bg-white">
            <p className="whitespace-pre-line">{application.coverLetter}</p>
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex justify-between pt-4 border-t">
        <div>
          <Button 
            variant="destructive" 
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Application"}
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <a href={`mailto:${application.email}`}>
              Contact Applicant
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
