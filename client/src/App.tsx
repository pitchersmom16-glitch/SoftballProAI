import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Athletes from "@/pages/Athletes";
import Teams from "@/pages/Teams";
import Assessments from "@/pages/Assessments";
import AssessmentDetail from "@/pages/AssessmentDetail";
import Drills from "@/pages/Drills";
import TrainBrain from "@/pages/TrainBrain";
import RoleSelection from "@/pages/RoleSelection";
import PlayerDashboard from "@/pages/PlayerDashboard";
import TeamCoachDashboard from "@/pages/TeamCoachDashboard";
import PitchingCoachDashboard from "@/pages/PitchingCoachDashboard";
import SpecialistRoster from "@/pages/SpecialistRoster";
import Register from "@/pages/Register";
import PlayerOnboarding from "@/pages/PlayerOnboarding";
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
          <Route path="/register" component={Register} />
          <Route path="/auth">
            {() => {
              window.location.href = "/api/login";
              return null;
            }}
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
    return <RoleSelection />;
  }

  // ============================================
  // PLAYER MODE ROUTES
  // ============================================
  if (user.role === "player") {
    return (
      <Layout>
        <Switch>
          {/* Onboarding route is NOT gated - it's the gate destination */}
          <Route path="/player/onboarding" component={PlayerOnboarding} />
          <Route path="/register" component={Register} />
          
          {/* All other player routes require dashboard to be unlocked */}
          <Route path="/">
            <OnboardingGate><PlayerDashboard /></OnboardingGate>
          </Route>
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
          <Route path="/teams" component={Teams} />
          <Route path="/assessments" component={Assessments} />
          <Route path="/assessments/:id" component={AssessmentDetail} />
          <Route path="/drills" component={Drills} />
          <Route path="/admin/train-brain" component={TrainBrain} />
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
          <Route path="/assessments" component={Assessments} />
          <Route path="/assessments/:id" component={AssessmentDetail} />
          <Route path="/drills" component={Drills} />
          <Route path="/admin/train-brain" component={TrainBrain} />
          {/* Safety Net: Redirect all unknown routes to dashboard */}
          <Route path="*">
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
      </Layout>
    );
  }

  // ============================================
  // DEFAULT COACH VIEW ROUTES
  // ============================================
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/athletes" component={Athletes} />
        <Route path="/teams" component={Teams} />
        <Route path="/assessments" component={Assessments} />
        <Route path="/assessments/:id" component={AssessmentDetail} />
        <Route path="/drills" component={Drills} />
        <Route path="/admin/train-brain" component={TrainBrain} />
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
