'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface rounded-modal shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-error mb-4">Oops!</h1>
        <p className="text-text-secondary mb-6">
          Something went wrong. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-4 py-3 bg-primary text-white font-medium rounded-card hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-3 bg-gray-100 text-text-primary font-medium rounded-card hover:bg-gray-200 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}