/**
 * App entry — loads app.config.json (via the Electron preload bridge, with a
 * web fallback for plain `vite` development) and renders the themed screen.
 */

import { useEffect, useState } from 'react';
import { AppScreen } from './AppScreen';
import { useAppTheme } from './useAppTheme';
import type { AppConfig } from './types';

interface WindowWithBridge {
  tgen?: {
    getConfig: () => Promise<AppConfig>;
    configLoaded: (cfg: AppConfig) => void;
  };
}

const FALLBACK_CONFIG: AppConfig = {
  schemaVersion: 1,
  appName: 'TGen App',
  slug: 'tgen-app',
  theme: 'light',
  primaryColor: '#3B82F6',
  logoUrl: 'assets/logo.png',
  supportEmail: 'support@example.com',
  platforms: ['windows'],
  packageName: 'com.tgenapp',
  version: '1.0.0',
};

export default function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const bridge = (window as WindowWithBridge).tgen;

    async function load() {
      try {
        const cfg = bridge ? await bridge.getConfig() : FALLBACK_CONFIG;
        if (cancelled) return;
        setConfig(cfg);
        bridge?.configLoaded(cfg);
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load config:', err);
        setError(err instanceof Error ? err.message : String(err));
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const theme = useAppTheme(config ?? FALLBACK_CONFIG);

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Segoe UI, system-ui, sans-serif',
          background: theme.palette.background,
          color: theme.palette.textPrimary,
        }}>
        <p>Failed to load app config: {error}</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Segoe UI, system-ui, sans-serif',
          background: theme.palette.background,
          color: theme.palette.textPrimary,
        }}>
        <p>Loading…</p>
      </div>
    );
  }

  return <AppScreen config={config} theme={theme} />;
}
