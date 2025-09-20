import { useEffect, useMemo, useState } from 'react';
import BriefForm from './components/BriefForm.jsx';
import DraftEditors from './components/DraftEditors.jsx';

const API_BASE = (import.meta.env?.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const STORAGE_KEY = 'market-message-generator.drafts.v1';
const EXPORT_FILENAME = 'drafts.json';

async function readFileText(file) {
  if (!file) return '';

  if (typeof file.text === 'function') {
    return await file.text();
  }

  if (typeof FileReader === 'function') {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => reject(reader.error || new Error('Unable to read file.'));
      reader.readAsText(file);
    });
  }

  if (typeof Response === 'function' && typeof Blob === 'function' && file instanceof Blob) {
    const response = new Response(file);
    return await response.text();
  }

  throw new Error('Unsupported file API.');
}

function collectMessages(raw) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function normaliseDraftEntry(entry = {}) {
  const text = typeof entry.text === 'string' ? entry.text : '';
  const generatedText = typeof entry.generatedText === 'string' ? entry.generatedText : text;
  return {
    text,
    generatedText,
    fit: entry.fit && typeof entry.fit === 'object' ? entry.fit : null,
    tone: typeof entry.tone === 'string' ? entry.tone : '',
    diffHint: typeof entry.diffHint === 'string' ? entry.diffHint : 'new',
    isDirty: Boolean(entry.isDirty),
  };
}

function normaliseDraftMap(drafts = {}) {
  const result = {};
  for (const [platform, entry] of Object.entries(drafts)) {
    result[platform] = normaliseDraftEntry(entry);
  }
  return result;
}

