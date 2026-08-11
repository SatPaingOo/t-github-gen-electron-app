/**
 * BrandBar — brand strip at the top. Uses the secondary color (accent = primary),
 * so both brand colors are visible in the app.
 */

import { useTheme } from '@/contexts/ThemeContext';
import { appConfig } from '@/configs/appConfig';

export function BrandBar() {
  const { colors } = useTheme();
  const secondary = appConfig.secondaryColor || appConfig.primaryColor;

  return (
    <div
      style={{
        background: secondary,
        color: colors.onAccent,
        textAlign: 'center',
        padding: '7px 16px',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 0.3,
      }}
    >
      {appConfig.appName}
      <span style={{ opacity: 0.8, fontWeight: 500 }}> · TGen</span>
    </div>
  );
}
