import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Coach, type CreateCoachRequest } from "@shared/routes";

export function useCoach() {
  return useQuery({
    queryKey: [api.coaches.me.path],
    queryFn: async () => {
      const res = await fetch(api.coaches.me.path, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch coach profile");
      return api.coaches.me.responses[200].parse(await res.json());
    },
    retry: false,
  });
}

export function useCreateCoach() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCoachRequest) => {
      const res = await fetch(api.coaches.create.path, {
        method: api.coaches.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.coaches.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create coach profile");
      }
      return api.coaches.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.coaches.me.path] });
    },
  });
}
