import { render, screen } from '@testing-library/react'
import { LevelsField } from './LevelsField'
import { mockLevels } from './mocks'

vi.mock('./useLevels', () => ({
  useLevels: () => ({
    levels: mockLevels,
    loading: false,
  }),
}))

vi.mock('./useLevelTimeValues', () => ({
  useLevelTimeValues: () => ({
    levelsChecked: ['1'],
    toggleLevel: vi.fn(),
    breakDurations: [],
    levelDurations: [],
    handleBreakChange: vi.fn(),
    handleTimeChange: vi.fn(),
  }),
}))

vi.mock('@payloadcms/ui', () => ({
  FieldLabel: ({ label }: { label: string }) => <label>{label}</label>,
}))

describe('LevelsField', () => {
  it('should render a list with the correct number of items', () => {
    render(<LevelsField field={{ type: 'relationship', name: 'levels', relationTo: 'level' }} path="levels" />)
    expect(screen.getByRole('list')).toBeVisible()
    expect(screen.getAllByRole('listitem')).toHaveLength(mockLevels.length)
  })

})
