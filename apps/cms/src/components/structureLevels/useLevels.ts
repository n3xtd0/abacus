import { useState, useEffect } from 'react'
import { Level } from '@/payload-types'

export const useLevels = () => {
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  
  // TODO: use tanstack query
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch('/api/level?limit=1000&sort=bb')
        const data = await response.json()
        setLevels(data.docs || [])
      } catch (error) {
        console.error('Error fetching levels:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLevels()
  }, [])

  return { levels, loading }
}
