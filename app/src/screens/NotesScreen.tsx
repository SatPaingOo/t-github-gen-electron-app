/**
 * NotesScreen — searchable list of note cards + create/edit/delete.
 * Mirrors the RN template (app/screens/NotesScreen.tsx).
 */

import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { NoteCard } from '../components/NoteCard';
import { EmptyState } from '../components/ui/EmptyState';
import { IconButton } from '../components/ui/IconButton';
import type { Note } from '../services/types';
import { AddNoteModal } from './AddNoteModal';

export function NotesScreen() {
  const { notes, addNote, updateNote, deleteNote } = useApp();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);

  const filtered = query
    ? notes.filter(
        n => n.title.toLowerCase().includes(query.toLowerCase()) || n.body.toLowerCase().includes(query.toLowerCase()),
      )
    : notes;

  const confirmDelete = (id: string) => {
    if (window.confirm('Delete note? This cannot be undone.')) {
      deleteNote(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 8px' }}>
        <div
          style={{
            flex: 1,
            border: `1px solid ${colors.border}`,
            background: colors.surface,
            borderRadius: 12,
            padding: '0 12px',
          }}>
          <input
            placeholder="Search notes…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: colors.text,
              padding: '10px 0',
              fontSize: 14,
            }}
          />
        </div>
        <IconButton
          glyph="✚"
          color={colors.accent}
          size={22}
          label="Add note"
          onPress={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 16px' }}>
        {filtered.length === 0 ? (
          <EmptyState
            glyph={query ? '🔍' : '🗒'}
            title={query ? 'No matches' : 'No notes yet'}
            subtitle={query ? 'Try a different search.' : 'Tap + to create your first note.'}
          />
        ) : (
          filtered.map(n => (
            <NoteCard
              key={n.id}
              note={n}
              onOpen={note => {
                setEditing(note);
                setModalOpen(true);
              }}
              onDelete={confirmDelete}
            />
          ))
        )}
      </div>

      <AddNoteModal
        visible={modalOpen}
        note={editing}
        onClose={() => setModalOpen(false)}
        onSave={input => {
          if (editing) updateNote(editing.id, input);
          else addNote(input);
        }}
      />
    </div>
  );
}
