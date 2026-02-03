declare module '@shared/schema' {
  // Minimal temporary shims for build/test until shared types are available
  export const drills: any;
  export const mentalEdge: any;
  export type SkillType = any;
  export const defaultExport: any;
}

declare module '@shared/*' {
  const whatever: any;
  export default whatever;
}

// Allow importing some node/static assets as any during checks
declare module '*.md' {
  const content: string;
  export default content;
}
