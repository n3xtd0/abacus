import { CollectionConfig } from 'payload'
import { statusOptions } from './options/entryOptions'

export const Entry: CollectionConfig = {
  slug: 'entry',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'event',
      type: 'relationship',
      required: true,
      relationTo: 'event',
    },
    {
      name: 'player',
      type: 'relationship',
      required: true,
      relationTo: 'player',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: statusOptions,
    },
    {
      name: 'position',
      type: 'number',
      required: true,
    },
    {
      name: 'prize_paid',
      type: 'number',
      required: false,
    },
    {
      name: 'pts_prize',
      type: 'number',
      required: true,
    },
    {
      name: 'pts_bonus',
      type: 'number',
      required: false,
    },
  ],
}
