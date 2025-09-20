import { getPlatformMeta } from '../platforms.js';

const HASHTAG_HELPERS = {
  default: ['#campaignboost', '#onbrand'],
  instagram: ['#instaglow'],
  facebook: ['#communityhighlights'],
  x: ['#trendingnow'],
};

const MENTION_HELPERS = {
  default: ['@brandhq'],
  instagram: ['@brandcreators'],
  facebook: ['@brandcommunity'],
  x: ['@brandteam'],
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function includesHelper(text, helper) {
  const pattern = new RegExp(`(^|\\s)${escapeRegExp(helper)}(\\s|$)`, 'i');
  return pattern.test(text);
}

function appendHelper(text, helper) {
  if (includesHelper(text, helper)) return text;
  const separator = text.length === 0 || /\s$/.test(text) ? '' : ' ';
  return `${text}${separator}${helper}`;
}

function helperList(platform) {
  const combined = [
    ...(HASHTAG_HELPERS.default || []),
    ...(HASHTAG_HELPERS[platform] || []),
    ...(MENTION_HELPERS.default || []),
    ...(MENTION_HELPERS[platform] || []),
  ];
  return Array.from(new Set(combined));
}

function DraftEditors({ drafts, onTextChange, onCopy, copyStatus }) {
  const platforms = Object.keys(drafts);

  return (
    <section className="drafts" aria-live="polite">
      <h2>Drafts</h2>
      {platforms.length === 0 ? (
        <p>No drafts yet. Provide a brief and generate to see platform output.</p>
      ) : (
        <div className="drafts__grid editors__grid">
          {platforms.map((platform) => {
            const entry = drafts[platform];
            const meta = getPlatformMeta(platform);
            const value = entry?.text || '';
            const limit = meta.limit;
            const length = Array.from(value).length;
            const remaining = limit - length;
            const countMessage = `Characters remaining: ${Math.max(0, remaining)} (used ${length}/${limit})`;
            const statusId = `editor-status-${platform}`;
            const helpers = helperList(platform);
            const copyFeedback = copyStatus?.platform === platform ? copyStatus.status : null;

            return (
              <article key={platform} className="draft-editor">
                <label htmlFor={`editor-${platform}`}>{`${meta.label} draft`}</label>
                <textarea
                  id={`editor-${platform}`}
                  value={value}
                  onChange={(event) => onTextChange(platform, event.target.value)}
                  aria-describedby={statusId}
                  rows={6}
                />
                <div className="draft-editor__status" id={statusId}>
                  <span>{countMessage}</span>
                  {remaining < 0 && (
                    <span role="alert">{`${Math.abs(remaining)} over limit`}</span>
                  )}
                </div>
                <div className="draft-editor__helpers">
                  {helpers.map((helper) => (
                    <button
                      key={helper}
                      type="button"
                      className="draft-editor__helper-button"
                      onClick={() => onTextChange(platform, appendHelper(value, helper))}
                      disabled={includesHelper(value, helper)}
                      aria-label={`Insert ${helper}`}
                    >
                      Insert {helper}
                    </button>
                  ))}
                </div>
                <div className="draft-editor__actions">
                  <button type="button" onClick={() => onCopy?.(platform)}>
                    Copy {meta.label} draft
                  </button>
                  {copyFeedback === 'success' && (
                    <span role="status" className="draft-editor__copy-status draft-editor__copy-status--success">
                      Copied!
                    </span>
                  )}
                  {copyFeedback === 'error' && (
                    <span role="alert" className="draft-editor__copy-status draft-editor__copy-status--error">
                      Copy failed
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default DraftEditors;
