import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Page not found</h2>
        <p className="text-text-secondary mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-3 bg-primary text-white font-medium rounded-card hover:bg-primary/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}