import { CollectionConfig } from 'payload'

export const Level: CollectionConfig = {
  slug: 'level',
  admin: {
    useAsTitle: 'label',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'sb',
      type: 'number',
      required: true,
    },
    {
      name: 'bb',
      type: 'number',
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data?.sb !== undefined && data?.bb !== undefined) {
              return `${data.sb}/${data.bb}`;
            }
            return data?.label ?? data?.id;
          },
        ],
      },
      admin: {
        hidden: true,
      },
    },
  ],
}
