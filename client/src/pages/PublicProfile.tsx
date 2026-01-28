import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Ruler, 
  Target, 
  Activity,
  TrendingUp,
  Zap,
  Award,
  GraduationCap,
  MapPin,
  Calendar,
  Star
} from "lucide-react";

interface AthleteProfile {
  id: number;
  firstName: string;
  lastName: string;
  heightInches: number;
  primaryPosition: string;
  secondaryPosition?: string;
  graduationYear?: number;
  school?: string;
  teamName?: string;
  photoUrl?: string;
}

interface GameChangerStats {
  avg?: string;
  ops?: string;
  era?: string;
  whip?: string;
  kPercent?: string;
  firstPitchStrikePercent?: string;
  exitVelocity?: string;
}

interface SkeletalHighlight {
  title: string;
  grade: string;
}

interface SeasonGoal {
  metric: string;
  metricLabel: string;
  target: number;
  unit: string;
  currentBaseline?: number;
  progress?: number;
}

export default function PublicProfile() {
  const params = useParams<{ id: string }>();
  const athleteId = params.id;

  const { data: profile, isLoading: profileLoading } = useQuery<AthleteProfile>({
    queryKey: ["/api/profile/public", athleteId],
  });

  const { data: stats } = useQuery<GameChangerStats>({
    queryKey: ["/api/stats/public", athleteId],
  });

  const { data: analysis } = useQuery<{ highlights: SkeletalHighlight[] }>({
    queryKey: ["/api/analysis/public", athleteId],
  });

  const { data: goals } = useQuery<SeasonGoal[]>({
    queryKey: ["/api/goals/public", athleteId],
  });

  const formatHeight = (inches: number) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  const demoProfile: AthleteProfile = {
    id: 9,
    firstName: "Shannon",
    lastName: "Demo",
    heightInches: 61,
    primaryPosition: "Pitcher",
    secondaryPosition: "SS",
    graduationYear: 2026,
    school: "West Cobb High School",
    teamName: "West Cobb Crush",
  };

  const demoStats: GameChangerStats = {
    era: "1.25",
    whip: "0.89",
    kPercent: "35%",
    firstPitchStrikePercent: "68%",
    avg: ".385",
    ops: ".975",
    exitVelocity: "67",
  };

  const demoAnalysis: SkeletalHighlight[] = [
    { title: "Elite Arm Circle Speed", grade: "A" },
    { title: "Strong Knee Drive", grade: "A-" },
    { title: "Optimal Release Point", grade: "B+" },
    { title: "Explosive Hip Rotation", grade: "A" },
  ];

  const demoGoals: SeasonGoal[] = [
    { metric: "velocity", metricLabel: "Increase Velocity", target: 5, unit: "mph", currentBaseline: 58, progress: 60 },
    { metric: "spin_rate", metricLabel: "Improve Spin Rate", target: 200, unit: "rpm", currentBaseline: 1800, progress: 45 },
    { metric: "strike_zone", metricLabel: "Strike Zone %", target: 70, unit: "%", currentBaseline: 62, progress: 75 },
  ];

  const displayProfile = profile || demoProfile;
  const displayStats = stats || demoStats;
  const displayAnalysis = analysis?.highlights || demoAnalysis;
  const displayGoals = goals || demoGoals;

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/20">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div 
          className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 border border-purple-500/30 p-8"
          data-testid="section-athlete-bio"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-purple-500/25">
              {displayProfile.firstName[0]}{displayProfile.lastName[0]}
            </div>
            
            <div className="text-center md:text-left space-y-3">
              <h1 
                className="text-4xl font-bold text-foreground"
                data-testid="text-athlete-name"
              >
                {displayProfile.firstName} {displayProfile.lastName}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Badge 
                  variant="outline" 
                  className="border-purple-500/50 text-purple-400 px-3 py-1"
                  data-testid="badge-primary-position"
                >
                  {displayProfile.primaryPosition}
                </Badge>
                {displayProfile.secondaryPosition && (
                  <Badge 
                    variant="outline" 
                    className="border-pink-500/50 text-pink-400 px-3 py-1"
                    data-testid="badge-secondary-position"
                  >
                    {displayProfile.secondaryPosition}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1" data-testid="text-height">
                  <Ruler className="h-4 w-4 text-purple-400" />
                  Height: {formatHeight(displayProfile.heightInches)}
                </span>
                {displayProfile.graduationYear && (
                  <span className="flex items-center gap-1" data-testid="text-grad-year">
                    <GraduationCap className="h-4 w-4 text-pink-400" />
                    Class of {displayProfile.graduationYear}
                  </span>
                )}
                {displayProfile.teamName && (
                  <span className="flex items-center gap-1" data-testid="text-team">
                    <MapPin className="h-4 w-4 text-cyan-400" />
                    {displayProfile.teamName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="border-purple-500/30 bg-card/50 backdrop-blur"
            data-testid="section-ai-analysis"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Activity className="h-5 w-5" />
                AI Skeletal Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Biomechanical highlights from video assessment
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {displayAnalysis.map((highlight, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-purple-500/20"
                  data-testid={`highlight-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="font-medium text-foreground">{highlight.title}</span>
                  </div>
                  <Badge 
                    className={`
                      ${highlight.grade.startsWith("A") ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                      ${highlight.grade.startsWith("B") ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : ""}
                      ${highlight.grade.startsWith("C") ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : ""}
                    `}
                    variant="outline"
                  >
                    {highlight.grade}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card 
            className="border-pink-500/30 bg-card/50 backdrop-blur"
            data-testid="section-gamechanger-stats"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-400">
                <TrendingUp className="h-5 w-5" />
                GameChanger Stats
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                On-field performance metrics
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {displayStats.era && (
                  <div className="p-4 rounded-lg bg-background/50 border border-pink-500/20 text-center" data-testid="stat-era">
                    <p className="text-3xl font-bold text-foreground">{displayStats.era}</p>
                    <p className="text-xs text-muted-foreground mt-1">ERA</p>
                  </div>
                )}
                {displayStats.kPercent && (
                  <div className="p-4 rounded-lg bg-background/50 border border-pink-500/20 text-center" data-testid="stat-k">
                    <p className="text-3xl font-bold text-foreground">{displayStats.kPercent}</p>
                    <p className="text-xs text-muted-foreground mt-1">K%</p>
                  </div>
                )}
                {displayStats.whip && (
                  <div className="p-4 rounded-lg bg-background/50 border border-pink-500/20 text-center" data-testid="stat-whip">
                    <p className="text-3xl font-bold text-foreground">{displayStats.whip}</p>
                    <p className="text-xs text-muted-foreground mt-1">WHIP</p>
                  </div>
                )}
                {displayStats.firstPitchStrikePercent && (
                  <div className="p-4 rounded-lg bg-background/50 border border-pink-500/20 text-center" data-testid="stat-fps">
                    <p className="text-3xl font-bold text-foreground">{displayStats.firstPitchStrikePercent}</p>
                    <p className="text-xs text-muted-foreground mt-1">1st Pitch Strike %</p>
                  </div>
                )}
                {displayStats.avg && (
                  <div className="p-4 rounded-lg bg-background/50 border border-purple-500/20 text-center" data-testid="stat-avg">
                    <p className="text-3xl font-bold text-foreground">{displayStats.avg}</p>
                    <p className="text-xs text-muted-foreground mt-1">AVG</p>
                  </div>
                )}
                {displayStats.ops && (
                  <div className="p-4 rounded-lg bg-background/50 border border-purple-500/20 text-center" data-testid="stat-ops">
                    <p className="text-3xl font-bold text-foreground">{displayStats.ops}</p>
                    <p className="text-xs text-muted-foreground mt-1">OPS</p>
                  </div>
                )}
                {displayStats.exitVelocity && (
                  <div className="col-span-2 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-center" data-testid="stat-exit-velo">
                    <p className="text-3xl font-bold text-foreground">{displayStats.exitVelocity} <span className="text-lg text-muted-foreground">mph</span></p>
                    <p className="text-xs text-muted-foreground mt-1">Exit Velocity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card 
          className="border-cyan-500/30 bg-card/50 backdrop-blur"
          data-testid="section-season-goals"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Target className="h-5 w-5" />
              2026 Season Goals
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              AI-tracked progress toward performance targets
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {displayGoals.map((goal, index) => (
              <div key={index} className="space-y-2" data-testid={`goal-${index}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-cyan-400" />
                    <span className="font-medium text-foreground">{goal.metricLabel}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Target: +{goal.target} {goal.unit}
                    {goal.currentBaseline && (
                      <span className="text-xs"> (from {goal.currentBaseline})</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress 
                    value={goal.progress || 0} 
                    className="h-3 flex-1 bg-background/50"
                  />
                  <span className="text-sm font-medium text-cyan-400 min-w-[3rem] text-right">
                    {goal.progress || 0}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="text-purple-400 font-semibold">SoftballProAI</span> Biomechanical Analysis
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Profile generated {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
