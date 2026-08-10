/**
 * useAppTheme — resolves dark/light + accent from app.config.json.
 */

import { useMemo } from 'react';
import { getPalette, resolveDark, type Palette } from './theme';
import type { AppConfig } from './types';

export interface AppTheme {
  isDark: boolean;
  palette: Palette;
  accent: string;
}

export function useAppTheme(config: AppConfig): AppTheme {
  return useMemo(() => {
    const systemDark =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = resolveDark(config.theme, systemDark);
    return {
      isDark,
      palette: getPalette(isDark),
      accent: config.primaryColor,
    };
  }, [config.theme, config.primaryColor]);
}
