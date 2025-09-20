const PLATFORM_PROFILES = {
  x: {
    template: {
      platform: 'x',
      displayName: 'X',
      limits: {
        characterLimit: 280,
      },
      formatting: {
        handles: 'Use @handle (up to 15 characters; letters, numbers, underscore).',
        hashtags: 'Use concise #CamelCase hashtags; avoid punctuation or spaces.',
        links: 'Links must be http(s) and count toward the 280 character limit - prefer short URLs.',
      },
      tonePresets: [
        {
          id: 'friendly',
          label: 'Friendly',
          guidance: 'Warm, conversational voice with light emoji accents.',
          example: 'Excited to share our latest update - tell us what you think!',
        },
        {
          id: 'professional',
          label: 'Professional',
          guidance: 'Direct and confident; highlight value and proof points.',
          example: 'Deliver results faster with Market-Message-Generator - designed for modern teams.',
        },
        {
          id: 'witty',
          label: 'Witty',
          guidance: 'Playful tone with smart wordplay; keep it clean and on-brand.',
          example: 'Less spreadsheet, more spotlight. Your campaign glow-up starts here.',
        },
      ],
    },
    rules: {
      handlePattern: /^@[A-Za-z0-9_]{1,15}$/,
      hashtagPattern: /^#[A-Za-z0-9_]{1,50}$/,
      linkPattern: /^https?:\/\/[\w.-]+(?:\/[\w\-.~:/?#[\]@!$&'()*+,;=%]*)?$/i,
    },
  },
  instagram: {
    template: {
      platform: 'instagram',
      displayName: 'Instagram',
      limits: {
        characterLimit: 2200,
      },
      formatting: {
        handles: 'Use @handle (up to 30 characters; letters, numbers, underscore, period).',
        hashtags: 'Stack key hashtags (letters/numbers/underscore); mix campaign + community tags.',
        links: 'Links should be in bio or use short URLs; include clear CTA.',
      },
      tonePresets: [
        {
          id: 'friendly',
          label: 'Friendly',
          guidance: 'Uplifting storytelling with expressive language and emoji.',
          example: 'We see you, creators! Drop your best tip in the comments.',
        },
        {
          id: 'professional',
          label: 'Professional',
          guidance: 'Clear, aspirational copy - spotlight results and next steps.',
          example: 'Level up your launch plan with insights from today\'s campaign toolkit.',
        },
        {
          id: 'witty',
          label: 'Witty',
          guidance: 'Sharp, memorable one-liners; keep the energy high.',
          example: 'Swipe left on chaos, right on organized campaigns.',
        },
      ],
    },
    rules: {
      handlePattern: /^@[A-Za-z0-9_.]{1,30}$/,
      hashtagPattern: /^#[A-Za-z0-9_]{1,50}$/,
      linkPattern: /^https?:\/\/[\w.-]+(?:\/[\w\-.~:/?#[\]@!$&'()*+,;=%]*)?$/i,
    },
  },
  facebook: {
    template: {
      platform: 'facebook',
      displayName: 'Facebook',
      limits: {
        characterLimit: 63206,
      },
      formatting: {
        handles: 'Use @PageName (letters, numbers, periods); align with official Page handle.',
        hashtags: 'Use sparingly - 1-2 descriptive hashtags without spaces or punctuation.',
        links: 'Prefer full https:// links with preview; include CTA near link.',
      },
      tonePresets: [
        {
          id: 'friendly',
          label: 'Friendly',
          guidance: 'Inclusive, community-forward voice; invite conversation.',
          example: 'We\'re celebrating big wins with our community - share yours below!',
        },
        {
          id: 'professional',
          label: 'Professional',
          guidance: 'Structured messaging with benefit statements and proof.',
          example: 'Discover how teams deliver campaigns 3x faster with Market-Message-Generator.',
        },
        {
          id: 'witty',
          label: 'Witty',
          guidance: 'Clever hooks that stay brand-safe; add light humor.',
          example: 'Turning brainstorms into broadcasts, one smart draft at a time.',
        },
      ],
    },
    rules: {
      handlePattern: /^@[A-Za-z0-9.]{5,50}$/,
      hashtagPattern: /^#[A-Za-z0-9_]{1,50}$/,
      linkPattern: /^https?:\/\/[\w.-]+(?:\/[\w\-.~:/?#[\]@!$&'()*+,;=%]*)?$/i,
    },
  },
};

function normalizePlatform(platform) {
  if (!platform) {
    throw new Error('Platform is required');
  }
  return platform.toLowerCase();
}

function cloneTemplate(template) {
  return JSON.parse(JSON.stringify(template));
}

function getProfileEntry(platform) {
  const key = normalizePlatform(platform);
  const entry = PLATFORM_PROFILES[key];
  if (!entry) {
    throw new Error(`Unknown platform: ${platform}`);
  }
  return { key, entry };
}

function getTemplate(platform) {
  const { entry } = getProfileEntry(platform);
  return cloneTemplate(entry.template);
}

function getValidationRules(platform) {
  const { entry, key } = getProfileEntry(platform);
  return { platform: key, rules: entry.rules, template: entry.template };
}

module.exports = { getTemplate, getValidationRules };
