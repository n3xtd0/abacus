import { fieldRawValuesToLevelTimeArray, removeRepeatedKeys } from './utils'
import { FormState } from 'payload'
import { keyWithoutLast } from './utils'

describe('utils', () => {
  it('should return empty array if field not found', () => {
    const fields: FormState = {}
    const basePath = 'breakDurations'
    const result = fieldRawValuesToLevelTimeArray(fields, basePath)
    expect(result).toEqual([])
  })
  it('should return array of level times if field found', () => {
    const fields: FormState = {
      // 'basePath.0': { value: 1 },
      'basePath.0.level': { value: 1 },
      'basePath.0.time': { value: 10 },
      'basePath.1.level': { value: 2 },
      'basePath.1.time': { value: 20 },
      'basePath.10.level': { value: 10 },
      'basePath.10.time': { value: 30 },
    }
    expect(fieldRawValuesToLevelTimeArray(fields, 'basePath')).toEqual([
      { levelId: 1, time: 10 },
      { levelId: 2, time: 20 },
      { levelId: 10, time: 30 },
    ])
  })

  describe('removeRepeatedKeys', () => {
    it('should return array of keys without repeated keys', () => {
      expect(removeRepeatedKeys(['basePath.0', 'basePath.1', 'basePath.10', 'basePath.0'])).toEqual([
        'basePath.0',
        'basePath.1',
        'basePath.10',
      ])
    })
  })

  it('should return key without last part', () => {
    expect(keyWithoutLast('basePath.0.level')).toBe('basePath.0')
    expect(keyWithoutLast('basePath.3.time')).toBe('basePath.3')
    expect(keyWithoutLast('basePath.10.time')).toBe('basePath.10')
  })
})
