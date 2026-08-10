/**
 * AppScreen — branded home screen for the generated desktop app.
 */

import type { AppTheme } from './useAppTheme';
import type { AppConfig } from './types';

interface Props {
  config: AppConfig;
  theme: AppTheme;
}

export function AppScreen({ config, theme }: Props) {
  const { palette, accent } = theme;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: palette.background,
        color: palette.textPrimary,
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}>
      {/* Brand strip */}
      <div
        style={{
          background: accent,
          color: palette.onAccent,
          textAlign: 'center',
          padding: '4px 0',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0.3,
        }}>
        Generated with TGen
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px 24px',
        }}>
        {/* Brand icon */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 24,
            background: accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 44,
            fontWeight: 700,
            color: palette.onAccent,
          }}>
          {config.appName.charAt(0).toUpperCase()}
        </div>

        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            margin: '16px 0 4px',
            color: palette.textPrimary,
          }}>
          {config.appName}
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: palette.textSecondary }}>
          Electron {config.platforms.join(' + ')} app
        </p>

        {/* Config card */}
        <div
          style={{
            width: '100%',
            maxWidth: 480,
            background: palette.surface,
            borderRadius: 16,
            marginTop: 32,
            padding: '0 16px',
            border: `1px solid ${palette.border}`,
          }}>
          <Row label="Theme" value={config.theme} palette={palette} />
          <Row label="Version" value={config.version} palette={palette} />
          <Row label="Package" value={config.packageName} palette={palette} />
          <Row label="Support" value={config.supportEmail} palette={palette} last />
        </div>

        <p style={{ fontSize: 13, marginTop: 24, color: palette.textSecondary }}>
          Customize me — edit app.config.json and rebuild.
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  palette,
  last,
}: {
  label: string;
  value: string;
  palette: AppTheme['palette'];
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 0',
        borderBottom: last ? 'none' : `1px solid ${palette.border}`,
      }}>
      <span style={{ fontSize: 14, color: palette.textSecondary }}>{label}</span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: palette.textPrimary,
          marginLeft: 12,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
        {value}
      </span>
    </div>
  );
}
