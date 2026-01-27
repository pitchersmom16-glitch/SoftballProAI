import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface OnboardingStatus {
  dashboardUnlocked: boolean;
  baselineComplete: boolean;
}

interface OnboardingGateProps {
  children: React.ReactNode;
}

export function OnboardingGate({ children }: OnboardingGateProps) {
  const [, setLocation] = useLocation();
  
  const { data: onboarding, isLoading, isError } = useQuery<OnboardingStatus>({
    queryKey: ["/api/player/onboarding"],
  });

  useEffect(() => {
    if (!isLoading && onboarding && !onboarding.dashboardUnlocked) {
      setLocation("/player/onboarding");
    }
  }, [onboarding, isLoading, setLocation]);

  if (isLoading) {
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

  if (onboarding && !onboarding.dashboardUnlocked) {
    return null;
  }

  return <>{children}</>;
}
