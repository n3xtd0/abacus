import type { CollectionConfig, User } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      required: true,
      options: ['admin', 'editor', 'user'],
    },
    // Email added by default
    // Add more fields as needed
  ],
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      return Boolean(user) && user?.role === 'admin';
    },
    update: ({ req: { user } }) => {
      return Boolean(user) && user?.role === 'admin';
    },
    delete: ({ req: { user } }) => {
      return Boolean(user) && user?.role === 'admin';
    },
  },
}
