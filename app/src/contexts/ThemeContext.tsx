/**
 * ThemeContext — resolves light/dark (from app.config.json theme + system
 * preference) and exposes the accent color + palette.
 * Mirrors the RN template (app/contexts/ThemeContext.tsx).
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { appConfig } from '../configs/appConfig';
import { getThemeColors, type ThemeColors } from '../configs/themes';
import { resolvePalette } from '../configs/constants';

interface ThemeContextValue {
  palette: 'light' | 'dark';
  isDark: boolean;
  colors: ThemeColors;
  accent: string;
  setAccent: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemPrefersDark(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [override, setOverride] = useState<string | null>(null);
  const palette = useMemo(() => resolvePalette(appConfig.theme, systemPrefersDark()), []);
  const isDark = palette === 'dark';
  const accent = override ?? appConfig.primaryColor;
  const setAccent = useCallback((color: string) => setOverride(color), []);
  const colors = useMemo(() => getThemeColors(palette, accent), [palette, accent]);

  const value = useMemo(
    () => ({ palette, isDark, colors, accent, setAccent }),
    [palette, isDark, colors, accent, setAccent],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
