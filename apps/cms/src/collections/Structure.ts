import { CollectionConfig } from "payload";

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
        sortable: true,
        appearance: 'drawer'
      }
    },
  ],
}