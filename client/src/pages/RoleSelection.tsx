import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, User, Users, Target, Shield, Sparkles } from "lucide-react";

type UserRole = "player" | "parent" | "team_coach" | "pitching_coach";

const roles = [
  {
    id: "player" as UserRole,
    title: "Player",
    subtitle: "Individual Athlete (Ages 8-16)",
    description: "Your Virtual Pro Coach - personal growth, daily check-ins, and instant AI feedback.",
    icon: User,
    color: "neon-green",
    price: "$14.99/mo",
    features: [
      "Daily Vibe check-in with soreness tracking",
      "Championship Mindset daily motivation (Mamba Feed)",
      "'Coach Me' button - instant video analysis",
      "Personalized goal tracking and drill library",
      "Smart injury prevention (blocks drills if sore)"
    ],
    accentClass: "from-neon-green/20 to-neon-green/5 border-neon-green/30 hover:border-neon-green/60"
  },
  {
    id: "pitching_coach" as UserRole,
    title: "Private Instructor",
    subtitle: "Pitching | Catching | Hitting Coach",
    description: "Remote specialist training for your private students. Manage your 'stable' of athletes.",
    icon: Target,
    color: "neon-pink",
    price: "$49.99/mo",
    features: [
      "Manage up to 25 students in your roster",
      "Assign homework drills with specific rep counts",
      "Split-screen analysis vs Pro Model videos",
      "Detailed video feedback and markup tools",
      "Track individual student progress over time"
    ],
    accentClass: "from-neon-pink/20 to-neon-pink/5 border-neon-pink/30 hover:border-neon-pink/60"
  },
  {
    id: "team_coach" as UserRole,
    title: "Team Coach",
    subtitle: "Full Roster Management",
    description: "Manage your 12-15 player team roster, auto-generate practice plans, track health.",
    icon: Users,
    color: "neon-yellow",
    price: "$99/mo",
    features: [
      "Full team roster (12-15 players)",
      "Practice Architect - auto-generate 2-hour plans",
      "Roster Health dashboard (Red/Injured or Green/Ready)",
      "Station-based practice splits (Infield/Outfield/Catcher)",
      "Team-wide analytics and progress tracking"
    ],
    accentClass: "from-neon-yellow/20 to-neon-yellow/5 border-neon-yellow/30 hover:border-neon-yellow/60"
  }
];

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Check for pending referral codes in localStorage - redirect back to register if found
  useEffect(() => {
    const pendingReferral = localStorage.getItem("pendingTeamReferral");
    const pendingInvite = localStorage.getItem("pendingInviteToken");
    
    if (pendingReferral) {
      // Clear and redirect to register with the referral code
      localStorage.removeItem("pendingTeamReferral");
      setLocation(`/register?ref=${pendingReferral}`);
      return;
    }
    
    if (pendingInvite) {
      // Clear and redirect to register with the invite token
      localStorage.removeItem("pendingInviteToken");
      setLocation(`/register?invite=${pendingInvite}`);
      return;
    }
  }, [setLocation]);

  const setRoleMutation = useMutation({
    mutationFn: async (role: UserRole) => {
      return apiRequest("PUT", "/api/user/role", { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const handleContinue = () => {
    if (selectedRole) {
      setRoleMutation.mutate(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-neon-green" />
            <h1 className="text-4xl font-bold font-display text-white">
              Welcome to <span className="text-neon-green">SoftballProAI</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your Virtual Pro Coach for fastpitch softball. Choose how you'll use the app:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card
                key={role.id}
                data-testid={`role-card-${role.id}`}
                onClick={() => setSelectedRole(role.id)}
                className={`
                  relative cursor-pointer p-6 bg-gradient-to-b ${role.accentClass}
                  border-2 transition-all duration-300
                  ${isSelected ? `ring-2 ring-${role.color} scale-105 shadow-lg shadow-${role.color}/20` : ""}
                `}
              >
                {isSelected && (
                  <div className={`absolute -top-2 -right-2 bg-${role.color} rounded-full p-1`}>
                    <Shield className="h-4 w-4 text-black" />
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className={`h-14 w-14 rounded-2xl bg-${role.color}/20 flex items-center justify-center`}>
                    <Icon className={`h-7 w-7 text-${role.color}`} />
                  </div>
                  
                  <div>
                    <p className={`text-sm font-medium text-${role.color} uppercase tracking-wider`}>
                      {role.subtitle}
                    </p>
                    <h3 className="text-xl font-bold text-white mt-1">{role.title}</h3>
                    <p className="text-lg font-bold text-neon-green mt-1">{role.price}</p>
                    <p className="text-gray-400 text-sm mt-2">{role.description}</p>
                  </div>

                  <ul className="space-y-2 pt-2">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <Heart className={`h-4 w-4 text-${role.color} mt-0.5 shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center pt-4">
          <Button
            data-testid="button-continue"
            onClick={handleContinue}
            disabled={!selectedRole || setRoleMutation.isPending}
            size="lg"
            className="bg-neon-green hover:bg-neon-green/90 text-black font-bold text-lg px-12 py-6"
          >
            {setRoleMutation.isPending ? "Setting up your experience..." : "Continue to My Dashboard"}
          </Button>
        </div>

        <p className="text-center text-gray-500 text-sm">
          You can change your role anytime from settings
        </p>
      </div>
    </div>
  );
}
