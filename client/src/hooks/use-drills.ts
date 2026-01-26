import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Drill, type CreateDrillRequest } from "@shared/routes";

export function useDrills(skillType?: string, difficulty?: string) {
  return useQuery({
    queryKey: [api.drills.list.path, skillType, difficulty],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (skillType) params.append("skillType", skillType);
      if (difficulty) params.append("difficulty", difficulty);
      
      const url = `${api.drills.list.path}?${params.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch drills");
      return api.drills.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateDrill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateDrillRequest) => {
      const validated = api.drills.create.input.parse(data);
      const res = await fetch(api.drills.create.path, {
        method: api.drills.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create drill");
      return api.drills.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.drills.list.path] });
    },
  });
}
