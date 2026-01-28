import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, Check, AlertCircle, TrendingUp, Target, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ParsedStats {
  name?: string;
  pos?: string;
  avg?: string;
  ops?: string;
  era?: string;
  whip?: string;
  kPercent?: string;
  firstPitchStrikePercent?: string;
  exitVelocity?: string;
}

export default function StatsImport() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedStats, setParsedStats] = useState<ParsedStats | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (stats: ParsedStats) => {
      return apiRequest("POST", "/api/stats/import", stats);
    },
    onSuccess: () => {
      toast({
        title: "Stats Imported",
        description: "Your GameChanger stats have been saved to your profile.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import stats",
        variant: "destructive",
      });
    },
  });

  const parseCSV = (content: string): ParsedStats | null => {
    const lines = content.trim().split("\n");
    if (lines.length < 2) return null;

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/[^a-z0-9%]/g, ""));
    const values = lines[1].split(",").map(v => v.trim());

    const headerMap: Record<string, string> = {};
    headers.forEach((h, i) => {
      headerMap[h] = values[i] || "";
    });

    const findValue = (keys: string[]): string | undefined => {
      for (const key of keys) {
        if (headerMap[key]) return headerMap[key];
      }
      return undefined;
    };

    return {
      name: findValue(["name", "player", "playername"]),
      pos: findValue(["pos", "position"]),
      avg: findValue(["avg", "ba", "battingavg", "battingaverage"]),
      ops: findValue(["ops"]),
      era: findValue(["era"]),
      whip: findValue(["whip"]),
      kPercent: findValue(["k", "kpercent", "strikeouts", "so"]),
      firstPitchStrikePercent: findValue(["firstpitchstrike", "fps", "fpstrike"]),
      exitVelocity: findValue(["exitvelocity", "ev", "exitvelo"]),
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setParseError("Please upload a CSV file");
      return;
    }

    setFile(selectedFile);
    setParseError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const stats = parseCSV(content);
      if (stats) {
        setParsedStats(stats);
      } else {
        setParseError("Could not parse CSV file. Please check the format.");
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = () => {
    if (parsedStats) {
      importMutation.mutate(parsedStats);
    }
  };

  const statCards = [
    { label: "AVG", value: parsedStats?.avg, icon: Target, color: "text-purple-400" },
    { label: "OPS", value: parsedStats?.ops, icon: TrendingUp, color: "text-pink-400" },
    { label: "ERA", value: parsedStats?.era, icon: Zap, color: "text-blue-400" },
    { label: "WHIP", value: parsedStats?.whip, icon: Target, color: "text-green-400" },
    { label: "K%", value: parsedStats?.kPercent, icon: Zap, color: "text-yellow-400" },
    { label: "1st Pitch Strike %", value: parsedStats?.firstPitchStrikePercent, icon: Check, color: "text-cyan-400" },
    { label: "Exit Velocity", value: parsedStats?.exitVelocity, icon: TrendingUp, color: "text-orange-400" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
            data-testid="text-page-title"
          >
            Sync Your GameChanger Data
          </h1>
          <p className="text-muted-foreground text-lg" data-testid="text-page-subtitle">
            Turn your on-field stats into a biomechanical recruiting resume.
          </p>
        </div>

        <Card className="border-purple-500/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-purple-400" />
              Upload GameChanger CSV
            </CardTitle>
            <CardDescription>
              Export your stats from GameChanger and upload the CSV file here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              data-testid="dropzone-csv"
            >
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                data-testid="input-csv-file"
              />
              <Upload className="h-12 w-12 mx-auto text-purple-400 mb-4" />
              {file ? (
                <div className="space-y-2">
                  <p className="text-foreground font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">Click to choose a different file</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-foreground font-medium">Click to upload CSV</p>
                  <p className="text-sm text-muted-foreground">
                    Supports: Name, Pos, AVG, OPS, ERA, WHIP, K%, First Pitch Strike %, Exit Velocity
                  </p>
                </div>
              )}
            </div>

            {parseError && (
              <div className="flex items-center gap-2 text-destructive" data-testid="text-parse-error">
                <AlertCircle className="h-4 w-4" />
                <span>{parseError}</span>
              </div>
            )}

            {parsedStats && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg" data-testid="text-preview-title">Preview Parsed Stats</h3>
                
                {parsedStats.name && (
                  <div className="flex items-center gap-2 text-foreground">
                    <span className="text-muted-foreground">Player:</span>
                    <span className="font-medium" data-testid="text-player-name">{parsedStats.name}</span>
                    {parsedStats.pos && (
                      <span className="text-purple-400">({parsedStats.pos})</span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {statCards.map((stat) => 
                    stat.value && (
                      <Card 
                        key={stat.label} 
                        className="bg-background/50 border-purple-500/20"
                        data-testid={`card-stat-${stat.label.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
                      >
                        <CardContent className="p-4 text-center">
                          <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>

                <Button
                  onClick={handleImport}
                  disabled={importMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  data-testid="button-import-stats"
                >
                  {importMutation.isPending ? (
                    "Importing..."
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Import Stats to Profile
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-pink-500/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-pink-400">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">1</span>
                <span>Export your season stats from GameChanger as a CSV file</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">2</span>
                <span>Upload the CSV here and verify the parsed stats</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">3</span>
                <span>Import to your profile to power your recruiting resume</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-sm font-bold">4</span>
                <span>Share your Public Profile with college recruiters</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
