import { useAthletes, useCreateAthlete } from "@/hooks/use-athletes";
import { useTeams } from "@/hooks/use-teams";
import { useState } from "react";
import { Link } from "wouter";
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
import { Search, Plus } from "lucide-react";

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
      firstName: "",
      lastName: "",
      bats: "R",
      throws: "R",
      primaryPosition: "",
      jerseyNumber: undefined as number | undefined,
      playerPhone: "",
      parentPhone: "",
      teamId: undefined as number | undefined,
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

  const getFullName = (athlete: { firstName: string; lastName: string }) => 
    `${athlete.firstName} ${athlete.lastName}`;

  const filteredAthletes = athletes?.filter(a => 
    getFullName(a).toLowerCase().includes(search.toLowerCase())
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
            <Button size="lg" className="shadow-lg shadow-primary/20" data-testid="button-add-athlete">
              <Plus className="mr-2 h-4 w-4" /> Add Athlete
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Add New Athlete</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input {...form.register("firstName")} placeholder="Jane" className="h-11" data-testid="input-first-name" />
                  {form.formState.errors.firstName && <p className="text-red-500 text-xs">{form.formState.errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input {...form.register("lastName")} placeholder="Doe" className="h-11" data-testid="input-last-name" />
                  {form.formState.errors.lastName && <p className="text-red-500 text-xs">{form.formState.errors.lastName.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Player Phone</Label>
                  <Input {...form.register("playerPhone")} placeholder="(555) 123-4567" className="h-11" data-testid="input-player-phone" />
                </div>
                <div className="space-y-2">
                  <Label>Parent Phone</Label>
                  <Input {...form.register("parentPhone")} placeholder="(555) 987-6543" className="h-11" data-testid="input-parent-phone" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Team</Label>
                  <Controller
                    control={form.control}
                    name="teamId"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value?.toString()}>
                        <SelectTrigger className="h-11" data-testid="select-team">
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
                  <Input type="number" {...form.register("jerseyNumber")} className="h-11" data-testid="input-jersey" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input {...form.register("primaryPosition")} placeholder="P, SS, C" className="h-11" data-testid="input-position" />
                </div>
                <div className="space-y-2">
                  <Label>Bats</Label>
                  <Controller
                    control={form.control}
                    name="bats"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || "R"}>
                        <SelectTrigger className="h-11" data-testid="select-bats">
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
                        <SelectTrigger className="h-11" data-testid="select-throws">
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
                <Button type="submit" disabled={createAthlete.isPending} className="w-full sm:w-auto" data-testid="button-submit-athlete">
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
          data-testid="input-search-athletes"
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
            const fullName = getFullName(athlete);
            return (
              <Card key={athlete.id} className="p-6 hover:shadow-lg transition-all duration-300 border-slate-100 group" data-testid={`card-athlete-${athlete.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {athlete.photoUrl ? (
                      <img 
                        src={athlete.photoUrl} 
                        alt={fullName}
                        className="h-14 w-14 rounded-2xl object-cover"
                        data-testid={`img-athlete-${athlete.id}`}
                      />
                    ) : (
                      <div 
                        className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors"
                        data-testid={`avatar-athlete-${athlete.id}`}
                      >
                        {athlete.firstName[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{fullName}</h3>
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

                <Link href={`/athletes/${athlete.id}`}>
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 group-hover:border-primary group-hover:text-primary transition-colors"
                    data-testid={`button-view-profile-${athlete.id}`}
                  >
                    View Profile
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
