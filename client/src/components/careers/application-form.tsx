import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { JobOpening, insertJobApplicationSchema } from "@shared/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";

interface ApplicationFormProps {
  selectedJob: JobOpening | null;
  onSuccess?: () => void;
}

const applicationSchema = insertJobApplicationSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  position: z.string().min(1, "Position is required"),
  coverLetter: z.string().optional(),
});

export default function ApplicationForm({ selectedJob, onSuccess }: ApplicationFormProps) {
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      jobId: selectedJob?.id,
      firstName: "",
      lastName: "",
      email: "",
      position: selectedJob?.title || "",
      coverLetter: "",
    },
  });
  
  // Update position field when selectedJob changes
  useState(() => {
    if (selectedJob) {
      form.setValue("jobId", selectedJob.id);
      form.setValue("position", selectedJob.title);
    } else {
      form.setValue("jobId", undefined);
    }
  });
  
  const applicationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof applicationSchema>) => {
      const formData = new FormData();
      
      // Add form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      // Handle file upload explicitly
      if (resumeFile) {
        console.log("Appending file:", resumeFile.name, resumeFile.type, resumeFile.size);
        formData.append("resume", resumeFile, resumeFile.name);
      } else {
        console.log("No resume file selected");
      }
      
      // Log form data for debugging
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1] instanceof File ? `File: ${(pair[1] as File).name}` : pair[1]}`);
      }
      
      // Direct fetch instead of apiRequest to handle FormData
      const res = await fetch("/api/applications", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.statusText);
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Thank you for your application. We'll be in touch soon!",
      });
      form.reset();
      setResumeFile(null);
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: z.infer<typeof applicationSchema>) {
    applicationMutation.mutate(data);
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setResumeFile(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desired Position</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedJob ? (
                    <SelectItem value={selectedJob.title}>{selectedJob.title}</SelectItem>
                  ) : (
                    <>
                      <SelectItem value="Designer">Designer</SelectItem>
                      <SelectItem value="Developer">Developer</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="mb-4">
          <FormLabel>Resume</FormLabel>
          <div 
            className="w-full border border-gray-300 border-dashed rounded-lg px-4 py-4 bg-white"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.add("border-primary");
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.remove("border-primary");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.remove("border-primary");
              
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.size > 5 * 1024 * 1024) {
                  toast({
                    title: "File too large",
                    description: "Please upload a file smaller than 5MB",
                    variant: "destructive",
                  });
                  return;
                }
                if (!file.type.match('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|text/plain')) {
                  toast({
                    title: "Invalid file type",
                    description: "Please upload a PDF, DOCX, or TXT file",
                    variant: "destructive",
                  });
                  return;
                }
                setResumeFile(file);
              }
            }}
          >
            <div className="flex items-center justify-center flex-col">
              <Upload className="text-gray-400 h-8 w-8 mb-2" />
              <p className="text-sm text-gray-500">
                {resumeFile ? resumeFile.name : "Drag and drop your resume here or"}
              </p>
              <label className="mt-2 text-primary font-medium cursor-pointer">
                Browse files
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-xs text-gray-400 mt-1">PDF, DOCX or TXT, max 5MB</p>
            </div>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us why you'd be a great fit..." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={applicationMutation.isPending}
        >
          {applicationMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>
    </Form>
  );
}
