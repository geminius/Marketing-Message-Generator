const assert = require('assert');

const { getTemplate } = require('../../src/templates');
const { validateDraft } = require('../../src/validation');

function expectTonePresets(template) {
  const presetIds = template.tonePresets.map((preset) => preset.id).sort();
  assert.deepStrictEqual(presetIds, ['friendly', 'professional', 'witty']);
  for (const preset of template.tonePresets) {
    assert.ok(preset.example && preset.example.length > 0, 'preset example present');
    assert.ok(preset.guidance && preset.guidance.length > 0, 'preset guidance present');
  }
}

function testGetTemplate() {
  const template = getTemplate('x');
  assert.strictEqual(template.platform, 'x');
  assert.strictEqual(template.displayName, 'X');
  assert.strictEqual(template.limits.characterLimit, 280);
  expectTonePresets(template);
  assert.ok(template.formatting.hashtags.toLowerCase().includes('hash'));
  assert.ok(template.formatting.handles.includes('@'));
  assert.ok(template.formatting.links.toLowerCase().includes('link'));
}

function testGetTemplateUnknown() {
  assert.throws(() => getTemplate('myspace'), /unknown platform/i);
}

function testValidateDraftHappyPath() {
  const text = 'Try Market-Message-Generator today! @BrandHQ #LaunchDay https://example.com';
  const result = validateDraft('x', text);
  assert.strictEqual(result.withinLimit, true);
  assert.strictEqual(result.violations.length, 0);
  assert.strictEqual(result.metrics.platform, 'x');
  assert.strictEqual(result.metrics.counts.hashtags, 1);
  assert.strictEqual(result.metrics.counts.handles, 1);
  assert.strictEqual(result.metrics.counts.links, 1);
  assert.strictEqual(result.charsRemaining, getTemplate('x').limits.characterLimit - text.length);
}

function testValidateDraftViolations() {
  const text = 'Follow us @bad-handle and love #bad-hashtag!';
  const result = validateDraft('x', text);
  const codes = result.violations.map((v) => v.code).sort();
  assert.deepStrictEqual(codes, ['handle_format', 'hashtag_format']);
  for (const violation of result.violations) {
    assert.ok(violation.message && violation.message.length > 0);
    assert.strictEqual(violation.platform, 'x');
  }
  assert.strictEqual(result.metrics.violationCount, result.violations.length);
}

function testValidateDraftLength() {
  const template = getTemplate('instagram');
  const overLimitText = 'x'.repeat(template.limits.characterLimit + 1);
  const result = validateDraft('instagram', overLimitText);
  assert.strictEqual(result.withinLimit, false);
  assert.strictEqual(result.charsRemaining, 0);
  const hasLengthViolation = result.violations.some((v) => v.code === 'length');
  assert.ok(hasLengthViolation, 'length violation present');
}

async function run() {
  testGetTemplate();
  testGetTemplateUnknown();
  testValidateDraftHappyPath();
  testValidateDraftViolations();
  testValidateDraftLength();
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
