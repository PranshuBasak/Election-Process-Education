import { useState } from 'react';

const USER_ID_KEY = 'election_edu_user_id';

function getOrCreateUserId(): string {
  const existing = localStorage.getItem(USER_ID_KEY);
  if (existing) return existing;

  const generated = crypto.randomUUID();
  localStorage.setItem(USER_ID_KEY, generated);
  return generated;
}

/**
 * Persistent anonymous identity for progress tracking.
 * Firebase Auth can replace this without changing page-level callers.
 */
export function useUser() {
  const [userId] = useState(getOrCreateUserId);
  return { userId };
}
