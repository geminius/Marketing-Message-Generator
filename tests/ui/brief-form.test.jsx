import { describe, expect, test, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../src/ui/App.jsx';

describe('BriefForm + PlatformSelector', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('submit disabled until required fields are filled and a platform is selected', async () => {
    render(<App />);

    const submitButton = screen.getByRole('button', { name: /generate drafts/i });
    expect(submitButton).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/objective/i), 'Launch new product');
    await userEvent.type(screen.getByLabelText(/call to action/i), 'Sign up today');
    await userEvent.click(screen.getByLabelText(/friendly tone/i));

    expect(submitButton).toBeDisabled();

    await userEvent.click(screen.getByLabelText(/x \(twitter\)/i));
    expect(submitButton).toBeEnabled();
  });

  test('shows drafts on successful API response and surfaces errors on failure', async () => {
    const draftsResponse = {
      drafts: {
        x: { text: 'Hello X', fit: { withinLimit: true, charsRemaining: 10 } },
      },
    };
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => draftsResponse,
    });

    render(<App />);

    await userEvent.type(screen.getByLabelText(/objective/i), 'Launch new product');
    await userEvent.type(screen.getByLabelText(/call to action/i), 'Sign up today');
    await userEvent.click(screen.getByLabelText(/friendly tone/i));
    await userEvent.click(screen.getByLabelText(/x \(twitter\)/i));
    await userEvent.click(screen.getByRole('button', { name: /generate drafts/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(await screen.findByText(/hello x/i)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    fetchMock.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'boom' }) });
    await userEvent.click(screen.getByRole('button', { name: /generate drafts/i }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/boom/i));
  });
});
