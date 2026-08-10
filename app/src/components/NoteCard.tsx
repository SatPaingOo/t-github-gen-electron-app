/**
 * NoteCard — clickable card for a note with colored accent + preview + time.
 * Mirrors the RN template (app/components/NoteCard.tsx).
 */

import type { CSSProperties } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { Note } from '../services/types';
import { timeAgo, truncate } from '../configs/constants';
import { IconButton } from './ui/IconButton';

interface Props {
  note: Note;
  onOpen: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onOpen, onDelete }: Props) {
  const { colors } = useTheme();

  const cardStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 16,
    border: `1px solid ${colors.border}`,
    background: colors.surface,
    padding: 14,
    marginBottom: 12,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    width: '100%',
    textAlign: 'left',
  };

  return (
    <button type="button" style={cardStyle} onClick={() => onOpen(note)}>
      <div style={{ width: 6, alignSelf: 'stretch', borderRadius: 3, background: note.color, marginRight: 12 }} />
      <div style={{ flex: 1, marginRight: 8, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {note.title || 'Untitled'}
        </p>
        <p style={{ margin: '3px 0 0', fontSize: 13, color: colors.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {truncate(note.body || 'No content', 120)}
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 11, color: colors.textMuted }}>{timeAgo(note.updatedAt)}</p>
      </div>
      <IconButton glyph="🗑" onPress={() => onDelete(note.id)} label="Delete note" />
    </button>
  );
}
