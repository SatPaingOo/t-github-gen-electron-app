/**
 * Typed access to the generated app's configuration.
 * Mirrors the RN template (app/configs/appConfig.ts) — same schema.
 */

import rawConfig from '../../../app.config.json';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppConfig {
  schemaVersion: number;
  appName: string;
  slug: string;
  theme: ThemeMode;
  primaryColor: string;
  logoUrl: string;
  supportEmail: string;
  platforms: string[];
  packageName: string;
  version: string;
}

export const appConfig = rawConfig as AppConfig;
