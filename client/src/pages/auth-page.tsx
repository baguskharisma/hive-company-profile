import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

// Login schema
const loginSchema = z.object({
  username: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);
  
  // Login form setup
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Form submission handlers
  const onLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl w-full shadow-lg rounded-xl overflow-hidden">
        {/* Form Section */}
        <div className="bg-white p-8">
          <div className="flex items-center mb-8">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white font-poppins font-bold text-xl mr-2">P</div>
            <span className="font-poppins font-bold text-xl">Pixel Perfect</span>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Login to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <p className="text-center mt-8 text-gray-500">
            <a href="/" className="text-primary hover:underline">Back to Home</a>
          </p>
        </div>
        
        {/* Hero Section */}
        <div className="bg-primary text-white p-8 flex flex-col justify-center relative hidden md:block">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[float_6s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[float_8s_ease-in-out_infinite]"></div>
          
          <div className="relative z-10">
            <h1 className="font-poppins font-bold text-3xl mb-6">Unlock the Power of Digital Creativity</h1>
            <p className="font-manrope text-lg mb-8 opacity-90">
              Join our creative agency platform to manage projects, showcase your work, and connect with clients.
            </p>
            <ul className="space-y-4">
              {[
                "Manage your creative projects",
                "Showcase your portfolio to potential clients",
                "Access powerful content management tools",
                "Connect with other creatives and clients"
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <ArrowRight className="mr-2 h-5 w-5 text-secondary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
