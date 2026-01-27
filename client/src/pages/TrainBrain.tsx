import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Brain, Plus, Video, Quote, Trash2, Tag, User, Zap, Target, BookOpen, Heart } from "lucide-react";
import type { Drill, MentalEdge } from "@shared/schema";

// Form schemas
const drillFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  category: z.enum(["Pitching", "Hitting", "Catching", "Throwing"]),
  skillType: z.string().min(1, "Skill type is required"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  description: z.string().min(20, "Description must be at least 20 characters"),
  videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  expertSource: z.string().optional(),
  mechanicTags: z.string().min(1, "At least one mechanic tag is required"),
  issueAddressed: z.string().optional(),
});

const mentalEdgeFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  contentType: z.enum(["quote", "video", "principle", "visualization"]),
  category: z.enum(["Pre-Game", "Recovery", "Focus", "Confidence", "Resilience"]),
  source: z.string().min(1, "Source is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tags: z.string().min(1, "At least one tag is required"),
  usageContext: z.string().optional(),
});

type DrillFormValues = z.infer<typeof drillFormSchema>;
type MentalEdgeFormValues = z.infer<typeof mentalEdgeFormSchema>;

export default function TrainBrain() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("drills");

  // Fetch existing drills
  const { data: drills = [], isLoading: loadingDrills } = useQuery<Drill[]>({
    queryKey: ["/api/drills"],
  });

  // Fetch existing mental edge content
  const { data: mentalEdge = [], isLoading: loadingMental } = useQuery<MentalEdge[]>({
    queryKey: ["/api/mental-edge"],
  });

  // Drill form
  const drillForm = useForm<DrillFormValues>({
    resolver: zodResolver(drillFormSchema),
    defaultValues: {
      name: "",
      category: "Pitching",
      skillType: "pitching",
      difficulty: "Intermediate",
      description: "",
      videoUrl: "",
      expertSource: "",
      mechanicTags: "",
      issueAddressed: "",
    },
  });

  // Mental edge form
  const mentalForm = useForm<MentalEdgeFormValues>({
    resolver: zodResolver(mentalEdgeFormSchema),
    defaultValues: {
      title: "",
      contentType: "quote",
      category: "Pre-Game",
      source: "",
      content: "",
      videoUrl: "",
      tags: "",
      usageContext: "",
    },
  });

  // Add drill mutation
  const addDrillMutation = useMutation({
    mutationFn: async (data: DrillFormValues) => {
      const payload = {
        ...data,
        videoUrl: data.videoUrl || undefined,
        mechanicTags: data.mechanicTags.split(",").map(t => t.trim()).filter(Boolean),
        equipment: [],
        ageRange: "All Ages",
      };
      return apiRequest("POST", "/api/brain/train/drill", payload);
    },
    onSuccess: () => {
      toast({ title: "Drill Added!", description: "The AI Brain has learned new knowledge." });
      queryClient.invalidateQueries({ queryKey: ["/api/drills"] });
      drillForm.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Add mental edge mutation
  const addMentalMutation = useMutation({
    mutationFn: async (data: MentalEdgeFormValues) => {
      const payload = {
        ...data,
        videoUrl: data.videoUrl || undefined,
        tags: data.tags.split(",").map(t => t.trim()).filter(Boolean),
      };
      return apiRequest("POST", "/api/brain/train/mental-edge", payload);
    },
    onSuccess: () => {
      toast({ title: "Mental Edge Added!", description: "New mindset content has been absorbed." });
      queryClient.invalidateQueries({ queryKey: ["/api/mental-edge"] });
      mentalForm.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Delete drill mutation
  const deleteDrillMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/drills/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Drill Removed", description: "Knowledge has been deleted." });
      queryClient.invalidateQueries({ queryKey: ["/api/drills"] });
    },
  });

  // Delete mental edge mutation
  const deleteMentalMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/mental-edge/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Content Removed", description: "Mental edge content deleted." });
      queryClient.invalidateQueries({ queryKey: ["/api/mental-edge"] });
    },
  });

  const onSubmitDrill = (data: DrillFormValues) => {
    addDrillMutation.mutate(data);
  };

  const onSubmitMental = (data: MentalEdgeFormValues) => {
    addMentalMutation.mutate(data);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Pitching": return <Target className="w-4 h-4" />;
      case "Hitting": return <Zap className="w-4 h-4" />;
      case "Catching": return <User className="w-4 h-4" />;
      case "Throwing": return <Target className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getMentalCategoryColor = (category: string) => {
    switch (category) {
      case "Pre-Game": return "bg-neon-green/20 text-neon-green border-neon-green/40";
      case "Recovery": return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "Focus": return "bg-purple-500/20 text-purple-400 border-purple-500/40";
      case "Confidence": return "bg-hot-pink/20 text-hot-pink border-hot-pink/40";
      case "Resilience": return "bg-electric-yellow/20 text-electric-yellow border-electric-yellow/40";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-neon-green/20 border border-neon-green/40">
            <Brain className="w-8 h-8 text-neon-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Train the AI Brain</h1>
            <p className="text-muted-foreground">Continuously teach new knowledge to the Expert System</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-neon-green">{drills.filter(d => d.category === "Pitching").length}</p>
              <p className="text-xs text-muted-foreground">Pitching</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-hot-pink">{drills.filter(d => d.category === "Hitting").length}</p>
              <p className="text-xs text-muted-foreground">Hitting</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-electric-yellow">{drills.filter(d => d.category === "Catching").length}</p>
              <p className="text-xs text-muted-foreground">Catching</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">{drills.filter(d => d.category === "Throwing").length}</p>
              <p className="text-xs text-muted-foreground">Throwing</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{mentalEdge.length}</p>
              <p className="text-xs text-muted-foreground">Mental Edge</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="drills" data-testid="tab-drills" className="data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green">
              <Video className="w-4 h-4 mr-2" />
              Drill Knowledge
            </TabsTrigger>
            <TabsTrigger value="mental" data-testid="tab-mental" className="data-[state=active]:bg-hot-pink/20 data-[state=active]:text-hot-pink">
              <Heart className="w-4 h-4 mr-2" />
              Mental Edge
            </TabsTrigger>
          </TabsList>

          {/* DRILLS TAB */}
          <TabsContent value="drills" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add Drill Form */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-neon-green">
                    <Plus className="w-5 h-5" />
                    Add New Drill
                  </CardTitle>
                  <CardDescription>Teach the AI Brain new drill knowledge</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...drillForm}>
                    <form onSubmit={drillForm.handleSubmit(onSubmitDrill)} className="space-y-4">
                      <FormField
                        control={drillForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Drill Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Internal Rotation Power Drill" {...field} data-testid="input-drill-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={drillForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={(value) => {
                                field.onChange(value);
                                drillForm.setValue("skillType", value.toLowerCase());
                              }} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-drill-category">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Pitching">Pitching</SelectItem>
                                  <SelectItem value="Hitting">Hitting</SelectItem>
                                  <SelectItem value="Catching">Catching</SelectItem>
                                  <SelectItem value="Throwing">Throwing</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={drillForm.control}
                          name="difficulty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Difficulty</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-drill-difficulty">
                                    <SelectValue placeholder="Select difficulty" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Beginner">Beginner</SelectItem>
                                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                                  <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={drillForm.control}
                        name="videoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>YouTube URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.youtube.com/watch?v=..." {...field} data-testid="input-drill-video" />
                            </FormControl>
                            <FormDescription>Reference video for this drill</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={drillForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Detailed biomechanical explanation of the drill..."
                                className="min-h-[100px]"
                                {...field}
                                data-testid="input-drill-description"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={drillForm.control}
                        name="mechanicTags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mechanic Tags</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Internal Rotation, Hip Drive, Arm Path (comma separated)"
                                {...field}
                                data-testid="input-drill-tags"
                              />
                            </FormControl>
                            <FormDescription>Key biomechanical concepts (comma separated)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={drillForm.control}
                          name="expertSource"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expert Source</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Amanda Scarborough" {...field} data-testid="input-drill-source" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={drillForm.control}
                          name="issueAddressed"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Issue Addressed</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Weak leg drive" {...field} data-testid="input-drill-issue" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                        disabled={addDrillMutation.isPending}
                        data-testid="button-train-drill"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        {addDrillMutation.isPending ? "Training..." : "Train AI Brain"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Existing Drills */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-neon-green" />
                    Knowledge Base ({drills.length} drills)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                    {loadingDrills ? (
                      <p className="text-muted-foreground">Loading...</p>
                    ) : drills.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No drills yet. Add some!</p>
                    ) : (
                      drills.map((drill) => (
                        <div 
                          key={drill.id} 
                          className="p-3 rounded-lg bg-background/50 border border-border hover-elevate group"
                          data-testid={`drill-item-${drill.id}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {getCategoryIcon(drill.category)}
                                <span className="font-medium text-sm truncate">{drill.name}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {drill.category}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {drill.difficulty}
                                </Badge>
                                {drill.expertSource && (
                                  <Badge variant="outline" className="text-xs text-muted-foreground">
                                    {drill.expertSource}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => deleteDrillMutation.mutate(drill.id)}
                              data-testid={`button-delete-drill-${drill.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* MENTAL EDGE TAB */}
          <TabsContent value="mental" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add Mental Edge Form */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-hot-pink">
                    <Heart className="w-5 h-5" />
                    Add Mental Edge Content
                  </CardTitle>
                  <CardDescription>Inject mindset and motivation content</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...mentalForm}>
                    <form onSubmit={mentalForm.handleSubmit(onSubmitMental)} className="space-y-4">
                      <FormField
                        control={mentalForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Championship Mindset - Fearless Focus" {...field} data-testid="input-mental-title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={mentalForm.control}
                          name="contentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-mental-type">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="quote">Quote</SelectItem>
                                  <SelectItem value="video">Video</SelectItem>
                                  <SelectItem value="principle">Principle</SelectItem>
                                  <SelectItem value="visualization">Visualization</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={mentalForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-mental-category">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Pre-Game">Pre-Game</SelectItem>
                                  <SelectItem value="Recovery">Recovery</SelectItem>
                                  <SelectItem value="Focus">Focus</SelectItem>
                                  <SelectItem value="Confidence">Confidence</SelectItem>
                                  <SelectItem value="Resilience">Resilience</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={mentalForm.control}
                        name="source"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Source</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Kobe Bryant, Michael Jordan" {...field} data-testid="input-mental-source" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mentalForm.control}
                        name="videoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Video URL (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.youtube.com/watch?v=..." {...field} data-testid="input-mental-video" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mentalForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="The quote, principle, or visualization content..."
                                className="min-h-[100px]"
                                {...field}
                                data-testid="input-mental-content"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mentalForm.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Championship Mindset, Work Ethic, Fearless (comma separated)"
                                {...field}
                                data-testid="input-mental-tags"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mentalForm.control}
                        name="usageContext"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Usage Context</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Before at-bat, after strikeout" {...field} data-testid="input-mental-context" />
                            </FormControl>
                            <FormDescription>When should this content be used?</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-hot-pink text-white hover:bg-hot-pink/90"
                        disabled={addMentalMutation.isPending}
                        data-testid="button-train-mental"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        {addMentalMutation.isPending ? "Adding..." : "Add to Mental Edge"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Existing Mental Edge Content */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-hot-pink" />
                    Mental Edge Library ({mentalEdge.length} items)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                    {loadingMental ? (
                      <p className="text-muted-foreground">Loading...</p>
                    ) : mentalEdge.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No content yet. Add some inspiration!</p>
                    ) : (
                      mentalEdge.map((item) => (
                        <div 
                          key={item.id} 
                          className="p-3 rounded-lg bg-background/50 border border-border hover-elevate group"
                          data-testid={`mental-item-${item.id}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {item.contentType === "video" ? (
                                  <Video className="w-4 h-4 text-hot-pink" />
                                ) : item.contentType === "quote" ? (
                                  <Quote className="w-4 h-4 text-electric-yellow" />
                                ) : (
                                  <Brain className="w-4 h-4 text-neon-green" />
                                )}
                                <span className="font-medium text-sm truncate">{item.title}</span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                                {item.content}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <Badge className={`text-xs ${getMentalCategoryColor(item.category)}`}>
                                  {item.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {item.source}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => deleteMentalMutation.mutate(item.id)}
                              data-testid={`button-delete-mental-${item.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
