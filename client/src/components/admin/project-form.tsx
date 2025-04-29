import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Project, insertProjectSchema } from "@shared/schema";
import { z } from "zod";

interface ProjectFormProps {
  projectData?: Project;
  onSuccess: () => void;
}

export default function ProjectForm({ projectData, onSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const isEditing = !!projectData;

  const form = useForm<z.infer<typeof insertProjectSchema>>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: projectData?.title || "",
      description: projectData?.description || "",
      category: projectData?.category || "",
      client: projectData?.client || "",
      imageUrl: projectData?.imageUrl || "",
      featured: projectData?.featured || false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertProjectSchema>) => {
      if (isEditing) {
        await apiRequest("PUT", `/api/projects/${projectData.id}`, data);
      } else {
        await apiRequest("POST", "/api/projects", data);
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Project updated" : "Project created",
        description: isEditing 
          ? "The project has been successfully updated." 
          : "The project has been successfully created.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} project: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof insertProjectSchema>) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Project title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Web Design">Web Design</SelectItem>
                    <SelectItem value="Mobile Apps">Mobile Apps</SelectItem>
                    <SelectItem value="Brand Identity">Brand Identity</SelectItem>
                    <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <FormControl>
                  <Input placeholder="Client name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Project description"
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Featured Project</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Featured projects will be displayed prominently on the homepage.
                </p>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEditing ? "Update Project" : "Create Project"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
