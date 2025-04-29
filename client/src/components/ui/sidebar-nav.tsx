import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Settings,
  UserPlus,
  Newspaper,
  BarChart,
  Users,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  return (
    <nav
      className={cn(
        "flex space-y-2 lg:space-y-0 lg:flex-col flex-row lg:gap-2",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link 
          key={item.href}
          href={item.href}
        >
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
              location === item.href 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground"
            )}
          >
            {item.icon}
            <span>{item.title}</span>
          </div>
        </Link>
      ))}
      
      <button
        onClick={() => logoutMutation.mutate()}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive hover:text-destructive-foreground mt-auto"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </nav>
  );
}

export const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    title: "Careers",
    href: "/admin/careers",
    icon: <UserPlus className="h-4 w-4" />,
  },
  {
    title: "Blog",
    href: "/admin/blog",
    icon: <Newspaper className="h-4 w-4" />,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart className="h-4 w-4" />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="h-4 w-4" />,
  },
];
