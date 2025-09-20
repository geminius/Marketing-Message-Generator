const PLATFORM_OPTIONS = [
  { id: 'platform-instagram', value: 'instagram', label: 'Instagram' },
  { id: 'platform-facebook', value: 'facebook', label: 'Facebook' },
  { id: 'platform-x', value: 'x', label: 'X (Twitter)' },
];

function PlatformSelector({ selected, onToggle }) {
  return (
    <fieldset className="platform-selector">
      <legend>Select platforms</legend>
      <div className="platform-selector__options">
        {PLATFORM_OPTIONS.map((option) => (
          <label key={option.value} htmlFor={option.id} className="platform-selector__option">
            <input
              id={option.id}
              type="checkbox"
              checked={Boolean(selected[option.value])}
              onChange={(event) => onToggle(option.value, event.target.checked)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default PlatformSelector;
