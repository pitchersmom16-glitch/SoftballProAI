import { useParams, useLocation } from "wouter";
import { useAthlete, useDeleteAthlete } from "@/hooks/use-athletes";
import { useTeams } from "@/hooks/use-teams";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { ArrowLeft, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AthleteDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { data: athlete, isLoading } = useAthlete(Number(id));
  const { data: teams } = useTeams();
  const deleteAthlete = useDeleteAthlete();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

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
        <div className="h-8 w-48 bg-slate-100 animate-pulse rounded" />
        <div className="h-64 bg-slate-100 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Athlete not found</p>
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

      <Card className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400">
              {athlete.name[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900" data-testid="text-athlete-name">{athlete.name}</h1>
              <p className="text-lg text-slate-500">
                {athlete.primaryPosition} {athlete.jerseyNumber && `• #${athlete.jerseyNumber}`}
              </p>
              {team && (
                <span className="inline-block mt-2 px-3 py-1 rounded-md bg-slate-100 text-sm font-semibold text-slate-600">
                  {team.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Bats</p>
            <p className="text-lg font-semibold">{athlete.bats || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Throws</p>
            <p className="text-lg font-semibold">{athlete.throws || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Height</p>
            <p className="text-lg font-semibold">
              {athlete.heightInches ? `${Math.floor(athlete.heightInches/12)}'${athlete.heightInches%12}"` : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Weight</p>
            <p className="text-lg font-semibold">{athlete.weightLbs ? `${athlete.weightLbs} lbs` : '-'}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Danger Zone</h3>
          <Button 
            variant="destructive" 
            onClick={() => setDeleteDialogOpen(true)}
            data-testid="button-delete-athlete"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Athlete
          </Button>
          <p className="text-sm text-slate-500 mt-2">
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
