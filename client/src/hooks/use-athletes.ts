import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type Athlete, type CreateAthleteRequest, type UpdateAthleteRequest } from "@shared/routes";

export function useAthletes(teamId?: number) {
  return useQuery({
    queryKey: [api.athletes.list.path, teamId],
    queryFn: async () => {
      const url = teamId 
        ? `${api.athletes.list.path}?teamId=${teamId}`
        : api.athletes.list.path;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch athletes");
      return api.athletes.list.responses[200].parse(await res.json());
    },
  });
}

export function useAthlete(id: number) {
  return useQuery({
    queryKey: [api.athletes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.athletes.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch athlete");
      return api.athletes.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateAthlete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateAthleteRequest) => {
      const validated = api.athletes.create.input.parse(data);
      const res = await fetch(api.athletes.create.path, {
        method: api.athletes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.athletes.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create athlete");
      }
      return api.athletes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.athletes.list.path] });
    },
  });
}

export function useUpdateAthlete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & UpdateAthleteRequest) => {
      const url = buildUrl(api.athletes.update.path, { id });
      const validated = api.athletes.update.input.parse(data);
      
      const res = await fetch(url, {
        method: api.athletes.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update athlete");
      return api.athletes.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.athletes.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.athletes.get.path] });
    },
  });
}
