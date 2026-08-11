/**
 * TodoItem — row with checkbox, title, priority chip and delete.
 * Click the priority chip cycles low → medium → high.
 * Mirrors the RN template (app/components/TodoItem.tsx).
 */

import type { CSSProperties } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { PRIORITIES, PRIORITY_META } from "@/configs/constants";
import type { Todo, TodoPriority } from "@/services/types";
import { PriorityBadge } from "@/components/PriorityBadge";
import { IconButton } from "@/components/ui/IconButton";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onCyclePriority: (id: string, priority: TodoPriority) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onCyclePriority, onDelete }: Props) {
  const { colors } = useTheme();
  const nextPriority =
    PRIORITIES[(PRIORITY_META[todo.priority].order + 1) % PRIORITIES.length];

  const rowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    borderRadius: 16,
    border: `1px solid ${colors.border}`,
    background: colors.surface,
    padding: 14,
    marginBottom: 10,
  };

  return (
    <div style={rowStyle}>
      <button
        type="button"
        aria-label={todo.done ? "Mark not done" : "Mark done"}
        onClick={() => onToggle(todo.id)}
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          border: `2px solid ${todo.done ? colors.success : colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          cursor: "pointer",
          marginRight: 12,
          color: colors.success,
          fontSize: 13,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {todo.done ? "✓" : ""}
      </button>
      <div style={{ flex: 1, marginRight: 8, minWidth: 0 }}>
        <p
          style={{
            margin: "0 0 6px",
            fontSize: 15,
            fontWeight: 500,
            color: todo.done ? colors.textMuted : colors.text,
            textDecoration: todo.done ? "line-through" : "none",
            overflowWrap: "anywhere",
          }}
        >
          {todo.title}
        </p>
        <button
          type="button"
          title="Click to change priority"
          onClick={() => onCyclePriority(todo.id, nextPriority)}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <PriorityBadge priority={todo.priority} />
        </button>
      </div>
      <IconButton
        glyph="🗑"
        onPress={() => onDelete(todo.id)}
        label="Delete todo"
      />
    </div>
  );
}
