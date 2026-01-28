import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, 
  Upload, 
  CheckCircle2, 
  Loader2,
  Target,
  AlertCircle,
  Timer,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

type Position = "PITCHER" | "CATCHER" | "INFIELD" | "OUTFIELD" | "HITTER";

interface VideoPrompt {
  number: number;
  category: string;
  title: string;
  description: string;
  focusAreas: string[];
}

const POSITION_VIDEO_PACKS: Record<Position, VideoPrompt[]> = {
  PITCHER: [
    { number: 1, category: "fastball", title: "Fastball", description: "Record your fastball from the side", focusAreas: ["arm circle", "knee drive"] },
    { number: 2, category: "changeup", title: "Change-up", description: "Record your change-up grip and release", focusAreas: ["wrist snap", "arm speed"] },
    { number: 3, category: "dropball", title: "Drop ball", description: "Record your drop ball motion", focusAreas: ["release point", "spin axis"] },
    { number: 4, category: "choice", title: "Choice", description: "Record your best pitch", focusAreas: ["full mechanics", "consistency"] },
  ],
  CATCHER: [
    { number: 1, category: "framing", title: "Framing", description: "Record your pitch framing technique", focusAreas: ["glove angle", "quiet hands"] },
    { number: 2, category: "blocking", title: "Blocking", description: "Record blocking drills", focusAreas: ["drop mechanics", "body position"] },
    { number: 3, category: "transfer", title: "Transfer (Pop-time)", description: "Record receiving and throwing", focusAreas: ["transfer speed", "footwork"] },
    { number: 4, category: "bunt_coverage", title: "Bunt Coverage", description: "Record bunt defense plays", focusAreas: ["first step", "throw accuracy"] },
  ],
  INFIELD: [
    { number: 1, category: "lateral_left", title: "Lateral Range (Left)", description: "Record fielding balls to your left", focusAreas: ["crossover step", "glove work"] },
    { number: 2, category: "lateral_right", title: "Lateral Range (Right)", description: "Record fielding balls to your right", focusAreas: ["backhand", "footwork"] },
    { number: 3, category: "chopper", title: "Chopper (Hard)", description: "Record fielding hard choppers", focusAreas: ["charge timing", "glove position"] },
    { number: 4, category: "pro_step", title: "Pro-Step Throw", description: "Record your throwing mechanics", focusAreas: ["arm slot", "hip rotation"] },
  ],
  OUTFIELD: [
    { number: 1, category: "dropstep", title: "Fly Ball (Drop-step)", description: "Record tracking fly balls", focusAreas: ["drop step", "route efficiency"] },
    { number: 2, category: "do_or_die", title: "Ground Ball (Do-or-Die)", description: "Record aggressive ground balls", focusAreas: ["charge angle", "bare hand"] },
    { number: 3, category: "gap_coverage", title: "Gap Coverage", description: "Record running down gap balls", focusAreas: ["angle", "closing speed"] },
    { number: 4, category: "long_hop", title: "Long-Hop Throw", description: "Record your outfield throws", focusAreas: ["crow hop", "arm strength"] },
  ],
  HITTER: [
    { number: 1, category: "opposite_field", title: "Opposite Field", description: "Record opposite field swings", focusAreas: ["bat path", "contact point"] },
    { number: 2, category: "pull_side", title: "Pull Side", description: "Record pull side swings", focusAreas: ["hip rotation", "extension"] },
    { number: 3, category: "contact_tee", title: "Contact (Tee)", description: "Record tee work", focusAreas: ["hand path", "swing plane"] },
    { number: 4, category: "live_rep", title: "Live Rep", description: "Record a live at-bat or front toss", focusAreas: ["timing", "pitch recognition"] },
  ],
};

