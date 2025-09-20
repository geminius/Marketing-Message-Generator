import { describe, expect, test, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../src/ui/App.jsx';

async function generateDrafts({ objective = 'Launch new product', cta = 'Sign up today', tone = 'friendly', platform = 'x', draftsResponse }) {
  const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: async () => draftsResponse,
  });

  render(<App />);

  await userEvent.type(screen.getByLabelText(/objective/i), objective);
  await userEvent.type(screen.getByLabelText(/call to action/i), cta);
  await userEvent.click(screen.getByLabelText(new RegExp(`${tone} tone`, 'i')));
  const platformLabels = {
    instagram: /Instagram/i,
    facebook: /Facebook/i,
    x: /X \(Twitter\)/i,
  };
  await userEvent.click(screen.getByLabelText(platformLabels[platform] || new RegExp(`${platform}\b`, 'i')));
  await userEvent.click(screen.getByRole('button', { name: /generate drafts/i }));

  await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  return { fetchMock };
}

describe('Draft editors', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('shows live counts and warnings when over character limit', async () => {
    const initialText = 'Hello world';
    await generateDrafts({
      draftsResponse: {
        drafts: {
          x: { text: initialText, fit: { withinLimit: true, charsRemaining: 270 } },
        },
      },
    });

    const editor = await screen.findByLabelText(/x draft/i);
    expect(editor).toHaveValue(initialText);

    expect(screen.getByText(/characters remaining/i)).toHaveTextContent('remaining');

    const extra = 'x'.repeat(280 - initialText.length + 5);
    await userEvent.type(editor, extra);

    expect(screen.getByText(/over limit/i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(/over limit/i);
  });

  test('matches backend character counting for multi-byte glyphs', async () => {
    await generateDrafts({
      draftsResponse: {
        drafts: {
          x: { text: '', fit: { withinLimit: true, charsRemaining: 280 } },
        },
      },
    });

    const editor = await screen.findByLabelText(/x draft/i);
    const container = editor.closest('article');
    const scoped = container ? within(container) : screen;

    const sample = '𠮷'.repeat(280);
    fireEvent.change(editor, { target: { value: sample } });
    await waitFor(() => expect(editor).toHaveValue(sample));

    const status = scoped.getByText(/characters remaining/i);
    expect(status).toHaveTextContent('used 280/280');
    expect(scoped.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('preserves user edits when generating new drafts with different tone', async () => {
    const firstResponse = {
      drafts: {
        x: { text: 'Initial suggestion', fit: { withinLimit: true, charsRemaining: 260 } },
      },
    };
    const { fetchMock } = await generateDrafts({ draftsResponse: firstResponse });

    const editor = await screen.findByLabelText(/x draft/i);
    await userEvent.clear(editor);
    await userEvent.type(editor, 'Custom edit');

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        drafts: {
          x: { text: 'Second suggestion', fit: { withinLimit: true, charsRemaining: 255 } },
        },
      }),
    });

    await userEvent.click(screen.getByLabelText(/professional tone/i));
    await userEvent.click(screen.getByRole('button', { name: /generate drafts/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(editor).toHaveValue('Custom edit');
  });
});
