import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  services, type Service, type InsertService,
  products, type Product, type InsertProduct,
  jobOpenings, type JobOpening, type InsertJobOpening,
  jobApplications, type JobApplication, type InsertJobApplication,
  blogArticles, type BlogArticle, type InsertBlogArticle
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Projects
  getAllProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | undefined>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Services
  getAllServices(): Promise<Service[]>;
  getServiceById(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getPopularProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Job Openings
  getAllJobOpenings(): Promise<JobOpening[]>;
  getActiveJobOpenings(): Promise<JobOpening[]>;
  getJobOpeningById(id: number): Promise<JobOpening | undefined>;
  createJobOpening(jobOpening: InsertJobOpening): Promise<JobOpening>;
  updateJobOpening(id: number, jobOpening: Partial<InsertJobOpening>): Promise<JobOpening | undefined>;
  deleteJobOpening(id: number): Promise<boolean>;
  
  // Job Applications
  getAllJobApplications(): Promise<JobApplication[]>;
  getJobApplicationById(id: number): Promise<JobApplication | undefined>;
  getJobApplicationsByJobId(jobId: number): Promise<JobApplication[]>;
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  deleteJobApplication(id: number): Promise<boolean>;
  
  // Blog Articles
  getAllBlogArticles(): Promise<BlogArticle[]>;
  getPublishedBlogArticles(): Promise<BlogArticle[]>;
  getBlogArticleById(id: number): Promise<BlogArticle | undefined>;
  createBlogArticle(article: InsertBlogArticle): Promise<BlogArticle>;
  updateBlogArticle(id: number, article: Partial<InsertBlogArticle>): Promise<BlogArticle | undefined>;
  deleteBlogArticle(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private projectsData: Map<number, Project>;
  private servicesData: Map<number, Service>;
  private productsData: Map<number, Product>;
  private jobOpeningsData: Map<number, JobOpening>;
  private jobApplicationsData: Map<number, JobApplication>;
  private blogArticlesData: Map<number, BlogArticle>;
  
  sessionStore: session.Store;
  
  private currentUserId: number;
  private currentProjectId: number;
  private currentServiceId: number;
  private currentProductId: number;
  private currentJobOpeningId: number;
  private currentJobApplicationId: number;
  private currentBlogArticleId: number;

  constructor() {
    this.usersData = new Map();
    this.projectsData = new Map();
    this.servicesData = new Map();
    this.productsData = new Map();
    this.jobOpeningsData = new Map();
    this.jobApplicationsData = new Map();
    this.blogArticlesData = new Map();
    
    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentServiceId = 1;
    this.currentProductId = 1;
    this.currentJobOpeningId = 1;
    this.currentJobApplicationId = 1;
    this.currentBlogArticleId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Add initial data
    this.seedInitialData();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: false, 
      createdAt: now
    };
    this.usersData.set(id, user);
    return user;
  }
  
  // Projects
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projectsData.values());
  }
  
  async getProjectById(id: number): Promise<Project | undefined> {
    return this.projectsData.get(id);
  }
  
  async getProjectsByCategory(category: string): Promise<Project[]> {
    return Array.from(this.projectsData.values()).filter(
      (project) => project.category === category
    );
  }
  
  async getFeaturedProjects(): Promise<Project[]> {
    return Array.from(this.projectsData.values()).filter(
      (project) => project.featured
    );
  }
  
  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const newProject: Project = { ...project, id, createdAt: now };
    this.projectsData.set(id, newProject);
    return newProject;
  }
  
  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const existingProject = this.projectsData.get(id);
    
    if (!existingProject) {
      return undefined;
    }
    
    const updatedProject: Project = {
      ...existingProject,
      ...project,
    };
    
    this.projectsData.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    return this.projectsData.delete(id);
  }
  
  // Services
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.servicesData.values());
  }
  
  async getServiceById(id: number): Promise<Service | undefined> {
    return this.servicesData.get(id);
  }
  
  async createService(service: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const now = new Date();
    const newService: Service = { ...service, id, createdAt: now };
    this.servicesData.set(id, newService);
    return newService;
  }
  
  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    const existingService = this.servicesData.get(id);
    
    if (!existingService) {
      return undefined;
    }
    
    const updatedService: Service = {
      ...existingService,
      ...service,
    };
    
    this.servicesData.set(id, updatedService);
    return updatedService;
  }
  
  async deleteService(id: number): Promise<boolean> {
    return this.servicesData.delete(id);
  }
  
  // Job Openings
  async getAllJobOpenings(): Promise<JobOpening[]> {
    return Array.from(this.jobOpeningsData.values());
  }
  
  async getActiveJobOpenings(): Promise<JobOpening[]> {
    return Array.from(this.jobOpeningsData.values()).filter(
      (job) => job.active
    );
  }
  
  async getJobOpeningById(id: number): Promise<JobOpening | undefined> {
    return this.jobOpeningsData.get(id);
  }
  
  async createJobOpening(jobOpening: InsertJobOpening): Promise<JobOpening> {
    const id = this.currentJobOpeningId++;
    const now = new Date();
    const newJobOpening: JobOpening = { ...jobOpening, id, createdAt: now };
    this.jobOpeningsData.set(id, newJobOpening);
    return newJobOpening;
  }
  
  async updateJobOpening(id: number, jobOpening: Partial<InsertJobOpening>): Promise<JobOpening | undefined> {
    const existingJobOpening = this.jobOpeningsData.get(id);
    
    if (!existingJobOpening) {
      return undefined;
    }
    
    const updatedJobOpening: JobOpening = {
      ...existingJobOpening,
      ...jobOpening,
    };
    
    this.jobOpeningsData.set(id, updatedJobOpening);
    return updatedJobOpening;
  }
  
  async deleteJobOpening(id: number): Promise<boolean> {
    return this.jobOpeningsData.delete(id);
  }
  
  // Job Applications
  async getAllJobApplications(): Promise<JobApplication[]> {
    return Array.from(this.jobApplicationsData.values());
  }
  
  async getJobApplicationById(id: number): Promise<JobApplication | undefined> {
    return this.jobApplicationsData.get(id);
  }
  
  async getJobApplicationsByJobId(jobId: number): Promise<JobApplication[]> {
    return Array.from(this.jobApplicationsData.values()).filter(
      (application) => application.jobId === jobId
    );
  }
  
  async createJobApplication(application: InsertJobApplication): Promise<JobApplication> {
    const id = this.currentJobApplicationId++;
    const now = new Date();
    const newJobApplication: JobApplication = { ...application, id, createdAt: now };
    this.jobApplicationsData.set(id, newJobApplication);
    return newJobApplication;
  }
  
  async deleteJobApplication(id: number): Promise<boolean> {
    return this.jobApplicationsData.delete(id);
  }
  
  // Blog Articles
  async getAllBlogArticles(): Promise<BlogArticle[]> {
    return Array.from(this.blogArticlesData.values());
  }
  
  async getPublishedBlogArticles(): Promise<BlogArticle[]> {
    return Array.from(this.blogArticlesData.values()).filter(
      (article) => article.published
    );
  }
  
  async getBlogArticleById(id: number): Promise<BlogArticle | undefined> {
    return this.blogArticlesData.get(id);
  }
  
  async createBlogArticle(article: InsertBlogArticle): Promise<BlogArticle> {
    const id = this.currentBlogArticleId++;
    const now = new Date();
    const newBlogArticle: BlogArticle = { ...article, id, createdAt: now };
    this.blogArticlesData.set(id, newBlogArticle);
    return newBlogArticle;
  }
  
  async updateBlogArticle(id: number, article: Partial<InsertBlogArticle>): Promise<BlogArticle | undefined> {
    const existingBlogArticle = this.blogArticlesData.get(id);
    
    if (!existingBlogArticle) {
      return undefined;
    }
    
    const updatedBlogArticle: BlogArticle = {
      ...existingBlogArticle,
      ...article,
    };
    
    this.blogArticlesData.set(id, updatedBlogArticle);
    return updatedBlogArticle;
  }
  
  async deleteBlogArticle(id: number): Promise<boolean> {
    return this.blogArticlesData.delete(id);
  }
  
  private seedInitialData() {
    // Seed admin user
    const adminUser: User = {
      id: this.currentUserId++,
      username: 'admin@pixelperfect.com',
      // Plain text password for development
      password: 'admin123',
      isAdmin: true,
      createdAt: new Date()
    };
    this.usersData.set(adminUser.id, adminUser);
    
    // Seed projects
    const projects: InsertProject[] = [
      {
        title: 'Modern E-commerce Platform',
        description: 'A complete digital shopping experience for a fashion brand',
        category: 'Web Design',
        client: 'Fashion Brand',
        imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&auto=format&fit=crop',
        featured: true
      },
      {
        title: 'NextGen Banking App',
        description: 'Intuitive mobile banking experience with advanced security',
        category: 'Mobile Apps',
        client: 'Financial Services',
        imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&auto=format&fit=crop',
        featured: true
      },
      {
        title: 'Evergreen Rebranding',
        description: 'Complete brand refresh for an established sustainability company',
        category: 'Brand Identity',
        client: 'Eco Solutions',
        imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&auto=format&fit=crop',
        featured: true
      },
      {
        title: 'Analytics Dashboard',
        description: 'Data visualization platform for marketing professionals',
        category: 'Web Design',
        client: 'Marketing Agency',
        imageUrl: 'https://images.unsplash.com/photo-1559028006-448665bd7c7b?w=600&auto=format&fit=crop',
        featured: false
      },
      {
        title: 'Fitness Tracking App',
        description: 'Comprehensive fitness solution with social features',
        category: 'Mobile Apps',
        client: 'Health Tech',
        imageUrl: 'https://images.unsplash.com/photo-1553484771-047a44eee27a?w=600&auto=format&fit=crop',
        featured: false
      },
      {
        title: 'Culinary Brand Identity',
        description: 'Fresh identity for an upscale restaurant chain',
        category: 'Brand Identity',
        client: 'Restaurant Group',
        imageUrl: 'https://images.unsplash.com/photo-1569017388730-020b5f80a004?w=600&auto=format&fit=crop',
        featured: false
      }
    ];
    
    projects.forEach(project => {
      this.createProject(project);
    });
    
    // Seed services
    const services: InsertService[] = [
      {
        title: 'Web Development',
        description: 'Custom websites and web applications built with cutting-edge technologies to deliver exceptional user experiences.',
        icon: 'laptop-code',
        features: ['Responsive design', 'CMS integration', 'E-commerce solutions']
      },
      {
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications that provide seamless experiences across all devices.',
        icon: 'mobile-alt',
        features: ['iOS & Android apps', 'React Native & Flutter', 'App maintenance & updates']
      },
      {
        title: 'UI/UX Design',
        description: 'User-centered design solutions that create intuitive, engaging, and memorable digital experiences.',
        icon: 'paint-brush',
        features: ['User research', 'Wireframing & prototyping', 'Design systems']
      },
      {
        title: 'Digital Marketing',
        description: 'Strategic marketing campaigns that increase visibility, drive traffic, and generate leads for your business.',
        icon: 'bullhorn',
        features: ['SEO & content strategy', 'Social media marketing', 'PPC & display advertising']
      },
      {
        title: 'Brand Identity',
        description: 'Comprehensive branding solutions that help you establish a strong and distinctive market presence.',
        icon: 'layer-group',
        features: ['Logo & visual identity', 'Brand guidelines', 'Brand messaging']
      },
      {
        title: 'Analytics & Optimization',
        description: 'Data-driven insights and optimization strategies to improve performance and ROI of your digital assets.',
        icon: 'chart-line',
        features: ['Performance analysis', 'Conversion rate optimization', 'A/B testing']
      }
    ];
    
    services.forEach(service => {
      this.createService(service);
    });
    
    // Seed job openings
    const jobOpenings: InsertJobOpening[] = [
      {
        title: 'Senior UI/UX Designer',
        location: 'Remote',
        type: 'Full-time',
        salary: 'Competitive',
        description: 'Create exceptional user experiences for web and mobile applications. Work closely with development teams to bring designs to life.',
        active: true
      },
      {
        title: 'Full-Stack Developer',
        location: 'New York',
        type: 'Full-time',
        salary: 'Competitive',
        description: 'Develop modern web applications using JavaScript frameworks. Experience with React, Node.js, and databases required.',
        active: true
      },
      {
        title: 'Digital Marketing Specialist',
        location: 'Hybrid',
        type: 'Full-time',
        salary: 'Competitive',
        description: 'Develop and implement digital marketing strategies for our clients. Experience with SEO, PPC, and content marketing required.',
        active: true
      }
    ];
    
    jobOpenings.forEach(job => {
      this.createJobOpening(job);
    });
    
    // Seed blog articles
    const blogArticles: InsertBlogArticle[] = [
      {
        title: '10 UX Design Trends to Watch in 2023',
        content: `<p>The world of UX design is constantly evolving, with new trends and technologies emerging all the time. In this article, we'll explore the top 10 UX design trends that are shaping the digital landscape in 2023.</p>
        <h2>1. Dark Mode</h2>
        <p>Dark mode has gained significant popularity over the past few years, and it's showing no signs of slowing down. Not only does it reduce eye strain and save battery life, but it also creates a sleek and modern look for your digital products.</p>
        <h2>2. Voice User Interface (VUI)</h2>
        <p>With the rise of smart speakers and voice assistants, VUI is becoming an increasingly important part of UX design. Designing for voice requires a different approach than traditional visual interfaces, focusing on conversation flows and natural language processing.</p>
        <h2>3. Microinteractions</h2>
        <p>Microinteractions are small animations or feedback mechanisms that enhance user experience by providing visual cues and making interfaces more engaging. From button states to loading animations, these subtle details can make a significant difference in the overall user experience.</p>
        <h2>4. 3D Elements</h2>
        <p>3D elements are making a comeback in web and mobile design, adding depth and interactivity to interfaces. With advances in web technologies, designers can now incorporate more complex 3D elements without sacrificing performance.</p>
        <h2>5. Augmented Reality (AR)</h2>
        <p>AR is revolutionizing how users interact with digital products, particularly in e-commerce and retail. By allowing users to visualize products in their own space before making a purchase, AR creates a more immersive and engaging shopping experience.</p>
        <h2>6. Minimalism and White Space</h2>
        <p>Minimalist design with generous use of white space continues to dominate UX design. This approach focuses on simplicity and clarity, making interfaces more intuitive and reducing cognitive load for users.</p>
        <h2>7. Personalized User Experiences</h2>
        <p>Personalization is becoming increasingly sophisticated, with AI and machine learning algorithms creating truly customized experiences for each user. From content recommendations to personalized interfaces, this trend is all about making users feel understood and valued.</p>
        <h2>8. Neomorphism</h2>
        <p>Neomorphism is a design style that combines elements of skeuomorphism and flat design, creating soft, extruded shapes that appear to be pressed out from the background. This trend adds a tactile quality to interfaces, making them more inviting and engaging.</p>
        <h2>9. Accessibility-First Design</h2>
        <p>Accessibility is no longer an afterthought but a fundamental aspect of UX design. Designers are increasingly adopting an accessibility-first approach, ensuring that digital products are usable by people of all abilities from the outset.</p>
        <h2>10. Storytelling</h2>
        <p>Storytelling in UX design involves crafting narratives that guide users through the interface, creating emotional connections and making complex information more accessible. This approach helps users understand the value proposition and creates more memorable experiences.</p>
        <p>By staying up-to-date with these UX design trends, designers can create more engaging, intuitive, and effective digital experiences. However, it's important to remember that trends should always serve the needs of your users, rather than being implemented for their own sake.</p>`,
        excerpt: 'Explore the latest UX design trends that are shaping the digital landscape and how you can implement them in your projects.',
        category: 'Design',
        imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&auto=format&fit=crop',
        authorName: 'Sarah Johnson',
        authorImageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        published: true
      },
      {
        title: 'Building Performance-First Web Applications',
        content: `<p>In today's fast-paced digital world, performance is a critical factor in the success of web applications. Users expect websites to load quickly and respond immediately to their interactions. In this article, we'll explore strategies for building performance-first web applications that provide the best possible user experience.</p>
        <h2>Understanding Web Performance</h2>
        <p>Web performance can be measured in various ways, including load time, time to interactive, and overall responsiveness. Poor performance can lead to high bounce rates, low conversion rates, and a negative user experience. By prioritizing performance from the start, you can avoid these issues and create a better experience for your users.</p>
        <h2>Optimize Images and Media</h2>
        <p>Images and media files are often the largest components of a web page. By optimizing these files, you can significantly improve load times. Use modern image formats like WebP, implement responsive images, and consider lazy loading to defer the loading of off-screen images.</p>
        <h2>Minimize and Optimize CSS and JavaScript</h2>
        <p>Minifying and compressing CSS and JavaScript files reduces their size, leading to faster downloads. Additionally, consider techniques like code splitting to load only the code that's needed for the current page, rather than loading everything at once.</p>
        <h2>Implement Caching Strategies</h2>
        <p>Caching allows browsers to store copies of static files, reducing the need for repeated downloads. Implement browser caching, use service workers for offline capabilities, and consider implementing a content delivery network (CDN) to serve files from locations closer to your users.</p>
        <h2>Optimize Critical Rendering Path</h2>
        <p>The critical rendering path is the sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels on the screen. By optimizing this path, you can ensure that your page loads and becomes interactive as quickly as possible. This includes inlining critical CSS, deferring non-critical JavaScript, and prioritizing visible content.</p>
        <h2>Use Modern Web Technologies</h2>
        <p>Technologies like HTTP/2 and HTTP/3 offer significant performance improvements over older protocols. Take advantage of these technologies to reduce latency and improve the overall performance of your web applications.</p>
        <h2>Implement Performance Monitoring</h2>
        <p>Performance monitoring allows you to track the performance of your web application over time and identify areas for improvement. Use tools like Lighthouse, WebPageTest, and real user monitoring (RUM) to gather data on your application's performance.</p>
        <h2>Optimize for Core Web Vitals</h2>
        <p>Core Web Vitals are a set of metrics developed by Google to measure user experience. These include Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS). By optimizing for these metrics, you can improve both user experience and search engine rankings.</p>
        <h2>Consider Server-Side Rendering (SSR) or Static Site Generation (SSG)</h2>
        <p>For applications with dynamic content, consider using server-side rendering to deliver a fully-rendered page to the client. For more static content, static site generation can provide even better performance by pre-rendering pages at build time.</p>
        <h2>Conclusion</h2>
        <p>Building performance-first web applications requires a holistic approach, considering everything from the size of your assets to the architecture of your application. By prioritizing performance from the start and continuously monitoring and optimizing your application, you can create a better experience for your users and achieve your business goals.</p>`,
        excerpt: 'Learn how to optimize your web applications for maximum performance and provide a better user experience.',
        category: 'Development',
        imageUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&auto=format&fit=crop',
        authorName: 'David Chen',
        authorImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        published: true
      },
      {
        title: 'The Future of Content Marketing Strategy',
        content: `<p>Content marketing has evolved significantly over the past decade, driven by changes in consumer behavior, technology, and the digital landscape. As we look to the future, several trends and strategies are emerging that will shape the next generation of content marketing. In this article, we'll explore these trends and provide insights into how you can adapt your content marketing strategy to stay ahead.</p>
        <h2>The Rise of Personalized Content</h2>
        <p>Personalization has been a buzzword in marketing for years, but advancements in AI and data analytics are taking it to a new level. In the future, content marketers will be able to deliver highly personalized content experiences that adapt to individual user preferences, behaviors, and contexts in real-time. This means moving beyond simple demographic targeting to creating dynamic content that changes based on user interactions and journey stage.</p>
        <h2>Interactive and Immersive Content</h2>
        <p>As consumers seek more engaging and interactive experiences, static content is giving way to interactive formats. Quizzes, polls, interactive infographics, and assessments not only capture attention but also provide valuable data on user preferences and behaviors. Additionally, immersive technologies like AR and VR are creating new possibilities for content experiences that blur the line between digital and physical worlds.</p>
        <h2>Voice and Visual Search Optimization</h2>
        <p>The growing popularity of voice assistants and visual search tools is changing how consumers find content. Content marketers need to adapt by optimizing for conversational keywords and natural language queries, as well as ensuring their visual content is properly tagged and indexed for visual search engines. This requires a shift in SEO strategy and content creation processes.</p>
        <h2>User-Generated Content and Community Building</h2>
        <p>Authentic, user-generated content continues to gain importance as consumers seek genuine connections with brands. Building communities around your brand and encouraging user participation will be key to content marketing success. This means creating platforms and opportunities for customers to share their experiences, provide feedback, and contribute to your content ecosystem.</p>
        <h2>Content Atomization and Repackaging</h2>
        <p>Creating high-quality content requires significant resources, leading to a trend towards content atomization—breaking down larger pieces of content into smaller, modular components that can be used across different channels and formats. This approach maximizes the value of your content investments and allows for more efficient content creation and distribution.</p>
        <h2>Data-Driven Content Strategy</h2>
        <p>As data collection and analysis capabilities improve, content marketers can make more informed decisions about what content to create, when to publish it, and how to distribute it. This includes using predictive analytics to anticipate topics of interest, performance metrics to refine content strategies, and AI-powered content optimization tools to improve engagement and conversion rates.</p>
        <h2>Values-Based Content</h2>
        <p>Consumers increasingly expect brands to take stands on social, environmental, and political issues. Content that reflects your brand's values and demonstrates your commitment to positive change can build stronger connections with like-minded consumers. However, this approach requires authenticity and consistency—empty gestures or "purpose washing" can backfire.</p>
        <h2>Multi-Channel, Omni-Present Content</h2>
        <p>The future of content marketing involves seamless experiences across multiple channels and touchpoints. This means creating content that works across different platforms and devices, adapting to the specific requirements and expectations of each while maintaining a consistent brand voice and message. It also means being present where your audience is, whether that's emerging social platforms, messaging apps, or new digital environments.</p>
        <h2>Conclusion</h2>
        <p>The future of content marketing is exciting and challenging, requiring marketers to embrace new technologies, formats, and strategies. By staying attuned to these trends and continuously adapting your approach, you can create content that resonates with your audience, drives engagement, and achieves your business objectives. The key is to remain flexible, data-driven, and focused on delivering value to your audience in whatever form they prefer to consume it.</p>`,
        excerpt: 'Discover how content marketing is evolving and what strategies will help your brand stand out in a crowded digital landscape.',
        category: 'Marketing',
        imageUrl: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=600&auto=format&fit=crop',
        authorName: 'Emily Rodriguez',
        authorImageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
        published: true
      }
    ];
    
    blogArticles.forEach(article => {
      this.createBlogArticle(article);
    });
  }
}

import { DatabaseStorage } from "./database-storage";

// Use DatabaseStorage instead of MemStorage for persistent storage
export const storage = new DatabaseStorage();

// Seed initial data
storage.seedInitialData().catch(error => {
  console.error("Error seeding initial data:", error);
});