const POSITION_INFO: Record<Position, { label: string; description: string; icon: string }> = {
  PITCHER: { label: "Pitcher", description: "Windmill pitching mechanics", icon: "🥎" },
  CATCHER: { label: "Catcher", description: "Receiving, blocking & throwing", icon: "🧤" },
  INFIELD: { label: "Infield (SS/2B/3B/1B)", description: "Fielding & throwing mechanics", icon: "⚾" },
  OUTFIELD: { label: "Outfield", description: "Fly balls, ground balls & throws", icon: "🏃" },
  HITTER: { label: "Hitter", description: "Swing mechanics & contact", icon: "🏏" },
};

interface UploadedVideo {
  number: number;
  category: string;
  file: File;
  duration: number;
}

export default function BiometricOnboarding() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"position" | "goals" | "videos">("position");
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);
  const [seasonGoals, setSeasonGoals] = useState("");
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
  const [uploadingVideo, setUploadingVideo] = useState<number | null>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const togglePosition = (pos: Position) => {
    setSelectedPositions(prev => {
      if (prev.includes(pos)) {
        return prev.filter(p => p !== pos);
      }
      if (prev.length < 2) {
        return [...prev, pos];
      }
      return prev;
    });
  };

  const getVideoPrompts = (): VideoPrompt[] => {
    if (selectedPositions.length === 0) return [];
    
    const primary = selectedPositions[0];
    const primaryPack = POSITION_VIDEO_PACKS[primary];
    
    if (selectedPositions.length === 1) {
      return primaryPack;
    }
    
    const secondary = selectedPositions[1];
    const secondaryPack = POSITION_VIDEO_PACKS[secondary];
    return [...primaryPack, ...secondaryPack.slice(0, 2).map((v, i) => ({ ...v, number: 5 + i }))];
  };

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

      if (duration < 20) {
        toast({
          title: "Video Too Short",
          description: "Please upload a video that is at least 20 seconds long.",
          variant: "destructive",
        });
        setUploadingVideo(null);
        return;
      }

      setUploadedVideos(prev => [
        ...prev.filter(v => v.number !== videoNumber),
        { number: videoNumber, category, file, duration }
      ]);
      
      toast({
        title: "Video Ready!",
        description: `${file.name} - ${Math.round(duration)}s`,
      });
      
      setUploadingVideo(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not process video file.",
        variant: "destructive",
      });
      setUploadingVideo(null);
    }
  };

  const triggerFileInput = (videoNumber: number) => {
    const input = fileInputRefs.current[videoNumber];
    if (input) {
      input.click();
    }
  };

  const handleContinueToAuth = () => {
    localStorage.setItem("onboarding_positions", JSON.stringify(selectedPositions));
    localStorage.setItem("onboarding_goals", seasonGoals);
    localStorage.setItem("onboarding_videos", JSON.stringify(uploadedVideos.map(v => ({
      number: v.number,
      category: v.category,
      fileName: v.file.name,
      duration: v.duration
    }))));
    
    window.location.href = "/api/login";
  };

  const videoPrompts = getVideoPrompts();
  const requiredCount = selectedPositions.length === 2 ? 6 : 4;
  const progress = (uploadedVideos.length / requiredCount) * 100;
  const allVideosUploaded = uploadedVideos.length >= requiredCount;

  if (step === "position") {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent" data-testid="text-position-title">
              Select Your Position(s)
            </h1>
            <p className="text-gray-400 max-w-md mx-auto">
              Choose your primary position. You can add a secondary position for additional analysis.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {(Object.entries(POSITION_INFO) as [Position, typeof POSITION_INFO[Position]][]).map(([pos, info]) => {
              const isSelected = selectedPositions.includes(pos);
              const isPrimary = selectedPositions[0] === pos;
              const isSecondary = selectedPositions[1] === pos;
              
              return (
                <Card
                  key={pos}
                  onClick={() => togglePosition(pos)}
                  className={`p-6 cursor-pointer transition-all ${
                    isSelected 
                      ? isPrimary 
                        ? "bg-purple-900/30 border-purple-500" 
                        : "bg-pink-900/20 border-pink-500/50"
                      : "bg-[#0a0a0a] border-gray-800 hover:border-gray-600"
                  }`}
                  data-testid={`card-position-${pos.toLowerCase()}`}
                >
                  <div className="text-3xl mb-3">{info.icon}</div>
                  <h3 className="font-semibold text-white mb-1">{info.label}</h3>
                  <p className="text-sm text-gray-400">{info.description}</p>
                  {isPrimary && (
                    <span className="inline-block mt-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                  {isSecondary && (
                    <span className="inline-block mt-2 text-xs bg-pink-600 text-white px-2 py-0.5 rounded">
                      Secondary
                    </span>
                  )}
                </Card>
              );
            })}
          </div>

          {selectedPositions.length > 0 && (
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                {selectedPositions.length === 1 
                  ? "You'll upload 4 videos for analysis"
                  : "You'll upload 6 videos (4 primary + 2 secondary)"
                }
              </p>
              <Button
                onClick={() => setStep("goals")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-12 px-8"
                data-testid="button-continue-goals"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === "goals") {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-6">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setStep("position")}
            className="mb-6 text-gray-400"
            data-testid="button-back-position"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent" data-testid="text-goals-title">
              2026 Season Goals
            </h1>
            <p className="text-gray-400 max-w-md mx-auto">
              What do you want to accomplish this season? Be specific about your goals.
            </p>
          </div>

          <Card className="bg-[#0a0a0a] border-purple-500/30 p-6 mb-6">
            <Textarea
              value={seasonGoals}
              onChange={(e) => setSeasonGoals(e.target.value)}
              placeholder="Example: I want to increase my pitching velocity by 5 mph, make the varsity team, and improve my change-up location..."
              className="min-h-[200px] bg-[#0f0f0f] border-gray-700 text-white"
              data-testid="textarea-goals"
            />
          </Card>

          <div className="text-center">
            <Button
              onClick={() => setStep("videos")}
              disabled={!seasonGoals.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-12 px-8"
              data-testid="button-continue-videos"
            >
              Continue to Video Upload
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setStep("goals")}
          className="mb-6 text-gray-400"
          data-testid="button-back-goals"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
            <Video className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent" data-testid="text-videos-title">
            Baseline Video Upload
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Upload {requiredCount} videos for your {selectedPositions.map(p => POSITION_INFO[p].label).join(" + ")} analysis.
          </p>
        </div>

        <Card className="bg-[#0a0a0a] border-purple-500/30 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400">Progress</span>
            <span className="text-purple-400 font-semibold" data-testid="text-video-progress">
              {uploadedVideos.length} / {requiredCount} videos
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Timer className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-amber-400 font-medium">Minimum 20 seconds per video</p>
            <p className="text-gray-400 text-sm">Show 3-5 repetitions of your motion in each video for accurate analysis.</p>
          </div>
        </div>

        <div className="grid gap-4">
          {videoPrompts.map((prompt) => {
            const isUploaded = uploadedVideos.some(v => v.number === prompt.number);
            const isUploading = uploadingVideo === prompt.number;
            const uploadedVideo = uploadedVideos.find(v => v.number === prompt.number);
            
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
                        {prompt.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{prompt.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {prompt.focusAreas.map((area, idx) => (
                          <span key={idx} className="text-xs bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded">
                            {area}
                          </span>
                        ))}
                      </div>
                      {uploadedVideo && (
                        <p className="text-xs text-green-400 mt-2">
                          Duration: {Math.round(uploadedVideo.duration)}s
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
                        disabled={isUploading}
                        className="bg-purple-600"
                        data-testid={`button-upload-${prompt.number}`}
                      >
                        {isUploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
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
                        Ready
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {allVideosUploaded && (
          <div className="mt-8 text-center">
            <Button
              onClick={handleContinueToAuth}
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-14 px-10 text-lg"
              data-testid="button-create-account"
            >
              Create Account & Submit Videos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        <div className="mt-8 p-4 bg-purple-900/10 border border-purple-500/20 rounded-lg">
          <h4 className="font-semibold text-purple-400 mb-2">Tips for Great Videos:</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              Record in good lighting - outdoor or well-lit indoor space
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              Keep each video at least 20 seconds long
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
