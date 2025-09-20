// Minimal tests using Node's built-in modules (no external deps)
const assert = require('assert');
const { mapError } = require('../../src/server');
const { handleRequest } = require('../../src/handler');
const { requestPlatformDraft } = require('../../src/llm');

async function request(method, path, body, query = {}) {
  const { status, body: resp } = await handleRequest(method, path, query, body);
  return { status, body: resp };
}

async function run() {
  // Stash env and fetch to avoid bleed between tests
  const restoreEnv = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_API_BASE: process.env.OPENAI_API_BASE,
    LLM_MODEL: process.env.LLM_MODEL,
  };
  const originalFetch = global.fetch;

  try {
    // Health
    let res = await request('GET', '/health');
    assert.strictEqual(res.status, 200);

    // Negative: missing brief
    res = await request('POST', '/api/generate', { brief: '', platforms: ['x'], tone: 'friendly' });
    assert.strictEqual(res.status, 400);

    // Malformed JSON maps to the correct HTTP error
    const mappedError = mapError(new Error('invalid_json'));
    assert.deepStrictEqual(mappedError, { status: 400, body: { error: 'invalid_json' } });

    // LLM happy path with deterministic response
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.OPENAI_API_BASE = 'https://api.example.com/v1';
    process.env.LLM_MODEL = 'test-model';

    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: { content: 'Generated draft text' },
          },
        ],
      }),
    });

    res = await request('POST', '/api/generate', {
      brief: {
        objective: 'Launch beta',
        messages: ['Highlight value'],
        cta: 'Join waitlist',
      },
      platforms: ['x'],
      tone: 'friendly',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof res.body.drafts.x.text, 'string');

    // Azure-style base should keep api-version query intact
    process.env.OPENAI_API_BASE =
      'https://example.com/openai/deployments/my-model?api-version=2024-12-01-preview';
    let capturedUrl = null;
    global.fetch = async (url) => {
      capturedUrl = url;
      return {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: { content: 'Draft text' },
            },
          ],
        }),
      };
    };

    await requestPlatformDraft(
      {
        objective: 'Ship feature',
        messages: ['Key message'],
        cta: 'Try now',
      },
      'instagram',
      'friendly',
    );

    assert.strictEqual(
      capturedUrl,
      'https://example.com/openai/deployments/my-model/chat/completions?api-version=2024-12-01-preview',
    );
  } finally {
    for (const [key, value] of Object.entries(restoreEnv)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    global.fetch = originalFetch;
  }
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
