const { getTemplate } = require('./templates');

const DEFAULT_API_BASE = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'gpt-4o-mini';

function joinUrl(base, path) {
  if (!base) throw new Error('OPENAI_API_BASE is not configured');

  const [root, query] = base.split('?');
  const trimmedBase = root.endsWith('/') ? root.slice(0, -1) : root;
  const trimmedPath = path.startsWith('/') ? path.slice(1) : path;
  const joined = `${trimmedBase}/${trimmedPath}`;

  if (!query) {
    return joined;
  }

  const separator = joined.includes('?') ? '&' : '?';
  return `${joined}${separator}${query}`;
}

function formatBrief(brief) {
  const lines = [];
  if (brief.objective) lines.push(`Objective: ${brief.objective}`);
  if (brief.audience) lines.push(`Audience: ${brief.audience}`);
  if (Array.isArray(brief.messages) && brief.messages.length > 0) {
    const messageList = brief.messages.map((message, index) => `${index + 1}. ${message}`).join('\n');
    lines.push(`Key messages:\n${messageList}`);
  }
  if (brief.cta) lines.push(`Call to action: ${brief.cta}`);
  return lines.join('\n');
}

function formatGuidelines(template, tone) {
  const formatting = template.formatting;
  const guidelines = [
    `Platform: ${template.displayName}`,
    `Tone: ${tone}`,
    `Character limit: ${template.limits.characterLimit}`,
  ];
  if (formatting?.handles) guidelines.push(`Handles: ${formatting.handles}`);
  if (formatting?.hashtags) guidelines.push(`Hashtags: ${formatting.hashtags}`);
  if (formatting?.links) guidelines.push(`Links: ${formatting.links}`);
  guidelines.push('Highlight key campaign value and include a call to action.');
  return guidelines.map((item) => `- ${item}`).join('\n');
}

function buildMessages(brief, platform, tone) {
  const template = getTemplate(platform);
  const briefSection = formatBrief(brief);
  const guidelinesSection = formatGuidelines(template, tone);

  return [
    {
      role: 'system',
      content:
        'You are an expert marketing copywriter producing social media posts that respect each platform\'s formatting rules.',
    },
    {
      role: 'user',
      content: `Create a single ${template.displayName} post draft using the brief below.\n\n${briefSection}\n\nGuidelines:\n${guidelinesSection}\n\nRespond with the post text only.`,
    },
  ];
}

function isConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

async function requestPlatformDraft(brief, platform, tone) {
  if (!isConfigured()) {
    throw new Error('LLM configuration is missing');
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const apiBase = process.env.OPENAI_API_BASE || DEFAULT_API_BASE;
  const model = process.env.LLM_MODEL || DEFAULT_MODEL;

  const url = joinUrl(apiBase, 'chat/completions');
  const body = {
    model,
    temperature: 1,
    messages: buildMessages(brief, platform, tone),
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let detail = '';
    try {
      detail = await response.text();
    } catch (err) {
      detail = err && err.message ? err.message : 'unable to read error body';
    }
    const message = detail.length > 200 ? detail.slice(0, 200) : detail;
    throw new Error(`LLM request failed: ${response.status} ${message}`.trim());
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== 'string') {
    throw new Error('LLM response did not include content');
  }
  return text.trim();
}

module.exports = {
  DEFAULT_API_BASE,
  DEFAULT_MODEL,
  isConfigured,
  requestPlatformDraft,
};
