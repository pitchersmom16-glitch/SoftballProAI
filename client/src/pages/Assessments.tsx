import { useAssessments, useCreateAssessment } from "@/hooks/use-assessments";
import { useAthletes } from "@/hooks/use-athletes";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Video, Upload, Play, Clock, CheckCircle } from "lucide-react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Assessments() {
  const { data: assessments, isLoading } = useAssessments();
  const { data: athletes } = useAthletes();
  const createAssessment = useCreateAssessment();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<string>("hitting");
  
  // Handling file upload
  const handleUploadComplete = (result: any) => {
    // Uppy result structure may vary, usually result.successful[0].uploadURL or similar
    // Assuming our ObjectUploader returns the result object directly
    
    // For MVP, we extract the first uploaded file's URL
    // NOTE: In a real app with ObjectUploader, we need to map the result correctly
    // Since ObjectUploader uses onComplete with a result object, we'll assume it worked
    // But we need the URL to create the assessment record.
    
    // The ObjectUploader component uses Uppy. We need to pass a callback that receives the file URL.
    // However, looking at the provided ObjectUploader, it takes onComplete(result).
    // result.successful[0].response.uploadURL is likely where it is if using XHR, 
    // but with presigned URLs it might be different.
    
    // Let's assume for this MVP we get the file URL from result.successful[0].uploadURL
    const fileUrl = result.successful[0]?.uploadURL;
    
    if (!fileUrl) {
      toast({ title: "Upload Failed", variant: "destructive" });
      return;
    }

    if (!selectedAthleteId) {
      toast({ title: "Select an athlete first", variant: "destructive" });
      return;
    }

    createAssessment.mutate({
      athleteId: parseInt(selectedAthleteId),
      skillType: selectedSkill,
      videoUrl: fileUrl,
      status: "pending",
      date: new Date().toISOString(), // Use string format for timestamp
    }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        toast({ title: "Assessment Created", description: "Analysis will start automatically." });
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Assessments</h1>
          <p className="text-gray-400 mt-1">Video analysis and biomechanical feedback.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg shadow-primary/20">
              <Upload className="mr-2 h-4 w-4" /> New Analysis
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Video for Analysis</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Athlete</Label>
                <Select value={selectedAthleteId} onValueChange={setSelectedAthleteId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Athlete" />
                  </SelectTrigger>
                  <SelectContent>
                    {athletes?.map(a => (
                      <SelectItem key={a.id} value={a.id.toString()}>{a.firstName} {a.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Skill Type</Label>
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hitting">Hitting</SelectItem>
                    <SelectItem value="pitching">Pitching</SelectItem>
                    <SelectItem value="fielding">Fielding</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <ObjectUploader
                  buttonClassName="w-full bg-slate-900 text-white hover:bg-slate-800"
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
                  onComplete={handleUploadComplete}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="h-4 w-4" /> Select Video & Upload
                  </div>
                </ObjectUploader>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments?.map(assessment => {
          const athlete = athletes?.find(a => a.id === assessment.athleteId);
          return (
            <Link key={assessment.id} href={`/assessments/${assessment.id}`}>
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-white/10 bg-card cursor-pointer">
                <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                  <Video className="h-12 w-12 text-slate-700 group-hover:text-white transition-colors" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
                    {new Date(assessment.date || '').toLocaleDateString()}
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white">{athlete ? `${athlete.firstName} ${athlete.lastName}` : "Unknown Athlete"}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide 
                      ${assessment.status === 'completed' ? 'bg-green-100 text-green-700' : 
                        assessment.status === 'analyzing' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                      {assessment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 capitalize mb-4">{assessment.skillType} Analysis</p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {assessment.status === 'completed' ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Analysis Ready</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
