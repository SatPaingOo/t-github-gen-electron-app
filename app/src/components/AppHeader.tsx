/**
 * AppHeader — brand header with the app logo + name.
 * Uses assets/logo.png (the same file the generate script writes from the
 * user's uploaded logo, or the default logo when none was provided).
 * Mirrors the RN template (app/components/AppHeader.tsx).
 */

import { appConfig } from '@/configs/appConfig';
import { useTheme } from '@/contexts/ThemeContext';
import logoUrl from '../../../assets/logo.png';

export function AppHeader() {
  const { colors } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        background: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <img
        src={logoUrl}
        alt="logo"
        style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }}
      />
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            color: colors.text,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {appConfig.appName}
        </p>
        <p style={{ margin: '1px 0 0', fontSize: 11, color: colors.textMuted }}>
          {appConfig.platforms.join(' + ')} · v{appConfig.version}
        </p>
      </div>
    </div>
  );
}
