/**
 * AboutScreen — app info + TGen info + in-app theme switcher.
 * Mirrors the RN template (app/screens/AboutScreen.tsx) as HTML.
 */

import { useTheme } from '@/contexts/ThemeContext';
import { appConfig, type ThemeMode } from '@/configs/appConfig';
import { TGenInfo } from '@/configs/constants';

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export function AboutScreen() {
  const { colors, accent, themeMode, setThemeMode } = useTheme();

  const card = {
    background: colors.surface,
    // longhand so borderLeft can be overridden without React's shorthand conflict warning
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  };

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        background: colors.background,
        padding: 20,
      }}
    >
      {/* App identity */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 34,
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          {appConfig.appName.charAt(0).toUpperCase()}
        </div>
        <p
          style={{
            margin: '12px 0 4px',
            fontSize: 22,
            fontWeight: 700,
            color: colors.text,
          }}
        >
          {appConfig.appName}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: colors.textMuted }}>
          {appConfig.platforms.join(' + ')} app · v{appConfig.version}
        </p>
      </div>

      {/* Theme switcher */}
      <div style={card}>
        <p
          style={{
            margin: '0 0 10px',
            fontSize: 13,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            color: colors.text,
          }}
        >
          Theme
        </p>
        <div
          style={{
            display: 'flex',
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            background: colors.surfaceAlt,
            padding: 3,
          }}
        >
          {THEME_OPTIONS.map(opt => {
            const active = themeMode === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setThemeMode(opt.value)}
                style={{
                  flex: 1,
                  borderRadius: 9,
                  padding: '8px 0',
                  border: 'none',
                  cursor: 'pointer',
                  background: active ? accent : 'transparent',
                  color: active ? '#FFFFFF' : colors.textMuted,
                  fontWeight: active ? 700 : 400,
                  fontSize: 13,
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <p style={{ margin: '8px 0 0', fontSize: 12, color: colors.textMuted }}>
          {themeMode === 'system'
            ? 'Follows your device theme.'
            : `${
                themeMode === 'light' ? 'Light' : 'Dark'
              } theme — applied now.`}
        </p>
      </div>

      {/* App details */}
      <div style={card}>
        <p
          style={{
            margin: '0 0 10px',
            fontSize: 13,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            color: colors.text,
          }}
        >
          App info
        </p>
        <Row label="Version" value={appConfig.version} colors={colors} />
        <Row label="Package" value={appConfig.packageName} colors={colors} />
        <Row
          label="Support"
          value={appConfig.supportEmail}
          colors={colors}
          last
        />
      </div>

      {/* TGen info — compact */}
      <div
        style={{
          ...card,
          borderLeft: `4px solid ${accent}`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          ⚡
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 700,
              color: colors.text,
            }}
          >
            Made with {TGenInfo.name}
          </p>
          <p
            style={{ margin: '2px 0 0', fontSize: 12, color: colors.textMuted }}
          >
            {TGenInfo.description}
          </p>
          <p
            style={{
              margin: '3px 0 0',
              fontSize: 11,
              color: accent,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {TGenInfo.url}
          </p>
        </div>
      </div>

      <p
        style={{
          margin: '8px 0 0',
          fontSize: 11,
          textAlign: 'center',
          color: colors.textMuted,
        }}
      >
        Made with TGen · v{appConfig.version}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  colors,
  last,
}: {
  label: string;
  value: string;
  colors: { text: string; textMuted: string; border: string };
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: last ? 'none' : `1px solid ${colors.border}`,
      }}
    >
      <span style={{ fontSize: 13, color: colors.textMuted }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: colors.text,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginLeft: 12,
        }}
      >
        {value}
      </span>
    </div>
  );
}
