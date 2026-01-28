import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Loader2,
  Lock,
  Unlock,
  Target,
  AlertCircle,
  Timer
} from "lucide-react";

interface VideoPrompt {
  number: number;
  category: string;
  title: string;
  description: string;
  focusAreas: string[];
}

interface BaselineVideo {
  id: number;
  videoNumber: number;
  videoCategory: string;
  videoUrl: string;
  status: string;
  durationSeconds?: number;
}

interface OnboardingData {
  dashboardUnlocked: boolean;
  baselineComplete: boolean;
  baselineVideoCount: number;
  baselineVideosRequired: number;
  onboardingType?: string;
  coachId?: number;
  teamId?: number;
  skillType?: string;
  baselineVideos?: BaselineVideo[];
  videoPrompts?: VideoPrompt[];
}

const DEFAULT_VIDEO_PROMPTS: VideoPrompt[] = [
  { number: 1, category: "hitting", title: "Hitting", description: "Record your swing from the side", focusAreas: ["bat path", "hip rotation"] },
  { number: 2, category: "throwing", title: "Throwing", description: "Record your throwing motion", focusAreas: ["arm slot", "follow-through"] },
  { number: 3, category: "fielding", title: "Fielding", description: "Record yourself fielding ground balls", focusAreas: ["glove position", "footwork"] },
  { number: 4, category: "pitching_or_catching", title: "Pitching or Catching", description: "Record your pitch or catching drill", focusAreas: ["arm circle", "release point"] },
];

