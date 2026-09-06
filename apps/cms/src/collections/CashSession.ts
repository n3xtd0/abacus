import type { CollectionConfig } from 'payload'

const isSessionEndDateValid = (
  endDate: Date | null | undefined,
  { siblingData }: { siblingData: { startDate?: Date } },
) => {
  if (!endDate || !siblingData.startDate) {
    return true
  }

  if (Number.isNaN(siblingData.startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 'Enter a valid end date.'
  }

  const startDay = Date.UTC(
    siblingData.startDate.getUTCFullYear(),
    siblingData.startDate.getUTCMonth(),
    siblingData.startDate.getUTCDate(),
  )
  const endDay = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate())
  const daysBetween = (endDay - startDay) / (1000 * 60 * 60 * 24)

  if (daysBetween < 0 || daysBetween > 1) {
    return 'The end date must be on the start date or the following day.'
  }

  return true
}

export const CashSession: CollectionConfig = {
  slug: 'cash-session',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'player',
      type: 'relationship',
      required: true,
      relationTo: 'player',
    },
    {
      name: 'cash_in',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'cash_out',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      validate: isSessionEndDateValid,
    },
  ],
}
