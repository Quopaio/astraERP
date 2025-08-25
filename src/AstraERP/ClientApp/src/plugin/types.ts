export type FrontendPlugin = {
  id: string;
  name: string;
  version: string;
  routes?: Array<{
    path: string;
    label?: string;
    requiresAuth?: boolean;
    component: () => Promise<{ default: React.ComponentType<any> }>;
  }>;
};
