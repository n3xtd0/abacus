import { CollectionConfig } from 'payload'

export const Level: CollectionConfig = {
  slug: 'level',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'sb',
      type: 'number',
    },
    {
      name: 'bb',
      type: 'number',
    },
  ],
}
