/**
 * Typed shape of app.config.json — same schema shared by the RN template.
 */

export interface AppConfig {
  schemaVersion: number;
  appName: string;
  slug: string;
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  logoUrl: string;
  supportEmail: string;
  platforms: string[];
  packageName: string;
  version: string;
}
