import { useState } from "react";
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
  Target
} from "lucide-react";

interface OnboardingData {
  dashboardUnlocked: boolean;
  baselineComplete: boolean;
  baselineVideoCount: number;
  baselineVideosRequired: number;
  coachId?: number;
  skillType?: string;
  baselineVideos?: {
    id: number;
    videoNumber: number;
    videoUrl: string;
    status: string;
  }[];
}

const VIDEO_PROMPTS = [
  { number: 1, title: "Front View - Full Motion", description: "Record yourself from the front showing your complete motion" },
  { number: 2, title: "Side View - Stride", description: "Record from the side to capture your stride and arm path" },
  { number: 3, title: "Back View - Rotation", description: "Record from behind to show hip and shoulder rotation" },
  { number: 4, title: "Close-Up - Release", description: "Record close-up of your release point and follow-through" },
];

export default function PlayerOnboarding() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [uploadingVideo, setUploadingVideo] = useState<number | null>(null);

  const { data: onboarding, isLoading } = useQuery<OnboardingData>({
    queryKey: ["/api/player/onboarding"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: { videoUrl: string; videoNumber: number }) => {
      return apiRequest("POST", "/api/player/baseline-video", data);
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/player/onboarding"] });
      setUploadingVideo(null);
      
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
    onError: () => {
      setUploadingVideo(null);
      toast({
        title: "Upload Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVideoUpload = (videoNumber: number) => {
    setUploadingVideo(videoNumber);
    const demoVideoUrl = `https://storage.example.com/baseline-video-${videoNumber}-${Date.now()}.mp4`;
    uploadMutation.mutate({ videoUrl: demoVideoUrl, videoNumber });
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

  const uploadedVideos = onboarding?.baselineVideos || [];
  const uploadedNumbers = uploadedVideos.map(v => v.videoNumber);
  const progress = ((onboarding?.baselineVideoCount || 0) / (onboarding?.baselineVideosRequired || 4)) * 100;

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
            Baseline Assessment
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Upload 4 videos of your current mechanics. Your coach will analyze these to create your personalized training plan.
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

        <div className="grid gap-4">
          {VIDEO_PROMPTS.map((prompt) => {
            const isUploaded = uploadedNumbers.includes(prompt.number);
            const isUploading = uploadingVideo === prompt.number;
            
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
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
                    <div>
                      <h3 className="font-semibold text-white" data-testid={`text-video-title-${prompt.number}`}>
                        Video {prompt.number}: {prompt.title}
                      </h3>
                      <p className="text-sm text-gray-400">{prompt.description}</p>
                    </div>
                  </div>
                  
                  {!isUploaded && (
                    <Button
                      onClick={() => handleVideoUpload(prompt.number)}
                      disabled={isUploading || uploadMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700"
                      data-testid={`button-upload-${prompt.number}`}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Uploading...
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
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-purple-900/10 border border-purple-500/20 rounded-lg">
          <h4 className="font-semibold text-purple-400 mb-2">Tips for Great Videos:</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Record in good lighting - outdoor or well-lit indoor space</li>
            <li>• Keep each video around 20 seconds</li>
            <li>• Show 3-5 repetitions of your motion</li>
            <li>• Make sure your full body is visible in frame</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
