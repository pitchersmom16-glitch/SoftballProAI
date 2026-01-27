import { useDrills } from "@/hooks/use-drills";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Play, Target, Users, Zap, Brain, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "all", label: "All", icon: Dumbbell },
  { value: "PITCHING", label: "Pitching", icon: Target },
  { value: "CATCHING", label: "Catching", icon: Users },
  { value: "INFIELD", label: "Infield", icon: Zap },
  { value: "OUTFIELD", label: "Outfield", icon: Wind },
  { value: "CONDITIONING", label: "Conditioning", icon: Dumbbell },
  { value: "MENTAL", label: "Mental", icon: Brain },
];

const DIFFICULTIES = [
  { value: "all", label: "All Levels" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

export default function Drills() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [diffFilter, setDiffFilter] = useState<string>("all");
  
  const { data: drills, isLoading } = useDrills(
    categoryFilter === "all" ? undefined : categoryFilter,
    diffFilter === "all" ? undefined : diffFilter
  );

  const filteredDrills = drills?.filter(drill => {
    if (diffFilter !== "all" && drill.difficulty !== diffFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white" data-testid="text-drills-title">Drill Library</h1>
          <p className="text-gray-400 mt-1">Academy drills across all skill categories</p>
        </div>
        
        <div className="flex flex-wrap gap-2" data-testid="filter-category-buttons">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = categoryFilter === cat.value;
            return (
              <Button
                key={cat.value}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(cat.value)}
                className={cn(
                  "gap-2 transition-all",
                  isActive 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white" 
                    : "border-gray-700 text-gray-300 hover:border-purple-500 hover:text-white"
                )}
                data-testid={`button-filter-${cat.value.toLowerCase()}`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </Button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2" data-testid="filter-difficulty-buttons">
          {DIFFICULTIES.map(diff => {
            const isActive = diffFilter === diff.value;
            return (
              <Button
                key={diff.value}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => setDiffFilter(diff.value)}
                className={cn(
                  "transition-all",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-gray-400 hover:text-white"
                )}
                data-testid={`button-difficulty-${diff.value.toLowerCase()}`}
              >
                {diff.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Showing {filteredDrills?.length || 0} drills
        {categoryFilter !== "all" && ` in ${categoryFilter}`}
        {diffFilter !== "all" && ` (${diffFilter})`}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="drills-grid">
        {isLoading ? (
          [1,2,3,4,5,6].map(i => (
            <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse border border-white/10" />
          ))
        ) : (
          filteredDrills?.map(drill => (
            <Card 
              key={drill.id} 
              className="overflow-hidden bg-white/5 border-white/10 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer h-full flex flex-col"
              data-testid={`card-drill-${drill.id}`}
            >
              <div className="relative h-40 bg-gradient-to-br from-purple-900/50 to-pink-900/50">
                {drill.videoUrl ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Dumbbell className="h-10 w-10 text-white/30" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-black/50 backdrop-blur text-white border-0" data-testid={`badge-category-${drill.id}`}>
                    {drill.category}
                  </Badge>
                </div>
                {drill.difficulty && (
                  <div className="absolute top-3 left-3">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "border-0 backdrop-blur",
                        drill.difficulty === "Beginner" && "bg-green-500/20 text-green-300",
                        drill.difficulty === "Intermediate" && "bg-yellow-500/20 text-yellow-300",
                        drill.difficulty === "Advanced" && "bg-red-500/20 text-red-300"
                      )}
                    >
                      {drill.difficulty}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-white mb-1" data-testid={`text-drill-name-${drill.id}`}>{drill.name}</h3>
                  {drill.expertSource && (
                    <p className="text-xs text-purple-400">{drill.expertSource}</p>
                  )}
                </div>
                
                <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                  {drill.description}
                </p>

                {drill.mechanicTags && drill.mechanicTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {drill.mechanicTags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-gray-700 text-gray-400">
                        {tag}
                      </Badge>
                    ))}
                    {drill.mechanicTags.length > 3 && (
                      <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                        +{drill.mechanicTags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full mt-auto border-gray-700 text-gray-300 hover:border-purple-500 hover:text-white hover:bg-purple-500/10 transition-all"
                  data-testid={`button-view-drill-${drill.id}`}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {filteredDrills?.length === 0 && !isLoading && (
        <div className="text-center py-16 text-gray-500">
          <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No drills found for this category.</p>
        </div>
      )}
    </div>
  );
}
