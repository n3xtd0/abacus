import { CollectionConfig } from 'payload'
import { formatOptions, gameOptions, feeTypeOptions } from './options/torneyOptions'

export const Tourney: CollectionConfig = {
  slug: 'tourney',
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
    },
    {
      name: 'format',
      type: 'select',
      required: true,
      options: formatOptions,
    },
    {
      name: 'game',
      type: 'select',
      required: true,
      options: gameOptions,
    },
    {
      name: 'buyin',
      type: 'number',
      required: true,
    },
    {
      name: 'fee_type',
      type: 'select',
      required: true,
      options: feeTypeOptions,
    },
    {
      name: 'fee_value',
      type: 'number',
      required: true,
    },
    {
      name: 'pool_type',
      type: 'select',
      required: false,
      options: feeTypeOptions,
    },

    //TODO: make values required if pool_type is defined
    {
      name: 'pool_value',
      type: 'number',
      required: false,
    },
    {
      name: 'org_type',
      type: 'select',
      required: false,
      options: feeTypeOptions,
    },
    {
      name: 'org_value',
      type: 'number',
      required: false,
    },
    {
      name: 'cost_rebuy',
      type: 'number',
      required: false,
    },
    {
      name: 'cost_addon',
      type: 'number',
      required: false,
    },
    {
      name: 'cost_addup',
      type: 'number',
      required: false,
    },
    {
      name: 'cost_topup',
      type: 'number',
      required: false,
    },
    {
      name: 'cost_maxup',
      type: 'number',
      required: false,
    },
    {
      name: 'max_rebuys',
      type: 'number',
      required: false,
    },

    //TODO: make values required if rebuy is defined
    {
      name: 'stack_buyin',
      type: 'number',
      required: true,
    },
    {
      name: 'stack_rebuy',
      type: 'number',
      required: false,
    },
    {
      name: 'stack_addon',
      type: 'number',
      required: false,
    },
    {
      name: 'stack_addup',
      type: 'number',
      required: false,
    },
    {
      name: 'stack_topup',
      type: 'number',
      required: false,
    },
    {
      name: 'stack_maxup',
      type: 'number',
      required: false,
    },
    {
      name: 'stack_ontime',
      type: 'number',
      required: false,
    },
    {
      name: 'stack_prereg',
      type: 'number',
      required: false,
    },
    {
      name: 'structure',
      type: 'relationship',
      required: true,
      relationTo: 'structure',
    },
  ],
}
