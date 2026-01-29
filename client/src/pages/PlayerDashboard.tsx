import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Video, 
  Heart, 
  Flame, 
  Moon, 
  Sun, 
  Zap,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Play,
  Quote,
  Loader2
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useLocation } from "wouter";
import type { MentalEdge, PlayerCheckin } from "@shared/schema";

const MOOD_OPTIONS = [
  { value: "great", label: "Feeling Great!", icon: Flame, color: "neon-green" },
  { value: "good", label: "Good to Go", icon: Zap, color: "neon-green" },
  { value: "okay", label: "Just Okay", icon: Sun, color: "neon-yellow" },
  { value: "tired", label: "Pretty Tired", icon: Moon, color: "neon-yellow" },
  { value: "struggling", label: "Struggling Today", icon: AlertTriangle, color: "neon-pink" },
];

const SORENESS_AREAS = [
  { id: "arm", label: "Throwing Arm" },
  { id: "shoulder", label: "Shoulder" },
  { id: "legs", label: "Legs" },
  { id: "back", label: "Back" },
  { id: "core", label: "Core/Abs" },
  { id: "none", label: "No Soreness" },
];

export default function PlayerDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [showCheckin, setShowCheckin] = useState(false);
  const [mood, setMood] = useState<string>("");
  const [sorenessAreas, setSorenessAreas] = useState<string[]>([]);
  const [sorenessLevel, setSorenessLevel] = useState(1);
  const [notes, setNotes] = useState("");
  
  // Video upload state
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string>("hitting");
  const [isUploading, setIsUploading] = useState(false);

  // Fetch today's check-in
  const { data: todayCheckin } = useQuery<PlayerCheckin | null>({
    queryKey: ["/api/player/checkin/today"],
  });

  // Fetch random Championship Mindset motivation
  const { data: championshipContent } = useQuery<MentalEdge | null>({
    queryKey: ["/api/mental-edge/random"],
  });

  // Determine if player should be blocked from pitching
  const isArmSore = todayCheckin?.sorenessAreas?.includes("arm") || 
                    todayCheckin?.sorenessAreas?.includes("shoulder");
  const highSoreness = (todayCheckin?.sorenessLevel || 0) >= 7;
  const shouldBlockPitching = isArmSore && highSoreness;

  const checkinMutation = useMutation({
    mutationFn: async (data: {
      mood: string;
      sorenessAreas: string[];
      sorenessLevel: number;
      notes: string;
    }) => {
      return apiRequest("POST", "/api/player/checkin", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/player/checkin/today"] });
      setShowCheckin(false);
      toast({
        title: "Check-in Complete!",
        description: "Thanks for letting me know how you're feeling today.",
      });
    },
  });

  const handleCheckin = () => {
    checkinMutation.mutate({
      mood,
      sorenessAreas,
      sorenessLevel,
      notes,
    });
  };

  // Video upload mutation
  const createAssessmentMutation = useMutation({
    mutationFn: async (data: {
      skillType: string;
      videoUrl: string;
    }) => {
      const response = await apiRequest("POST", "/api/player/assessment", data);
      return response.json();
    },
    onSuccess: (assessment: { id: number }) => {
      setShowUploadDialog(false);
      setIsUploading(false);
      toast({
        title: "Video Uploaded!",
        description: "AI analysis is starting now...",
      });
      // Navigate to the assessment result page
      if (assessment?.id) {
        navigate(`/assessments/${assessment.id}`);
      }
    },
    onError: (err: Error) => {
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleVideoUploadComplete = (result: any) => {
    // Extract the uploaded file URL
    const fileUrl = result.successful[0]?.uploadURL;
    
    if (!fileUrl) {
      setIsUploading(false);
      toast({ title: "Upload Failed", description: "Could not get file URL", variant: "destructive" });
      return;
    }

    // Create assessment for the player
    createAssessmentMutation.mutate({
      skillType: selectedSkill,
      videoUrl: fileUrl,
    });
  };

  const toggleSorenessArea = (area: string) => {
    if (area === "none") {
      setSorenessAreas(["none"]);
      setSorenessLevel(1);
    } else {
      setSorenessAreas(prev => {
        const filtered = prev.filter(a => a !== "none");
        if (filtered.includes(area)) {
          return filtered.filter(a => a !== area);
        }
        return [...filtered, area];
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-white flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-neon-green" />
            My Journey
          </h1>
          <p className="text-gray-400 mt-1">Your personal softball training hub</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily Vibe Check-in */}
        <Card className="p-6 bg-gradient-to-br from-neon-green/10 to-transparent border-neon-green/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Heart className="h-5 w-5 text-neon-pink" />
              Daily Vibe Check
            </h2>
            {todayCheckin && (
              <span className="text-sm text-neon-green flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </span>
            )}
          </div>

          {!todayCheckin && !showCheckin ? (
            <div className="text-center py-6">
              <p className="text-gray-300 mb-4">How are you feeling today?</p>
              <Button
                data-testid="button-start-checkin"
                onClick={() => setShowCheckin(true)}
                className="bg-neon-green hover:bg-neon-green/90 text-black font-bold"
              >
                Start Check-in
              </Button>
            </div>
          ) : showCheckin ? (
            <div className="space-y-6">
              {/* Mood Selection */}
              <div>
                <p className="text-sm text-gray-400 mb-3">How's your energy today?</p>
                <div className="grid grid-cols-5 gap-2">
                  {MOOD_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      data-testid={`mood-${option.value}`}
                      onClick={() => setMood(option.value)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        mood === option.value
                          ? `border-${option.color} bg-${option.color}/20`
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <option.icon className="h-6 w-6 mb-1" />
                      <div className="text-xs text-gray-400">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Soreness Areas */}
              <div>
                <p className="text-sm text-gray-400 mb-3">Any soreness?</p>
                <div className="flex flex-wrap gap-2">
                  {SORENESS_AREAS.map((area) => (
                    <Button
                      key={area.id}
                      data-testid={`soreness-${area.id}`}
                      variant={sorenessAreas.includes(area.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSorenessArea(area.id)}
                      className={sorenessAreas.includes(area.id) 
                        ? "bg-neon-pink text-black" 
                        : ""
                      }
                    >
                      {area.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Soreness Level */}
              {sorenessAreas.length > 0 && !sorenessAreas.includes("none") && (
                <div>
                  <p className="text-sm text-gray-400 mb-3">
                    Soreness Level: <span className="text-white font-bold">{sorenessLevel}/10</span>
                    {sorenessLevel >= 7 && (
                      <span className="text-neon-pink ml-2">(High - Take it easy!)</span>
                    )}
                  </p>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sorenessLevel}
                    onChange={(e) => setSorenessLevel(Number(e.target.value))}
                    className="w-full accent-neon-pink"
                    data-testid="soreness-slider"
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <Textarea
                  placeholder="Any notes about how you're feeling? (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="checkin-notes"
                />
              </div>

              <Button
                data-testid="button-submit-checkin"
                onClick={handleCheckin}
                disabled={!mood || checkinMutation.isPending}
                className="w-full bg-neon-green hover:bg-neon-green/90 text-black font-bold"
              >
                {checkinMutation.isPending ? "Saving..." : "Complete Check-in"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {(() => {
                  const MoodIcon = MOOD_OPTIONS.find(m => m.value === todayCheckin?.mood)?.icon || Heart;
                  return <MoodIcon className="h-8 w-8 text-neon-green" />;
                })()}
                <div>
                  <p className="text-white font-medium">
                    {MOOD_OPTIONS.find(m => m.value === todayCheckin?.mood)?.label}
                  </p>
                  <p className="text-sm text-gray-400">
                    {todayCheckin?.sorenessAreas?.includes("none") 
                      ? "No soreness reported" 
                      : `Soreness: ${todayCheckin?.sorenessAreas?.join(", ")}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Injury Prevention Alert */}
        {shouldBlockPitching && (
          <Card className="p-6 bg-gradient-to-br from-neon-pink/20 to-transparent border-neon-pink/40">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-neon-pink/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6 text-neon-pink" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Rest Day Recommended</h3>
                <p className="text-gray-300 mt-1">
                  Your arm or shoulder is sore today. Let's focus on recovery and stretching instead of pitching.
                </p>
                <Button
                  className="mt-4 bg-neon-pink/20 text-neon-pink border border-neon-pink/40 hover:bg-neon-pink/30"
                  onClick={() => navigate("/drills")}
                  data-testid="button-recovery-drills"
                >
                  View Recovery Drills
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Championship Mindset Feed - Daily Motivation */}
        <Card className="p-6 bg-gradient-to-br from-neon-yellow/10 to-transparent border-neon-yellow/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="h-5 w-5 text-neon-yellow" />
              Championship Mindset
            </h2>
          </div>

          {championshipContent ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Quote className="h-8 w-8 text-neon-yellow shrink-0 mt-1" />
                <div>
                  <p className="text-lg text-white italic leading-relaxed">
                    "{championshipContent.content}"
                  </p>
                  <p className="text-sm text-neon-yellow mt-2">
                    — {championshipContent.source}
                  </p>
                </div>
              </div>

              {championshipContent.videoUrl && (
                <Button
                  variant="outline"
                  className="w-full border-neon-yellow/30 text-neon-yellow hover:bg-neon-yellow/10"
                  onClick={() => window.open(championshipContent.videoUrl!, "_blank")}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch Motivational Video
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <Flame className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Loading your daily motivation...</p>
            </div>
          )}
        </Card>

        {/* Coach Me Button */}
        <Card className="p-6 bg-gradient-to-br from-neon-green/10 to-transparent border-neon-green/20">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto">
              <Video className="h-8 w-8 text-neon-green" />
            </div>
            <h2 className="text-xl font-bold text-white">Coach Me</h2>
            <p className="text-gray-400">
              Upload a video of your mechanics for instant AI feedback
            </p>
            <Button
              data-testid="button-coach-me"
              className="bg-neon-green text-black font-bold px-8"
              disabled={shouldBlockPitching}
              onClick={() => setShowUploadDialog(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
            {shouldBlockPitching && (
              <p className="text-sm text-neon-pink">
                Pitching analysis disabled while you're recovering
              </p>
            )}
          </div>
        </Card>

        {/* Quick Action Buttons */}
        <Card className="p-6 bg-[#0a0a0a] border-gray-800">
          <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            <Button 
              onClick={() => setLocation("/drills")}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              data-testid="button-nav-drills"
            >
              <Dumbbell className="h-5 w-5 text-purple-400" />
              <span className="text-xs">Drills</span>
            </Button>
            <Button 
              onClick={() => setLocation("/goals")}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              data-testid="button-nav-goals"
            >
              <Target className="h-5 w-5 text-pink-400" />
              <span className="text-xs">My Goals</span>
            </Button>
            <Button 
              onClick={() => setLocation("/stats-import")}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              data-testid="button-nav-stats"
            >
              <BarChart3 className="h-5 w-5 text-green-400" />
              <span className="text-xs">Stats</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Video Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle data-testid="text-upload-dialog-title" className="text-white">Upload Video for AI Analysis</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-gray-300">What skill are you working on?</Label>
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger data-testid="select-skill-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hitting">Hitting</SelectItem>
                  <SelectItem value="pitching">Pitching</SelectItem>
                  <SelectItem value="catching">Catching</SelectItem>
                  <SelectItem value="fielding">Fielding</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isUploading ? (
              <div className="text-center py-8" data-testid="status-uploading">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-neon-green mb-4" />
                <p className="text-white font-medium">Uploading & Analyzing...</p>
                <p className="text-gray-400 text-sm mt-1">This may take a moment</p>
              </div>
            ) : (
              <div className="pt-4">
                <ObjectUploader
                  buttonClassName="w-full bg-neon-green text-black font-bold"
                  onGetUploadParameters={async (file) => {
                    const res = await fetch("/api/uploads/request-url", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: file.name,
                        size: file.size,
                        contentType: file.type,
                      }),
                    });
                    const { uploadURL } = await res.json();
                    return {
                      method: "PUT",
                      url: uploadURL,
                      headers: { "Content-Type": file.type },
                    };
                  }}
                  onComplete={(result) => {
                    // Check if upload was successful before proceeding
                    if (!result.successful || result.successful.length === 0) {
                      toast({
                        title: "Upload Failed",
                        description: "No file was uploaded successfully",
                        variant: "destructive",
                      });
                      return;
                    }
                    setIsUploading(true);
                    handleVideoUploadComplete(result);
                  }}
                >
                  <div className="flex items-center justify-center gap-2" data-testid="button-select-video">
                    <Upload className="h-4 w-4" /> Select Video & Upload
                  </div>
                </ObjectUploader>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
