/**
 * Shared domain types for the Notes + Todos app.
 * Mirrors the RN template (app/services/types.ts).
 */

export interface Note {
  id: string;
  title: string;
  body: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface NewNote {
  title: string;
  body: string;
  color: string;
}

export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  priority: TodoPriority;
  createdAt: number;
  updatedAt: number;
}

export interface NewTodo {
  title: string;
  priority: TodoPriority;
}
