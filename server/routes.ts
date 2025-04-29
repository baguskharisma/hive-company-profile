import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import {
  insertProjectSchema,
  insertServiceSchema,
  insertJobOpeningSchema,
  insertJobApplicationSchema,
  insertBlogArticleSchema,
  insertProductSchema
} from "@shared/schema";
import multer from "multer";

// Configure multer for file uploads (in-memory storage for this example)
const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up auth (login, register, logout, user endpoints)
  setupAuth(app);

  // Projects routes
  app.get("/api/projects", async (_req: Request, res: Response) => {
    const projects = await storage.getAllProjects();
    res.json(projects);
  });

  app.get("/api/projects/featured", async (_req: Request, res: Response) => {
    const featuredProjects = await storage.getFeaturedProjects();
    res.json(featuredProjects);
  });

  app.get("/api/projects/category/:category", async (req: Request, res: Response) => {
    const category = req.params.category;
    const projects = await storage.getProjectsByCategory(category);
    res.json(projects);
  });

  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const project = await storage.getProjectById(id);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  });

  app.post("/api/projects", async (req: Request, res: Response) => {
    try {
      // Authorize - only admin can create projects
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertProjectSchema.parse(req.body);
      const newProject = await storage.createProject(validatedData);
      res.status(201).json(newProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.format() });
      }
      res.status(500).json({ message: "Error creating project" });
    }
  });

  app.put("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      // Authorize - only admin can update projects
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const updatedProject = await storage.updateProject(id, validatedData);
      
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.format() });
      }
      res.status(500).json({ message: "Error updating project" });
    }
  });

  app.delete("/api/projects/:id", async (req: Request, res: Response) => {
    // Authorize - only admin can delete projects
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    const success = await storage.deleteProject(id);
    
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.status(204).end();
  });

  // Services routes
  app.get("/api/services", async (_req: Request, res: Response) => {
    const services = await storage.getAllServices();
    res.json(services);
  });

  app.get("/api/services/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const service = await storage.getServiceById(id);
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.json(service);
  });

  app.post("/api/services", async (req: Request, res: Response) => {
    try {
      // Authorize - only admin can create services
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertServiceSchema.parse(req.body);
      const newService = await storage.createService(validatedData);
      res.status(201).json(newService);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.format() });
      }
      res.status(500).json({ message: "Error creating service" });
    }
  });

  app.put("/api/services/:id", async (req: Request, res: Response) => {
    try {
      // Authorize - only admin can update services
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const updatedService = await storage.updateService(id, validatedData);
      
      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(updatedService);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.format() });
      }
      res.status(500).json({ message: "Error updating service" });
    }
  });

  app.delete("/api/services/:id", async (req: Request, res: Response) => {
    // Authorize - only admin can delete services
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    const success = await storage.deleteService(id);
    
    if (!success) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.status(204).end();
  });

  // Job openings routes
  app.get("/api/jobs", async (_req: Request, res: Response) => {
    const jobOpenings = await storage.getActiveJobOpenings();
    res.json(jobOpenings);
  });

  app.get("/api/jobs/all", async (req: Request, res: Response) => {
    // Authorize - only admin can see all jobs including inactive ones
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const jobOpenings = await storage.getAllJobOpenings();
    res.json(jobOpenings);
  });

  app.get("/api/jobs/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const job = await storage.getJobOpeningById(id);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    res.json(job);
  });

  app.post("/api/jobs", async (req: Request, res: Response) => {
    try {
      // Authorize - only admin can create jobs
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertJobOpeningSchema.parse(req.body);
      const newJob = await storage.createJobOpening(validatedData);
      res.status(201).json(newJob);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid job data", errors: error.format() });
      }
      res.status(500).json({ message: "Error creating job" });
    }
  });

  app.put("/api/jobs/:id", async (req: Request, res: Response) => {
    try {
      // Authorize - only admin can update jobs
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      const validatedData = insertJobOpeningSchema.partial().parse(req.body);
      const updatedJob = await storage.updateJobOpening(id, validatedData);
      
      if (!updatedJob) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      res.json(updatedJob);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid job data", errors: error.format() });
      }
      res.status(500).json({ message: "Error updating job" });
    }
  });

  app.delete("/api/jobs/:id", async (req: Request, res: Response) => {
    // Authorize - only admin can delete jobs
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    const success = await storage.deleteJobOpening(id);
    
    if (!success) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    res.status(204).end();
  });

  // Job applications routes
  app.get("/api/applications", async (req: Request, res: Response) => {
    // Authorize - only admin can see job applications
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const applications = await storage.getAllJobApplications();
    res.json(applications);
  });

  app.get("/api/applications/:id", async (req: Request, res: Response) => {
    // Authorize - only admin can see job applications
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    const application = await storage.getJobApplicationById(id);
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    res.json(application);
  });

  app.get("/api/applications/job/:jobId", async (req: Request, res: Response) => {
    // Authorize - only admin can see job applications
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const jobId = parseInt(req.params.jobId);
    const applications = await storage.getJobApplicationsByJobId(jobId);
    res.json(applications);
  });

  app.post("/api/applications", upload.single('resume'), async (req: Request, res: Response) => {
    try {
      console.log("Application submission received");
      console.log("Body:", req.body);
      console.log("File:", req.file ? `File received: ${req.file.originalname} (${req.file.mimetype}, ${req.file.size} bytes)` : "No file received");
      
      const applicationData = {
        ...req.body,
        jobId: req.body.jobId ? parseInt(req.body.jobId) : undefined,
        resumeUrl: req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null
      };
      
      const validatedData = insertJobApplicationSchema.parse(applicationData);
      const newApplication = await storage.createJobApplication(validatedData);
      
      // In a real application, you would send an email notification here
      // For this demo, we'll just log a message
      console.log(`New job application received: ${newApplication.firstName} ${newApplication.lastName} (${newApplication.email})`);
      
      res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
      console.error("Error processing application:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.format() });
      }
      res.status(500).json({ message: "Error submitting application" });
    }
  });

  app.delete("/api/applications/:id", async (req: Request, res: Response) => {
    // Authorize - only admin can delete job applications
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    const success = await storage.deleteJobApplication(id);
    
    if (!success) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    res.status(204).end();
  });

  // Blog articles routes
  app.get("/api/blog", async (_req: Request, res: Response) => {
    const articles = await storage.getPublishedBlogArticles();
    res.json(articles);
  });

  app.get("/api/blog/all", async (req: Request, res: Response) => {
    // Authorize - only admin can see all blog articles including unpublished ones
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const articles = await storage.getAllBlogArticles();
    res.json(articles);
  });

  app.get("/api/blog/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const article = await storage.getBlogArticleById(id);
    
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    // Only return published articles to public
    if (!article.published && (!req.isAuthenticated() || !req.user.isAdmin)) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    res.json(article);
  });

  app.post("/api/blog", async (req: Request, res: Response) => {
    try {
      // Authorize - only admin can create blog articles
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertBlogArticleSchema.parse(req.body);
      const newArticle = await storage.createBlogArticle(validatedData);
      res.status(201).json(newArticle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.format() });
      }
      res.status(500).json({ message: "Error creating article" });
    }
  });

  app.put("/api/blog/:id", async (req: Request, res: Response) => {
    try {
      // Authorize - only admin can update blog articles
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      const validatedData = insertBlogArticleSchema.partial().parse(req.body);
      const updatedArticle = await storage.updateBlogArticle(id, validatedData);
      
      if (!updatedArticle) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(updatedArticle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.format() });
      }
      res.status(500).json({ message: "Error updating article" });
    }
  });

  app.delete("/api/blog/:id", async (req: Request, res: Response) => {
    // Authorize - only admin can delete blog articles
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    const success = await storage.deleteBlogArticle(id);
    
    if (!success) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    res.status(204).end();
  });
  
  // Products routes
  app.get("/api/products", async (_req: Request, res: Response) => {
    const products = await storage.getAllProducts();
    res.json(products);
  });
  
  app.get("/api/products/featured", async (_req: Request, res: Response) => {
    const featuredProducts = await storage.getFeaturedProducts();
    res.json(featuredProducts);
  });
  
  app.get("/api/products/category/:category", async (req: Request, res: Response) => {
    const category = req.params.category;
    const products = await storage.getProductsByCategory(category);
    res.json(products);
  });
  
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const product = await storage.getProductById(id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  });
  
  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      // Authorize - only admin can create products
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertProductSchema.parse(req.body);
      const newProduct = await storage.createProduct(validatedData);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.format() });
      }
      res.status(500).json({ message: "Error creating product" });
    }
  });
  
  app.put("/api/products/:id", async (req: Request, res: Response) => {
    try {
      // Authorize - only admin can update products
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const updatedProduct = await storage.updateProduct(id, validatedData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.format() });
      }
      res.status(500).json({ message: "Error updating product" });
    }
  });
  
  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    // Authorize - only admin can delete products
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    const success = await storage.deleteProduct(id);
    
    if (!success) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}
