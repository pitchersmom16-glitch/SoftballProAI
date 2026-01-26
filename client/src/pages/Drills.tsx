import { useDrills, useCreateDrill } from "@/hooks/use-drills";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Filter, Play } from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

export default function Drills() {
  const [skillFilter, setSkillFilter] = useState<string>("all");
  const [diffFilter, setDiffFilter] = useState<string>("all");
  
  const { data: drills, isLoading } = useDrills(
    skillFilter === "all" ? undefined : skillFilter,
    diffFilter === "all" ? undefined : diffFilter
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Drill Library</h1>
          <p className="text-slate-500 mt-1">Curated exercises to improve mechanics.</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="w-40 h-10 bg-white">
              <SelectValue placeholder="Skill Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              <SelectItem value="hitting">Hitting</SelectItem>
              <SelectItem value="pitching">Pitching</SelectItem>
              <SelectItem value="fielding">Fielding</SelectItem>
            </SelectContent>
          </Select>

          <Select value={diffFilter} onValueChange={setDiffFilter}>
            <SelectTrigger className="w-40 h-10 bg-white">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />)
        ) : (
          drills?.map(drill => (
            <Card key={drill.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-100 group cursor-pointer h-full flex flex-col">
              <div className="relative h-48 bg-slate-200">
                {drill.videoUrl ? (
                  <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                     <Play className="h-12 w-12 text-white/80 group-hover:text-white transition-colors" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
                    <Dumbbell className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge className="bg-white/90 text-slate-900 hover:bg-white">{drill.category}</Badge>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold font-display text-slate-900 mb-1">{drill.name}</h3>
                  <p className="text-sm text-slate-500 capitalize">{drill.skillType} • {drill.difficulty}</p>
                </div>
                
                <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">
                  {drill.description}
                </p>

                <Button variant="outline" className="w-full mt-auto group-hover:bg-slate-900 group-hover:text-white transition-all">
                  View Drill Details
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
