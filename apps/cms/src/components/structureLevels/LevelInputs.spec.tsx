import { render, screen } from '@testing-library/react'
import { LevelInputs } from './LevelInputs'
import { mockLevels } from './mocks'

describe("LevelInputs", () => {
  it("should render a list item with the correct number of items", () => {
    render(<LevelInputs level={mockLevels[0]} isLevelSelected={true} breakTime={undefined} timeEntry={undefined} toggleLevel={vi.fn()} handleBreakChange={vi.fn()} handleTimeChange={vi.fn()} />)
    expect(screen.getByRole('listitem')).toBeVisible()
  })
})