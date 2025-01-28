'use server'
import { prisma } from "@/lib/db/prisma"

export default  async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (!user) {
    return null
  }

  return user
}