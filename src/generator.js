const { validateDraft } = require('./validation');
const { requestPlatformDraft, isConfigured } = require('./llm');

const DEFAULT_TONE = 'friendly';
const TONE_EMOJI = {
  friendly: '😊',
  professional: '🔹',
  witty: '😉',
};

function emojiForTone(tone) {
  return TONE_EMOJI[tone] || TONE_EMOJI[DEFAULT_TONE];
}

function draftFromBrief(brief, platform, tone) {
  const toneTag = emojiForTone(tone);
  const text = `${toneTag} ${brief.objective}: ${brief.messages?.[0] || ''} — ${brief.cta}`.trim();
  const fit = validateDraft(platform, text);
  return { text, fit };
}

function computeDiffHint(previous, next) {
  if (!previous) return 'new';
  if (previous === next) return 'unchanged';
  const prevWords = new Set(previous.split(/\s+/).filter(Boolean));
  const nextWords = next.split(/\s+/).filter(Boolean);
  if (nextWords.length === 0) return 'major_change';
  let differing = 0;
  for (const word of nextWords) {
    if (!prevWords.has(word)) differing += 1;
  }
  const ratio = differing / nextWords.length;
  if (ratio <= 0.2) return 'minor_change';
  return 'major_change';
}

async function generateDrafts(brief, platforms, options = {}) {
  const {
    defaultTone = DEFAULT_TONE,
    toneByPlatform = {},
    previousDrafts = {},
  } = options;

  const drafts = {};
  const useLlm = isConfigured();

  for (const platform of platforms) {
    const tone = toneByPlatform[platform] || defaultTone;
    const previous = previousDrafts[platform]?.generatedText || previousDrafts[platform]?.text;
    let text = '';
    let fit = null;

    if (useLlm) {
      try {
        text = await requestPlatformDraft(brief, platform, tone);
        fit = validateDraft(platform, text);
      } catch (err) {
        console.warn?.(`LLM generation failed for ${platform}: ${err.message}`);
      }
    }

    if (!text) {
      const fallback = draftFromBrief(brief, platform, tone);
      text = fallback.text;
      fit = fallback.fit;
    }

    drafts[platform] = {
      text,
      fit,
      tone,
      diffHint: computeDiffHint(previous, text),
    };
  }

  return { drafts };
}

module.exports = { generateDrafts, DEFAULT_TONE, TONE_EMOJI };
