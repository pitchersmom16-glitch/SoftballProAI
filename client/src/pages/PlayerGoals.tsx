/**
 * PLAYER GOALS PAGE
 * 
 * Displays AI-generated SMART goals based on baseline video analysis
 * Shows progress tracking and recommended drills for each goal
 */

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar, CheckCircle2, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

interface SmartGoal {
  id: number;
  metric: string;
  metricLabel: string;
  currentValue: number | null;
  targetValue: number;
  targetDate: string;
  unit: string;
  description: string;
  progress?: number;
  recommendedDrills?: any[];
}

export default function PlayerGoals() {
  const [, setLocation] = useLocation();

  const { data: goals, isLoading } = useQuery<SmartGoal[]>({
    queryKey: ["/api/player/goals"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const displayGoals = goals || [];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Your 2026 Season Goals
            </h1>
          </div>
          <p className="text-gray-400">
            Based on your baseline video analysis, here are your personalized, trackable goals for this season.
          </p>
        </div>

        {/* Goals List */}
        {displayGoals.length === 0 ? (
          <Card className="bg-[#0a0a0a] border-gray-800 p-8 text-center">
            <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
            <p className="text-gray-400 mb-4">
              Complete your baseline videos to get AI-generated SMART goals!
            </p>
            <Button onClick={() => setLocation("/player/onboarding")}>
              Complete Onboarding
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {displayGoals.map((goal, index) => (
              <Card key={index} className="bg-[#0a0a0a] border-purple-500/30 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                      <h3 className="text-xl font-bold text-white">{goal.metricLabel}</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{goal.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Current:</span>{" "}
                        <span className="text-white font-medium">
                          {goal.currentValue !== null ? `${goal.currentValue} ${goal.unit}` : "Baseline TBD"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Target:</span>{" "}
                        <span className="text-purple-400 font-medium">
                          {goal.targetValue > 0 ? "+" : ""}{goal.targetValue} {goal.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(goal.targetDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {goal.progress !== undefined && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-400 mb-1">
                        {goal.progress}%
                      </div>
                      <div className="text-xs text-gray-500">Progress</div>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <Progress value={goal.progress || 0} className="h-2" />
                </div>

                {/* Recommended Drills */}
                {goal.recommendedDrills && goal.recommendedDrills.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-sm text-gray-500 mb-2">Recommended Drills to Reach This Goal:</p>
                    <div className="flex flex-wrap gap-2">
                      {goal.recommendedDrills.slice(0, 3).map((drill: any, i: number) => (
                        <span key={i} className="text-xs bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full">
                          {drill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Button variant="outline" onClick={() => setLocation("/dashboard")}>
            Back to Dashboard
          </Button>
          <Button onClick={() => setLocation("/drills")} className="bg-gradient-to-r from-purple-600 to-pink-600">
            View Recommended Drills
          </Button>
        </div>
      </div>
    </div>
  );
}
