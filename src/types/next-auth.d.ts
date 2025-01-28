import type { Role } from '@/lib/types'
import 'next-auth'

declare module 'next-auth' {
  interface User {
    role: Role | undefined | unknown
  }
  interface Session {
    user: {
      role: Role | undefined | unknown
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role | undefined | unknown
  }
}