import { render, screen } from '@testing-library/react'
import { LevelInputs as Component, type Props } from './LevelInputs'
import { mockLevels } from './mocks'
import userEvent from '@testing-library/user-event'

const mockToggleLevel = vi.fn()
const mockHandleBreakChange = vi.fn()
const mockHandleTimeChange = vi.fn()

const LevelInputs = (props: Partial<Props>) => {
  const defaultProps = {
    level: mockLevels[0],
    selected: false,
    breakTime: undefined,
    timeEntry: undefined,
    toggleLevel: mockToggleLevel,
    handleBreakChange: mockHandleBreakChange,
    handleTimeChange: mockHandleTimeChange,
  }
  return <Component {...defaultProps} {...props} />
}

describe("LevelInputs", () => {

  beforeEach(vi.clearAllMocks)

  it("should render a list item with two inputs when the checkbox is checked", () => {
    render(<LevelInputs selected />)
    expect(screen.getByRole('listitem')).toBeVisible()
    expect(screen.getByRole('checkbox')).toBeChecked()
    expect(screen.getByRole('spinbutton', { name: /Break time after this level/i })).toBeVisible()
    expect(screen.getByRole('spinbutton', { name: /Custom time for this level/i })).toBeVisible()
  })

  it("should render a list item with just one unchecked checkbox by default", () => {
    render(<LevelInputs />)
    expect(screen.getByRole('listitem')).toBeVisible()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(screen.queryByRole('spinbutton', { name: /Break time after this level/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('spinbutton', { name: /Custom time for this level/i })).not.toBeInTheDocument()
  })

  it("should call the toggleLevel with level id when the checkbox is clicked", async () => {
    const user = userEvent.setup()
    render(<LevelInputs />)
    await user.click(screen.getByRole('checkbox'))
    expect(mockToggleLevel).toHaveBeenCalledTimes(1)
    expect(mockToggleLevel).toHaveBeenCalledWith(mockLevels[0].id)
  });

  it("should call the handleBreakChange with level id and time when the break time input is changed", async () => {
    const mockBreakTime = { levelId: mockLevels[0].id, time: 10 }
    const user = userEvent.setup()
    render(<LevelInputs selected breakTime={mockBreakTime}  />)
    await user.type(screen.getByRole('spinbutton', { name: /Break time after this level/i }), '10')
    expect(mockHandleBreakChange).toHaveBeenCalledTimes(1)
    expect(mockHandleBreakChange).toHaveBeenCalledWith(mockBreakTime.levelId, mockBreakTime.time)
  });

  it("should call the handleTimeChange with level id and time when the custom time input is changed", async () => {
    const mockTimeEntry = { levelId: mockLevels[0].id, time: 10 }
    const user = userEvent.setup()
    render(<LevelInputs selected timeEntry={mockTimeEntry} />)
    await user.type(screen.getByRole('spinbutton', { name: /Custom time for this level/i }), mockTimeEntry.time.toString())
    expect(mockHandleTimeChange).toHaveBeenCalledTimes(1)
    expect(mockHandleTimeChange).toHaveBeenCalledWith(mockTimeEntry.levelId, mockTimeEntry.time)
  });
})