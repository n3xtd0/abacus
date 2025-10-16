import { CollectionConfig } from "payload";

export const League: CollectionConfig = {
  slug: 'league',
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
      maxLength: 45,
    },
    {
      name: 'year',
      type: 'number',
      required: false,
    },
    {
      name: 'description',
      type: 'text',
      required: false,
    },
  ],
}