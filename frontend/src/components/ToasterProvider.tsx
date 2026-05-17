'use client'

import { Toaster } from 'react-hot-toast'

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#0A2540',
          color: '#fff',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '12px',
          fontWeight: 500,
          boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)',
        },
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          },
          style: {
            background: '#10B981',
            borderRadius: '8px',
            padding: '10px 14px',
          },
        },
        error: {
          iconTheme: {
            primary: '#DC2626',
            secondary: '#fff',
          },
          style: {
            background: '#DC2626',
            borderRadius: '8px',
            padding: '10px 14px',
          },
        },
      }}
    />
  )
}

export default ToasterProvider