function App() {
  const [form, setForm] = useState({
    objective: '',
    audience: '',
    messages: '',
    cta: '',
    tone: '',
    platforms: { instagram: false, facebook: false, x: false },
  });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [copyStatus, setCopyStatus] = useState(null);
  const [exportData, setExportData] = useState('');
  const [importError, setImportError] = useState(null);
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage?.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !parsed.drafts) return;
      const normalised = normaliseDraftMap(parsed.drafts);
      if (Object.keys(normalised).length > 0) {
        setDrafts(normalised);
      }
    } catch (err) {
      setStorageAvailable(false);
    }
  }, []);

  useEffect(() => {
    if (!storageAvailable) return;
    try {
      const payload = JSON.stringify({ drafts: normaliseDraftMap(drafts) });
      window.localStorage?.setItem(STORAGE_KEY, payload);
    } catch (err) {
      setStorageAvailable(false);
    }
  }, [drafts, storageAvailable]);

  useEffect(() => {
    if (!copyStatus) return;
    const timeout = setTimeout(() => setCopyStatus(null), 2000);
    return () => clearTimeout(timeout);
  }, [copyStatus]);

  const selectedPlatforms = useMemo(
    () => Object.entries(form.platforms).filter(([, isChecked]) => isChecked).map(([key]) => key),
    [form.platforms],
  );

  const canSubmit =
    form.objective.trim().length > 0 &&
    form.cta.trim().length > 0 &&
    form.tone !== '' &&
    selectedPlatforms.length > 0 &&
    status !== 'loading';

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handlePlatformToggle = (platform, checked) => {
    setForm((current) => ({
      ...current,
      platforms: { ...current.platforms, [platform]: checked },
    }));
  };

  const handleToneChange = (tone) => {
    setForm((current) => ({ ...current, tone }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setStatus('loading');
    setError(null);

    try {
      const payload = {
        brief: {
          objective: form.objective.trim(),
          audience: form.audience.trim(),
          messages: collectMessages(form.messages),
          cta: form.cta.trim(),
        },
        platforms: selectedPlatforms,
        tone: form.tone,
      };

      const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        const message = data?.error || 'Unable to generate drafts.';
        throw new Error(message);
      }

      const responseDrafts = data.drafts || {};
      setDrafts((current) => {
        const next = { ...current };
        for (const platform of Object.keys(responseDrafts)) {
          const generated = responseDrafts[platform] || {};
          const existing = current[platform];
          if (existing && existing.isDirty) {
            next[platform] = {
              ...existing,
              generatedText: generated.text || existing.generatedText || '',
              fit: generated.fit ?? existing.fit ?? null,
              tone: generated.tone || existing.tone || '',
              diffHint: generated.diffHint || existing.diffHint || 'minor_change',
            };
          } else {
            next[platform] = {
              text: generated.text || '',
              generatedText: generated.text || '',
              fit: generated.fit ?? null,
              isDirty: false,
              tone: generated.tone || (payload.tone || ''),
              diffHint: generated.diffHint || 'new',
            };
          }
        }
        return next;
      });
    } catch (err) {
      setError(err.message || 'Unable to generate drafts.');
    } finally {
      setStatus('idle');
    }
  };

  const handleDraftTextChange = (platform, value) => {
    setDrafts((current) => {
      const existing = normaliseDraftEntry(current[platform]);
      return {
        ...current,
        [platform]: {
          ...existing,
          text: value,
          isDirty: true,
        },
      };
    });
  };

  const handleCopyDraft = async (platform) => {
    const value = drafts[platform]?.text ?? '';
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
        throw new Error('clipboard unavailable');
      }
      await navigator.clipboard.writeText(value);
      setCopyStatus({ platform, status: 'success' });
    } catch (err) {
      setCopyStatus({ platform, status: 'error' });
    }
  };

  const handleExportDrafts = () => {
    if (!Object.keys(drafts).length) {
      setExportData('');
      return;
    }
    const payload = {
      version: 1,
      generatedAt: new Date().toISOString(),
      drafts: normaliseDraftMap(drafts),
    };
    setExportData(JSON.stringify(payload, null, 2));
  };

  const exportDataUrl = useMemo(() => {
    if (!exportData) return null;
    return `data:application/json;charset=utf-8,${encodeURIComponent(exportData)}`;
  }, [exportData]);

  const handleImportFile = async (fileList) => {
    const list = Array.isArray(fileList) ? fileList : Array.from(fileList ?? []);
    const file = list[0];
    if (!file) return;
    try {
      const text = await readFileText(file);
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object' || !parsed.drafts) {
        throw new Error('invalid');
      }
      const normalised = normaliseDraftMap(parsed.drafts);
      setDrafts(normalised);
      setImportError(null);
      setExportData('');
    } catch (err) {
      setImportError('Unable to import drafts JSON.');
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Campaign Brief</h1>
      </header>

      <main>
        <BriefForm
          form={form}
          onFieldChange={handleFieldChange}
          onPlatformToggle={handlePlatformToggle}
          onToneChange={handleToneChange}
          onSubmit={handleSubmit}
          canSubmit={canSubmit}
          isSubmitting={status === 'loading'}
        />

        {error && (
          <div className="app__error" role="alert">
            {error}
          </div>
        )}

        <DraftEditors drafts={drafts} onTextChange={handleDraftTextChange} onCopy={handleCopyDraft} copyStatus={copyStatus} />

        <section className="draft-actions">
          <div className="draft-actions__controls">
            <button type="button" onClick={handleExportDrafts} disabled={Object.keys(drafts).length === 0}>
              Export drafts JSON
            </button>
            {exportData && exportDataUrl && (
              <a href={exportDataUrl} download={EXPORT_FILENAME} className="draft-actions__download">
                Download drafts JSON
              </a>
            )}
          </div>
          {exportData && (
            <textarea aria-label="Drafts export JSON" readOnly value={exportData} className="draft-actions__export" />
          )}
          <label className="draft-actions__import-label">
            Import drafts JSON
            <input
              aria-label="Import drafts JSON"
              type="file"
              accept="application/json"
              onChange={(event) => {
                void handleImportFile(event.target.files);
                event.target.value = '';
              }}
            />
          </label>
          {importError && (
            <div role="alert" className="draft-actions__error">
              {importError}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
