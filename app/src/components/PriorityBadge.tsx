/**
 * PriorityBadge — small colored chip for a todo priority.
 * Mirrors the RN template (app/components/PriorityBadge.tsx).
 */

import { PRIORITY_META } from '../configs/constants';
import type { TodoPriority } from '../services/types';

export function PriorityBadge({ priority }: { priority: TodoPriority }) {
  const meta = PRIORITY_META[priority];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 8px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        color: meta.color,
        background: `${meta.color}22`,
      }}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          background: meta.color,
        }}
      />
      {meta.label}
    </span>
  );
}
