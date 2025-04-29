import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";
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
import { Service, insertServiceSchema } from "@shared/schema";
import { z } from "zod";
import { useState } from "react";

interface ServiceFormProps {
  serviceData?: Service;
  onSuccess: () => void;
}

// Available icons for services
const availableIcons = [
  'laptop-code', 'mobile-alt', 'paint-brush', 'bullhorn', 
  'layer-group', 'chart-line', 'code', 'globe', 'cog',
  'users', 'search', 'shopping-cart', 'rocket'
];

export default function ServiceForm({ serviceData, onSuccess }: ServiceFormProps) {
  const { toast } = useToast();
  const isEditing = !!serviceData;
  const [features, setFeatures] = useState<string[]>(serviceData?.features || []);
  const [newFeature, setNewFeature] = useState("");

  const form = useForm<z.infer<typeof insertServiceSchema>>({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      title: serviceData?.title || "",
      description: serviceData?.description || "",
      icon: serviceData?.icon || "",
      features: serviceData?.features || [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertServiceSchema>) => {
      // Ensure features are included in the data
      const dataWithFeatures = {
        ...data,
        features: features
      };
      
      if (isEditing) {
        await apiRequest("PUT", `/api/services/${serviceData.id}`, dataWithFeatures);
      } else {
        await apiRequest("POST", "/api/services", dataWithFeatures);
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Service updated" : "Service created",
        description: isEditing 
          ? "The service has been successfully updated." 
          : "The service has been successfully created.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} service: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof insertServiceSchema>) {
    if (features.length === 0) {
      toast({
        title: "Validation error",
        description: "Please add at least one feature",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate(data);
  }
  
  const addFeature = () => {
    if (newFeature.trim() === "") return;
    
    if (!features.includes(newFeature)) {
      const updatedFeatures = [...features, newFeature];
      setFeatures(updatedFeatures);
      form.setValue("features", updatedFeatures);
    }
    
    setNewFeature("");
  };
  
  const removeFeature = (feature: string) => {
    const updatedFeatures = features.filter(f => f !== feature);
    setFeatures(updatedFeatures);
    form.setValue("features", updatedFeatures);
  };

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
                <Input placeholder="Service title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Service description"
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
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableIcons.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      <div className="flex items-center">
                        <i className={`fas fa-${icon} text-primary mr-2`}></i>
                        {icon}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Features</FormLabel>
          <div className="flex gap-2 mb-2">
            <Input 
              placeholder="Add a feature"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFeature();
                }
              }}
            />
            <Button 
              type="button" 
              variant="secondary"
              onClick={addFeature}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {features.length === 0 && (
            <p className="text-sm text-muted-foreground">No features added yet. Add some features above.</p>
          )}
          
          <div className="space-y-2 mt-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <span>{feature}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeFeature(feature)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.features && (
            <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.features.message}</p>
          )}
        </div>
        
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
              isEditing ? "Update Service" : "Create Service"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
