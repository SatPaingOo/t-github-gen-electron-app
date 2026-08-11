/**
 * EmptyState — friendly placeholder for empty lists.
 * Mirrors the RN template (app/components/ui/EmptyState.tsx).
 */

import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  glyph: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({ glyph, title, subtitle }: Props) {
  const { colors } = useTheme();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 32px",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          background: colors.accentSoft,
          marginBottom: 16,
        }}
      >
        {glyph}
      </div>
      <p
        style={{ margin: 0, fontSize: 17, fontWeight: 600, color: colors.text }}
      >
        {title}
      </p>
      {subtitle ? (
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 13,
            color: colors.textMuted,
            textAlign: "center",
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
