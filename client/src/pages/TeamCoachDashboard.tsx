import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  ClipboardList, 
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  Dumbbell,
  Activity,
  ChevronRight,
  Trash2
} from "lucide-react";
import type { Team, Athlete, PracticePlan } from "@shared/schema";

interface RosterHealthData {
  athlete: Athlete;
  healthStatus: "healthy" | "caution" | "rest";
  lastCheckIn?: {
    mood: string;
    sorenessLevel: number;
    sorenessAreas: string[];
  };
}

const PRACTICE_FOCUS_OPTIONS = [
  { value: "defensive", label: "Defensive Focus", icon: Target },
  { value: "offensive", label: "Offensive Focus", icon: Dumbbell },
  { value: "pitching", label: "Pitching Focus", icon: Activity },
  { value: "full", label: "Full Practice", icon: ClipboardList },
];

const DURATION_OPTIONS = [
  { value: 60, label: "1 Hour" },
  { value: 90, label: "1.5 Hours" },
  { value: 120, label: "2 Hours" },
  { value: 150, label: "2.5 Hours" },
];

export default function TeamCoachDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPracticeBuilder, setShowPracticeBuilder] = useState(false);
  const [practiceData, setPracticeData] = useState({
    name: "",
    duration: 90,
    focus: "full",
    scheduledDate: "",
    notes: "",
  });

  const { data: teams } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const { data: athletes } = useQuery<Athlete[]>({
    queryKey: ["/api/athletes"],
  });

  const { data: practicePlans } = useQuery<PracticePlan[]>({
    queryKey: ["/api/practice-plans"],
  });

  const { data: rosterHealth } = useQuery<RosterHealthData[]>({
    queryKey: ["/api/roster-health"],
  });

  const createPracticeMutation = useMutation({
    mutationFn: async (data: typeof practiceData) => {
      return apiRequest("POST", "/api/practice-plans", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/practice-plans"] });
      setShowPracticeBuilder(false);
      setPracticeData({
        name: "",
        duration: 90,
        focus: "full",
        scheduledDate: "",
        notes: "",
      });
      toast({
        title: "Practice Plan Created!",
        description: "Your practice plan has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create practice plan.",
        variant: "destructive",
      });
    },
  });

  const healthData = rosterHealth || [];
  const healthyCount = healthData.filter(r => r.healthStatus === "healthy").length;
  const cautionCount = healthData.filter(r => r.healthStatus === "caution").length;
  const restCount = healthData.filter(r => r.healthStatus === "rest").length;

  const handleCreatePractice = () => {
    if (!practiceData.name) {
      toast({
        title: "Missing Name",
        description: "Please give your practice a name.",
        variant: "destructive",
      });
      return;
    }
    createPracticeMutation.mutate(practiceData);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neon-pink">
              Team Coach HQ
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your roster and architect winning practices
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/teams">
              <Button 
                variant="outline" 
                className="border-neon-pink/50 text-neon-pink hover-elevate"
                data-testid="button-view-teams"
              >
                <Users className="w-4 h-4 mr-2" />
                Teams ({teams?.length || 0})
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-card border-neon-pink/20 hover-elevate col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-neon-pink/20">
                  <ClipboardList className="w-6 h-6 text-neon-pink" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Practice Architect</h2>
                  <p className="text-sm text-muted-foreground">Auto-generate winning practice plans</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowPracticeBuilder(true)}
                className="bg-neon-pink text-black hover:bg-neon-pink/90"
                data-testid="button-new-practice"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Practice
              </Button>
            </div>

            {showPracticeBuilder && (
              <div className="mb-6 p-6 rounded-lg border border-neon-pink/30 bg-background/50 space-y-4">
                <h3 className="font-semibold text-neon-yellow">Build Your Practice</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Practice Name</label>
                    <Input
                      placeholder="e.g., Pre-Game Warmup Routine"
                      value={practiceData.name}
                      onChange={(e) => setPracticeData({ ...practiceData, name: e.target.value })}
                      className="mt-1"
                      data-testid="input-practice-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Scheduled Date</label>
                    <Input
                      type="date"
                      value={practiceData.scheduledDate}
                      onChange={(e) => setPracticeData({ ...practiceData, scheduledDate: e.target.value })}
                      className="mt-1"
                      data-testid="input-practice-date"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Practice Focus</label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {PRACTICE_FOCUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPracticeData({ ...practiceData, focus: option.value })}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          practiceData.focus === option.value
                            ? "border-neon-pink bg-neon-pink/20 text-neon-pink"
                            : "border-border hover:border-neon-pink/50"
                        }`}
                        data-testid={`button-focus-${option.value}`}
                      >
                        <option.icon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Duration</label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {DURATION_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPracticeData({ ...practiceData, duration: option.value })}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          practiceData.duration === option.value
                            ? "border-neon-pink bg-neon-pink/20 text-neon-pink"
                            : "border-border hover:border-neon-pink/50"
                        }`}
                        data-testid={`button-duration-${option.value}`}
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-xs">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Notes</label>
                  <Textarea
                    placeholder="Any special focus areas or notes for this practice..."
                    value={practiceData.notes}
                    onChange={(e) => setPracticeData({ ...practiceData, notes: e.target.value })}
                    className="mt-1"
                    data-testid="textarea-practice-notes"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowPracticeBuilder(false)}
                    data-testid="button-cancel-practice"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePractice}
                    disabled={createPracticeMutation.isPending}
                    className="bg-neon-pink text-black hover:bg-neon-pink/90"
                    data-testid="button-save-practice"
                  >
                    {createPracticeMutation.isPending ? "Creating..." : "Create Practice Plan"}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold text-muted-foreground">Upcoming Practices</h3>
              {practicePlans && practicePlans.length > 0 ? (
                practicePlans.slice(0, 5).map((plan) => (
                  <div 
                    key={plan.id}
                    className="p-4 rounded-lg border border-border hover:border-neon-pink/30 transition-colors flex items-center justify-between"
                    data-testid={`practice-plan-${plan.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded bg-neon-pink/10">
                        <Calendar className="w-5 h-5 text-neon-pink" />
                      </div>
                      <div>
                        <h4 className="font-medium">{plan.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {plan.duration} min | {plan.focus} focus
                          {plan.scheduledDate && ` | ${plan.scheduledDate}`}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No practice plans yet</p>
                  <p className="text-sm">Create your first practice plan above</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-card border-neon-yellow/20 hover-elevate">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-neon-yellow/20">
                <Activity className="w-6 h-6 text-neon-yellow" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Roster Health</h2>
                <p className="text-sm text-muted-foreground">At-a-glance team status</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-lg bg-neon-green/10 text-center">
                <CheckCircle2 className="w-6 h-6 text-neon-green mx-auto mb-1" />
                <p className="text-2xl font-bold text-neon-green">{healthyCount}</p>
                <p className="text-xs text-muted-foreground">Healthy</p>
              </div>
              <div className="p-3 rounded-lg bg-neon-yellow/10 text-center">
                <AlertTriangle className="w-6 h-6 text-neon-yellow mx-auto mb-1" />
                <p className="text-2xl font-bold text-neon-yellow">{cautionCount}</p>
                <p className="text-xs text-muted-foreground">Caution</p>
              </div>
              <div className="p-3 rounded-lg bg-neon-pink/10 text-center">
                <Clock className="w-6 h-6 text-neon-pink mx-auto mb-1" />
                <p className="text-2xl font-bold text-neon-pink">{restCount}</p>
                <p className="text-xs text-muted-foreground">Rest</p>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {healthData.map((item) => (
                <div 
                  key={item.athlete.id}
                  className="p-3 rounded-lg border border-border hover:border-neon-yellow/30 transition-colors flex items-center justify-between"
                  data-testid={`roster-athlete-${item.athlete.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {item.athlete.photoUrl ? (
                        <img 
                          src={item.athlete.photoUrl} 
                          alt={item.athlete.name}
                          className="w-8 h-8 rounded-full object-cover border border-white/20"
                          data-testid={`health-img-athlete-${item.athlete.id}`}
                        />
                      ) : (
                        <div 
                          className="w-8 h-8 rounded-full bg-neon-yellow/20 flex items-center justify-center"
                          data-testid={`health-avatar-fallback-${item.athlete.id}`}
                        >
                          <span className="text-neon-yellow text-xs font-bold">
                            {item.athlete.name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                        item.healthStatus === "healthy" ? "bg-neon-green" :
                        item.healthStatus === "caution" ? "bg-neon-yellow" : "bg-neon-pink"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.athlete.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.athlete.primaryPosition || "Player"}
                      </p>
                    </div>
                  </div>
                  {item.healthStatus !== "healthy" && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        item.healthStatus === "caution" 
                          ? "border-neon-yellow/50 text-neon-yellow" 
                          : "border-neon-pink/50 text-neon-pink"
                      }`}
                    >
                      {item.healthStatus === "caution" ? "Arm Soreness" : "Rest Day"}
                    </Badge>
                  )}
                </div>
              ))}
              {healthData.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No athletes on roster</p>
                  <p className="text-sm">Add athletes to track their health</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-card border-neon-green/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-neon-green/20">
                <Users className="w-6 h-6 text-neon-green" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Full Roster</h2>
                <p className="text-sm text-muted-foreground">{athletes?.length || 0} athletes across all teams</p>
              </div>
            </div>
            <Button 
              variant="outline"
              className="border-neon-green/50 text-neon-green hover-elevate"
              data-testid="button-add-athlete"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Athlete
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(athletes || []).slice(0, 12).map((athlete) => (
              <div
                key={athlete.id}
                className="p-4 rounded-lg border border-border hover:border-neon-green/30 transition-colors"
                data-testid={`athlete-card-${athlete.id}`}
              >
                <div className="flex items-center gap-3">
                  {athlete.photoUrl ? (
                    <img 
                      src={athlete.photoUrl} 
                      alt={athlete.name}
                      className="w-10 h-10 rounded-full object-cover border border-neon-green/30"
                      data-testid={`img-athlete-${athlete.id}`}
                    />
                  ) : (
                    <div 
                      className="w-10 h-10 rounded-full bg-neon-green/20 flex items-center justify-center"
                      data-testid={`avatar-fallback-${athlete.id}`}
                    >
                      <span className="text-neon-green font-bold">
                        {athlete.name?.charAt(0) || "?"}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{athlete.name}</p>
                    <p className="text-xs text-muted-foreground">
                      #{athlete.jerseyNumber || "--"} | {athlete.primaryPosition || "Player"}
                    </p>
                  </div>
                </div>
                {athlete.dob && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {athlete.throws || "R"}H Throw / {athlete.bats || "R"}H Bat
                  </p>
                )}
              </div>
            ))}
          </div>

          {(!athletes || athletes.length === 0) && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Your roster is empty</p>
              <p className="text-sm">Add athletes to start building your team</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
