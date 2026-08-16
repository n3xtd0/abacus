import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ComponentType, ReactNode } from 'react'
import { vi } from 'vitest'

const state = vi.hoisted(() => ({
  setValue: vi.fn(),
  fields: {
    event: { value: 1 },
    current_level: { value: 10 },
    current_time: { value: 1200 },
    status: { value: 'paused' },
    clock_started_at: { value: null },
    num_entries: { value: 10 },
  },
}))

vi.mock('@payloadcms/ui', () => ({
  Button: ({
    children,
    newTab,
    url,
  }: {
    children: ReactNode
    newTab?: boolean
    url?: string
  }) => (
    <a href={url} target={newTab ? '_blank' : undefined}>
      {children}
    </a>
  ),
  FieldLabel: ({ label }: { label: string }) => <label>{label}</label>,
  useFormFields: (selector: (formState: unknown) => unknown) => selector([state.fields]),
  useField: ({ path }: { path: string }) => ({
    setValue: (value: unknown) => state.setValue(path, value),
  }),
}))

import { LiveControls } from './LiveControls'
import { LiveNumberControl } from './LiveNumberControl'
import { LivePageButton } from './LivePageButton'

describe('LiveControls', () => {
  const Controls = LiveControls as unknown as ComponentType<{ path: string }>
  const NumberControl = LiveNumberControl as unknown as ComponentType<{ path: string }>

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

  it('increments a live number and saves it immediately', async () => {
    render(<NumberControl path="num_entries" />)

    fireEvent.click(screen.getByRole('button', { name: 'Increase Registered players' }))

    expect(state.setValue).toHaveBeenCalledWith('num_entries', 11)
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        '/api/live-event/1',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ num_entries: 11 }),
        }),
      ),
    )
  })

  it('opens the related event live page in a new tab', () => {
    render(<LivePageButton />)

    expect(screen.getByRole('link', { name: 'Open live page' })).toHaveAttribute('href', '/live/1')
    expect(screen.getByRole('link', { name: 'Open live page' })).toHaveAttribute('target', '_blank')
  })
})
