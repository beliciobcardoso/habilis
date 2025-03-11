import type { Role } from '@/lib/types'
import 'next-auth'

declare module 'next-auth' {
  interface User {
    role: Role | undefined | unknown
    id: string
  }
  interface Session {
    user: {
      role: Role | undefined | unknown
      id: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role | undefined | unknown
    id: string
  }
}