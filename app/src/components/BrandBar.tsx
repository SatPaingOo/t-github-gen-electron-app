/**
 * BrandBar — accent-colored strip showing the generated app name.
 * Mirrors the RN template (app/components/BrandBar.tsx).
 */

import { useTheme } from "@/contexts/ThemeContext";
import { appConfig } from "@/configs/appConfig";

export function BrandBar() {
  const { colors } = useTheme();

  return (
    <div
      style={{
        background: colors.accent,
        color: colors.onAccent,
        textAlign: "center",
        padding: "7px 16px",
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
