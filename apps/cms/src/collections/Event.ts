import { CollectionConfig } from 'payload'

export const Event: CollectionConfig = {
  slug: 'event',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
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
    {
      name: 'num_entries',
      type: 'number',
      required: true,
    },
    {
      name: 'num_rebuys',
      type: 'number',
      required: false,
    },
    {
      name: 'num_addons',
      type: 'number',
      required: false,
    },
    {
      name: 'num_addups',
      type: 'number',
      required: false,
    },
    {
      name: 'num_topups',
      type: 'number',
      required: false,
    },
    {
      name: 'num_maxups',
      type: 'number',
      required: false,
    },
  ],
}
