import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarNav, adminNavItems } from "@/components/ui/sidebar-nav";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import JobOpeningForm from "@/components/admin/job-opening-form";
import JobApplicationView from "@/components/admin/job-application-view";
import { JobOpening, JobApplication } from "@shared/schema";

export default function AdminCareers() {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [activeTab, setActiveTab] = useState("openings");
  
  const { data: jobs, isLoading: jobsLoading } = useQuery<JobOpening[]>({
    queryKey: ["/api/jobs/all"],
  });
  
  const { data: applications, isLoading: applicationsLoading } = useQuery<JobApplication[]>({
    queryKey: ["/api/applications"],
  });
  
  const deleteJobMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs/all"] });
      setIsDeleteOpen(false);
      toast({
        title: "Job opening deleted",
        description: "The job opening has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete job opening: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const deleteApplicationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/applications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      setIsViewOpen(false);
      toast({
        title: "Application deleted",
        description: "The application has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete application: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleEditJob = (job: JobOpening) => {
    setSelectedJob(job);
    setIsEditOpen(true);
  };

  const handleDeleteJob = (job: JobOpening) => {
    setSelectedJob(job);
    setIsDeleteOpen(true);
  };

  const handleViewApplication = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsViewOpen(true);
  };

  const confirmDeleteJob = () => {
    if (selectedJob) {
      deleteJobMutation.mutate(selectedJob.id);
    }
  };
  
  const confirmDeleteApplication = () => {
    if (selectedApplication) {
      deleteApplicationMutation.mutate(selectedApplication.id);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Admin Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white font-poppins font-bold text-xl mr-2">P</div>
              <span className="font-poppins font-bold text-xl">Admin Dashboard</span>
            </Link>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <SidebarNav items={adminNavItems} className="flex flex-col" />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="font-poppins font-bold text-2xl">Careers Management</h1>
                {activeTab === "openings" && (
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white font-medium"
                    onClick={() => setIsAddOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Job Opening
                  </Button>
                )}
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="openings">Job Openings</TabsTrigger>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                </TabsList>
                
                <TabsContent value="openings" className="mt-6">
                  {jobsLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    <DataTable 
                      data={jobs || []}
                      columns={[
                        {
                          header: "Position",
                          accessorKey: "title",
                        },
                        {
                          header: "Location",
                          accessorKey: "location",
                        },
                        {
                          header: "Type",
                          accessorKey: "type",
                        },
                        {
                          header: "Status",
                          accessorKey: "active",
                          cell: (item) => (
                            <span className={`px-2 py-1 rounded-full text-xs ${item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.active ? 'Active' : 'Inactive'}
                            </span>
                          ),
                        },
                        {
                          header: "Salary",
                          accessorKey: "salary",
                        },
                      ]}
                      actions={(item) => (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditJob(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleDeleteJob(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      searchKey="title"
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="applications" className="mt-6">
                  {applicationsLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    <DataTable 
                      data={applications || []}
                      columns={[
                        {
                          header: "Name",
                          accessorKey: "firstName",
                          cell: (item) => `${item.firstName} ${item.lastName}`,
                        },
                        {
                          header: "Email",
                          accessorKey: "email",
                        },
                        {
                          header: "Position",
                          accessorKey: "position",
                        },
                        {
                          header: "Date",
                          accessorKey: "createdAt",
                          cell: (item) => new Date(item.createdAt).toLocaleDateString(),
                        },
                        {
                          header: "Resume",
                          accessorKey: "resumeUrl",
                          cell: (item) => item.resumeUrl ? (
                            <span className="text-primary">Available</span>
                          ) : (
                            <span className="text-gray-400">No resume</span>
                          ),
                        },
                      ]}
                      actions={(item) => (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewApplication(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      searchKey="email"
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Job Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Job Opening</DialogTitle>
          </DialogHeader>
          <JobOpeningForm 
            onSuccess={() => {
              setIsAddOpen(false);
              queryClient.invalidateQueries({ queryKey: ["/api/jobs/all"] });
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Job Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Job Opening</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <JobOpeningForm 
              jobData={selectedJob}
              onSuccess={() => {
                setIsEditOpen(false);
                queryClient.invalidateQueries({ queryKey: ["/api/jobs/all"] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Job Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete the "{selectedJob?.title}" position? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteJob}
              disabled={deleteJobMutation.isPending}
            >
              {deleteJobMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Application Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <JobApplicationView 
              application={selectedApplication}
              onDelete={confirmDeleteApplication}
              isDeleting={deleteApplicationMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
