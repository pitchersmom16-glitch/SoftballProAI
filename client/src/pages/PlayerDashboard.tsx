import { useState, useEffect } from "react";
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
  Quote
} from "lucide-react";
import type { MentalEdge, PlayerCheckin } from "@shared/schema";

const MOOD_OPTIONS = [
  { value: "great", label: "Feeling Great!", emoji: "🔥", color: "neon-green" },
  { value: "good", label: "Good to Go", emoji: "💪", color: "neon-green" },
  { value: "okay", label: "Just Okay", emoji: "😊", color: "neon-yellow" },
  { value: "tired", label: "Pretty Tired", emoji: "😴", color: "neon-yellow" },
  { value: "struggling", label: "Struggling Today", emoji: "😓", color: "neon-pink" },
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
  const [showCheckin, setShowCheckin] = useState(false);
  const [mood, setMood] = useState<string>("");
  const [sorenessAreas, setSorenessAreas] = useState<string[]>([]);
  const [sorenessLevel, setSorenessLevel] = useState(1);
  const [notes, setNotes] = useState("");

  // Fetch today's check-in
  const { data: todayCheckin } = useQuery<PlayerCheckin | null>({
    queryKey: ["/api/player/checkin/today"],
  });

  // Fetch random Mamba motivation
  const { data: mambaContent } = useQuery<MentalEdge | null>({
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
                      <div className="text-2xl mb-1">{option.emoji}</div>
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
                <span className="text-3xl">
                  {MOOD_OPTIONS.find(m => m.value === todayCheckin?.mood)?.emoji || "👋"}
                </span>
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
                >
                  View Recovery Drills
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Mamba Feed - Daily Motivation */}
        <Card className="p-6 bg-gradient-to-br from-neon-yellow/10 to-transparent border-neon-yellow/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="h-5 w-5 text-neon-yellow" />
              Mamba Mentality
            </h2>
          </div>

          {mambaContent ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Quote className="h-8 w-8 text-neon-yellow shrink-0 mt-1" />
                <div>
                  <p className="text-lg text-white italic leading-relaxed">
                    "{mambaContent.content}"
                  </p>
                  <p className="text-sm text-neon-yellow mt-2">
                    — {mambaContent.source}
                  </p>
                </div>
              </div>

              {mambaContent.videoUrl && (
                <Button
                  variant="outline"
                  className="w-full border-neon-yellow/30 text-neon-yellow hover:bg-neon-yellow/10"
                  onClick={() => window.open(mambaContent.videoUrl!, "_blank")}
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
              className="bg-neon-green hover:bg-neon-green/90 text-black font-bold px-8"
              disabled={shouldBlockPitching}
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
      </div>
    </div>
  );
}
