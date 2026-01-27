import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";

// Pages
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

import { useAuth } from "@/hooks/use-auth";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  // Not logged in - show landing page
  if (!user) {
    return (
      <Layout>
        <Switch>
          <Route path="/" component={Landing} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    );
  }

  // Logged in but no role selected - show role selection
  if (!user.role) {
    return <RoleSelection />;
  }

  // Player mode - show player-specific dashboard
  if (user.role === "player") {
    return (
      <Layout>
        <Switch>
          <Route path="/" component={PlayerDashboard} />
          <Route path="/assessments" component={Assessments} />
          <Route path="/assessments/:id" component={AssessmentDetail} />
          <Route path="/drills" component={Drills} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    );
  }

  // Team Coach mode - show team-focused dashboard
  if (user.role === "team_coach") {
    return (
      <Layout>
        <Switch>
          <Route path="/" component={TeamCoachDashboard} />
          <Route path="/athletes" component={Athletes} />
          <Route path="/teams" component={Teams} />
          <Route path="/assessments" component={Assessments} />
          <Route path="/assessments/:id" component={AssessmentDetail} />
          <Route path="/drills" component={Drills} />
          <Route path="/admin/train-brain" component={TrainBrain} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    );
  }

  // Pitching Coach mode - show pitching-focused dashboard
  if (user.role === "pitching_coach") {
    return (
      <Layout>
        <Switch>
          <Route path="/" component={PitchingCoachDashboard} />
          <Route path="/athletes" component={Athletes} />
          <Route path="/assessments" component={Assessments} />
          <Route path="/assessments/:id" component={AssessmentDetail} />
          <Route path="/drills" component={Drills} />
          <Route path="/admin/train-brain" component={TrainBrain} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    );
  }

  // Default coach view
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/athletes" component={Athletes} />
        <Route path="/teams" component={Teams} />
        <Route path="/assessments" component={Assessments} />
        <Route path="/assessments/:id" component={AssessmentDetail} />
        <Route path="/drills" component={Drills} />
        <Route path="/admin/train-brain" component={TrainBrain} />
        <Route component={NotFound} />
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
