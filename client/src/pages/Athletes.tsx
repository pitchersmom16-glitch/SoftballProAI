import { useAthletes, useCreateAthlete } from "@/hooks/use-athletes";
import { useTeams } from "@/hooks/use-teams";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAthleteSchema } from "@shared/routes";
import { z } from "zod";
import { Search, Plus, User } from "lucide-react";

// Schema for the form, handling numeric coercions
const createAthleteFormSchema = insertAthleteSchema.extend({
  heightInches: z.coerce.number().optional(),
  weightLbs: z.coerce.number().optional(),
  jerseyNumber: z.coerce.number().optional(),
  teamId: z.coerce.number().optional(),
});

export default function Athletes() {
  const [search, setSearch] = useState("");
  const { data: athletes, isLoading } = useAthletes();
  const { data: teams } = useTeams();
  const createAthlete = useCreateAthlete();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(createAthleteFormSchema),
    defaultValues: {
      name: "",
      bats: "R",
      throws: "R",
      primaryPosition: "",
      jerseyNumber: undefined,
    }
  });

  const onSubmit = (data: any) => {
    createAthlete.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
      }
    });
  };

  const filteredAthletes = athletes?.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Athletes</h1>
          <p className="text-slate-500 mt-1">Manage your roster and player profiles.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> Add Athlete
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Add New Athlete</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input {...form.register("name")} placeholder="Jane Doe" className="h-11" />
                {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Team</Label>
                  <Controller
                    control={form.control}
                    name="teamId"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value?.toString()}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select Team" />
                        </SelectTrigger>
                        <SelectContent>
                          {teams?.map(t => (
                            <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jersey Number</Label>
                  <Input type="number" {...form.register("jerseyNumber")} className="h-11" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input {...form.register("primaryPosition")} placeholder="P, SS, C" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Bats</Label>
                  <Controller
                    control={form.control}
                    name="bats"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || "R"}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="R">Right</SelectItem>
                          <SelectItem value="L">Left</SelectItem>
                          <SelectItem value="S">Switch</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Throws</Label>
                  <Controller
                    control={form.control}
                    name="throws"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || "R"}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="R">Right</SelectItem>
                          <SelectItem value="L">Left</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={createAthlete.isPending} className="w-full sm:w-auto">
                  {createAthlete.isPending ? "Adding..." : "Add Athlete"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search athletes..." 
          className="pl-10 h-12 bg-white shadow-sm border-slate-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAthletes?.map(athlete => {
            const team = teams?.find(t => t.id === athlete.teamId);
            return (
              <Card key={athlete.id} className="p-6 hover:shadow-lg transition-all duration-300 border-slate-100 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                      {athlete.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{athlete.name}</h3>
                      <p className="text-sm text-slate-500">{athlete.primaryPosition} {athlete.jerseyNumber && `• #${athlete.jerseyNumber}`}</p>
                    </div>
                  </div>
                  {team && (
                    <span className="px-2 py-1 rounded-md bg-slate-100 text-xs font-semibold text-slate-600">
                      {team.name}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-50">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Bats</p>
                    <p className="font-semibold">{athlete.bats}</p>
                  </div>
                  <div className="text-center border-l border-slate-50">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Throws</p>
                    <p className="font-semibold">{athlete.throws}</p>
                  </div>
                  <div className="text-center border-l border-slate-50">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Height</p>
                    <p className="font-semibold">{athlete.heightInches ? `${Math.floor(athlete.heightInches/12)}'${athlete.heightInches%12}"` : '-'}</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-2 group-hover:border-primary group-hover:text-primary transition-colors">
                  View Profile
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
