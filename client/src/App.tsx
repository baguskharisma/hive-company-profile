import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

// Public Pages
import HomePage from "@/pages/home-page";
import ShowcasePage from "@/pages/showcase-page";
import ProductsPage from "@/pages/products-page";
import CareersPage from "@/pages/careers-page";
import BlogPage from "@/pages/blog-page";
import BlogArticlePage from "@/pages/blog-article-page";
import ProjectDetailPage from "@/pages/project-detail-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

// Admin Pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProjects from "@/pages/admin/projects";
import AdminServices from "@/pages/admin/services";
import AdminCareers from "@/pages/admin/careers";
import AdminBlog from "@/pages/admin/blog";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/showcase" component={ShowcasePage} />
      <Route path="/showcase/:id" component={ProjectDetailPage} />
      <Route path="/services" component={ProductsPage} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:id" component={BlogArticlePage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Admin Routes - Protected */}
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} requireAdmin={true} />
      <ProtectedRoute path="/admin/projects" component={AdminProjects} requireAdmin={true} />
      <ProtectedRoute path="/admin/services" component={AdminServices} requireAdmin={true} />
      <ProtectedRoute path="/admin/careers" component={AdminCareers} requireAdmin={true} />
      <ProtectedRoute path="/admin/blog" component={AdminBlog} requireAdmin={true} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
