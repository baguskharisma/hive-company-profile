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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogArticle, insertBlogArticleSchema } from "@shared/schema";
import { z } from "zod";
import { useState } from "react";

interface BlogFormProps {
  articleData?: BlogArticle;
  onSuccess: () => void;
}

export default function BlogForm({ articleData, onSuccess }: BlogFormProps) {
  const { toast } = useToast();
  const isEditing = !!articleData;
  const [previewContent, setPreviewContent] = useState(articleData?.content || "");

  const form = useForm<z.infer<typeof insertBlogArticleSchema>>({
    resolver: zodResolver(insertBlogArticleSchema),
    defaultValues: {
      title: articleData?.title || "",
      content: articleData?.content || "",
      excerpt: articleData?.excerpt || "",
      category: articleData?.category || "",
      imageUrl: articleData?.imageUrl || "",
      authorName: articleData?.authorName || "",
      authorImageUrl: articleData?.authorImageUrl || "",
      published: articleData?.published ?? false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertBlogArticleSchema>) => {
      if (isEditing) {
        await apiRequest("PUT", `/api/blog/${articleData.id}`, data);
      } else {
        await apiRequest("POST", "/api/blog", data);
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Article updated" : "Article created",
        description: isEditing 
          ? "The article has been successfully updated." 
          : "The article has been successfully created.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} article: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof insertBlogArticleSchema>) {
    mutation.mutate(data);
  }
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    form.setValue("content", content);
    setPreviewContent(content);
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
                <Input placeholder="Article title" {...field} />
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
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief summary of the article"
                  className="resize-none min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <Tabs defaultValue="write" className="w-full">
                <TabsList className="mb-2">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write">
                  <FormControl>
                    <Textarea
                      placeholder="Article content with HTML allowed"
                      className="min-h-[300px] font-mono text-sm"
                      {...field}
                      onChange={handleContentChange}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground mt-1">HTML formatting is supported</p>
                </TabsContent>
                <TabsContent value="preview">
                  <div className="border min-h-[300px] rounded-md p-4 overflow-y-auto bg-white">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewContent }} />
                  </div>
                </TabsContent>
              </Tabs>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="authorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="authorImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/author.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Published</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Published articles will be visible on the public blog. Drafts will only be visible in the admin dashboard.
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
              isEditing ? "Update Article" : "Create Article"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
