export interface CssTheme {
  id: number | string;
  name: string;
  is_dark?: boolean;
  default_dark?: boolean;
  default_light?: boolean;
  colors: CssThemeColors;
  created_at?: string;
  updated_at?: string;
}

export interface CssThemeColors {
  [key: string]: string;
}
