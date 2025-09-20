const { getTemplate, getValidationRules } = require('./templates');

const HANDLE_TOKEN_REGEX = /@[^\s@]+/gu;
const HASHTAG_TOKEN_REGEX = /#[^\s#]+/gu;
const LINK_TOKEN_REGEX = /https?:\/\/[^\s)]+/giu;

function findTokens(text, baseRegex) {
  const regex = new RegExp(baseRegex.source, baseRegex.flags);
  return text.match(regex) || [];
}

function asString(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

function characterLength(text) {
  return Array.from(text).length;
}

function limitFor(platform) {
  return getTemplate(platform).limits.characterLimit;
}

function validateDraft(platform, draftText) {
  const content = asString(draftText);
  const { platform: normalizedPlatform, rules, template } = getValidationRules(platform);
  const limit = template.limits.characterLimit;
  const length = characterLength(content);
  const withinLimit = length <= limit;

  const handles = findTokens(content, HANDLE_TOKEN_REGEX);
  const hashtags = findTokens(content, HASHTAG_TOKEN_REGEX);
  const links = findTokens(content, LINK_TOKEN_REGEX);

  const violations = [];

  if (!withinLimit) {
    const overBy = Math.max(0, length - limit);
    violations.push({
      code: 'length',
      platform: normalizedPlatform,
      overBy,
      message: `Draft exceeds ${limit} characters by ${overBy}.`,
    });
  }

  for (const handle of handles) {
    if (!rules.handlePattern.test(handle)) {
      violations.push({
        code: 'handle_format',
        platform: normalizedPlatform,
        token: handle,
        message: `Handle ${handle} is not valid for ${template.displayName}.`,
      });
    }
  }

  for (const tag of hashtags) {
    if (!rules.hashtagPattern.test(tag)) {
      violations.push({
        code: 'hashtag_format',
        platform: normalizedPlatform,
        token: tag,
        message: `Hashtag ${tag} must use letters, numbers, or underscore only.`,
      });
    }
  }

  for (const link of links) {
    if (!rules.linkPattern.test(link)) {
      violations.push({
        code: 'link_format',
        platform: normalizedPlatform,
        token: link,
        message: `Link ${link} must start with http:// or https:// and contain valid characters.`,
      });
    }
  }

  const metrics = {
    platform: normalizedPlatform,
    totalCharacters: length,
    withinLimit,
    counts: {
      hashtags: hashtags.length,
      handles: handles.length,
      links: links.length,
    },
    violationCount: violations.length,
  };

  return {
    withinLimit,
    charsRemaining: Math.max(0, limit - length),
    violations,
    metrics,
  };
}

module.exports = { limitFor, validateDraft };

