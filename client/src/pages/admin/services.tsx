import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Settings } from "lucide-react";
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
import ServiceForm from "@/components/admin/service-form";
import { Service } from "@shared/schema";

export default function AdminServices() {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setIsDeleteOpen(false);
      toast({
        title: "Service deleted",
        description: "The service has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete service: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedService) {
      deleteMutation.mutate(selectedService.id);
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
                <h1 className="font-poppins font-bold text-2xl">Services</h1>
                <Button
                  className="bg-primary hover:bg-primary/90 text-white font-medium"
                  onClick={() => setIsAddOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <DataTable 
                  data={services || []}
                  columns={[
                    {
                      header: "Service",
                      accessorKey: "title",
                    },
                    {
                      header: "Description",
                      accessorKey: "description",
                      cell: (item) => (
                        <div className="max-w-md truncate">{item.description}</div>
                      )
                    },
                    {
                      header: "Icon",
                      accessorKey: "icon",
                      cell: (item) => (
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <i className={`fas fa-${item.icon} text-primary`}></i>
                          </div>
                        </div>
                      ),
                    },
                    {
                      header: "Features",
                      accessorKey: "features",
                      cell: (item) => (
                        <div className="max-w-xs">
                          {item.features.length} features
                        </div>
                      ),
                    }
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
      
      {/* Add Service Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <ServiceForm 
            onSuccess={() => {
              setIsAddOpen(false);
              queryClient.invalidateQueries({ queryKey: ["/api/services"] });
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Service Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <ServiceForm 
              serviceData={selectedService}
              onSuccess={() => {
                setIsEditOpen(false);
                queryClient.invalidateQueries({ queryKey: ["/api/services"] });
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
          <p>Are you sure you want to delete "{selectedService?.title}"? This action cannot be undone.</p>
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
