'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Level, Structure, Tourney } from '@/payload-types'

type PopulatedEvent = {
  tourney: number | Tourney
}

type PopulatedTourney = Omit<Tourney, 'structure'> & {
  structure: number | Structure
}

export const getID = (value: unknown) => {
  if (typeof value === 'number') return value
  if (typeof value === 'object' && value && 'id' in value && typeof value.id === 'number') return value.id
  return undefined
}

export const useLiveEventStructure = (eventID?: number) => {
  const [structure, setStructure] = useState<Structure>()

  useEffect(() => {
    if (!eventID) {
      setStructure(undefined)
      return
    }

    const getDocument = async <T,>(collection: string, id: number, depth: number) => {
      const response = await fetch(`/api/${collection}?where[id][equals]=${id}&limit=1&depth=${depth}`)
      if (!response.ok) throw new Error(`Unable to load ${collection} ${id}.`)
      const data = (await response.json()) as { docs: T[] }
      if (!data.docs[0]) throw new Error(`${collection} ${id} was not found.`)
      return data.docs[0]
    }

    const populateLevels = async (loadedStructure: Structure) => {
      const levelIDs = loadedStructure.levels.map(getID).filter((id): id is number => id !== undefined)
      const response = await fetch(`/api/level?where[id][in]=${levelIDs.join(',')}&limit=${levelIDs.length}&depth=0`)
      if (!response.ok) throw new Error('Unable to load structure levels.')

      const { docs } = (await response.json()) as { docs: Level[] }
      const levelsByID = new Map(docs.map((level) => [level.id, level]))
      return {
        ...loadedStructure,
        levels: levelIDs.map((id) => levelsByID.get(id)).filter((level): level is Level => level !== undefined),
      }
    }

    void getDocument<PopulatedEvent>('event', eventID, 1)
      .then(async (event) => {
        const tourney =
          typeof event.tourney === 'object'
            ? (event.tourney as PopulatedTourney)
            : await getDocument<PopulatedTourney>('tourney', event.tourney, 1)
        return typeof tourney.structure === 'object'
          ? tourney.structure
          : getDocument<Structure>('structure', tourney.structure, 2)
      })
      .then(populateLevels)
      .then(setStructure)
      .catch((error: unknown) => {
        console.error(error)
        setStructure(undefined)
      })
  }, [eventID])

  const levels = useMemo(
    () => structure?.levels.filter((level): level is Level => typeof level === 'object') ?? [],
    [structure],
  )

  return { structure, levels }
}
