import type { CollectionConfig } from 'payload'

export const Player: CollectionConfig = {
  slug: 'player',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'full_name',
  },
  fields: [
    {
      name: 'full_name',
      type: 'text',
      required: true,
      maxLength: 255,
    },
    {
      name: 'nickname',
      type: 'text',
      required: true,
      maxLength: 45,
    },
    {
      name: 'dni',
      type: 'text',
      required: true,
      maxLength: 12,
      minLength: 8,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      maxLength: 15,
      minLength: 9,
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'dni_photo',
      type: 'upload',
      required: false,
      relationTo: 'media',
    },
    {
      name: 'user',
      type: 'relationship',
      required: false,
      relationTo: 'users',
    },
  ],
}
