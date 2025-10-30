import { CollectionConfig } from 'payload'

export const Structure: CollectionConfig = {
  slug: 'structure',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'levels',
      type: 'relationship',
      required: true,
      hasMany: true,
      relationTo: 'level',
      admin: {
        components: {
          Field: '/components/LevelsCheckboxField#LevelsCheckboxField',
        },
      },
    },
    {
      name: 'breaks',
      type: 'array',
      fields: [
        {
          name: 'time',
          type: 'number',
          required: true,
        },
        {
          name: 'after_level',
          type: 'number',
        },
      ],
    },
  ],
}
