import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  LayoutDashboard, 
  Briefcase, 
  Package, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Menu, 
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { href: '/admin/projects', label: 'Projects', icon: <Briefcase className="mr-2 h-4 w-4" /> },
    { href: '/admin/services', label: 'Services', icon: <FileText className="mr-2 h-4 w-4" /> },
    { href: '/admin/products', label: 'Products', icon: <Package className="mr-2 h-4 w-4" /> },
    { href: '/admin/careers', label: 'Careers', icon: <Users className="mr-2 h-4 w-4" /> },
    { href: '/admin/blog', label: 'Blog', icon: <FileText className="mr-2 h-4 w-4" /> },
  ];

  const NavList = () => (
    <ul className="space-y-2 px-2">
      {navItems.map((item) => (
        <li key={item.href}>
          <Link href={item.href}>
            <a
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                location === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {item.icon}
              {item.label}
              {location === item.href && (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r">
        <div className="p-6 border-b">
          <h2 className="font-bold text-2xl text-primary">Admin</h2>
        </div>
        <div className="flex-1 py-6">
          <NavList />
        </div>
        <div className="p-6 border-t">
          <div className="mb-6 flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="font-medium">{user?.username}</p>
              <p className="text-sm text-muted-foreground">Administrator</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Mobile navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="absolute top-4 left-4">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-bold text-2xl text-primary">Admin</h2>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 py-6">
            <NavList />
          </div>
          <div className="p-6 border-t">
            <div className="mb-6 flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="font-medium">{user?.username}</p>
                <p className="text-sm text-muted-foreground">Administrator</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10">
        <div className="md:hidden mb-10 pb-4 border-b">
          <h2 className="font-bold text-2xl text-primary text-center">Admin Dashboard</h2>
        </div>
        {children}
      </main>
    </div>
  );
}