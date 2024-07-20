export interface Permission {
  id: number;
  name: string;
  advanced?: boolean;
  display_name: string;
  description: string;
  group: string;
  restrictions: PermissionRestriction[];
}

export interface PermissionRestriction {
  name: string;
  type: string;
  value?: string | number | boolean;
  description?: string;
}
