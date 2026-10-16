import { existsSync, readFileSync } from 'node:fs';

// Founding is sold to ten workspaces. The server counts the places taken on Polar and archives the
// product at ten; scripts/founding-state.mjs writes that state to founding-state.json before the build.
export const FOUNDING_SLOTS = 10;

export interface FoundingState {
  open: boolean;
  // null when the count could not be read: the offer then shows without a count, and Polar still
  // refuses checkout once the product is archived.
  taken: number | null;
}

const UNKNOWN: FoundingState = { open: true, taken: null };

export function foundingState(): FoundingState {
  const file = process.env.FOUNDING_STATE_FILE ?? 'founding-state.json';
  if (!existsSync(file)) return UNKNOWN;
  try {
    const state = JSON.parse(readFileSync(file, 'utf8'));
    if (typeof state.open !== 'boolean') return UNKNOWN;
    const taken = Number.isInteger(state.taken) && state.taken >= 0 ? state.taken : null;
    return { open: state.open, taken };
  } catch {
    return UNKNOWN;
  }
}

// Places left, or null when the count is unknown.
export function placesLeft(state: FoundingState): number | null {
  if (!state.open) return 0;
  return state.taken === null ? null : Math.max(0, FOUNDING_SLOTS - state.taken);
}
