import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface OnboardingStatus {
  dashboardUnlocked: boolean;
  baselineComplete: boolean;
}

interface AthleteProfile {
  id: number;
  firstName: string;
  lastName: string;
  primaryPosition?: string;
  // Add other profile fields as needed
}

interface OnboardingGateProps {
  children: React.ReactNode;
}

export function OnboardingGate({ children }: OnboardingGateProps) {
  const [, setLocation] = useLocation();
  
  const { data: athlete, isLoading: athleteLoading } = useQuery<AthleteProfile>({
    queryKey: ["/api/player/athlete"],
  });

  const { data: onboarding, isLoading: onboardingLoading, isError } = useQuery<OnboardingStatus>({
    queryKey: ["/api/player/onboarding"],
  });

  useEffect(() => {
    if (athleteLoading || onboardingLoading) return;

    // Step 1: No athlete profile - redirect to profile setup
    if (!athlete) {
      setLocation("/profile/setup");
      return;
    }

    // Step 2: Athlete exists but no position - redirect to position selection
    if (!athlete.primaryPosition) {
      setLocation("/position/select");
      return;
    }

    // Step 3: Position selected but onboarding not complete - redirect to video upload
    if (!onboarding?.dashboardUnlocked) {
      setLocation("/player/onboarding");
      return;
    }

    // All checks passed - show the gated content
  }, [athlete, athleteLoading, onboarding, onboardingLoading, setLocation]);

  if (athleteLoading || onboardingLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center" data-testid="loading-onboarding-gate">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center" data-testid="error-onboarding-gate">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // If we get here, all checks passed
  return <>{children}</>;
}
