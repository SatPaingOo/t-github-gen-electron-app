/**
 * Database adapter contract.
 * Mirrors the RN template (app/services/db/types.ts) — the same repo/context
 * logic runs on every platform. Operations are synchronous (the Electron
 * adapter uses sync IPC to better-sqlite3 in the main process).
 */

import type { NewNote, NewTodo, Note, Todo } from '../types';

export interface DbAdapter {
  init(): void;
  close(): void;
  listNotes(): Note[];
  getNote(id: string): Note | null;
  insertNote(note: NewNote): Note;
  updateNote(id: string, patch: Partial<NewNote>): Note | null;
  deleteNote(id: string): void;
  listTodos(): Todo[];
  insertTodo(todo: NewTodo): Todo;
  updateTodo(id: string, patch: Partial<Pick<Todo, 'title' | 'done' | 'priority'>>): Todo | null;
  deleteTodo(id: string): void;
}
