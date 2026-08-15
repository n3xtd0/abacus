import { LabeledInput } from './LabeledInput'
import { Level } from '@/payload-types'
import { LevelTime } from './useLevelTimeValues'

export interface Props {
  level: Level
  toggleLevel: (id: Level['id']) => void
  breakTime?: LevelTime
  timeEntry?: LevelTime
  handleBreakChange: (id: Level['id'], time: number) => void
  handleTimeChange: (id: Level['id'], time: number) => void
  selected: boolean
}
export const LevelInputs = ({
  level,
  selected,
  breakTime,
  timeEntry,
  toggleLevel,
  handleBreakChange,
  handleTimeChange,
}: Props) => {
  return (
    <li
      key={level.id}
      className={`flex flex-col gap-2 p-3 rounded-md border-2 transition-all duration-200 ${
        selected
          ? 'bg-white text-black border-blue-600 dark:bg-zinc-900 dark:text-white'
          : 'bg-zinc-100 text-black border-zinc-300 dark:bg-zinc-800 dark:text-white dark:border-zinc-700'
      }`}
      onClick={() => toggleLevel(level.id)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <LabeledInput
          label={`${level.sb} / ${level.bb}`}
          value={selected ? 'true' : 'false'}
          onChange={() => toggleLevel(level.id)}
          className="w-4 h-4 accent-blue-600"
          labelClassName="text-black dark:text-white font-medium"
        />
      </div>
      {selected && (
        <div className="flex flex-col gap-2">
          <div onClick={(e) => e.stopPropagation()}>
            <LabeledInput
              type="number"
              label="Break time after this level"
              value={breakTime ? breakTime.time.toString() : ''}
              onChange={(e) => handleBreakChange(level.id, Number(e.target.value))}
              className="text-black dark:text-white"
              labelClassName={breakTime ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-400'}
            />
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <LabeledInput
              label="Custom time for this level"
              value={timeEntry ? timeEntry.time.toString() : ''}
              onChange={(e) => handleTimeChange(level.id, Number(e.target.value))}
              type="number"
              className="text-black dark:text-white"
              labelClassName={timeEntry ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-400'}
            />
          </div>
        </div>
      )}
    </li>
  )
}
