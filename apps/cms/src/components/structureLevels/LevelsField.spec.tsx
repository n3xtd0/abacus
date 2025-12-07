import { render, screen } from '@testing-library/react'
import { LevelsField } from './LevelsField'

describe('LevelsField', () => {
  it('should render', () => {
    render(<LevelsField field={{ type: 'relationship', name: 'levels', relationTo: 'level' }} path="levels" />)
  })
})
