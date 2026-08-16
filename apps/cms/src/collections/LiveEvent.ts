import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'
import { getLevelDurationSeconds, relatedID, sortLevelsByBlinds } from '@/lib/liveEvent'
import type { Level, Structure, Tourney } from '@/payload-types'

const createLiveState: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  const tourney = await req.payload.findByID({
    collection: 'tourney',
    id: relatedID(doc.tourney as number | Tourney),
    depth: 1,
  })
  const structure = tourney.structure as Structure
  const levelIDs = structure.levels.map((level) => relatedID(level as number | Level))
  const { docs: levels } = await req.payload.find({
    collection: 'level',
    where: { id: { in: levelIDs } },
    limit: levelIDs.length,
  })
  const firstLevel = sortLevelsByBlinds(levels)[0]

  if (!firstLevel) {
    throw new Error(`Tourney ${tourney.id} has no structure levels configured.`)
  }

  const currentLevel = firstLevel.id
  await req.payload.create({
    collection: 'live-event',
    data: {
      event: doc.id,
      current_level: currentLevel,
      current_time: getLevelDurationSeconds(structure, currentLevel),
      status: 'paused',
      num_entries: 0,
    },
  })

  return doc
}

export const LiveEvent: CollectionConfig = {
  slug: 'live-event',
  admin: {
    useAsTitle: 'event',
    defaultColumns: ['event', 'status', 'current_level', 'current_time', 'updatedAt'],
    components: {
      edit: {
        beforeDocumentControls: ['/components/liveEvent/LivePageButton#LivePageButton'],
      },
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'event',
      required: true,
      unique: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'num_entries',
          type: 'number',
          required: true,
          defaultValue: 0,
          min: 0,
          admin: {
            components: {
              Field: '/components/liveEvent/LiveNumberControl#LiveNumberControls',
            },
          },
        },
        {
          name: 'num_rebuys',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: {
            hidden: true,
          },
        },
        {
          name: 'num_addons',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: {
            hidden: true,
          },
        },
        {
          name: 'num_addups',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: {
            hidden: true,
          },
        },
        {
          name: 'num_topups',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: {
            hidden: true,
          },
        },
        {
          name: 'num_maxups',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: {
            hidden: true,
          },
        },
        {
          name: 'num_eliminated',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: {
            hidden: true,
          },
        },
      ],
    },
    {
      name: 'current_level',
      type: 'relationship',
      relationTo: 'level',
      required: true,
    },
    {
      name: 'current_time',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        components: {
          Field: '/components/liveEvent/LiveControls#LiveControls',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'paused',
      options: ['paused', 'running'],
    },
    {
      name: 'clock_started_at',
      type: 'date',
      admin: {
        hidden: true,
      },
    },
  ],
}

export const eventHooks = {
  afterChange: [createLiveState],
}