export default function PlayerOnboarding() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [uploadingVideo, setUploadingVideo] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const { data: onboarding, isLoading } = useQuery<OnboardingData>({
    queryKey: ["/api/player/onboarding"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: { videoUrl: string; videoNumber: number; videoCategory: string; durationSeconds?: number }) => {
      return apiRequest("POST", "/api/player/baseline-video", data);
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/player/onboarding"] });
      setUploadingVideo(null);
      setUploadProgress(0);
      
      if (response.baselineComplete) {
        toast({
          title: "All Videos Uploaded!",
          description: "Your coach will review your videos and unlock your dashboard.",
        });
      } else {
        toast({
          title: "Video Uploaded!",
          description: `${response.remaining} more video(s) to go.`,
        });
      }
    },
    onError: (error: any) => {
      setUploadingVideo(null);
      setUploadProgress(0);
      toast({
        title: "Upload Failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = async (videoNumber: number, category: string, file: File) => {
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid File",
        description: "Please select a video file.",
        variant: "destructive",
      });
      return;
    }

    setUploadingVideo(videoNumber);
    setUploadProgress(10);

    try {
      const video = document.createElement("video");
      video.preload = "metadata";
      
      const duration = await new Promise<number>((resolve) => {
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          resolve(video.duration);
        };
        video.src = URL.createObjectURL(file);
      });

      if (duration > 20) {
        toast({
          title: "Video Too Long",
          description: "Please upload a video that is no longer than 20 seconds.",
          variant: "destructive",
        });
        setUploadingVideo(null);
        setUploadProgress(0);
        return;
      }

      setUploadProgress(30);

      const urlResponse = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `baseline-${category}-${Date.now()}.${file.name.split('.').pop()}`,
          size: file.size,
          contentType: file.type,
        }),
      });

      if (!urlResponse.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadURL, objectPath } = await urlResponse.json();
      setUploadProgress(50);

      await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      setUploadProgress(80);

      uploadMutation.mutate({
        videoUrl: objectPath,
        videoNumber,
        videoCategory: category,
        durationSeconds: Math.round(duration),
      });

    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
      setUploadingVideo(null);
      setUploadProgress(0);
    }
  };

  const triggerFileInput = (videoNumber: number) => {
    const input = fileInputRefs.current[videoNumber];
    if (input) {
      input.click();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center" data-testid="loading-onboarding">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  if (onboarding?.dashboardUnlocked) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-[#0a0a0a] border-green-500/30 text-center">
          <Unlock className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4" data-testid="text-dashboard-unlocked">
            Dashboard Unlocked!
          </h1>
          <p className="text-gray-400 mb-6">
            Your coach has reviewed your baseline videos. You're all set to start training!
          </p>
          <Button
            onClick={() => setLocation("/dashboard")}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
            data-testid="button-go-dashboard"
          >
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const videoPrompts = onboarding?.videoPrompts || DEFAULT_VIDEO_PROMPTS;
  const uploadedVideos = onboarding?.baselineVideos || [];
  const uploadedCategories = uploadedVideos.map(v => v.videoCategory);
  const progress = ((onboarding?.baselineVideoCount || 0) / (onboarding?.baselineVideosRequired || 4)) * 100;

  const getOnboardingTitle = () => {
    switch (onboarding?.onboardingType) {
      case "pitching_instructor":
        return "Pitching Baseline Assessment";
      case "catching_instructor":
        return "Catching Baseline Assessment";
      case "team_coach":
      default:
        return "Athlete Onboarding Checklist";
    }
  };

  const getOnboardingSubtitle = () => {
    switch (onboarding?.onboardingType) {
      case "pitching_instructor":
        return "Upload 4 videos of your pitches. Your instructor will analyze these to create your personalized training plan.";
      case "catching_instructor":
        return "Upload 4 videos of your catching skills. Your instructor will analyze these to create your personalized training plan.";
      case "team_coach":
      default:
        return "Upload 4 videos showing your core skills. Your coach will analyze these to build your training roadmap.";
    }
  };

  if (onboarding?.baselineComplete) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-[#0a0a0a] border-yellow-500/30 text-center">
          <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold text-white mb-4" data-testid="text-pending-review">
            Pending Coach Review
          </h1>
          <p className="text-gray-400 mb-4">
            All 4 baseline videos have been uploaded successfully!
          </p>
          <p className="text-purple-400 mb-6">
            Your coach is reviewing your videos and will unlock your dashboard soon.
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Dashboard locked until coach approval</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent" data-testid="text-onboarding-title">
            {getOnboardingTitle()}
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            {getOnboardingSubtitle()}
          </p>
        </div>

        <Card className="bg-[#0a0a0a] border-purple-500/30 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400">Progress</span>
            <span className="text-purple-400 font-semibold" data-testid="text-progress">
              {onboarding?.baselineVideoCount || 0} / {onboarding?.baselineVideosRequired || 4} videos
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Timer className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-amber-400 font-medium">Maximum 20 seconds per video</p>
            <p className="text-gray-400 text-sm">Show 3-5 repetitions of your motion in each video for accurate analysis.</p>
          </div>
        </div>

        <div className="grid gap-4">
          {videoPrompts.map((prompt) => {
            const isUploaded = uploadedCategories.includes(prompt.category);
            const isUploading = uploadingVideo === prompt.number;
            const uploadedVideo = uploadedVideos.find(v => v.videoCategory === prompt.category);
            
            return (
              <Card 
                key={prompt.number} 
                className={`p-6 transition-all ${
                  isUploaded 
                    ? "bg-green-900/20 border-green-500/30" 
                    : "bg-[#0a0a0a] border-gray-800"
                }`}
                data-testid={`card-video-${prompt.number}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isUploaded 
                        ? "bg-green-600" 
                        : "bg-gray-800"
                    }`}>
                      {isUploaded ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <Video className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white" data-testid={`text-video-title-${prompt.number}`}>
                        Upload your {prompt.title} video
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{prompt.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {prompt.focusAreas.map((area, idx) => (
                          <span key={idx} className="text-xs bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded">
                            {area}
                          </span>
                        ))}
                      </div>
                      {uploadedVideo?.durationSeconds && (
                        <p className="text-xs text-green-400 mt-2">
                          Duration: {uploadedVideo.durationSeconds}s
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      ref={(el) => { fileInputRefs.current[prompt.number] = el; }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileSelect(prompt.number, prompt.category, file);
                        }
                      }}
                      data-testid={`input-file-${prompt.number}`}
                    />
                    
                    {!isUploaded && (
                      <Button
                        onClick={() => triggerFileInput(prompt.number)}
                        disabled={isUploading || uploadMutation.isPending}
                        className="bg-purple-600"
                        data-testid={`button-upload-${prompt.number}`}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            {uploadProgress}%
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </>
                        )}
                      </Button>
                    )}
                    
                    {isUploaded && (
                      <span className="text-green-400 text-sm flex items-center gap-1" data-testid={`text-uploaded-${prompt.number}`}>
                        <CheckCircle2 className="w-4 h-4" />
                        Uploaded
                      </span>
                    )}
                  </div>
                </div>
                
                {isUploading && uploadProgress > 0 && (
                  <div className="mt-4">
                    <Progress value={uploadProgress} className="h-1" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-purple-900/10 border border-purple-500/20 rounded-lg">
          <h4 className="font-semibold text-purple-400 mb-2">Tips for Great Videos:</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              Record in good lighting - outdoor or well-lit indoor space
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              Keep each video under 20 seconds
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              Show 3-5 repetitions of your motion
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              Make sure your full body is visible in frame
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
