import { Level } from "@/payload-types"

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