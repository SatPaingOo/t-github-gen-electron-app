/**
 * AddNoteModal — create / edit a note with title, body and a color picker.
 * Mirrors the RN template (app/screens/AddNoteModal.tsx).
 */

import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { NOTE_COLORS } from "@/configs/constants";
import type { Note } from "@/services/types";

interface Props {
  visible: boolean;
  note: Note | null; // null = create
  onSave: (input: { title: string; body: string; color: string }) => void;
  onClose: () => void;
}

export function AddNoteModal({ visible, note, onSave, onClose }: Props) {
  const { colors } = useTheme();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [color, setColor] = useState(NOTE_COLORS[0]);

  useEffect(() => {
    if (visible) {
      setTitle(note?.title ?? "");
      setBody(note?.body ?? "");
      setColor(note?.color ?? NOTE_COLORS[0]);
    }
  }, [visible, note]);

  if (!visible) return null;

  const inputStyle = {
    width: "100%",
    border: `1px solid ${colors.border}`,
    background: colors.surfaceAlt,
    color: colors.text,
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 15,
    outline: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 560,
          background: colors.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 20,
          paddingBottom: 32,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, color: colors.text }}>
            {note ? "Edit note" : "New note"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 15,
              color: colors.textMuted,
            }}
          >
            Cancel
          </button>
        </div>

        <input
          autoFocus
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="Write something…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
        />

        <div style={{ display: "flex", gap: 12 }}>
          {NOTE_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`color ${c}`}
              onClick={() => setColor(c)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                background: c,
                border: color === c ? "3px solid #FFFFFF" : "none",
                outline: color === c ? "2px solid #0F172A" : "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            onSave({ title: title.trim(), body: body.trim(), color });
            onClose();
          }}
          style={{
            border: "none",
            borderRadius: 14,
            padding: "14px",
            background: colors.accent,
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            marginTop: 4,
          }}
        >
          {note ? "Save changes" : "Add note"}
        </button>
      </div>
    </div>
  );
}
