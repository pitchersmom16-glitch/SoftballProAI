import { useState } from "react";
import { useAssessment } from "@/hooks/use-assessments";
import { useAthlete } from "@/hooks/use-athletes";
import { useRoute, Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import PoseAnalyzer from "@/components/PoseAnalyzer";

interface LiveMetrics {
  armSlotAngle: number | null;
  kneeFlexion: number | null;
  torqueSeparation: number | null;
}

export default function AssessmentDetail() {
  const [, params] = useRoute("/assessments/:id");
  const id = parseInt(params?.id || "0");
  const { data: assessment, isLoading } = useAssessment(id);
  const { data: athlete } = useAthlete(assessment?.athleteId || 0);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    armSlotAngle: null,
    kneeFlexion: null,
    torqueSeparation: null,
  });

  if (isLoading || !assessment) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold font-display text-slate-900">{athlete ? `${athlete.firstName} ${athlete.lastName}` : ''}'s Analysis</h1>
            <Badge variant="outline" className="text-sm capitalize">{assessment.skillType}</Badge>
          </div>
          <p className="text-slate-500">{new Date(assessment.date || '').toLocaleDateString()} • {assessment.status}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Video Player Section with Pose Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden bg-black rounded-2xl shadow-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-[#39FF14]" />
              <h3 className="font-bold text-white">Biomechanical Analysis</h3>
              <Badge className="bg-[#39FF14]/20 text-[#39FF14] border-none">AI Powered</Badge>
            </div>
            <PoseAnalyzer
              videoUrl={assessment.videoUrl}
              onMetricsUpdate={setLiveMetrics}
            />
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Coach's Notes</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {assessment.notes || "No notes added yet."}
            </p>
          </Card>
        </div>

        {/* Metrics & Feedback Sidebar */}
        <div className="space-y-6">
          {/* Live Biomechanics Metrics */}
          <Card className="p-6 border-[#39FF14]/30 bg-slate-900">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-5 w-5 text-[#39FF14]" />
              <h3 className="font-bold text-lg text-white">Live Biomechanics</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-black/50 p-4 rounded-xl border border-[#39FF14]/20">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Arm Slot Angle</p>
                <p className="text-3xl font-bold text-[#39FF14]" data-testid="sidebar-arm-slot">
                  {liveMetrics.armSlotAngle !== null ? `${liveMetrics.armSlotAngle}°` : "--"}
                </p>
                <p className="text-xs text-slate-500 mt-1">Hip → Shoulder → Elbow</p>
              </div>
              
              <div className="bg-black/50 p-4 rounded-xl border border-[#FF10F0]/20">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Knee Flexion</p>
                <p className="text-3xl font-bold text-[#FF10F0]" data-testid="sidebar-knee-flexion">
                  {liveMetrics.kneeFlexion !== null ? `${liveMetrics.kneeFlexion}°` : "--"}
                </p>
                <p className="text-xs text-slate-500 mt-1">Hip → Knee → Ankle</p>
              </div>
              
              <div className="bg-black/50 p-4 rounded-xl border border-[#FAFF00]/20">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Torque Separation</p>
                <p className="text-3xl font-bold text-[#FAFF00]" data-testid="sidebar-torque-sep">
                  {liveMetrics.torqueSeparation !== null ? `${liveMetrics.torqueSeparation}%` : "--"}
                </p>
                <p className="text-xs text-slate-500 mt-1">Shoulder vs Hip rotation</p>
              </div>
            </div>
          </Card>
          
          {/* Saved Metrics Card */}
          <Card className="p-6 border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-accent-foreground" />
              <h3 className="font-bold text-lg">Saved Metrics</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {assessment.metrics && typeof assessment.metrics === 'object' && 
                Object.keys(assessment.metrics as Record<string, unknown>).length > 0 ? (
                  Object.entries(assessment.metrics as Record<string, unknown>).map(([key, val]) => (
                    <div key={key} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">{key}</p>
                      <p className="text-xl font-bold">{String(val)}</p>
                    </div>
                  ))
                ) : (
                <div className="col-span-2 text-center py-4 text-slate-400 text-sm">
                  Play video to see live analysis
                </div>
              )}
            </div>
          </Card>

          {/* AI Feedback */}
          <Card className="p-6 bg-slate-900 text-white border-none shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <h3 className="font-bold text-lg">AI Breakdown</h3>
            </div>

            <div className="space-y-6">
              {assessment.feedback?.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`mt-1 flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center
                    ${item.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {item.priority === 'High' ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">{item.issueDetected}</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{item.feedbackText}</p>
                    {item.drillId && (
                      <Link href={`/drills`}>
                        <Button variant="ghost" className="text-accent p-0 h-auto text-xs mt-2">
                          View Recommended Drill
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              
              {(!assessment.feedback || assessment.feedback.length === 0) && (
                 <p className="text-slate-400 text-sm italic">Analysis in progress. Please check back shortly.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
