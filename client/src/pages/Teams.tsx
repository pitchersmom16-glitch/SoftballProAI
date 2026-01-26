import { useTeams, useCreateTeam } from "@/hooks/use-teams";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTeamSchema } from "@shared/routes";
import { useState } from "react";

export default function Teams() {
  const { data: teams, isLoading } = useTeams();
  const createTeam = useCreateTeam();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertTeamSchema),
    defaultValues: {
      name: "",
      ageDivision: "",
      season: "Spring 2024",
    }
  });

  const onSubmit = (data: any) => {
    createTeam.mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Teams</h1>
          <p className="text-slate-500 mt-1">Manage your squads and seasons.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg shadow-primary/20">
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
                <Input {...form.register("name")} placeholder="Tigers 14U" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Division</Label>
                  <Input {...form.register("ageDivision")} placeholder="14U" />
                </div>
                <div className="space-y-2">
                  <Label>Season</Label>
                  <Input {...form.register("season")} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createTeam.isPending}>
                {createTeam.isPending ? "Creating..." : "Create Team"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams?.map(team => (
          <Card key={team.id} className="p-6 border-slate-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900">{team.name}</h3>
                <p className="text-sm text-slate-500">{team.ageDivision} • {team.season}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">Roster</Button>
              <Button variant="outline" className="flex-1">Settings</Button>
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
    </div>
  );
}
