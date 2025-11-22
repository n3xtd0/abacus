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
      name: 'mainTime',
      type: 'number',
      required: true,
      admin: {
        description: 'Default time of the levels in the structure',
      },
    },
    {
      name: 'levels',
      type: 'relationship',
      required: true,
      hasMany: true,
      relationTo: 'level',
      admin: {
        components: {
          Field: '/components/structureLevels/LevelsCheckboxField#LevelsCheckboxField',
        },
      },
    },
    {
      name: 'breakDurations',
      type: 'array',
      admin: {
        description: 'Break times for specific levels',
        hidden: true, // Hide this field since it's managed by the custom component above
      },
      fields: [
        {
          name: 'level',
          type: 'relationship',
          relationTo: 'level',
          required: true,
        },
        {
          name: 'time',
          type: 'number',
          required: true,
        }
      ],
    },
    {
      name: 'levelDurations',
      type: 'array',
      admin: {
        description: 'Custom time values for specific levels',
        hidden: true, // Hide this field since it's managed by the custom component above
      },
      fields: [
        {
          name: 'level',
          type: 'relationship',
          relationTo: 'level',
          required: true,
        },
        {
          name: 'time',
          type: 'number',
          required: true,
        },
      ],
    },
  ],
}
