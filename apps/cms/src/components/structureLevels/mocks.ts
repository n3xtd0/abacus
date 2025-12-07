import { Level } from "@/payload-types"

export const mockLevels: Level[] = [
  { id: 1, sb: 25, bb: 50, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 2, sb: 50, bb: 100, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
]