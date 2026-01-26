import { z } from 'zod';
export { 
  insertCoachSchema, 
  insertTeamSchema, 
  insertAthleteSchema, 
  insertDrillSchema, 
  insertAssessmentSchema, 
  insertFeedbackSchema
} from './schema';

import { 
  insertCoachSchema, 
  insertTeamSchema, 
  insertAthleteSchema, 
  insertDrillSchema, 
  insertAssessmentSchema, 
  insertFeedbackSchema,
  coaches, teams, athletes, drills, assessments, assessmentFeedback 
} from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  coaches: {
    me: {
      method: 'GET' as const,
      path: '/api/coaches/me',
      responses: {
        200: z.custom<typeof coaches.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/coaches',
      input: insertCoachSchema,
      responses: {
        201: z.custom<typeof coaches.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  athletes: {
    list: {
      method: 'GET' as const,
      path: '/api/athletes',
      input: z.object({
        teamId: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof athletes.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/athletes/:id',
      responses: {
        200: z.custom<typeof athletes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/athletes',
      input: insertAthleteSchema,
      responses: {
        201: z.custom<typeof athletes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/athletes/:id',
      input: insertAthleteSchema.partial(),
      responses: {
        200: z.custom<typeof athletes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  teams: {
    list: {
      method: 'GET' as const,
      path: '/api/teams',
      responses: {
        200: z.array(z.custom<typeof teams.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/teams',
      input: insertTeamSchema,
      responses: {
        201: z.custom<typeof teams.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  assessments: {
    list: {
      method: 'GET' as const,
      path: '/api/assessments',
      input: z.object({
        athleteId: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof assessments.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/assessments',
      input: insertAssessmentSchema,
      responses: {
        201: z.custom<typeof assessments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/assessments/:id',
      responses: {
        200: z.custom<typeof assessments.$inferSelect & { feedback?: typeof assessmentFeedback.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
    analyze: { // Special endpoint to trigger AI analysis
      method: 'POST' as const,
      path: '/api/assessments/:id/analyze',
      responses: {
        202: z.object({ message: z.string(), status: z.string() }),
        404: errorSchemas.notFound,
      },
    }
  },
  drills: {
    list: {
      method: 'GET' as const,
      path: '/api/drills',
      input: z.object({
        skillType: z.string().optional(),
        difficulty: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof drills.$inferSelect>()),
      },
    },
    create: { // Admin or Coach only
      method: 'POST' as const,
      path: '/api/drills',
      input: insertDrillSchema,
      responses: {
        201: z.custom<typeof drills.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
