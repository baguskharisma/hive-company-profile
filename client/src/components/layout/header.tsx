import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [location] = useLocation();
  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  
  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white font-poppins font-bold text-xl mr-2">P</div>
            <span className="font-poppins font-bold text-xl">Pixel Perfect</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className={`relative font-manrope font-medium ${isActive('/') ? 'text-primary' : ''}`}>
            Home
            {isActive('/') && <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-primary"></span>}
          </Link>
          <Link href="/showcase" className={`relative font-manrope font-medium ${isActive('/showcase') ? 'text-primary' : ''}`}>
            Showcase
            {isActive('/showcase') && <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-primary"></span>}
          </Link>
          <Link href="/services" className={`relative font-manrope font-medium ${isActive('/services') ? 'text-primary' : ''}`}>
            Services
            {isActive('/services') && <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-primary"></span>}
          </Link>
          <Link href="/careers" className={`relative font-manrope font-medium ${isActive('/careers') ? 'text-primary' : ''}`}>
            Careers
            {isActive('/careers') && <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-primary"></span>}
          </Link>
          <Link href="/blog" className={`relative font-manrope font-medium ${isActive('/blog') ? 'text-primary' : ''}`}>
            Blog
            {isActive('/blog') && <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-primary"></span>}
          </Link>
        </nav>
        
        <div className="flex items-center">
          {!isMobile && (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  {user.isAdmin && (
                    <Link href="/admin/dashboard">
                      <Button variant="outline" className="mr-2">Dashboard</Button>
                    </Link>
                  )}
                  <Button onClick={handleLogout} variant="destructive">Logout</Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="#contact">
                    <Button className="bg-primary hover:bg-primary/90 text-white font-manrope font-medium px-5 py-2 rounded-lg transition-all hover:-translate-y-1">
                      Contact Us
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button variant="outline" className="ml-2">Login</Button>
                  </Link>
                </div>
              )}
            </>
          )}
          <button 
            className="md:hidden text-gray-700 ml-4"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-white pb-4 px-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/" className="block py-2 font-manrope font-medium">Home</Link>
            <Link href="/showcase" className="block py-2 font-manrope font-medium">Showcase</Link>
            <Link href="/services" className="block py-2 font-manrope font-medium">Services</Link>
            <Link href="/careers" className="block py-2 font-manrope font-medium">Careers</Link>
            <Link href="/blog" className="block py-2 font-manrope font-medium">Blog</Link>
            
            {user ? (
              <>
                {user.isAdmin && (
                  <Link href="/admin/dashboard" className="block py-2 font-manrope font-medium">
                    Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left py-2 mt-2 bg-red-500 text-white font-manrope font-medium px-4 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="#contact" className="block py-2 mt-2 bg-primary text-white font-manrope font-medium px-4 py-2 rounded-lg text-center">
                  Contact Us
                </Link>
                <Link href="/auth" className="block py-2 mt-2 border border-gray-200 text-gray-800 font-manrope font-medium px-4 py-2 rounded-lg text-center">
                  Login
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
