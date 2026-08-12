/**
 * Root App — providers + bottom tab navigation (Notes / Todos).
 * Mirrors the RN template (app/index.tsx).
 */

import { useState } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { AppHeader } from '@/components/AppHeader';
import { NotesScreen } from '@/screens/NotesScreen';
import { TodosScreen } from '@/screens/TodosScreen';
import { AboutScreen } from '@/screens/AboutScreen';

type Tab = 'notes' | 'todos' | 'about';

const TABS: { key: Tab; label: string; glyph: string }[] = [
  { key: 'notes', label: 'Notes', glyph: '🗒' },
  { key: 'todos', label: 'Todos', glyph: '✅' },
  { key: 'about', label: 'About', glyph: 'ℹ️' },
];

function Shell() {
  const [tab, setTab] = useState<Tab>('notes');
  const { colors } = useTheme();

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: colors.background,
        color: colors.text,
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      <AppHeader />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {tab === 'notes' ? (
          <NotesScreen />
        ) : tab === 'todos' ? (
          <TodosScreen />
        ) : (
          <AboutScreen />
        )}
      </div>

      <div
        style={{
          display: 'flex',
          borderTop: `1px solid ${colors.border}`,
          background: colors.surface,
          paddingTop: 8,
        }}
      >
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '4px 0 8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: active ? colors.accent : colors.textMuted,
                fontWeight: active ? 700 : 400,
              }}
            >
              <span style={{ fontSize: 18 }}>{t.glyph}</span>
              <span style={{ fontSize: 12 }}>{t.label}</span>
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  background: active ? colors.accent : 'transparent',
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const systemDark =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <ThemeProvider systemDark={systemDark}>
      <AppProvider>
        <Shell />
      </AppProvider>
    </ThemeProvider>
  );
}
