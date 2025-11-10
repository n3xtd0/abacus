import { useState, useEffect } from 'react'
import { Level } from '@/payload-types'

export const useLevels = () => {
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        console.log('🔄 Fetching levels...')
        const response = await fetch('/api/level?limit=1000&sort=bb')
        console.log('📡 Response received:', response.status)
        const data = await response.json()
        console.log('📦 Data:', data)
        setLevels(data.docs || [])
        console.log('✅ Levels set:', data.docs?.length)
      } catch (error) {
        console.error('❌ Error fetching levels:', error)
      } finally {
        console.log('🏁 Setting loading to false')
        setLoading(false)
      }
    }

    fetchLevels()
  }, [])

  return { levels, loading }
}
