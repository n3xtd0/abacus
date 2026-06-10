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
      access: {
        create: ({ req: { user } }) => user?.role === 'admin' || false,
        update: ({ req: { user } }) => user?.role === 'admin' || false,
      }
    },
    // Email added by default
    // Add more fields as needed
  ],
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user) return { id: { equals: user.id } }
      return false
    },
    create: () => true,
    update: ({ req: { user } }) => {
      return Boolean(user) && user?.role === 'admin';
    },
    delete: ({ req: { user } }) => {
      return Boolean(user) && user?.role === 'admin';
    },
  },
}
