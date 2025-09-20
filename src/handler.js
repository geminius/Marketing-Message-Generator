const { generateDrafts, DEFAULT_TONE } = require('./generator');
const { validateDraft } = require('./validation');
const { upsertDraft, listDrafts } = require('./storage');

const ALLOWED_TONES = new Set(['friendly', 'professional', 'witty']);

function isValidTone(value) {
  return typeof value === 'string' && ALLOWED_TONES.has(value);
}

async function handleRequest(method, path, query = {}, body = {}) {
  if (method === 'GET' && path === '/health') {
    return { status: 200, body: { ok: true } };
  }

  if (method === 'POST' && path === '/api/generate') {
    const { brief, platforms, tone, toneByPlatform, previousDrafts } = body || {};
    if (!brief || !brief.objective || !Array.isArray(platforms) || platforms.length === 0) {
      return { status: 400, body: { error: 'invalid_request' } };
    }
    if (tone && !isValidTone(tone)) {
      return { status: 400, body: { error: 'invalid_tone' } };
    }
    const perPlatform = toneByPlatform && typeof toneByPlatform === 'object' ? toneByPlatform : {};
    for (const value of Object.values(perPlatform)) {
      if (typeof value !== 'string' || !isValidTone(value)) {
        return { status: 400, body: { error: 'invalid_tone' } };
      }
    }
    const result = await generateDrafts(brief, platforms, {
      defaultTone: tone && isValidTone(tone) ? tone : DEFAULT_TONE,
      toneByPlatform: perPlatform,
      previousDrafts: previousDrafts && typeof previousDrafts === 'object' ? previousDrafts : {},
    });
    for (const p of platforms) {
      const draft = result.drafts[p];
      draft.fit = validateDraft(p, draft.text);
    }
    return { status: 200, body: result };
  }

  if (path.startsWith('/api/drafts')) {
    const sessionId = query.sessionId;
    if (!sessionId) return { status: 400, body: { error: 'session_required' } };
    if (method === 'GET' && path === '/api/drafts') {
      const drafts = listDrafts(sessionId);
      return { status: 200, body: { drafts } };
    }
    if (method === 'PUT') {
      const id = path.split('/').pop();
      const draft = Object.assign({}, body, { id });
      if (!draft.platform || typeof draft.text !== 'string') {
        return { status: 400, body: { error: 'invalid_draft' } };
      }
      draft.fit = validateDraft(draft.platform, draft.text);
      upsertDraft(sessionId, draft);
      return { status: 200, body: { ok: true, fit: draft.fit } };
    }
  }

  return { status: 404, body: { error: 'not_found' } };
}

module.exports = { handleRequest };
