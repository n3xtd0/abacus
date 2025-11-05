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
      name: 'levelBreaks',
      type: 'relationship',
      hasMany: true,
      relationTo: 'level',
      admin: {
        description: 'Levels that should have a break after them',
        hidden: true, // Hide this field since it's managed by the custom component above
      },
    },
  ],
}
