/**
 * Electron DbAdapter — routes CRUD to better-sqlite3 in the main process via
 * synchronous IPC (preload exposes window.tgen.db). Implements the same
 * DbAdapter contract as the RN op-sqlite adapter.
 */

import type { DbAdapter } from '@/services/db/types';
import type { NewNote, NewTodo, Note, Todo } from '@/services/types';

interface DbBridge {
  call(op: string, args?: unknown[]): unknown;
}

function bridge(): DbBridge {
  const win = window as unknown as { tgen?: { db?: DbBridge } };
  if (!win.tgen?.db) {
    throw new Error(
      'Electron bridge unavailable — run inside the Electron app',
    );
  }
  return win.tgen.db;
}

function call<T>(op: string, args?: unknown[]): T {
  return bridge().call(op, args) as T;
}

export const betterSqliteAdapter: DbAdapter = {
  init() {},
  close() {},

  listNotes: () => call<Note[]>('listNotes'),
  getNote: id => call<Note | null>('getNote', [id]),
  insertNote: (note: NewNote) => call<Note>('insertNote', [note]),
  updateNote: (id, patch) => call<Note | null>('updateNote', [id, patch]),
  deleteNote: id => call<void>('deleteNote', [id]),

  listTodos: () => call<Todo[]>('listTodos'),
  insertTodo: (todo: NewTodo) => call<Todo>('insertTodo', [todo]),
  updateTodo: (id, patch) => call<Todo | null>('updateTodo', [id, patch]),
  deleteTodo: id => call<void>('deleteTodo', [id]),
};

/** Uniform adapter instance consumed by the shared core (services/db/index.ts). */
export const sqliteAdapter: DbAdapter = betterSqliteAdapter;
