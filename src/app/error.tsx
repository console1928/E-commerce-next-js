'use client'

import { useEffect } from 'react'
import Button from '@components/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Something went wrong!</h2>
      <Button onClick={() => reset()}>
        Try again
      </Button>
    </div>
  )
}