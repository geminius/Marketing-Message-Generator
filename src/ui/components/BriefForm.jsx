import PlatformSelector from './PlatformSelector.jsx';

const TONE_OPTIONS = [
  { id: 'tone-friendly', value: 'friendly', label: 'Friendly tone' },
  { id: 'tone-professional', value: 'professional', label: 'Professional tone' },
  { id: 'tone-witty', value: 'witty', label: 'Witty tone' },
];

function BriefForm({ form, onFieldChange, onPlatformToggle, onToneChange, onSubmit, canSubmit, isSubmitting }) {
  return (
    <form className="brief-form" onSubmit={onSubmit} noValidate>
      <div className="brief-form__group">
        <label htmlFor="objective">Objective</label>
        <input
          id="objective"
          name="objective"
          type="text"
          required
          value={form.objective}
          onChange={onFieldChange}
        />
      </div>

      <div className="brief-form__group">
        <label htmlFor="audience">Audience</label>
        <input
          id="audience"
          name="audience"
          type="text"
          value={form.audience}
          onChange={onFieldChange}
        />
      </div>

      <div className="brief-form__group">
        <label htmlFor="messages">Key messages</label>
        <textarea
          id="messages"
          name="messages"
          rows={4}
          value={form.messages}
          onChange={onFieldChange}
        />
      </div>

      <div className="brief-form__group">
        <label htmlFor="cta">Call to action</label>
        <input
          id="cta"
          name="cta"
          type="text"
          required
          value={form.cta}
          onChange={onFieldChange}
        />
      </div>

      <PlatformSelector selected={form.platforms} onToggle={onPlatformToggle} />

      <fieldset className="tone-selector">
        <legend>Select tone</legend>
        <div className="tone-selector__options">
          {TONE_OPTIONS.map((option) => (
            <label key={option.value} htmlFor={option.id} className="tone-selector__option">
              <input
                id={option.id}
                type="radio"
                name="tone"
                value={option.value}
                checked={form.tone === option.value}
                onChange={() => onToneChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="brief-form__actions">
        <button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? 'Generating…' : 'Generate drafts'}
        </button>
      </div>
    </form>
  );
}

export default BriefForm;
