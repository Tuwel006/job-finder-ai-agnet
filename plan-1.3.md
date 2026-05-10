# Module 1.3: Frontend Setup - Detailed Plan

## Overview
Set up the frontend with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui components, Zustand state management, and other required dependencies.

## Deliverables
- `frontend/package.json` with all dependencies
- `frontend/tsconfig.json` for Next.js
- `frontend/next.config.js`
- `frontend/tailwind.config.ts`
- `frontend/postcss.config.js`
- All dependencies installed via npm

---

## Step-by-Step Implementation

### Step 1.3.1: Create Frontend package.json

**Action:** Create initial `frontend/package.json`

```bash
cd job-find/frontend
cat > package.json << 'EOF'
{
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
EOF
```

---

### Step 1.3.2: Install Next.js and React

**Action:** Install Next.js 14, React, and React DOM

```bash
cd job-find/frontend
npm install next@^14.1.0
npm install react@^18.2.0
npm install react-dom@^18.2.0
```

---

### Step 1.3.3: Install State Management and API Client

**Action:** Install Zustand, TanStack Query, and Axios

```bash
cd job-find/frontend
npm install @tanstack/react-query@^5.17.0
npm install zustand@^4.5.0
npm install axios@^1.6.5
```

---

### Step 1.3.4: Install Form Handling

**Action:** Install React Hook Form and Zod resolver

```bash
cd job-find/frontend
npm install react-hook-form@^7.50.0
npm install @hookform/resolvers@^3.3.4
```

---

### Step 1.3.5: Install Animation and UI Utilities

**Action:** Install Framer Motion and utility libraries

```bash
cd job-find/frontend
npm install framer-motion@^10.18.0
npm install clsx@^2.1.0
npm install tailwind-merge@^2.2.0
npm install class-variance-authority@^0.7.0
npm install lucide-react@^0.323.0
```

---

### Step 1.3.6: Install Radix UI Components (shadcn/ui base)

**Action:** Install Radix UI primitives needed for shadcn/ui

```bash
cd job-find/frontend
npm install @radix-ui/react-dialog@^1.0.5
npm install @radix-ui/react-dropdown-menu@^2.0.6
npm install @radix-ui/react-label@^2.0.2
npm install @radix-ui/react-slot@^1.0.2
npm install @radix-ui/react-toast@^1.1.5
```

---

### Step 1.3.7: Install Toast Notifications

**Action:** Install React Hot Toast

```bash
cd job-find/frontend
npm install react-hot-toast@^2.4.1
```

---

### Step 1.3.8: Install Development Dependencies

**Action:** Install TypeScript and styling dev dependencies

```bash
cd job-find/frontend
npm install -D typescript@^5.3.3
npm install -D @types/node@^20.11.0
npm install -D @types/react@^18.2.48
npm install -D @types/react-dom@^18.2.18
npm install -D tailwindcss@^3.4.1
npm install -D postcss@^8.4.33
npm install -D autoprefixer@^10.4.17
npm install -D eslint@^8.56.0
npm install -D eslint-config-next@^14.1.0
```

---

### Step 1.3.9: Create TypeScript Configuration

**Action:** Create `tsconfig.json` for Next.js

```bash
cd job-find/frontend
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
```

---

### Step 1.3.10: Create Next.js Configuration

**Action:** Create `next.config.js`

```bash
cd job-find/frontend
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig
EOF
```

---

### Step 1.3.11: Create Tailwind Configuration

**Action:** Create `tailwind.config.ts` with design tokens from SPEC.md

```bash
cd job-find/frontend
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A2540',
        secondary: '#00D4AA',
        accent: '#635BFF',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        'text-primary': '#1E293B',
        'text-secondary': '#64748B',
        error: '#DC2626',
        warning: '#F59E0B',
        success: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'card': '8px',
        'modal': '12px',
        'pill': '24px',
      },
    },
  },
  plugins: [],
}
export default config
EOF
```

---

### Step 1.3.12: Create PostCSS Configuration

**Action:** Create `postcss.config.js`

```bash
cd job-find/frontend
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
```

---

### Step 1.3.13: Create Environment File

**Action:** Create `.env.local` for frontend environment variables

```bash
cd job-find/frontend
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
```

---

### Step 1.3.14: Create Global Styles

**Action:** Create basic `globals.css` with Tailwind directives

```bash
cd job-find/frontend
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --primary: #0A2540;
    --secondary: #00D4AA;
    --accent: #635BFF;
    --background: #F8FAFC;
    --surface: #FFFFFF;
    --text-primary: #1E293B;
    --text-secondary: #64748B;
  }

  body {
    @apply bg-background text-text-primary antialiased;
  }
}

@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
EOF
```

---

### Step 1.3.15: Create Root Layout

**Action:** Create basic `layout.tsx` with fonts and Toaster

```bash
cd job-find/frontend
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'JobFind - AI-Powered Job Search',
  description: 'Privacy-first AI-powered job matching platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0A2540',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
EOF
```

---

### Step 1.3.16: Create Root Page (Placeholder)

**Action:** Create placeholder `page.tsx`

```bash
cd job-find/frontend
cat > src/app/page.tsx << 'EOF'
export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">JobFind</h1>
        <p className="text-text-secondary mt-2">AI-Powered Job Search</p>
      </div>
    </main>
  )
}
EOF
```

---

### Step 1.3.17: Update package.json with Dependencies

**Action:** Update frontend package.json to reflect all installed packages

```bash
cd job-find/frontend
cat > package.json << 'EOF'
{
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.17.0",
    "zustand": "^4.5.0",
    "axios": "^1.6.5",
    "zod": "^3.22.4",
    "react-hook-form": "^7.50.0",
    "@hookform/resolvers": "^3.3.4",
    "framer-motion": "^10.18.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.323.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-toast": "^1.1.5",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.33",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0"
  }
}
EOF
```

---

## Verification Steps

```bash
cd job-find/frontend

# Check files exist
ls -la

# Verify Next.js version
npx next --version

# Try building (should succeed with placeholder)
npm run build
```

---

## Expected Result

```
frontend/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── .env.local
├── .gitignore
├── node_modules/
└── src/
    └── app/
        ├── globals.css
        ├── layout.tsx
        └── page.tsx
```

---

## Notes

- Uses Next.js 14 with App Router
- Tailwind configured with design tokens from SPEC.md
- shadcn/ui components will be added as needed in later modules
- Global CSS with Tailwind directives and custom animations
- Google Fonts (Inter + JetBrains Mono) configured

---

## Ready to Proceed?

If this plan looks good, say "approve" and I will implement module 1.3.

If you want changes, tell me what to modify.