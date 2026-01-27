import { useTeams, useCreateTeam, useDeleteTeam } from "@/hooks/use-teams";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Plus, Settings, Users, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTeamSchema } from "@shared/routes";
import { useState } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Teams() {
  const { data: teams, isLoading } = useTeams();
  const createTeam = useCreateTeam();
  const deleteTeam = useDeleteTeam();
  const [isOpen, setIsOpen] = useState(false);
  const [settingsTeam, setSettingsTeam] = useState<{ id: number; name: string } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertTeamSchema),
    defaultValues: {
      name: "",
      ageDivision: "",
      season: "Spring 2026",
    }
  });

  const onSubmit = (data: any) => {
    createTeam.mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
        toast({ title: "Team created", description: "Your new team has been added." });
      }
    });
  };

  const handleDeleteTeam = () => {
    if (settingsTeam) {
      deleteTeam.mutate(settingsTeam.id, {
        onSuccess: () => {
          toast({ title: "Team deleted", description: `${settingsTeam.name} has been removed.` });
          setDeleteDialogOpen(false);
          setSettingsTeam(null);
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to delete team.", variant: "destructive" });
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-display text-slate-900">Teams</h1>
            <p className="text-slate-500 mt-1">Manage your squads and seasons.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Teams</h1>
          <p className="text-slate-500 mt-1">Manage your squads and seasons.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg shadow-primary/20" data-testid="button-create-team">
              <Plus className="mr-2 h-4 w-4" /> Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Team Name</Label>
                <Input {...form.register("name")} placeholder="Tigers 14U" data-testid="input-team-name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Division</Label>
                  <Input {...form.register("ageDivision")} placeholder="14U" data-testid="input-team-division" />
                </div>
                <div className="space-y-2">
                  <Label>Season</Label>
                  <Input {...form.register("season")} data-testid="input-team-season" />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createTeam.isPending} data-testid="button-submit-team">
                {createTeam.isPending ? "Creating..." : "Create Team"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams?.map(team => (
          <Card key={team.id} className="p-6 border-slate-100 hover:shadow-lg transition-all duration-300" data-testid={`card-team-${team.id}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900" data-testid={`text-team-name-${team.id}`}>{team.name}</h3>
                <p className="text-sm text-slate-500">{team.ageDivision} {team.season && `• ${team.season}`}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link href={`/athletes?teamId=${team.id}`} className="flex-1">
                <Button variant="outline" className="w-full" data-testid={`button-roster-${team.id}`}>
                  <Users className="mr-2 h-4 w-4" /> Roster
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setSettingsTeam({ id: team.id, name: team.name })}
                data-testid={`button-settings-${team.id}`}
              >
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
            </div>
          </Card>
        ))}
        
        {teams?.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <ShieldCheck className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No teams yet. Create one to get started!</p>
          </div>
        )}
      </div>

      {/* Team Settings Dialog */}
      <Dialog open={!!settingsTeam} onOpenChange={(open) => !open && setSettingsTeam(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Team Settings</DialogTitle>
            <DialogDescription>
              Manage settings for {settingsTeam?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Team Information</h4>
              <p className="text-slate-500 text-sm">Team: {settingsTeam?.name}</p>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3">Danger Zone</h4>
              <Button 
                variant="destructive" 
                onClick={() => setDeleteDialogOpen(true)}
                data-testid="button-delete-team"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Team
              </Button>
              <p className="text-sm text-slate-500 mt-2">
                Permanently remove this team. Athletes will not be deleted but will be unassigned.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {settingsTeam?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTeam}
              disabled={deleteTeam.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteTeam.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
