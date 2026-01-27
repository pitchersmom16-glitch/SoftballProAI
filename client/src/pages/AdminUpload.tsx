import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Database, Upload, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "Pitching", label: "Pitching" },
  { value: "Hitting", label: "Hitting" },
  { value: "Catching", label: "Catching" },
  { value: "Throwing", label: "Throwing" },
  { value: "Biomechanics", label: "Biomechanics" },
  { value: "Crossfit", label: "Crossfit" },
];

interface ImportResult {
  message: string;
  imported: number;
  total: number;
  errors?: string[];
}

export default function AdminUpload() {
  const { toast } = useToast();
  const [category, setCategory] = useState<string>("");
  const [jsonData, setJsonData] = useState<string>("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const importMutation = useMutation({
    mutationFn: async (data: { category: string; drills: any[] }) => {
      const response = await apiRequest("POST", "/api/admin/import-drills", data);
      return response.json();
    },
    onSuccess: (data: ImportResult) => {
      setResult(data);
      toast({
        title: "Import Complete",
        description: data.message,
      });
      if (data.imported === data.total) {
        setJsonData("");
      }
    },
    onError: (err: any) => {
      const errorMessage = err?.message || "Import failed";
      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleImport = () => {
    setParseError(null);
    setResult(null);

    if (!category) {
      setParseError("Please select a category first");
      return;
    }

    if (!jsonData.trim()) {
      setParseError("Please paste JSON data");
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonData);
    } catch (err) {
      setParseError(`JSON Parse Error: ${err instanceof Error ? err.message : 'Invalid JSON'}`);
      return;
    }

    let drills: any[];
    if (Array.isArray(parsed)) {
      drills = parsed;
    } else if (parsed.drills && Array.isArray(parsed.drills)) {
      drills = parsed.drills;
    } else {
      setParseError("JSON must be an array of drills, or an object with a 'drills' array property");
      return;
    }

    if (drills.length === 0) {
      setParseError("No drills found in JSON data");
      return;
    }

    for (let i = 0; i < Math.min(drills.length, 3); i++) {
      const drill = drills[i];
      if (!drill.name || !drill.description) {
        setParseError(`Drill at index ${i} is missing required fields (name, description)`);
        return;
      }
    }

    importMutation.mutate({ category, drills });
  };

  const sampleJson = `[
  {
    "name": "Power Drive Drill",
    "description": "Focus on leg drive and explosion off the mound",
    "difficulty": "Intermediate",
    "expertSource": "Amanda Scarborough",
    "mechanicTags": ["Leg Drive", "Explosive Power"],
    "issueAddressed": "weak leg drive",
    "videoUrl": "https://youtube.com/watch?v=example"
  }
]`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#39FF14]">Knowledge Base Importer</h1>
        <p className="text-slate-400 mt-2">Bulk import drills into the AI Brain database</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-slate-900 border-[#39FF14]/30">
            <div className="flex items-center gap-2 mb-6">
              <Database className="h-5 w-5 text-[#39FF14]" />
              <h2 className="font-bold text-lg text-white">Import Drills</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-black border-slate-700" data-testid="select-category">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  JSON Data
                </label>
                <Textarea
                  value={jsonData}
                  onChange={(e) => {
                    setJsonData(e.target.value);
                    setParseError(null);
                    setResult(null);
                  }}
                  placeholder={sampleJson}
                  className="min-h-[400px] font-mono text-sm bg-black border-slate-700"
                  data-testid="textarea-json"
                />
              </div>

              {parseError && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg" data-testid="error-message">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-400">Parse Error</p>
                    <p className="text-sm text-red-300 mt-1 font-mono">{parseError}</p>
                  </div>
                </div>
              )}

              {result && (
                <div className={`flex items-start gap-3 p-4 rounded-lg border ${
                  result.errors && result.errors.length > 0 
                    ? 'bg-yellow-500/10 border-yellow-500/30' 
                    : 'bg-green-500/10 border-green-500/30'
                }`} data-testid="result-message">
                  <CheckCircle2 className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                    result.errors && result.errors.length > 0 ? 'text-yellow-400' : 'text-green-400'
                  }`} />
                  <div>
                    <p className={`font-medium ${
                      result.errors && result.errors.length > 0 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {result.message}
                    </p>
                    {result.errors && result.errors.length > 0 && (
                      <ul className="text-sm text-yellow-300 mt-2 space-y-1">
                        {result.errors.slice(0, 5).map((err, i) => (
                          <li key={i} className="font-mono">{err}</li>
                        ))}
                        {result.errors.length > 5 && (
                          <li className="italic">...and {result.errors.length - 5} more errors</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={handleImport}
                disabled={importMutation.isPending || !category || !jsonData.trim()}
                className="w-full bg-[#FF10F0] text-white"
                data-testid="button-inject"
              >
                {importMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Inject Knowledge
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="font-bold text-lg mb-4">JSON Format</h3>
            <p className="text-sm text-slate-400 mb-4">
              Paste an array of drill objects. Each drill must have:
            </p>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#39FF14]">*</span>
                <span><code className="text-[#FF10F0]">name</code> - Drill name</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#39FF14]">*</span>
                <span><code className="text-[#FF10F0]">description</code> - What the drill does</span>
              </li>
            </ul>
            <p className="text-sm text-slate-400 mt-4 mb-2">Optional fields:</p>
            <ul className="text-sm text-slate-300 space-y-1">
              <li><code className="text-slate-400">difficulty</code> - Beginner/Intermediate/Advanced</li>
              <li><code className="text-slate-400">videoUrl</code> - YouTube link</li>
              <li><code className="text-slate-400">expertSource</code> - Coach name</li>
              <li><code className="text-slate-400">mechanicTags</code> - Array of tags</li>
              <li><code className="text-slate-400">issueAddressed</code> - Problem it fixes</li>
              <li><code className="text-slate-400">equipment</code> - Array of items</li>
              <li><code className="text-slate-400">ageRange</code> - e.g., "8U-12U"</li>
            </ul>
          </Card>

          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="font-bold text-lg mb-4">Tips</h3>
            <ul className="text-sm text-slate-400 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-[#FAFF00]">1.</span>
                <span>You can paste a raw array <code>[...]</code> or an object with a <code>drills</code> property</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FAFF00]">2.</span>
                <span>The category you select will be applied to ALL drills in the import</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FAFF00]">3.</span>
                <span>Duplicate names are allowed but not recommended</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
