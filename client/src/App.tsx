import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Athletes from "@/pages/Athletes";
import AthleteDetail from "@/pages/AthleteDetail";
import Teams from "@/pages/Teams";
import Assessments from "@/pages/Assessments";
import AssessmentDetail from "@/pages/AssessmentDetail";
import Drills from "@/pages/Drills";
import TrainBrain from "@/pages/TrainBrain";
import AdminUpload from "@/pages/AdminUpload";
import RoleSelection from "@/pages/RoleSelection";
import PlayerDashboard from "@/pages/PlayerDashboard";
import TeamCoachDashboard from "@/pages/TeamCoachDashboard";
import PitchingCoachDashboard from "@/pages/PitchingCoachDashboard";
import SpecialistRoster from "@/pages/SpecialistRoster";
import Register from "@/pages/Register";
import PlayerOnboarding from "@/pages/PlayerOnboarding";
import PlayerProfileEdit from "@/pages/PlayerProfileEdit";
import BiometricOnboarding from "@/pages/BiometricOnboarding";
import StatsImport from "@/pages/StatsImport";
import PublicProfile from "@/pages/PublicProfile";
import Pricing from "@/pages/Pricing";
import PlayerGoals from "@/pages/PlayerGoals";
import ProfileSetup from "@/pages/ProfileSetup";
import PositionSelection from "@/pages/PositionSelection";
import { OnboardingGate } from "@/components/OnboardingGate";

