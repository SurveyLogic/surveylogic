export interface Localization {
  id: number;
  name: string;
  language: string;
  lines?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}
