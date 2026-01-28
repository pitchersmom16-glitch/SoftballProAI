import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2, Users, Sparkles, Shield } from "lucide-react";

interface ValidationData {
  type: "invite" | "referral" | "team_referral";
  coachId: number;
  coachName?: string;
  skillType?: string;
  studentName?: string;
  inviteToken?: string;
  referralCode?: string;
  teamId?: number;
  teamName?: string;
}

export default function Register() {
  const [, setLocation] = useLocation();
  const [registrationStep, setRegistrationStep] = useState<"validating" | "ready" | "completing" | "done" | "error">("validating");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [primaryPosition, setPrimaryPosition] = useState("");

  const params = new URLSearchParams(window.location.search);
  const inviteToken = params.get("invite");
  const referralCode = params.get("ref");

  const validationQueryString = inviteToken 
    ? `invite=${inviteToken}` 
    : referralCode 
      ? `ref=${referralCode}` 
      : "";
      
  const { data: validation, error: validationError, isLoading } = useQuery<ValidationData>({
    queryKey: [`/api/register/validate?${validationQueryString}`],
    enabled: !!(inviteToken || referralCode),
  });

  const { data: user } = useQuery<any>({
    queryKey: ["/api/auth/user"],
  });

  const isTeamReferral = validation?.type === "team_referral";

  const completeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/register/complete", {
        inviteToken: validation?.inviteToken,
        referralCode: validation?.referralCode,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        primaryPosition: primaryPosition || undefined,
      });
    },
    onSuccess: async () => {
      setRegistrationStep("done");
      // Invalidate user cache so the new role is picked up
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setTimeout(() => {
        // All players now go to onboarding to upload baseline videos
        setLocation("/player/onboarding");
      }, 2000);
    },
    onError: () => {
      setRegistrationStep("error");
    },
  });

  useEffect(() => {
    if (!isLoading && validation) {
      setRegistrationStep("ready");
    }
    if (validationError) {
      setRegistrationStep("error");
    }
  }, [isLoading, validation, validationError]);

  useEffect(() => {
    // For non-team referrals (Private Instructor Mode), auto-complete when logged in
    // For team referrals, wait for user to fill out the form and click submit
    if (user && validation && registrationStep === "ready" && !isTeamReferral) {
      setRegistrationStep("completing");
      completeMutation.mutate();
    }
  }, [user, validation, registrationStep, isTeamReferral]);

  if (!inviteToken && !referralCode) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-[#0a0a0a] border-gray-800 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Link</h1>
          <p className="text-gray-400 mb-6">This registration link is missing required information.</p>
          <Button onClick={() => setLocation("/")} data-testid="button-go-home">
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  if (registrationStep === "validating" || isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center" data-testid="loading-validation">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Validating your invite...</p>
        </div>
      </div>
    );
  }

  if (registrationStep === "error") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-[#0a0a0a] border-red-500/30 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid or Expired Invite</h1>
          <p className="text-gray-400 mb-6">
            {validationError instanceof Error ? validationError.message : "This invite link is no longer valid."}
          </p>
          <Button onClick={() => setLocation("/")} variant="outline" data-testid="button-go-home">
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  if (registrationStep === "done") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-[#0a0a0a] border-green-500/30 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">
            {isTeamReferral ? `Welcome to ${validation?.teamName}!` : "Welcome to the Team!"}
          </h1>
          <p className="text-gray-400 mb-4">
            {isTeamReferral 
              ? "You're now on the roster! Next step: upload your baseline videos."
              : `You're now connected with Coach ${validation?.coachName}.`
            }
          </p>
          <p className="text-purple-400">
            Redirecting to your onboarding checklist...
          </p>
        </Card>
      </div>
    );
  }

  if (registrationStep === "completing") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center" data-testid="completing-registration">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 bg-[#0a0a0a] border-purple-500/30">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
            {isTeamReferral ? <Shield className="w-10 h-10 text-white" /> : <Sparkles className="w-10 h-10 text-white" />}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" data-testid="text-welcome-title">
            {isTeamReferral ? "Join Your Team" : "Welcome to AI Coach"}
          </h1>
          <p className="text-gray-400">
            {isTeamReferral 
              ? `You're invited to join ${validation?.teamName}`
              : validation?.studentName 
                ? `${validation.studentName}, you're invited to train with`
                : "You're invited to train with"
            }
          </p>
        </div>

        <div className="bg-purple-900/20 rounded-lg p-6 mb-6 border border-purple-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
              {isTeamReferral ? <Shield className="w-6 h-6 text-white" /> : <Users className="w-6 h-6 text-white" />}
            </div>
            <div>
              <p className="text-white font-semibold text-lg" data-testid="text-coach-name">
                {isTeamReferral ? validation?.teamName : `Coach ${validation?.coachName || "Your Coach"}`}
              </p>
              <p className="text-purple-400" data-testid="text-skill-type">
                {isTeamReferral 
                  ? `Head Coach: ${validation?.coachName || "Coach"}`
                  : `${validation?.skillType || "Specialist"} Training`
                }
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-gray-300">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span>{isTeamReferral ? "Join your team roster instantly" : "Personalized training program designed for you"}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span>AI-powered video analysis and feedback</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span>{isTeamReferral ? "Access team drills and training plans" : "Direct communication with your coach"}</span>
          </div>
        </div>

        {/* Team referral registration form */}
        {isTeamReferral && user && (
          <div className="space-y-4 mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <h3 className="text-white font-semibold mb-2">Complete Your Profile</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-gray-400 text-sm">First Name</Label>
                <Input 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Shannon"
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-first-name"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-gray-400 text-sm">Last Name</Label>
                <Input 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Smith"
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-last-name"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-400 text-sm">Primary Position</Label>
              <Select value={primaryPosition} onValueChange={setPrimaryPosition}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-position">
                  <SelectValue placeholder="Select your position..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P">Pitcher (P)</SelectItem>
                  <SelectItem value="C">Catcher (C)</SelectItem>
                  <SelectItem value="1B">First Base (1B)</SelectItem>
                  <SelectItem value="2B">Second Base (2B)</SelectItem>
                  <SelectItem value="SS">Shortstop (SS)</SelectItem>
                  <SelectItem value="3B">Third Base (3B)</SelectItem>
                  <SelectItem value="LF">Left Field (LF)</SelectItem>
                  <SelectItem value="CF">Center Field (CF)</SelectItem>
                  <SelectItem value="RF">Right Field (RF)</SelectItem>
                  <SelectItem value="DP">Designated Player (DP)</SelectItem>
                  <SelectItem value="FLEX">Flex</SelectItem>
                  <SelectItem value="UTIL">Utility</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {!user ? (
          <Button
            onClick={() => {
              // Store the referral code in localStorage before login so we can recover after redirect
              if (referralCode) {
                localStorage.setItem("pendingTeamReferral", referralCode);
              } else if (inviteToken) {
                localStorage.setItem("pendingInviteToken", inviteToken);
              }
              // Pass the current URL as returnTo so user comes back here after login
              const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
              window.location.href = `/api/login?returnTo=${returnTo}`;
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-lg py-6"
            data-testid="button-login-register"
          >
            Sign In to Get Started
          </Button>
        ) : (
          <Button
            onClick={() => {
              setRegistrationStep("completing");
              completeMutation.mutate();
            }}
            disabled={completeMutation.isPending || (isTeamReferral && (!firstName || !lastName))}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-lg py-6"
            data-testid="button-complete-registration"
          >
            {completeMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Setting Up...
              </>
            ) : (
              isTeamReferral ? "Join Team" : "Complete Registration"
            )}
          </Button>
        )}

        <p className="text-center text-gray-500 text-sm mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </Card>
    </div>
  );
}
