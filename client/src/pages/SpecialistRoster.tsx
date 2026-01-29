import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Plus,
  Copy,
  CheckCircle2,
  Clock,
  Archive,
  AlertCircle,
  Link2,
  Mail,
  Phone,
  Loader2,
  Eye,
  Video,
  MapPin,
  Gauge
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BaselineVideo {
  id: number;
  videoNumber: number;
  videoUrl: string;
  aiAnalysis?: string;
}

interface Student {
  id: number;
  playerId: string;
  name: string;
  email?: string;
  skillType: string;
  status: string;
  startDate?: string;
  baselineComplete: boolean;
  baselineVideoCount: number;
  dashboardUnlocked: boolean;
  needsReview: boolean;
  baselineVideos?: BaselineVideo[];
}

interface RosterData {
  students: Student[];
  count: number;
  maxStudents: number;
}

interface ReferralData {
  referralCode: string;
  referralUrl: string;
}

const VIDEO_LABELS = ["Front View", "Side View", "Back View", "Close-Up Release"];

export default function SpecialistRoster() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [roadmapNotes, setRoadmapNotes] = useState("");
  const [inviteData, setInviteData] = useState({
    parentEmail: "",
    studentEmail: "",
    phone: "",
    studentName: "",
  });

  const { data: roster, isLoading: rosterLoading } = useQuery<RosterData>({
    queryKey: ["/api/specialist/roster"],
  });

  const { data: referral, isLoading: referralLoading } = useQuery<ReferralData>({
    queryKey: ["/api/specialist/referral-code"],
  });

  const inviteMutation = useMutation({
    mutationFn: async (data: typeof inviteData) => {
      return apiRequest("POST", "/api/specialist/invite", data);
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/specialist/roster"] });
      setShowInviteDialog(false);
      setInviteData({ parentEmail: "", studentEmail: "", phone: "", studentName: "" });
      
      const inviteUrl = response.inviteUrl || "";
      navigator.clipboard.writeText(window.location.origin + inviteUrl);
      
      toast({
        title: "Invite Created!",
        description: "Invite link copied to clipboard. Share it with the student/parent.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create invite.",
        variant: "destructive",
      });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (studentId: number) => {
      return apiRequest("POST", `/api/specialist/roster/${studentId}/archive`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/specialist/roster"] });
      toast({
        title: "Student Archived",
        description: "Student has been removed from your active roster.",
      });
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (playerId: string) => {
      return apiRequest("POST", `/api/specialist/baseline/${playerId}/approve`, { 
        notes: roadmapNotes 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/specialist/roster"] });
      setShowReviewDialog(false);
      setSelectedStudent(null);
      setRoadmapNotes("");
      toast({
        title: "Roadmap Created!",
        description: "Student dashboard has been unlocked. They can now access their training plan.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create roadmap.",
        variant: "destructive",
      });
    },
  });

  const openReviewDialog = (student: Student) => {
    setSelectedStudent(student);
    setRoadmapNotes("");
    setShowReviewDialog(true);
  };

  const copyReferralLink = () => {
    if (referral?.referralUrl) {
      navigator.clipboard.writeText(window.location.origin + referral.referralUrl);
      toast({
        title: "Link Copied!",
        description: "Referral link copied to clipboard.",
      });
    }
  };

  const getStatusBadge = (student: Student) => {
    if (student.needsReview) {
      return <Badge variant="destructive" data-testid={`badge-status-${student.id}`}><AlertCircle className="w-3 h-3 mr-1" />Needs Review</Badge>;
    }
    if (!student.baselineComplete) {
      return <Badge variant="secondary" data-testid={`badge-status-${student.id}`}><Clock className="w-3 h-3 mr-1" />Onboarding ({student.baselineVideoCount}/4)</Badge>;
    }
    if (student.dashboardUnlocked) {
      return <Badge variant="default" data-testid={`badge-status-${student.id}`}><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>;
    }
    return <Badge variant="outline" data-testid={`badge-status-${student.id}`}>Pending</Badge>;
  };

  if (rosterLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="loading-roster">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const students = roster?.students || [];
  const studentCount = roster?.count || 0;
  const maxStudents = roster?.maxStudents || 25;
  const spotsRemaining = maxStudents - studentCount;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent" data-testid="text-page-title">
              My Students
            </h1>
            <p className="text-gray-400 mt-1" data-testid="text-roster-count">
              {studentCount} / {maxStudents} active students ({spotsRemaining} spots remaining)
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={copyReferralLink}
              disabled={referralLoading}
              className="border-purple-500/50 text-purple-400"
              data-testid="button-copy-referral"
            >
              <Link2 className="w-4 h-4 mr-2" />
              Copy Referral Link
            </Button>
            
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                  disabled={spotsRemaining <= 0}
                  data-testid="button-add-student"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0a0a0a] border-purple-500/30" data-testid="dialog-invite">
                <DialogHeader>
                  <DialogTitle className="text-white">Invite New Student</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Send an invite to a student or their parent. They will receive a unique link to register.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Student Name (Optional)</label>
                    <Input
                      placeholder="e.g., Sarah Johnson"
                      value={inviteData.studentName}
                      onChange={(e) => setInviteData({ ...inviteData, studentName: e.target.value })}
                      className="bg-black/50 border-gray-700"
                      data-testid="input-student-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Parent Email
                    </label>
                    <Input
                      type="email"
                      placeholder="parent@example.com"
                      value={inviteData.parentEmail}
                      onChange={(e) => setInviteData({ ...inviteData, parentEmail: e.target.value })}
                      className="bg-black/50 border-gray-700"
                      data-testid="input-parent-email"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Student Email
                    </label>
                    <Input
                      type="email"
                      placeholder="student@example.com"
                      value={inviteData.studentEmail}
                      onChange={(e) => setInviteData({ ...inviteData, studentEmail: e.target.value })}
                      className="bg-black/50 border-gray-700"
                      data-testid="input-student-email"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone (Optional)
                    </label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={inviteData.phone}
                      onChange={(e) => setInviteData({ ...inviteData, phone: e.target.value })}
                      className="bg-black/50 border-gray-700"
                      data-testid="input-phone"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    At least one contact method (parent email, student email, or phone) is required.
                  </p>
                  <Button
                    onClick={() => inviteMutation.mutate(inviteData)}
                    disabled={inviteMutation.isPending || (!inviteData.parentEmail && !inviteData.studentEmail && !inviteData.phone)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                    data-testid="button-send-invite"
                  >
                    {inviteMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Create Invite Link
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {referral && (
          <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30 p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400">Your Referral Code</p>
                <p className="text-lg font-mono text-purple-400" data-testid="text-referral-code">{referral.referralCode}</p>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  readOnly 
                  value={window.location.origin + referral.referralUrl}
                  className="bg-black/50 border-gray-700 text-sm w-64"
                  data-testid="input-referral-url"
                />
                <Button 
                  size="icon" 
                  variant="outline" 
                  onClick={copyReferralLink}
                  className="border-purple-500/50"
                  data-testid="button-copy-url"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card className="bg-[#0a0a0a] border-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Skill</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Start Date</TableHead>
                <TableHead className="text-gray-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-12">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No students yet. Add your first student to get started.</p>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id} className="border-gray-800" data-testid={`row-student-${student.id}`}>
                    <TableCell className="font-medium" data-testid={`text-student-name-${student.id}`}>
                      {student.name}
                      {student.email && (
                        <span className="text-xs text-gray-500 block">{student.email}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                        {student.skillType}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(student)}</TableCell>
                    <TableCell className="text-gray-400">
                      {student.startDate ? new Date(student.startDate).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {student.needsReview && (
                          <Button 
                            size="sm" 
                            className="bg-pink-600"
                            onClick={() => openReviewDialog(student)}
                            data-testid={`button-review-${student.id}`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => archiveMutation.mutate(student.id)}
                          disabled={archiveMutation.isPending}
                          className="text-gray-400"
                          data-testid={`button-archive-${student.id}`}
                        >
                          <Archive className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {spotsRemaining <= 5 && spotsRemaining > 0 && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg" data-testid="alert-spots-remaining">
            <p className="text-yellow-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              You have {spotsRemaining} spots remaining in your roster.
            </p>
          </div>
        )}

        {spotsRemaining <= 0 && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg" data-testid="alert-roster-full">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Your roster is full. Archive inactive students to add new ones.
            </p>
          </div>
        )}

        {/* Review Baseline Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="bg-[#0a0a0a] border-purple-500/30 max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="dialog-review">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-pink-500" />
                Baseline Review: {selectedStudent?.name}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Review the student's baseline videos and AI analysis, then create their training roadmap.
              </DialogDescription>
            </DialogHeader>
            
            {selectedStudent && (
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {VIDEO_LABELS.map((label, idx) => {
                    const video = selectedStudent.baselineVideos?.find(v => v.videoNumber === idx + 1);
                    return (
                      <Card key={idx} className="bg-black/50 border-gray-700 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Video className="w-4 h-4 text-purple-400" />
                          <h4 className="font-medium text-white">{label}</h4>
                        </div>
                        {video?.videoUrl ? (
                          <div className="space-y-2">
                            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                              <video 
                                src={video.videoUrl} 
                                controls 
                                className="w-full h-full rounded-lg"
                                data-testid={`video-baseline-${idx + 1}`}
                              />
                            </div>
                            {video.aiAnalysis && (
                              <div className="bg-purple-900/20 border border-purple-500/20 rounded p-2">
                                <p className="text-xs text-gray-400">AI Analysis:</p>
                                <p className="text-sm text-gray-300">{video.aiAnalysis}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500 text-sm">No video uploaded</p>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Roadmap Notes (What to focus on first)
                  </label>
                  <Textarea
                    placeholder="e.g., Start with K-drills for arm circle, focus on internal rotation..."
                    value={roadmapNotes}
                    onChange={(e) => setRoadmapNotes(e.target.value)}
                    className="bg-black/50 border-gray-700 min-h-[100px]"
                    data-testid="textarea-roadmap-notes"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={async () => {
                      if (!selectedStudent) return;
                      
                      // Trigger AI analysis for all baseline videos
                      toast({
                        title: "Analyzing Videos",
                        description: "Processing baseline videos with AI Brain...",
                      });
                      
                      try {
                        for (const video of selectedStudent.baselineVideos || []) {
                          if (video.videoUrl) {
                            await apiRequest('POST', '/api/analysis/process', {
                              assessmentId: video.assessmentId || 0,
                              videoUrl: video.videoUrl,
                              skillType: video.skillType || 'PITCHING',
                              athleteId: selectedStudent.id,
                              videoCategory: video.videoCategory || 'fastball',
                            });
                          }
                        }
                        
                        toast({
                          title: "Analysis Complete!",
                          description: "AI has analyzed all videos and generated recommendations.",
                        });
                        
                        queryClient.invalidateQueries({ queryKey: ["/api/specialist/baseline-queue"] });
                      } catch (error) {
                        toast({
                          title: "Analysis Failed",
                          description: "Could not complete video analysis. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }}
                    disabled={!selectedStudent || !selectedStudent.baselineVideos?.length}
                    variant="secondary"
                    className="flex-1"
                    data-testid="button-analyze-videos"
                  >
                    <Gauge className="w-4 h-4 mr-2" />
                    Analyze with AI Brain
                  </Button>
                  <Button
                    onClick={() => selectedStudent && approveMutation.mutate(selectedStudent.playerId)}
                    disabled={approveMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                    data-testid="button-create-roadmap"
                  >
                    {approveMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    Create Roadmap & Unlock Dashboard
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
