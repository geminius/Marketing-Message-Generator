const assert = require('assert');

const { requestPlatformDraft } = require('../../src/llm');

async function runAzureRequestTest() {
  const restore = {};
  const originalFetch = global.fetch;
  restore.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  restore.OPENAI_API_BASE = process.env.OPENAI_API_BASE;
  restore.LLM_MODEL = process.env.LLM_MODEL;

  process.env.OPENAI_API_KEY = 'test-key';
  process.env.OPENAI_API_BASE = 'https://example.com/openai/deployments/my-model?api-version=2024-12-01';
  process.env.LLM_MODEL = 'ignored';

  let capturedUrl = null;
  global.fetch = async (url) => {
    capturedUrl = url;
    return {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'Draft text',
            },
          },
        ],
      }),
    };
  };

  const brief = {
    objective: 'Launch beta',
    messages: ['Key message'],
    cta: 'Join waitlist',
  };

  await requestPlatformDraft(brief, 'x', 'friendly');

  assert.strictEqual(
    capturedUrl,
    'https://example.com/openai/deployments/my-model/chat/completions?api-version=2024-12-01',
  );

  global.fetch = originalFetch;
  for (const [key, value] of Object.entries(restore)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

async function run() {
  await runAzureRequestTest();
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

module.exports = { runAzureRequestTest };
