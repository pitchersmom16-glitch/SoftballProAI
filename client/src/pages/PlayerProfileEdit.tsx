import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Camera, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useRef } from "react";
import { api, UpdateAthleteRequest } from "@shared/routes";

const TRAINING_DAYS = [
  "Monday",
  "Tuesday", 
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const profileSchema = api.athletes.update.input.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  parentEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
  graduationYear: z.coerce.number().min(2020).max(2040).optional().nullable(),
  heightInches: z.coerce.number().min(36).max(84).optional().nullable(),
  weightLbs: z.coerce.number().min(50).max(300).optional().nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function PlayerProfileEdit() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const pendingObjectPath = useRef<string | null>(null);

  const { data: playerAthlete, isLoading } = useQuery<{
    id: number;
    firstName: string;
    lastName: string;
    playerPhone: string | null;
    parentPhone: string | null;
    parentEmail: string | null;
    goals: string | null;
    preferredTrainingDays: string[] | null;
    graduationYear: number | null;
    school: string | null;
    heightInches: number | null;
    weightLbs: number | null;
    bats: string | null;
    throws: string | null;
    primaryPosition: string | null;
    photoUrl: string | null;
  }>({
    queryKey: ["/api/player/athlete"],
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      playerPhone: "",
      parentPhone: "",
      parentEmail: "",
      goals: "",
      preferredTrainingDays: [],
      graduationYear: null,
      school: "",
      heightInches: null,
      weightLbs: null,
      bats: "",
      throws: "",
      primaryPosition: "",
    },
    values: playerAthlete ? {
      firstName: playerAthlete.firstName,
      lastName: playerAthlete.lastName,
      playerPhone: playerAthlete.playerPhone || "",
      parentPhone: playerAthlete.parentPhone || "",
      parentEmail: playerAthlete.parentEmail || "",
      goals: playerAthlete.goals || "",
      preferredTrainingDays: playerAthlete.preferredTrainingDays || [],
      graduationYear: playerAthlete.graduationYear,
      school: playerAthlete.school || "",
      heightInches: playerAthlete.heightInches,
      weightLbs: playerAthlete.weightLbs,
      bats: playerAthlete.bats || "",
      throws: playerAthlete.throws || "",
      primaryPosition: playerAthlete.primaryPosition || "",
    } : undefined,
  });

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      if (!playerAthlete) throw new Error("No athlete profile found");
      return apiRequest("PUT", `/api/athletes/${playerAthlete.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/player/athlete"] });
      toast({ 
        title: "Profile Updated", 
        description: "Your profile has been saved successfully." 
      });
    },
    onError: (err: Error) => {
      toast({ 
        title: "Update Failed", 
        description: err.message,
        variant: "destructive" 
      });
    },
  });

  const updatePhoto = useMutation({
    mutationFn: async (photoUrl: string) => {
      if (!playerAthlete) throw new Error("No athlete profile found");
      return apiRequest("PUT", `/api/athletes/${playerAthlete.id}`, { photoUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/player/athlete"] });
      toast({ 
        title: "Photo Updated", 
        description: "Your profile photo has been updated." 
      });
    },
    onError: (err: Error) => {
      toast({ 
        title: "Upload Failed", 
        description: err.message,
        variant: "destructive" 
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-800 animate-pulse rounded" />
        <div className="h-[600px] bg-slate-800 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!playerAthlete) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No athlete profile found for your account.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} data-testid="button-back-dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
          {playerAthlete.firstName} {playerAthlete.lastName}
        </h1>
        <p className="text-muted-foreground mt-2">
          Update your personal information and training preferences
        </p>
      </div>

      <Card className="border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-lg">Profile Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative group">
              {playerAthlete.photoUrl ? (
                <img 
                  src={playerAthlete.photoUrl} 
                  alt={`${playerAthlete.firstName} ${playerAthlete.lastName}`}
                  className="h-24 w-24 rounded-2xl object-cover border-2 border-purple-500/30"
                  data-testid="img-profile-photo"
                />
              ) : (
                <div 
                  className="h-24 w-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 flex items-center justify-center text-4xl font-bold text-purple-400"
                  data-testid="avatar-profile-fallback"
                >
                  {playerAthlete.firstName[0]}
                </div>
              )}
              <ObjectUploader
                maxNumberOfFiles={1}
                maxFileSize={5242880}
                onGetUploadParameters={async (file) => {
                  const response = await fetch("/api/uploads/request-url", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: file.name,
                      size: file.size,
                      type: file.type,
                      prefix: ".private/athlete-photos",
                    }),
                  });
                  const { url, objectPath, headers } = await response.json();
                  pendingObjectPath.current = objectPath;
                  return { url, method: "PUT" as const, headers };
                }}
                onComplete={async () => {
                  if (pendingObjectPath.current) {
                    const photoUrl = `/api/objects/${encodeURIComponent(pendingObjectPath.current)}`;
                    updatePhoto.mutate(photoUrl);
                    pendingObjectPath.current = null;
                  }
                }}
              >
                <button
                  type="button"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer"
                  data-testid="button-upload-photo"
                >
                  <Camera className="h-8 w-8 text-white" />
                </button>
              </ObjectUploader>
            </div>
            <div>
              <p className="font-medium text-foreground">Click the photo to upload a new one</p>
              <p className="text-sm text-muted-foreground">Max file size: 5MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-first-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-last-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Lincoln High School" {...field} value={field.value || ""} data-testid="input-school" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="graduationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Graduation Year</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 2027" 
                          {...field} 
                          value={field.value || ""} 
                          data-testid="input-graduation-year"
                        />
                      </FormControl>
                      <FormDescription>For recruiting purposes</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="heightInches"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (inches)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 64" 
                          {...field} 
                          value={field.value || ""}
                          data-testid="input-height"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weightLbs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (lbs)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 125" 
                          {...field} 
                          value={field.value || ""}
                          data-testid="input-weight"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="primaryPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Position</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-position">
                          <SelectValue placeholder="Select position..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="P">Pitcher (P)</SelectItem>
                        <SelectItem value="C">Catcher (C)</SelectItem>
                        <SelectItem value="1B">First Base (1B)</SelectItem>
                        <SelectItem value="2B">Second Base (2B)</SelectItem>
                        <SelectItem value="SS">Shortstop (SS)</SelectItem>
                        <SelectItem value="3B">Third Base (3B)</SelectItem>
                        <SelectItem value="LF">Left Field (LF)</SelectItem>
                        <SelectItem value="CF">Center Field (CF)</SelectItem>
                        <SelectItem value="RF">Right Field (RF)</SelectItem>
                        <SelectItem value="DP">Designated Player (DP)</SelectItem>
                        <SelectItem value="FLEX">Flex</SelectItem>
                        <SelectItem value="UTIL">Utility</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bats</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger data-testid="select-bats">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="R">Right</SelectItem>
                          <SelectItem value="L">Left</SelectItem>
                          <SelectItem value="S">Switch</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="throws"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Throws</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger data-testid="select-throws">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="R">Right</SelectItem>
                          <SelectItem value="L">Left</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="playerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="(555) 123-4567" 
                        {...field} 
                        value={field.value || ""}
                        data-testid="input-player-phone"
                      />
                    </FormControl>
                    <FormDescription>For practice reminders and coach messages</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="parentPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent/Guardian Phone</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="(555) 123-4567" 
                          {...field} 
                          value={field.value || ""}
                          data-testid="input-parent-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent/Guardian Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="parent@example.com" 
                          {...field} 
                          value={field.value || ""}
                          data-testid="input-parent-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Training Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Goals</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What do you want to achieve? e.g., Improve my rise ball speed, make varsity team, get recruited by D1 school..."
                        className="min-h-[100px]"
                        {...field}
                        value={field.value || ""}
                        data-testid="textarea-goals"
                      />
                    </FormControl>
                    <FormDescription>
                      Share your softball goals so your coach can create a personalized training plan
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredTrainingDays"
                render={() => (
                  <FormItem>
                    <FormLabel>Preferred Training Days</FormLabel>
                    <FormDescription className="mb-3">
                      Select the days you are available for training
                    </FormDescription>
                    <div className="grid grid-cols-4 gap-3">
                      {TRAINING_DAYS.map((day) => (
                        <FormField
                          key={day}
                          control={form.control}
                          name="preferredTrainingDays"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, day]);
                                    } else {
                                      field.onChange(current.filter((d) => d !== day));
                                    }
                                  }}
                                  data-testid={`checkbox-day-${day.toLowerCase()}`}
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-sm cursor-pointer">
                                {day.slice(0, 3)}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/dashboard")}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateProfile.isPending}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              data-testid="button-save-profile"
            >
              {updateProfile.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Profile
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
