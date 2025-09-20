// Very simple in-memory drafts storage scoped by sessionId
const store = new Map(); // sessionId -> Map<id, draft>

function upsertDraft(sessionId, draft) {
  if (!store.has(sessionId)) store.set(sessionId, new Map());
  store.get(sessionId).set(draft.id, draft);
}

function listDrafts(sessionId) {
  const m = store.get(sessionId) || new Map();
  return Array.from(m.values());
}

module.exports = { upsertDraft, listDrafts };

