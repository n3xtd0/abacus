import type { CollectionConfig } from 'payload'

export const CashSession: CollectionConfig = {
  slug: 'cash-session',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'player',
      type: 'relationship',
      required: true,
      relationTo: 'player',
    },
    {
      name: 'buy_in',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'cash_out',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
  ],
}
