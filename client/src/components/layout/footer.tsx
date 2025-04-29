import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

export default function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you would send the email to your API
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter",
    });
    setEmail("");
  };

  return (
    <footer className="bg-text text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div>
            <Link href="/" className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-primary font-poppins font-bold text-xl mr-2">P</div>
              <span className="font-poppins font-bold text-xl text-white">Pixel Perfect</span>
            </Link>
            <p className="text-gray-300 mb-6">We create digital experiences that help brands stand out, connect with their audience, and achieve their goals.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-secondary transition-all">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-secondary transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-secondary transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-secondary transition-all">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-poppins font-bold text-xl mb-6">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-all">About Us</Link></li>
              <li><Link href="/showcase" className="text-gray-300 hover:text-white transition-all">Our Work</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-all">Services</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-white transition-all">Careers</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white transition-all">Blog</Link></li>
              <li><Link href="#contact" className="text-gray-300 hover:text-white transition-all">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-bold text-xl mb-6">Services</h3>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-all">Web Development</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-all">Mobile App Development</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-all">UI/UX Design</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-all">Digital Marketing</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-all">Brand Identity</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-all">Analytics & Optimization</Link></li>
            </ul>
          </div>
          
          <div id="contact">
            <h3 className="font-poppins font-bold text-xl mb-6">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-3 text-secondary" />
                <span className="text-gray-300">123 Creative Street, New York, NY 10001, USA</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-secondary" />
                <a href="tel:+1234567890" className="text-gray-300 hover:text-white transition-all">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-secondary" />
                <a href="mailto:info@pixelperfect.com" className="text-gray-300 hover:text-white transition-all">info@pixelperfect.com</a>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="font-poppins font-medium mb-3">Subscribe to our newsletter</h4>
              <form className="flex" onSubmit={handleSubscribe}>
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-secondary border-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" className="bg-secondary text-text px-4 py-2 rounded-r-lg hover:bg-secondary/90">
                  <Mail className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2023 Pixel Perfect. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-all">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-all">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-all">Cookie Policy</a>
              <Link href="/auth" className="text-gray-400 hover:text-white text-sm transition-all">Admin Login</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
