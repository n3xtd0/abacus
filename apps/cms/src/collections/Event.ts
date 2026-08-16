import { CollectionConfig } from 'payload'
import { eventHooks } from './LiveEvent'

export const Event: CollectionConfig = {
  slug: 'event',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  hooks: eventHooks,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'name_short',
      type: 'text',
      required: false,
    },
    {
      name: 'league',
      type: 'relationship',
      required: false,
      relationTo: 'league',
    },
    {
      name: 'tourney',
      type: 'relationship',
      required: true,
      relationTo: 'tourney',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'time',
      type: 'text',
      required: true,
    },
    {
      name: 'max_players',
      type: 'number',
      required: true,
    },
  ],
}
