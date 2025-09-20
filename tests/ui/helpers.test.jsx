import { describe, expect, test, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../src/ui/App.jsx';

const defaultDraftResponse = {
  drafts: {
    x: { text: 'Hello world', fit: { withinLimit: true, charsRemaining: 260 } },
  },
};

function mockFetch(response = defaultDraftResponse) {
  return vi.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: async () => response,
    }),
  );
}

describe('Draft helpers, export, and autosave', () => {
  let clipboardBackup;

  beforeEach(() => {
    vi.restoreAllMocks();
    clipboardBackup = navigator.clipboard;
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    Object.assign(navigator, { clipboard: clipboardBackup });
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  test('helpers insert without duplication, copy works, and export exposes JSON', async () => {
    const fetchMock = mockFetch();
    render(<App />);

    await userEvent.type(screen.getByLabelText(/objective/i), 'Launch new product');
    await userEvent.type(screen.getByLabelText(/call to action/i), 'Sign up today');
    await userEvent.click(screen.getByLabelText(/friendly tone/i));
    await userEvent.click(screen.getByLabelText(/x \(twitter\)/i));
    await userEvent.click(screen.getByRole('button', { name: /generate drafts/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const editor = await screen.findByLabelText(/x draft/i);

    const helperButton = screen.getByRole('button', { name: /insert #campaignboost/i });
    await userEvent.click(helperButton);
    expect(editor.value).toMatch(/#campaignboost/i);

    await userEvent.click(helperButton);
    const occurrences = editor.value.match(/#campaignboost/gi) || [];
    expect(occurrences.length).toBe(1);
    expect(helperButton).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: /copy x draft/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(editor.value);

    await userEvent.click(screen.getByRole('button', { name: /export drafts json/i }));
    const exportTextarea = await screen.findByLabelText(/drafts export json/i);
    expect(exportTextarea.value).toContain('"x"');
    expect(exportTextarea.value).toContain('#campaignboost');
    expect(screen.getByRole('link', { name: /download drafts json/i }).getAttribute('href')).toContain('data:application/json');
  });

  test('autosave restores drafts after reload', async () => {
    mockFetch();
    render(<App />);

    await userEvent.type(screen.getByLabelText(/objective/i), 'Launch new product');
    await userEvent.type(screen.getByLabelText(/call to action/i), 'Sign up today');
    await userEvent.click(screen.getByLabelText(/friendly tone/i));
    await userEvent.click(screen.getByLabelText(/x \(twitter\)/i));
    await userEvent.click(screen.getByRole('button', { name: /generate drafts/i }));

    const editor = await screen.findByLabelText(/x draft/i);
    await userEvent.clear(editor);
    await userEvent.type(editor, 'Custom draft');

    await waitFor(() =>
      expect(window.localStorage.getItem('market-message-generator.drafts.v1') ?? '').toContain('Custom draft'),
    );

    cleanup();

    mockFetch();
    render(<App />);
    const restoredEditor = await screen.findByLabelText(/x draft/i);
    expect(restoredEditor).toHaveValue('Custom draft');
  });

  test('importing JSON restores drafts with helpers available', async () => {
    mockFetch();
    render(<App />);

    const data = {
      drafts: {
        x: {
          text: 'Imported draft',
          generatedText: 'Imported draft',
          fit: { withinLimit: true, charsRemaining: 200 },
          isDirty: true,
        },
      },
    };
    const file = new File([JSON.stringify(data)], 'drafts.json', { type: 'application/json' });

    const input = screen.getByLabelText(/import drafts json/i);
    await userEvent.upload(input, file);

    const editor = await screen.findByLabelText(/x draft/i);
    expect(editor).toHaveValue('Imported draft');
    expect(screen.getByRole('button', { name: /insert #campaignboost/i })).toBeEnabled();
  });
});
