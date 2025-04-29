import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  Newspaper,
  Users,
  ArrowUp,
  ArrowRight,
  Trash2,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarNav, adminNavItems } from "@/components/ui/sidebar-nav";
import { DataTable } from "@/components/ui/data-table";
import { useAuth } from "@/hooks/use-auth";
import {
  Project,
  JobApplication,
  BlogArticle
} from "@shared/schema";

export default function AdminDashboard() {
  const { user } = useAuth();
  
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });
  
  const { data: applications } = useQuery<JobApplication[]>({
    queryKey: ["/api/applications"],
  });
  
  const { data: articles } = useQuery<BlogArticle[]>({
    queryKey: ["/api/blog/all"],
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Admin Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white font-poppins font-bold text-xl mr-2">P</div>
              <span className="font-poppins font-bold text-xl">Admin Dashboard</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4">
              <span className="font-medium">{user?.username}</span>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Stats Card 1 */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-poppins font-medium">Total Projects</h3>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="text-primary h-6 w-6" />
                  </div>
                </div>
                <p className="font-poppins font-bold text-3xl mb-2">{projects?.length || 0}</p>
                <p className="text-green-500 text-sm">
                  <ArrowUp className="inline h-3 w-3 mr-1" /> 12% from last month
                </p>
              </motion.div>
              
              {/* Stats Card 2 */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-poppins font-medium">Job Applications</h3>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="text-primary h-6 w-6" />
                  </div>
                </div>
                <p className="font-poppins font-bold text-3xl mb-2">{applications?.length || 0}</p>
                <p className="text-green-500 text-sm">
                  <ArrowUp className="inline h-3 w-3 mr-1" /> 5% from last month
                </p>
              </motion.div>
              
              {/* Stats Card 3 */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-poppins font-medium">Blog Articles</h3>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Newspaper className="text-primary h-6 w-6" />
                  </div>
                </div>
                <p className="font-poppins font-bold text-3xl mb-2">{articles?.length || 0}</p>
                <p className="text-green-500 text-sm">
                  <ArrowUp className="inline h-3 w-3 mr-1" /> 8% from last month
                </p>
              </motion.div>
            </div>
            
            {/* Recent Projects */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-poppins font-bold text-xl">Recent Projects</h3>
                <Link href="/admin/projects">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-medium">
                    <ArrowRight className="mr-2 h-4 w-4" /> View All Projects
                  </Button>
                </Link>
              </div>
              
              {projects ? (
                <DataTable 
                  data={projects.slice(0, 5)}
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
                          {item.featured ? 'Yes' : 'No'}
                        </span>
                      ),
                    },
                  ]}
                  actions={(item) => (
                    <div className="flex space-x-2">
                      <Link href={`/admin/projects/edit/${item.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  onRowClick={(item) => console.log("View project", item.id)}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading projects...</p>
                </div>
              )}
            </div>
            
            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-poppins font-bold text-xl">Recent Applications</h3>
                <Link href="/admin/careers">
                  <Button variant="outline" className="font-medium">View All</Button>
                </Link>
              </div>
              
              {applications ? (
                <div className="space-y-4">
                  {applications.slice(0, 3).map((application) => (
                    <div key={application.id} className="border rounded-lg p-4 hover:shadow-sm transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-poppins font-bold">{application.firstName} {application.lastName}</h4>
                          <p className="text-sm text-gray-500">{application.position}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-sm text-gray-500 mr-4">
                              <Users className="inline h-3 w-3 mr-1" /> {application.email}
                            </span>
                            <span className="text-sm text-gray-500">
                              <FileText className="inline h-3 w-3 mr-1" /> 
                              {new Date(application.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex">
                          <Button size="sm" className="bg-primary text-white mr-2">View</Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading applications...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
