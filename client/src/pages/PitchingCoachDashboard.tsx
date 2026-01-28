import { useState } from "react";
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
  Video, 
  ClipboardList, 
  Plus,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  GraduationCap,
  Target,
  Play,
  MessageSquare,
  Eye
} from "lucide-react";
import type { Athlete, HomeworkAssignment, CoachStudent, Drill } from "@shared/schema";

interface StudentWithHomework {
  student: CoachStudent & { athlete?: Athlete };
  pendingHomework: number;
  completedHomework: number;
  lastSubmission?: string;
}

const SKILL_FOCUS_OPTIONS = [
  { value: "rise_ball", label: "Rise Ball" },
  { value: "drop_ball", label: "Drop Ball" },
  { value: "curve_ball", label: "Curve Ball" },
  { value: "change_up", label: "Change-Up" },
  { value: "mechanics", label: "General Mechanics" },
  { value: "drag_foot", label: "Drag Foot Technique" },
];

export default function PitchingCoachDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAssignHomework, setShowAssignHomework] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [homeworkData, setHomeworkData] = useState({
    title: "",
    description: "",
    skillFocus: "mechanics",
    dueDate: "",
    referenceVideoUrl: "",
  });

  const { data: students } = useQuery<(CoachStudent & { athlete?: Athlete })[]>({
    queryKey: ["/api/coach/students"],
  });

  const { data: homework } = useQuery<HomeworkAssignment[]>({
    queryKey: ["/api/homework"],
  });

  const { data: drills } = useQuery<Drill[]>({
    queryKey: ["/api/drills"],
  });

  const assignHomeworkMutation = useMutation({
    mutationFn: async (data: {
      athleteId: number;
      title: string;
      description: string;
      skillFocus: string;
      dueDate?: string;
      referenceVideoUrl?: string;
    }) => {
      return apiRequest("POST", "/api/homework", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/homework"] });
      setShowAssignHomework(false);
      setSelectedStudent(null);
      setHomeworkData({
        title: "",
        description: "",
        skillFocus: "mechanics",
        dueDate: "",
        referenceVideoUrl: "",
      });
      toast({
        title: "Homework Assigned!",
        description: "Your student will be notified of the new assignment.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to assign homework.",
        variant: "destructive",
      });
    },
  });

  const mockStudentStats: StudentWithHomework[] = (students || []).map((student, index) => ({
    student,
    pendingHomework: (index % 3) + 1,
    completedHomework: (index % 5) + 2,
    lastSubmission: index % 2 === 0 ? "2 days ago" : "1 week ago",
  }));

  const pendingReviewCount = homework?.filter(h => h.status === "completed" && !h.coachFeedback).length || 0;
  const activeStudentsCount = students?.filter(s => s.status === "active").length || 0;

  const handleAssignHomework = () => {
    if (!selectedStudent || !homeworkData.title) {
      toast({
        title: "Missing Information",
        description: "Please select a student and provide a title.",
        variant: "destructive",
      });
      return;
    }
    assignHomeworkMutation.mutate({
      athleteId: selectedStudent,
      title: homeworkData.title,
      description: homeworkData.description,
      skillFocus: homeworkData.skillFocus,
      dueDate: homeworkData.dueDate || undefined,
      referenceVideoUrl: homeworkData.referenceVideoUrl || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neon-yellow">
              Private Instructor Studio
            </h1>
            <p className="text-muted-foreground mt-1">
              Train your roster remotely with video analysis
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="border-neon-yellow/50 text-neon-yellow hover-elevate"
              data-testid="button-add-student"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 bg-card border-neon-green/20 hover-elevate">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-neon-green/20">
                <Users className="w-6 h-6 text-neon-green" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeStudentsCount}</p>
                <p className="text-sm text-muted-foreground">Active Students</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 bg-card border-neon-yellow/20 hover-elevate">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-neon-yellow/20">
                <ClipboardList className="w-6 h-6 text-neon-yellow" />
              </div>
              <div>
                <p className="text-2xl font-bold">{homework?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Assignments</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 bg-card border-neon-pink/20 hover-elevate">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-neon-pink/20">
                <Video className="w-6 h-6 text-neon-pink" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingReviewCount}</p>
                <p className="text-sm text-muted-foreground">Awaiting Review</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-card border-neon-yellow/20 hover-elevate col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-neon-yellow/20">
                  <GraduationCap className="w-6 h-6 text-neon-yellow" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">My Active Roster</h2>
                  <p className="text-sm text-muted-foreground">Your remote training students</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {mockStudentStats.length > 0 ? (
                mockStudentStats.map((item) => (
                  <div 
                    key={item.student.id}
                    className="p-4 rounded-lg border border-border hover:border-neon-yellow/30 transition-colors"
                    data-testid={`student-row-${item.student.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-neon-yellow/20 flex items-center justify-center">
                          <span className="text-neon-yellow font-bold text-lg">
                            {item.student.athlete?.firstName?.charAt(0) || "?"}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{item.student.athlete ? `${item.student.athlete.firstName} ${item.student.athlete.lastName}` : "Unknown Student"}</h4>
                          <p className="text-sm text-muted-foreground">
                            Started {item.student.startDate || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-neon-yellow">{item.pendingHomework}</p>
                          <p className="text-xs text-muted-foreground">Pending</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-neon-green">{item.completedHomework}</p>
                          <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(item.student.athleteId || 0);
                            setShowAssignHomework(true);
                          }}
                          className="bg-neon-yellow text-black hover:bg-neon-yellow/90"
                          data-testid={`button-assign-${item.student.id}`}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Assign
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Your roster is empty</p>
                  <p className="text-sm">Add students to start remote coaching</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-card border-neon-pink/20 hover-elevate">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-neon-pink/20">
                <Video className="w-6 h-6 text-neon-pink" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Review Queue</h2>
                <p className="text-sm text-muted-foreground">Student submissions</p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {homework && homework.filter(h => h.status === "completed").length > 0 ? (
                homework
                  .filter(h => h.status === "completed")
                  .slice(0, 5)
                  .map((h) => (
                    <div
                      key={h.id}
                      className="p-3 rounded-lg border border-border hover:border-neon-pink/30 transition-colors"
                      data-testid={`review-item-${h.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{h.title}</p>
                          <p className="text-xs text-muted-foreground">{h.description?.slice(0, 30) || "Pitching drill"}</p>
                        </div>
                        <Button size="icon" variant="ghost" className="text-neon-pink">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                      {!h.coachFeedback && (
                        <Badge 
                          variant="outline" 
                          className="mt-2 text-xs border-neon-pink/50 text-neon-pink"
                        >
                          Needs Feedback
                        </Badge>
                      )}
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pending reviews</p>
                  <p className="text-sm">Students will appear here when they submit</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {showAssignHomework && (
          <Card className="p-6 bg-card border-neon-yellow/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-neon-yellow/20">
                <Send className="w-6 h-6 text-neon-yellow" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Assign New Homework</h2>
                <p className="text-sm text-muted-foreground">
                  Create a practice assignment for your student
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Assignment Title</label>
                  <Input
                    placeholder="e.g., Rise Ball Release Point Focus"
                    value={homeworkData.title}
                    onChange={(e) => setHomeworkData({ ...homeworkData, title: e.target.value })}
                    className="mt-1"
                    data-testid="input-homework-title"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Skill Focus</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {SKILL_FOCUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setHomeworkData({ ...homeworkData, skillFocus: option.value })}
                        className={`p-2 rounded-lg border text-center text-sm transition-all ${
                          homeworkData.skillFocus === option.value
                            ? "border-neon-yellow bg-neon-yellow/20 text-neon-yellow"
                            : "border-border hover:border-neon-yellow/50"
                        }`}
                        data-testid={`button-skill-${option.value}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Due Date (Optional)</label>
                  <Input
                    type="date"
                    value={homeworkData.dueDate}
                    onChange={(e) => setHomeworkData({ ...homeworkData, dueDate: e.target.value })}
                    className="mt-1"
                    data-testid="input-homework-date"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Instructions</label>
                  <Textarea
                    placeholder="Describe what you want the student to focus on..."
                    value={homeworkData.description}
                    onChange={(e) => setHomeworkData({ ...homeworkData, description: e.target.value })}
                    className="mt-1 h-24"
                    data-testid="textarea-homework-desc"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Reference Video URL (Optional)</label>
                  <Input
                    placeholder="YouTube or drill video URL"
                    value={homeworkData.referenceVideoUrl}
                    onChange={(e) => setHomeworkData({ ...homeworkData, referenceVideoUrl: e.target.value })}
                    className="mt-1"
                    data-testid="input-reference-video"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAssignHomework(false);
                      setSelectedStudent(null);
                    }}
                    data-testid="button-cancel-homework"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAssignHomework}
                    disabled={assignHomeworkMutation.isPending}
                    className="bg-neon-yellow text-black hover:bg-neon-yellow/90"
                    data-testid="button-send-homework"
                  >
                    {assignHomeworkMutation.isPending ? "Sending..." : "Send Assignment"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6 bg-card border-neon-green/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-neon-green/20">
              <Target className="w-6 h-6 text-neon-green" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Pro Model Comparison</h2>
              <p className="text-sm text-muted-foreground">
                Side-by-side video analysis with expert pitchers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="aspect-video rounded-lg bg-background border border-border flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Student Video</p>
                <p className="text-xs">Upload or select a submission</p>
              </div>
            </div>
            <div className="aspect-video rounded-lg bg-background border border-neon-green/30 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Play className="w-12 h-12 mx-auto mb-3 text-neon-green opacity-50" />
                <p className="text-neon-green">Pro Model Reference</p>
                <p className="text-xs">Select from drill library</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <Button 
              variant="outline" 
              className="border-neon-green/50 text-neon-green"
              onClick={() => toast({ title: "Coming Soon", description: "Pro Model comparison will be available in a future update." })}
            >
              <Eye className="w-4 h-4 mr-2" />
              Load Pro Model
            </Button>
            <Button 
              variant="outline"
              onClick={() => toast({ title: "Coming Soon", description: "Video annotations will be available in a future update." })}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Add Annotation
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
