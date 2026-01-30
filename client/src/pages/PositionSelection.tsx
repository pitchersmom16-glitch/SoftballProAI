import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Target, Users, Zap } from "lucide-react";

const POSITIONS = [
  { id: "P", name: "Pitcher", category: "pitching", description: "Ace, Closer, Relief Pitcher" },
  { id: "C", name: "Catcher", category: "catching", description: "Backstop, Battery Mate" },
  { id: "1B", name: "First Base", category: "infield", description: "Corner Infielder" },
  { id: "2B", name: "Second Base", category: "infield", description: "Middle Infielder, Double Play" },
  { id: "3B", name: "Third Base", category: "infield", description: "Hot Corner, Power Position" },
  { id: "SS", name: "Shortstop", category: "infield", description: "Wizard of the Diamond" },
  { id: "LF", name: "Left Field", category: "outfield", description: "Pull Power, Left Side" },
  { id: "CF", name: "Center Field", category: "outfield", description: "Center of Attention, Speed" },
  { id: "RF", name: "Right Field", category: "outfield", description: "Right Side, Arm Strength" },
  { id: "DH", name: "Designated Hitter", category: "hitting", description: "Pure Hitter, No Fielding" },
];

const POSITION_CATEGORIES = {
  pitching: { icon: Zap, color: "text-electricPink", bgColor: "bg-electricPink/10" },
  catching: { icon: Target, color: "text-cyberBlue", bgColor: "bg-cyberBlue/10" },
  infield: { icon: Users, color: "text-limePop", bgColor: "bg-limePop/10" },
  outfield: { icon: CheckCircle, color: "text-ultraviolet", bgColor: "bg-ultraviolet/10" },
  hitting: { icon: Target, color: "text-solarOrange", bgColor: "bg-solarOrange/10" },
};

export default function PositionSelection() {
  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(null);
  const [selectedSecondary, setSelectedSecondary] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: athlete } = useQuery({
    queryKey: ["/api/player/athlete"],
  });

  const handleSubmit = async () => {
    if (!selectedPrimary) {
      toast({
        title: "Primary position required",
        description: "Please select your primary position.",
        variant: "destructive",
      });
      return;
    }

    if (!athlete) {
      toast({
        title: "Profile not found",
        description: "Please complete your profile setup first.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update athlete profile with positions
      await apiRequest("PUT", `/api/athletes/${athlete.id}`, {
        primaryPosition: selectedPrimary,
        secondaryPosition: selectedSecondary,
      });

      toast({
        title: "Positions saved!",
        description: "Now let's get you set up with your training videos.",
      });

      // Redirect to video onboarding
      setLocation("/player/onboarding");
    } catch (error: any) {
      toast({
        title: "Error saving positions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryInfo = (category: string) => {
    return POSITION_CATEGORIES[category as keyof typeof POSITION_CATEGORIES] || POSITION_CATEGORIES.infield;
  };

  return (
    <div className="min-h-screen bg-gradient-circuit flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-blacklightBase border-electricPink/30">
        <CardHeader className="text-center">
          <CardTitle className="text-heading-l bg-gradient-brand bg-clip-text text-transparent">
            Choose Your Positions
          </CardTitle>
          <CardDescription className="text-cyberBlue">
            Select your primary position and optionally a secondary position for comprehensive training
          </CardDescription>

          {/* Progress indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-electricPink flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-whiteGlow" />
              </div>
              <span className="text-cyberBlue font-semibold">Profile Complete</span>
              <div className="w-8 h-0.5 bg-electricPink" />
              <div className="w-10 h-10 rounded-full bg-cyberBlue flex items-center justify-center">
                <Target className="w-5 h-5 text-whiteGlow" />
              </div>
              <span className="text-cyberBlue font-semibold">Positions</span>
              <div className="w-8 h-0.5 bg-charcoal2" />
              <div className="w-10 h-10 rounded-full bg-charcoal2 flex items-center justify-center">
                <Zap className="w-5 h-5 text-whiteGlow/50" />
              </div>
              <span className="text-whiteGlow/70">Training Videos</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Primary Position Selection */}
          <div className="space-y-4">
            <h3 className="text-subheading text-limePop flex items-center gap-2">
              <Target className="w-5 h-5" />
              Primary Position *
            </h3>
            <p className="text-body text-cyberBlue">
              Choose the position you play most often or aspire to play.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {POSITIONS.map((position) => {
                const categoryInfo = getCategoryInfo(position.category);
                const Icon = categoryInfo.icon;
                const isSelected = selectedPrimary === position.id;

                return (
                  <button
                    key={position.id}
                    onClick={() => setSelectedPrimary(position.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? "border-electricPink bg-electricPink/10 shadow-lg shadow-electricPink/20"
                        : "border-charcoal2 hover:border-cyberBlue/50 bg-charcoal2/50 hover:bg-charcoal2"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${categoryInfo.color}`} />
                      <span className="font-semibold text-whiteGlow">{position.id}</span>
                    </div>
                    <div className="text-sm text-cyberBlue font-medium">{position.name}</div>
                    <div className="text-xs text-whiteGlow/70 mt-1">{position.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Position Selection */}
          <div className="space-y-4">
            <h3 className="text-subheading text-ultraviolet flex items-center gap-2">
              <Users className="w-5 h-5" />
              Secondary Position (Optional)
            </h3>
            <p className="text-body text-cyberBlue">
              Select a backup position or one you're working on developing.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {POSITIONS.filter(pos => pos.id !== selectedPrimary).map((position) => {
                const categoryInfo = getCategoryInfo(position.category);
                const Icon = categoryInfo.icon;
                const isSelected = selectedSecondary === position.id;

                return (
                  <button
                    key={position.id}
                    onClick={() => setSelectedSecondary(position.id === selectedSecondary ? null : position.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? "border-ultraviolet bg-ultraviolet/10 shadow-lg shadow-ultraviolet/20"
                        : "border-charcoal2 hover:border-cyberBlue/50 bg-charcoal2/50 hover:bg-charcoal2"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${categoryInfo.color}`} />
                      <span className="font-semibold text-whiteGlow">{position.id}</span>
                    </div>
                    <div className="text-sm text-cyberBlue font-medium">{position.name}</div>
                    <div className="text-xs text-whiteGlow/70 mt-1">{position.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selection Summary */}
          {(selectedPrimary || selectedSecondary) && (
            <div className="bg-charcoal2/50 rounded-lg p-4 border border-electricPink/20">
              <h4 className="text-subheading text-limePop mb-3">Your Selection</h4>
              <div className="flex flex-wrap gap-2">
                {selectedPrimary && (
                  <Badge variant="secondary" className="bg-electricPink/20 text-electricPink border-electricPink/30">
                    Primary: {POSITIONS.find(p => p.id === selectedPrimary)?.name}
                  </Badge>
                )}
                {selectedSecondary && (
                  <Badge variant="secondary" className="bg-ultraviolet/20 text-ultraviolet border-ultraviolet/30">
                    Secondary: {POSITIONS.find(p => p.id === selectedSecondary)?.name}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setLocation("/profile/setup")}
              className="border-electricPink/30 text-electricPink hover:bg-electricPink/10"
            >
              ← Back to Profile
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={!selectedPrimary || isSubmitting}
              className="bg-gradient-brand hover:opacity-90 text-whiteGlow font-semibold px-8"
            >
              {isSubmitting ? "Saving..." : "Continue to Training Setup"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}