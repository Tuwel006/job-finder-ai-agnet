import { Container, Card, Text, Flex } from '@/components/ui'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-slate-50 relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <Container size="sm">
          <Flex direction="col" align="center" gap={4} className="animate-fade-in">
            {/* Brand Header - Compact */}
            <Flex direction="col" align="center" gap={1}>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <Text variant="small" className="text-primary font-bold tracking-tight">
                JobFind
              </Text>
            </Flex>

            {/* Auth Card - Compact padding */}
            <Card className="w-full p-4">
              {children}
            </Card>

            {/* Footer - Smaller */}
            <Text variant="caption" className="text-center text-text-secondary/50 text-[10px]">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-secondary hover:text-secondary/80">Terms</a>
              {' '}and{' '}
              <a href="/privacy" className="text-secondary hover:text-secondary/80">Privacy</a>
            </Text>
          </Flex>
        </Container>
      </div>
    </main>
  )
}