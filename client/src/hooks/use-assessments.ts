import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type Assessment, type CreateAssessmentRequest } from "@shared/routes";

export function useAssessments(athleteId?: number) {
  return useQuery({
    queryKey: [api.assessments.list.path, athleteId],
    queryFn: async () => {
      const url = athleteId
        ? `${api.assessments.list.path}?athleteId=${athleteId}`
        : api.assessments.list.path;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch assessments");
      return api.assessments.list.responses[200].parse(await res.json());
    },
  });
}

export function useAssessment(id: number) {
  return useQuery({
    queryKey: [api.assessments.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.assessments.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch assessment");
      return api.assessments.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Poll if status is 'pending' or 'analyzing'
      return data && (data.status === "pending" || data.status === "analyzing") ? 2000 : false;
    },
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateAssessmentRequest) => {
      const validated = api.assessments.create.input.parse(data);
      const res = await fetch(api.assessments.create.path, {
        method: api.assessments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create assessment");
      const created = api.assessments.create.responses[201].parse(await res.json());
      
      // Trigger analysis immediately after creation
      // We don't await this so UI can update immediately
      fetch(buildUrl(api.assessments.analyze.path, { id: created.id }), {
        method: "POST",
        credentials: "include"
      });
      
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.assessments.list.path] });
    },
  });
}

export function useAnalyzeAssessment() {
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.assessments.analyze.path, { id });
      const res = await fetch(url, { 
        method: api.assessments.analyze.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to trigger analysis");
      return res.json();
    },
  });
}
