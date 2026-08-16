'use client'

import { Button, useFormFields } from '@payloadcms/ui'
import { getID } from './useLiveEventStructure'

export const LivePageButton = () => {
  const { fields } = useFormFields(([fields]) => ({ fields }))
  const eventID = getID(fields.event?.value)

  if (!eventID) return null

  return (
    <Button buttonStyle="secondary" el="anchor" newTab url={`/live/${eventID}`}>
      Open live page
    </Button>
  )
}
