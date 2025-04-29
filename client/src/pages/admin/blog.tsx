import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, FileImage } from "lucide-react";
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
import BlogForm from "@/components/admin/blog-form";
import { BlogArticle } from "@shared/schema";

export default function AdminBlog() {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  
  const { data: articles, isLoading } = useQuery<BlogArticle[]>({
    queryKey: ["/api/blog/all"],
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/all"] });
      setIsDeleteOpen(false);
      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete article: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleEditClick = (article: BlogArticle) => {
    setSelectedArticle(article);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (article: BlogArticle) => {
    setSelectedArticle(article);
    setIsDeleteOpen(true);
  };
  
  const handleViewClick = (article: BlogArticle) => {
    setSelectedArticle(article);
    setIsViewOpen(true);
  };

  const confirmDelete = () => {
    if (selectedArticle) {
      deleteMutation.mutate(selectedArticle.id);
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
                <h1 className="font-poppins font-bold text-2xl">Blog Articles</h1>
                <Button
                  className="bg-primary hover:bg-primary/90 text-white font-medium"
                  onClick={() => setIsAddOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Article
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <DataTable 
                  data={articles || []}
                  columns={[
                    {
                      header: "Title",
                      accessorKey: "title",
                      cell: (item) => (
                        <div className="max-w-xs truncate font-medium">{item.title}</div>
                      )
                    },
                    {
                      header: "Category",
                      accessorKey: "category",
                    },
                    {
                      header: "Author",
                      accessorKey: "authorName",
                    },
                    {
                      header: "Status",
                      accessorKey: "published",
                      cell: (item) => (
                        <span className={`px-2 py-1 rounded-full text-xs ${item.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {item.published ? 'Published' : 'Draft'}
                        </span>
                      ),
                    },
                    {
                      header: "Date",
                      accessorKey: "createdAt",
                      cell: (item) => new Date(item.createdAt).toLocaleDateString(),
                    },
                  ]}
                  actions={(item) => (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewClick(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
      
      {/* Add Article Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Article</DialogTitle>
          </DialogHeader>
          <BlogForm 
            onSuccess={() => {
              setIsAddOpen(false);
              queryClient.invalidateQueries({ queryKey: ["/api/blog/all"] });
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Article Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
          </DialogHeader>
          {selectedArticle && (
            <BlogForm 
              articleData={selectedArticle}
              onSuccess={() => {
                setIsEditOpen(false);
                queryClient.invalidateQueries({ queryKey: ["/api/blog/all"] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* View Article Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedArticle && (
            <div className="mt-4">
              <div className="flex items-center mb-4">
                <img 
                  src={selectedArticle.authorImageUrl} 
                  alt={selectedArticle.authorName}
                  className="w-10 h-10 rounded-full mr-3" 
                />
                <div>
                  <p className="font-medium">{selectedArticle.authorName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedArticle.createdAt).toLocaleDateString()} • {selectedArticle.category}
                  </p>
                </div>
                <span className={`ml-auto px-2 py-1 rounded-full text-xs ${selectedArticle.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {selectedArticle.published ? 'Published' : 'Draft'}
                </span>
              </div>
              
              <div className="mb-4">
                <img 
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-56 object-cover rounded-lg"
                />
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium">Excerpt:</h3>
                <p className="text-gray-600">{selectedArticle.excerpt}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Content:</h3>
                <div 
                  className="prose prose-sm max-w-none border p-4 rounded-lg bg-gray-50 overflow-y-auto max-h-96"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            <Button onClick={() => {
              setIsViewOpen(false);
              handleEditClick(selectedArticle!);
            }}>Edit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete "{selectedArticle?.title}"? This action cannot be undone.</p>
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
