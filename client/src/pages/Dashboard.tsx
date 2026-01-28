import { useAuth } from "@/hooks/use-auth";
import { useCoach, useCreateCoach } from "@/hooks/use-coaches";
import { useAssessments } from "@/hooks/use-assessments";
import { useAthletes } from "@/hooks/use-athletes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCoachSchema } from "@shared/routes";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Video, Users, CheckCircle } from "lucide-react";

const createCoachSchema = insertCoachSchema.extend({
  experienceYears: z.coerce.number().min(0),
});

export default function Dashboard() {
  const { user } = useAuth();
  const { data: coach, isLoading: isCoachLoading } = useCoach();
  const { data: athletes } = useAthletes();
  const { data: assessments } = useAssessments();
  const createCoach = useCreateCoach();

  const form = useForm({
    resolver: zodResolver(createCoachSchema),
    defaultValues: {
      name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      bio: "",
      experienceYears: 0,
      certificationLevel: "",
      userId: user?.id,
    }
  });

  if (isCoachLoading) return null;

  // Onboarding Modal for new coaches
  if (!coach && user) {
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-white">Welcome to SoftballProAI, Coach!</DialogTitle>
            <DialogDescription>
              Let's set up your coaching profile to get started.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit((data) => createCoach.mutate({ ...data, userId: user.id }))} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...form.register("name")} className="h-11" placeholder="e.g. Coach Sarah" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exp">Experience (Years)</Label>
                <Input type="number" id="exp" {...form.register("experienceYears")} className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert">Certification</Label>
                <Input id="cert" {...form.register("certificationLevel")} className="h-11" placeholder="e.g. NFCA Level 1" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" {...form.register("bio")} placeholder="Tell us about your coaching philosophy..." />
            </div>

            <DialogFooter>
              <Button type="submit" size="lg" disabled={createCoach.isPending}>
                {createCoach.isPending ? "Creating Profile..." : "Complete Setup"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Calculate quick stats
  const recentAssessments = assessments?.slice(0, 5) || [];
  const pendingCount = assessments?.filter(a => a.status === 'pending').length || 0;
  const totalAthletes = athletes?.length || 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Coach Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {coach?.name}. Here's what's happening.</p>
        </div>
        <Link href="/assessments">
          <Button size="lg" className="shadow-lg shadow-primary/20 w-full md:w-auto" data-testid="button-new-assessment">
            <Video className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-white/10 bg-card hover:border-neon-green/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-neon-green/20 text-neon-green flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Total Athletes</p>
              <h3 className="text-2xl font-bold text-white">{totalAthletes}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-white/10 bg-card hover:border-neon-pink/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-neon-pink/20 text-neon-pink flex items-center justify-center">
              <Video className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Assessments This Week</p>
              <h3 className="text-2xl font-bold text-white">{recentAssessments.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-white/10 bg-card hover:border-neon-yellow/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-neon-yellow/20 text-neon-yellow flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Pending Analysis</p>
              <h3 className="text-2xl font-bold text-white">{pendingCount}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-white">Recent Assessments</h2>
            <Link href="/assessments" className="text-sm font-medium text-primary hover:text-primary/80">View All</Link>
          </div>

          <div className="bg-card rounded-2xl border border-white/10 overflow-hidden">
            {recentAssessments.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Video className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                <p>No assessments yet. Upload a video to start!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {recentAssessments.map(assessment => {
                  const athlete = athletes?.find(a => a.id === assessment.athleteId);
                  return (
                    <div key={assessment.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-neon-green/20 flex items-center justify-center text-lg font-bold text-neon-green">
                          {athlete?.firstName?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-white">{athlete ? `${athlete.firstName} ${athlete.lastName}` : 'Unknown Athlete'}</p>
                          <p className="text-xs text-gray-400 capitalize">{assessment.skillType} • {new Date(assessment.date || '').toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize 
                          ${assessment.status === 'completed' ? 'bg-neon-green/20 text-neon-green' : 
                            assessment.status === 'analyzing' ? 'bg-neon-pink/20 text-neon-pink' : 'bg-white/10 text-gray-300'}`}>
                          {assessment.status}
                        </span>
                        <Link href={`/assessments/${assessment.id}`}>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-neon-green">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold font-display mb-6 text-white">Quick Actions</h2>
          <div className="space-y-4">
            <Link href="/athletes">
              <Card className="p-4 border-white/10 hover:border-neon-green/30 transition-all cursor-pointer group bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-neon-green/20 text-neon-green flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-white">Manage Roster</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-neon-green transition-colors" />
                </div>
              </Card>
            </Link>
            
            <Link href="/drills">
              <Card className="p-4 border-white/10 hover:border-neon-pink/30 transition-all cursor-pointer group bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-neon-pink/20 text-neon-pink flex items-center justify-center">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-white">Browse Drills</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-neon-pink transition-colors" />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
