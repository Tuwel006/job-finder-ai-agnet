import { Container, Card, Text, Flex } from '@/components/ui'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Container size="md">
        <Flex direction="col" align="center" gap={8}>
          {/* Brand Header */}
          <Flex direction="col" align="center" gap={3}>
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Text variant="h1" className="text-white">J</Text>
            </div>
            <Text variant="h1" className="text-primary text-3xl font-bold tracking-tight">
              JobFind
            </Text>
            <Text variant="body" className="text-text-secondary text-center max-w-sm">
              AI-Powered Job Search Platform
            </Text>
          </Flex>

          {/* Auth Card */}
          <Card className="w-full shadow-xl border border-gray-100">
            {children}
          </Card>

          {/* Footer */}
          <Text variant="caption" className="text-center text-text-secondary">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-secondary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-secondary hover:underline">Privacy Policy</a>
          </Text>
        </Flex>
      </Container>
    </main>
  )
}