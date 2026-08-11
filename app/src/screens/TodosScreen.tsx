/**
 * TodosScreen — add/complete/delete todos with priority cycling + progress bar.
 * Mirrors the RN template (app/screens/TodosScreen.tsx).
 */

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";
import { TodoItem } from "@/components/TodoItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import type { TodoPriority } from "@/services/types";

export function TodosScreen() {
  const { todos, addTodo, toggleTodo, setTodoPriority, deleteTodo } = useApp();
  const { colors } = useTheme();
  const [draft, setDraft] = useState("");

  const done = todos.filter((t) => t.done).length;
  const progress = todos.length ? Math.round((done / todos.length) * 100) : 0;

  const submit = () => {
    const title = draft.trim();
    if (!title) return;
    addTodo({ title, priority: "medium" });
    setDraft("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          margin: "14px 16px 0",
          background: colors.surfaceAlt,
          borderRadius: 14,
          padding: 14,
        }}
      >
        <div
          style={{
            height: 8,
            borderRadius: 4,
            background: "rgba(127,127,127,0.2)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: colors.accent,
              width: `${progress}%`,
            }}
          />
        </div>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 12,
            fontWeight: 500,
            color: colors.textMuted,
          }}
        >
          {done} of {todos.length} done · {progress}%
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
        }}
      >
        <div
          style={{
            flex: 1,
            border: `1px solid ${colors.border}`,
            background: colors.surface,
            borderRadius: 12,
            padding: "0 14px",
          }}
        >
          <input
            placeholder="Add a task…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              color: colors.text,
              padding: "10px 0",
              fontSize: 15,
            }}
          />
        </div>
        <IconButton
          glyph="✚"
          color={colors.accent}
          size={22}
          label="Add task"
          onPress={submit}
        />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "4px 16px 16px" }}>
        {todos.length === 0 ? (
          <EmptyState
            glyph="✅"
            title="All clear!"
            subtitle="Add a task to get started."
          />
        ) : (
          todos.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={toggleTodo}
              onCyclePriority={(id, priority: TodoPriority) =>
                setTodoPriority(id, priority)
              }
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}
