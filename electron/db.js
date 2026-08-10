/**
 * Electron main-process SQLite service built on better-sqlite3.
 *
 * Implements the SAME contract as the RN DbAdapter (app/services/db/types)
 * so the renderer's shared repo/context logic runs unchanged.
 * better-sqlite3 is synchronous — no async glue needed.
 */

const Database = require('better-sqlite3');
const path = require('node:path');

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS notes (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL DEFAULT '',
  color      TEXT NOT NULL DEFAULT '#F59E0B',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS todos (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  done       INTEGER NOT NULL DEFAULT 0,
  priority   TEXT NOT NULL DEFAULT 'medium',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
`;

let db = null;

function ensureDb(userDataPath) {
  if (!db) {
    db = new Database(path.join(userDataPath, 'tgen.db'));
    db.exec(SCHEMA_SQL);
  }
  return db;
}

const toNote = (r) => ({
  id: r.id,
  title: r.title,
  body: r.body ?? '',
  color: r.color ?? '#F59E0B',
  createdAt: Number(r.created_at),
  updatedAt: Number(r.updated_at),
});

const toTodo = (r) => ({
  id: r.id,
  title: r.title,
  done: Boolean(r.done),
  priority: r.priority,
  createdAt: Number(r.created_at),
  updatedAt: Number(r.updated_at),
});

const now = () => Date.now();

function createService(userDataPath) {
  const dbc = ensureDb(userDataPath);

  return {
    listNotes() {
      return dbc.prepare('SELECT * FROM notes').all().map(toNote);
    },
    getNote(id) {
      const row = dbc.prepare('SELECT * FROM notes WHERE id = ?').get(id);
      return row ? toNote(row) : null;
    },
    insertNote(note) {
      const ts = now();
      const row = {
        id: `${ts.toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
        ...note,
        createdAt: ts,
        updatedAt: ts,
      };
      dbc
        .prepare('INSERT INTO notes (id, title, body, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
        .run(row.id, row.title, row.body, row.color, row.createdAt, row.updatedAt);
      return row;
    },
    updateNote(id, patch) {
      const existing = this.getNote(id);
      if (!existing) return null;
      const next = { ...existing, ...patch, updatedAt: now() };
      dbc
        .prepare('UPDATE notes SET title = ?, body = ?, color = ?, updated_at = ? WHERE id = ?')
        .run(next.title, next.body, next.color, next.updatedAt, id);
      return next;
    },
    deleteNote(id) {
      dbc.prepare('DELETE FROM notes WHERE id = ?').run(id);
    },

    listTodos() {
      return dbc.prepare('SELECT * FROM todos').all().map(toTodo);
    },
    insertTodo(todo) {
      const ts = now();
      const row = { id: `${ts.toString(36)}-${Math.random().toString(36).slice(2, 10)}`, done: false, ...todo, createdAt: ts, updatedAt: ts };
      dbc
        .prepare('INSERT INTO todos (id, title, done, priority, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
        .run(row.id, row.title, row.done ? 1 : 0, row.priority, row.createdAt, row.updatedAt);
      return row;
    },
    updateTodo(id, patch) {
      const existing = this.listTodos().find((t) => t.id === id);
      if (!existing) return null;
      const next = { ...existing, ...patch, updatedAt: now() };
      dbc
        .prepare('UPDATE todos SET title = ?, done = ?, priority = ?, updated_at = ? WHERE id = ?')
        .run(next.title, next.done ? 1 : 0, next.priority, next.updatedAt, id);
      return next;
    },
    deleteTodo(id) {
      dbc.prepare('DELETE FROM todos WHERE id = ?').run(id);
    },
  };
}

module.exports = { createService };
