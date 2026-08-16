import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ComponentType } from 'react'
import { vi } from 'vitest'

const state = vi.hoisted(() => ({
  setValue: vi.fn(),
  fields: {
    event: { value: 1 },
    current_level: { value: 10 },
    current_time: { value: 1200 },
    status: { value: 'paused' },
    clock_started_at: { value: null },
  },
}))

vi.mock('@payloadcms/ui', () => ({
  FieldLabel: ({ label }: { label: string }) => <label>{label}</label>,
  useFormFields: (selector: (formState: unknown) => unknown) =>
    selector([state.fields]),
  useField: ({ path }: { path: string }) => ({
    setValue: (value: unknown) => state.setValue(path, value),
  }),
}))

import { LiveControls } from './LiveControls'

describe('LiveControls', () => {
  const Controls = LiveControls as unknown as ComponentType<{ path: string }>

  beforeEach(() => {
    state.setValue.mockReset()
    window.history.pushState({}, '', '/admin/collections/live-event/1')
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => ({
        ok: true,
        json: async () =>
          url.startsWith('/api/level')
            ? {
                docs: [
                  { id: 10, sb: 100, bb: 200, label: '100/200' },
                  { id: 20, sb: 200, bb: 400, label: '200/400' },
                ],
              }
            : {
                docs: [
                  {
                    tourney: {
                      structure: {
                        mainTime: 20,
                        levels: [10, 20],
                        levelDurations: [{ level: 20, time: 15 }],
                      },
                    },
                  },
                ],
              },
      })),
    )
  })

  it('moves to the next configured level and resets its remaining time', async () => {
    render(<Controls path="current_time" />)

    const nextButton = await screen.findByRole('button', { name: 'Next level' })
    await waitFor(() => expect(nextButton).toBeEnabled())
    fireEvent.click(nextButton)

    expect(state.setValue).toHaveBeenCalledWith('current_level', 20)
    expect(state.setValue).toHaveBeenCalledWith('current_time', 900)
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        '/api/live-event/1',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ current_level: 20, current_time: 900 }),
        }),
      ),
    )
  })
})
