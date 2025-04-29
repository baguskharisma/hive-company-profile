import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Image,
  FileText,
  Users,
  PackageOpen,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: <Image className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Services',
    href: '/admin/services',
    icon: <FileText className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: <PackageOpen className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Career',
    href: '/admin/careers',
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Blog',
    href: '/admin/blog',
    icon: <FileText className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">You need to log in to access the admin panel.</p>
          <Link href="/auth">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:bg-muted/50 border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="mt-2 text-sm text-muted-foreground">
            Logged in as {user.username}
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center py-2 px-4 rounded-md text-sm transition-colors",
                  location === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.icon}
                {item.title}
              </a>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
          </Button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden bg-background border-b fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <Button variant="outline" size="sm">
            Menu
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-1 p-4 md:p-0">
          {children}
        </main>
      </div>
    </div>
  );
}