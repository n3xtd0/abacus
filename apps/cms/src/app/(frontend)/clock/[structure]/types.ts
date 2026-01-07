import { Level, Structure } from "@/payload-types"

export interface ClockLevel {
    sb: Level['sb']
    bb: Level['bb']
    time: number
}

export interface Break {
    sb: 0
    bb: 0
    time: number
}

export type PopulatedStructure = Omit<Structure, 'levels' | 'levelDurations' | 'breakDurations'> & {
    levels: Level[]
    levelDurations?: { level: Level; time: number; id?: string | null }[] | null
    breakDurations?: { level: Level; time: number; id?: string | null }[] | null
  }