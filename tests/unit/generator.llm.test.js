const assert = require('assert');

const { generateDrafts } = require('../../src/generator');

function setEnv(key, value, bag) {
  bag[key] = process.env[key];
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}

async function testUsesLlmWhenConfigured() {
  const restore = {};
  const originalFetch = global.fetch;
  const originalWarn = console.warn;
  console.warn = () => {};

  setEnv('OPENAI_API_KEY', 'test-key', restore);
  setEnv('OPENAI_API_BASE', 'https://api.example.com/v1', restore);
  setEnv('LLM_MODEL', 'test-model', restore);

  let capturedRequest = null;
  global.fetch = async (url, options) => {
    capturedRequest = { url, options };
    return {
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'Instagram draft with CTA and #LaunchDay',
            },
          },
        ],
      }),
    };
  };

  const brief = {
    objective: 'Launch beta waitlist',
    audience: 'Product hunters',
    messages: ['Join early access'],
    cta: 'Sign up today',
  };

  const result = await generateDrafts(brief, ['instagram'], { defaultTone: 'friendly' });

  assert.ok(capturedRequest, 'expected fetch to be called');
  assert.strictEqual(capturedRequest.url, 'https://api.example.com/v1/chat/completions');
  const payload = JSON.parse(capturedRequest.options.body);
  assert.strictEqual(payload.model, 'test-model');
  assert.strictEqual(payload.messages[0].role, 'system');
  assert.ok(payload.messages[1].content.includes('Objective'));

  const draft = result.drafts.instagram;
  assert.ok(draft.text.includes('Instagram') || draft.text.length > 0, 'draft text present');
  assert.strictEqual(draft.tone, 'friendly');
  assert.ok(draft.fit && typeof draft.fit === 'object', 'fit metadata present');

  // cleanup
  global.fetch = originalFetch;
  console.warn = originalWarn;
  Object.entries(restore).forEach(([key, value]) => {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  });
}

async function testFallsBackWhenLlmFails() {
  const restore = {};
  const originalFetch = global.fetch;
  const originalWarn = console.warn;
  console.warn = () => {};

  setEnv('OPENAI_API_KEY', 'test-key', restore);
  setEnv('OPENAI_API_BASE', 'https://api.example.com/v1', restore);

  global.fetch = async () => {
    throw new Error('network down');
  };

  const brief = {
    objective: 'Ship new feature',
    messages: ['Highlight automation'],
    cta: 'Request access',
  };

  const result = await generateDrafts(brief, ['x'], { defaultTone: 'friendly' });
  const draft = result.drafts.x;

  assert.ok(draft.text.includes('😊'), 'fallback text should include emoji');
  assert.strictEqual(draft.fit.withinLimit, true);

  global.fetch = originalFetch;
  console.warn = originalWarn;
  Object.entries(restore).forEach(([key, value]) => {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  });
}

async function run() {
  await testUsesLlmWhenConfigured();
  await testFallsBackWhenLlmFails();
}

if (require.main === module) {
  run()
    .then(() => {
      console.log('OK');
      process.exit(0);
    })
    .catch((err) => {
      console.error('TEST FAIL', err);
      process.exit(1);
    });
}

module.exports = { run };
