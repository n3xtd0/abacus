import { LabeledInput } from "./LabeledInput"
import { Level } from "@/payload-types"

interface Props {
  level: Level
  isLevelSelected: boolean
  breakTime: { time: number } | undefined
  timeEntry: { time: number } | undefined
  toggleLevel: (id: Level['id']) => void
  handleBreakChange: (id: Level['id'], time: number) => void
  handleTimeChange: (id: Level['id'], time: number) => void
}
export const LevelInputs = ({ level, isLevelSelected, breakTime, timeEntry, toggleLevel, handleBreakChange, handleTimeChange }: Props) => {
  return (
    <li 
    key={level.id}
    className={`flex flex-col gap-2 p-3 rounded-md border-2 transition-all duration-200 ${
      isLevelSelected ? 'bg-zinc-900 border-blue-600' : 'bg-zinc-800 border-zinc-700'
    }`}
  >
    <LabeledInput
      label={`${level.sb} / ${level.bb}`}
      value={isLevelSelected ? 'true' : 'false'}
      onChange={() => toggleLevel(level.id)}
      className="w-4 h-4 accent-blue-600"
      labelClassName="text-white font-medium"
    />
    {isLevelSelected && (
      <LabeledInput
        type="number"
        label="Break time after this level"
        value={breakTime ? breakTime.time.toString() : ''}
        onChange={(e) => handleBreakChange(level.id, Number(e.target.value))}
        className=""
        labelClassName={`${breakTime ? 'text-green-400' : 'text-gray-400'}`}
      />
    )}
    {isLevelSelected && (
      <LabeledInput
        label="Custom time for this level"
        value={timeEntry ? timeEntry.time.toString() : ''}
        onChange={(e) => handleTimeChange(level.id, Number(e.target.value))}
        type="number"
        className="text-white"
      />
    )}
  </li>
  )
}