'use client'

import { FieldLabel, useField, useFormFields } from '@payloadcms/ui'
import type { FieldClientComponent } from 'payload'
import { useState } from 'react'

const labels: Record<string, string> = {
  num_entries: 'Registered players',
  num_rebuys: 'Rebuys',
  num_addons: 'Add-ons',
  num_addups: 'Add-ups',
  num_topups: 'Top-ups',
  num_maxups: 'Max-ups',
  num_eliminated: 'Eliminated players',
}

const LiveNumberInput = ({ fieldPath }: { fieldPath: string }) => {
  const { fields } = useFormFields(([fields]) => ({ fields }))
  const { setValue } = useField<number>({ path: fieldPath })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string>()
  const value = Math.max(0, Number(fields[fieldPath]?.value ?? 0))
  const entryCount = Math.max(0, Number(fields.num_entries?.value ?? 0))
  const isEliminatedField = fieldPath === 'num_eliminated'

  const saveValue = async (nextValue: number) => {
    const documentID = window.location.pathname.split('/').at(-1)
    if (!fieldPath || !documentID || documentID === 'create') return

    setValue(nextValue)
    setIsSaving(true)
    setSaveError(undefined)

    try {
      const response = await fetch(`/api/live-event/${documentID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [fieldPath]: nextValue }),
      })
      if (!response.ok) throw new Error('Unable to save the live value.')
    } catch (error) {
      setValue(value)
      setSaveError(error instanceof Error ? error.message : 'Unable to save the live value.')
    } finally {
      setIsSaving(false)
    }
  }

  const incrementDisabled = isSaving || (isEliminatedField && value >= entryCount)

  return (
    <div className="field-type">
      <FieldLabel label={labels[fieldPath] ?? fieldPath} required />
      <div className="flex items-center gap-2">
        <button
          className="rounded border border-[var(--theme-elevation-400)] px-3 py-1 text-lg hover:bg-[var(--theme-elevation-100)] disabled:cursor-not-allowed disabled:opacity-50 max-[600px]:min-h-14 max-[600px]:min-w-14 max-[600px]:text-3xl"
          type="button"
          aria-label={`Decrease ${labels[fieldPath] ?? fieldPath}`}
          disabled={isSaving || value <= 0}
          onClick={() => void saveValue(value - 1)}
        >
          −
        </button>
        <output className="min-w-12 text-center text-xl font-bold">{value}</output>
        <button
          className="rounded border border-[var(--theme-elevation-400)] px-3 py-1 text-lg hover:bg-[var(--theme-elevation-100)] disabled:cursor-not-allowed disabled:opacity-50 max-[600px]:min-h-14 max-[600px]:min-w-14 max-[600px]:text-3xl"
          type="button"
          aria-label={`Increase ${labels[fieldPath] ?? fieldPath}`}
          disabled={incrementDisabled}
          onClick={() => void saveValue(value + 1)}
        >
          +
        </button>
      </div>
      {saveError && <p role="alert">{saveError}</p>}
    </div>
  )
}

export const LiveNumberControl: FieldClientComponent = ({ path }) => (
  <LiveNumberInput fieldPath={typeof path === 'string' ? path : ''} />
)

export const LiveNumberControls: FieldClientComponent = () => (
  <div className="field-type grid grid-cols-2 gap-x-4 max-[400px]:grid-cols-1">
    {Object.keys(labels).map((fieldPath) => (
      <LiveNumberInput key={fieldPath} fieldPath={fieldPath} />
    ))}
  </div>
)
