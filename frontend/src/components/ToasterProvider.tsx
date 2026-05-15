'use client'

import { Toaster } from 'react-hot-toast'

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#0A2540',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
        },
        success: {
          style: {
            background: '#10B981',
          },
        },
        error: {
          style: {
            background: '#DC2626',
          },
        },
      }}
    />
  )
}

export default ToasterProvider