import { useAuth } from "@/hooks/use-auth";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  // ============================================
  // PUBLIC ROUTES (Not Logged In)
  // ============================================
  if (!user) {
    return (
      <Layout>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/register" component={Register} />
          <Route path="/profile/:id" component={PublicProfile} />
          <Route path="/auth">
            {() => {
              window.location.href = "/api/login";
              return null;
            }}
          </Route>
          {/* Redirect old routes to home */}
          <Route path="/onboarding">
            <Redirect to="/" />
          </Route>
          {/* Safety Net: Redirect all unknown routes to home */}
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Layout>
    );
  }

  // ============================================
  // ROLE SELECTION (Logged in but no role)
  // ============================================
  if (!user.role) {
    // User is logged in but hasn't selected a role yet
    // Show RoleSelection for all routes - they must select a role first
    return (
      <Switch>
        <Route path="/" component={RoleSelection} />
        <Route path="*" component={RoleSelection} />
      </Switch>
    );
  }

  // Helper: Check if user is any type of coach
  const isCoach = user.role === "team_coach" || user.role === "pitching_coach" || user.role?.includes("coach");

  // ============================================
  // PARENT MODE ROUTES
  // ============================================
  if (user.role === "parent") {
    return (
      <Layout>
        <Switch>
          {/* Parent onboarding routes */}
          <Route path="/profile/setup" component={ProfileSetup} />
          <Route path="/position/select" component={PositionSelection} />
          <Route path="/register" component={Register} />
          
          {/* Parent dashboard - athlete management */}
          <Route path="/" component={Athletes} />
          <Route path="/dashboard" component={Athletes} />
          <Route path="/athletes" component={Athletes} />
          <Route path="/athletes/:id" component={AthleteDetail} />
          <Route path="/assessments" component={Assessments} />
          <Route path="/assessments/:id" component={AssessmentDetail} />
          <Route path="/drills" component={Drills} />
          <Route path="/profile/:id" component={PublicProfile} />
          
          {/* Safety Net: Redirect all unknown routes to athlete management */}
          <Route path="*">
            <Redirect to="/athletes" />
          </Route>
        </Switch>
      </Layout>
    );
  }

  // ============================================
  // PLAYER MODE ROUTES
  // ============================================
  if (user.role === "player") {
    return (
      <Layout>
        <Switch>
          {/* Landing page is always accessible */}
          <Route path="/" component={Landing} />
          
          {/* Onboarding routes are NOT gated - they're the gate destinations */}
          <Route path="/profile/setup" component={ProfileSetup} />
          <Route path="/position/select" component={PositionSelection} />
          <Route path="/player/onboarding" component={PlayerOnboarding} />
          <Route path="/register" component={Register} />
          
          {/* All other player routes require onboarding to be complete */}
          <Route path="/dashboard">
            <OnboardingGate><PlayerDashboard /></OnboardingGate>
          </Route>
          <Route path="/assessments">
            <OnboardingGate><Assessments /></OnboardingGate>
          </Route>
          <Route path="/assessments/:id">
            {(params) => <OnboardingGate><AssessmentDetail /></OnboardingGate>}
          </Route>
          <Route path="/drills">
            <OnboardingGate><Drills /></OnboardingGate>
          </Route>
          <Route path="/profile">
            <OnboardingGate><PlayerProfileEdit /></OnboardingGate>
          </Route>
          <Route path="/profile/:id" component={PublicProfile} />
          <Route path="/stats-import">
            <OnboardingGate><StatsImport /></OnboardingGate>
          </Route>
          <Route path="/goals">
            <OnboardingGate><PlayerGoals /></OnboardingGate>
          </Route>
          {/* Safety Net: Redirect all unknown routes to dashboard */}
          <Route path="*">
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
      </Layout>
    );
  }

  // ============================================
  // TEAM COACH MODE ROUTES
  // ============================================
  if (user.role === "team_coach") {
    return (
      <Layout>
        <Switch>
          <Route path="/" component={TeamCoachDashboard} />
          <Route path="/dashboard" component={TeamCoachDashboard} />
          <Route path="/athletes" component={Athletes} />
          <Route path="/athletes/:id" component={AthleteDetail} />
          <Route path="/teams" component={Teams} />
          <Route path="/assessments" component={Assessments} />
          <Route path="/assessments/:id" component={AssessmentDetail} />
          <Route path="/drills" component={Drills} />
          <Route path="/admin/train-brain" component={TrainBrain} />
          <Route path="/admin/upload" component={AdminUpload} />
          {/* Safety Net: Redirect all unknown routes to dashboard */}
          <Route path="*">
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
      </Layout>
    );
  }

  // ============================================
  // PITCHING/SPECIALIST COACH MODE ROUTES
  // ============================================
  if (user.role === "pitching_coach") {
    return (
      <Layout>
        <Switch>
          <Route path="/" component={PitchingCoachDashboard} />
          <Route path="/dashboard" component={PitchingCoachDashboard} />
          <Route path="/roster" component={SpecialistRoster} />
          <Route path="/athletes" component={Athletes} />
          <Route path="/athletes/:id" component={AthleteDetail} />
          <Route path="/assessments" component={Assessments} />
          <Route path="/assessments/:id" component={AssessmentDetail} />
          <Route path="/drills" component={Drills} />
          <Route path="/admin/train-brain" component={TrainBrain} />
          <Route path="/admin/upload" component={AdminUpload} />
          {/* Safety Net: Redirect all unknown routes to dashboard */}
          <Route path="*">
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
      </Layout>
    );
  }

  // ============================================
  // COACH VIEW ROUTES (Any coach role gets admin access)
  // ============================================
  if (isCoach) {
    return (
      <Layout>
        <Switch>
          <Route path="/" component={TeamCoachDashboard} />
          <Route path="/dashboard" component={TeamCoachDashboard} />
          <Route path="/athletes" component={Athletes} />
          <Route path="/teams" component={Teams} />
          <Route path="/roster" component={SpecialistRoster} />
          <Route path="/assessments" component={Assessments} />
          <Route path="/assessments/:id" component={AssessmentDetail} />
          <Route path="/drills" component={Drills} />
          <Route path="/admin/train-brain" component={TrainBrain} />
          <Route path="/admin/upload" component={AdminUpload} />
          {/* Safety Net: Redirect all unknown routes to dashboard */}
          <Route path="*">
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
      </Layout>
    );
  }

  // ============================================
  // DEFAULT VIEW ROUTES (Fallback)
  // ============================================
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/athletes" component={Athletes} />
        <Route path="/athletes/:id" component={AthleteDetail} />
        <Route path="/teams" component={Teams} />
        <Route path="/assessments" component={Assessments} />
        <Route path="/assessments/:id" component={AssessmentDetail} />
        <Route path="/drills" component={Drills} />
        <Route path="/admin/train-brain" component={TrainBrain} />
        <Route path="/admin/upload" component={AdminUpload} />
        {/* Safety Net: Redirect all unknown routes to dashboard */}
        <Route path="*">
          <Redirect to="/dashboard" />
        </Route>
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
