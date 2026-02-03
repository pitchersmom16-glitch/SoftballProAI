declare module '@shared/schema' {
  export const drills: any;
  export const mentalEdge: any;
  export type SkillType = any;
}

declare module '@shared/*' {
  const whatever: any;
  export default whatever;
}

declare module '*.md' {
  const content: string;
  export default content;
}
