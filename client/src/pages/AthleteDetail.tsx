import { useParams, useLocation } from "wouter";
import { useAthlete, useDeleteAthlete, useUpdateAthlete } from "@/hooks/use-athletes";
import { useTeams } from "@/hooks/use-teams";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { ArrowLeft, Trash2, Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export default function AthleteDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { data: athlete, isLoading } = useAthlete(Number(id));
  const { data: teams } = useTeams();
  const deleteAthlete = useDeleteAthlete();
  const updateAthlete = useUpdateAthlete();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const pendingObjectPath = useRef<string | null>(null);

  const team = teams?.find(t => t.id === athlete?.teamId);

  const confirmDelete = () => {
    if (athlete) {
      deleteAthlete.mutate(athlete.id, {
        onSuccess: () => {
          toast({ title: "Athlete deleted", description: `${athlete.name} has been removed.` });
          navigate("/athletes");
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to delete athlete.", variant: "destructive" });
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-800 animate-pulse rounded" />
        <div className="h-64 bg-slate-800 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Athlete not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/athletes")}>
          Back to Athletes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/athletes")} data-testid="button-back-athletes">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Athletes
        </Button>
      </div>

      <Card className="p-8 bg-card border-neon-green/20">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              {athlete.photoUrl ? (
                <img 
                  src={athlete.photoUrl} 
                  alt={athlete.name}
                  className="h-24 w-24 rounded-2xl object-cover border-2 border-neon-green/30"
                  data-testid="img-athlete-photo"
                />
              ) : (
                <div 
                  className="h-24 w-24 rounded-2xl bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 border-2 border-neon-green/30 flex items-center justify-center text-4xl font-bold text-neon-green"
                  data-testid="avatar-athlete-fallback"
                >
                  {athlete.name[0]}
                </div>
              )}
              <ObjectUploader
                maxNumberOfFiles={1}
                maxFileSize={5242880}
                onGetUploadParameters={async (file) => {
                  const response = await fetch("/api/uploads/request-url", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: file.name,
                      size: file.size,
                      contentType: file.type || "image/jpeg",
                    }),
                    credentials: "include",
                  });

                  if (!response.ok) {
                    throw new Error("Failed to get upload URL");
                  }

                  const data = await response.json();
                  pendingObjectPath.current = data.objectPath;
                  return {
                    method: "PUT" as const,
                    url: data.uploadURL,
                    headers: { "Content-Type": file.type || "image/jpeg" },
                  };
                }}
                onComplete={async () => {
                  const objectPath = pendingObjectPath.current;
                  if (objectPath && athlete) {
                    updateAthlete.mutate(
                      { id: athlete.id, photoUrl: objectPath },
                      {
                        onSuccess: () => {
                          toast({ title: "Photo uploaded", description: "Profile picture has been updated." });
                          queryClient.invalidateQueries({ queryKey: [api.athletes.get.path, athlete.id] });
                          queryClient.invalidateQueries({ queryKey: [api.athletes.list.path] });
                          pendingObjectPath.current = null;
                        },
                        onError: () => {
                          toast({ title: "Error", description: "Failed to save photo.", variant: "destructive" });
                          pendingObjectPath.current = null;
                        },
                      }
                    );
                  }
                }}
                buttonClassName="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 h-10 w-10 rounded-full bg-neon-pink p-0 flex items-center justify-center shadow-lg"
              >
                {updateAthlete.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin text-black" data-testid="icon-upload-loading" />
                ) : (
                  <Camera className="h-5 w-5 text-black" data-testid="icon-upload-camera" />
                )}
              </ObjectUploader>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white" data-testid="text-athlete-name">{athlete.name}</h1>
              <p className="text-lg text-muted-foreground">
                {athlete.primaryPosition} {athlete.jerseyNumber && `• #${athlete.jerseyNumber}`}
              </p>
              {team && (
                <span className="inline-block mt-2 px-3 py-1 rounded-md bg-neon-green/10 text-sm font-semibold text-neon-green border border-neon-green/30">
                  {team.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-white/10">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Bats</p>
            <p className="text-lg font-semibold text-white">{athlete.bats || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Throws</p>
            <p className="text-lg font-semibold text-white">{athlete.throws || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Height</p>
            <p className="text-lg font-semibold text-white">
              {athlete.heightInches ? `${Math.floor(athlete.heightInches/12)}'${athlete.heightInches%12}"` : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Weight</p>
            <p className="text-lg font-semibold text-white">{athlete.weightLbs ? `${athlete.weightLbs} lbs` : '-'}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4">Danger Zone</h3>
          <Button 
            variant="destructive" 
            onClick={() => setDeleteDialogOpen(true)}
            data-testid="button-delete-athlete"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Athlete
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Permanently remove this athlete from your roster. This action cannot be undone.
          </p>
        </div>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Athlete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {athlete.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteAthlete.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteAthlete.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
