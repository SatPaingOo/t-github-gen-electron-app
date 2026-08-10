/**
 * IconButton — pressable icon wrapper (text glyphs, no icon lib).
 * Mirrors the RN template (app/components/ui/IconButton.tsx).
 */

import type { CSSProperties, MouseEvent } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  glyph: string;
  onPress: () => void;
  color?: string;
  size?: number;
  label?: string;
}

export function IconButton({ glyph, onPress, color, size = 20, label }: Props) {
  const { colors } = useTheme();

  const style: CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: 17,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: size,
    lineHeight: `${size + 2}px`,
    color: color ?? colors.textMuted,
  };

  return (
    <button
      type="button"
      aria-label={label ?? glyph}
      title={label}
      onClick={(e: MouseEvent) => {
        e.stopPropagation();
        onPress();
      }}
      style={style}>
      {glyph}
    </button>
  );
}
