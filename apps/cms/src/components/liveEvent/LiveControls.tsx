'use client'

import { FieldLabel } from '@payloadcms/ui'
import type { FieldClientComponent } from 'payload'
import { useLiveEventClockControls } from './useLiveEventClockControls'
import styles from './LiveControls.module.css'

export const LiveControls: FieldClientComponent = ({ path }) => {
  const {
    canGoNext,
    currentIndex,
    currentLevel,
    isSaving,
    remainingTime,
    saveError,
    selectLevel,
    status,
    toggleClock,
  } = useLiveEventClockControls(path)
  const currentLevelLabel = currentLevel ? `${currentLevel.sb} / ${currentLevel.bb}` : 'Not available'

  return (
    <div className={`field-type ${styles.controls}`}>
      <FieldLabel label="Live clock controls" required />
      <div className={styles.readout}>
        <p className={styles.stat}>
          Remaining time
          <span className={styles.statValue}>
            {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}
          </span>
        </p>
        <p className={styles.stat}>
          Current level
          <span className={styles.statValue}>{currentLevelLabel}</span>
        </p>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.button}
          type="button"
          onClick={() => selectLevel(currentIndex - 1)}
          disabled={isSaving || currentIndex <= 0}
        >
          Previous level
        </button>
        <button
          className={`${styles.button} ${styles.primaryButton}`}
          type="button"
          onClick={toggleClock}
          disabled={isSaving || !currentLevel}
        >
          {status === 'running' ? 'Pause' : 'Resume'}
        </button>
        <button
          className={styles.button}
          type="button"
          onClick={() => selectLevel(currentIndex + 1)}
          disabled={isSaving || !canGoNext}
        >
          Next level
        </button>
      </div>
      <p className={styles.help}>{isSaving ? 'Saving live event…' : 'Clock changes are saved automatically.'}</p>
      {saveError && <p role="alert">{saveError}</p>}
    </div>
  )
}
