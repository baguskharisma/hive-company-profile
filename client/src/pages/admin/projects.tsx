import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNav, adminNavItems } from "@/components/ui/sidebar-nav";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProjectForm from "@/components/admin/project-form";
import { Project } from "@shared/schema";

export default function AdminProjects() {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsDeleteOpen(false);
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete project: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProject) {
      deleteMutation.mutate(selectedProject.id);
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
                <h1 className="font-poppins font-bold text-2xl">Projects</h1>
                <Button
                  className="bg-primary hover:bg-primary/90 text-white font-medium"
                  onClick={() => setIsAddOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Project
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <DataTable 
                  data={projects || []}
                  columns={[
                    {
                      header: "Project",
                      accessorKey: "title",
                    },
                    {
                      header: "Client",
                      accessorKey: "client",
                    },
                    {
                      header: "Category",
                      accessorKey: "category",
                    },
                    {
                      header: "Featured",
                      accessorKey: "featured",
                      cell: (item) => (
                        <span className={`px-2 py-1 rounded-full text-xs ${item.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {item.featured ? 'Featured' : 'Not Featured'}
                        </span>
                      ),
                    },
                    {
                      header: "Image",
                      accessorKey: "imageUrl",
                      cell: (item) => (
                        <div className="flex items-center">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                              <FileImage className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                      ),
                    },
                  ]}
                  actions={(item) => (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  searchKey="title"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Project Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm 
            onSuccess={() => {
              setIsAddOpen(false);
              queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Project Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <ProjectForm 
              projectData={selectedProject}
              onSuccess={() => {
                setIsEditOpen(false);
                queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
