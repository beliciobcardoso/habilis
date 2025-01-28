'use server'
import bcrypt from 'bcryptjs'
import { prisma } from "@/lib/db/prisma"

export default  async function Register(name: string, email: string, password: string): Promise<{
    id?: string;
    email?: string;
    name?: string;
} | null> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (user) {
        return {email: "Email already registered"}
    }

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword
        }
    })

    
    return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
    }
}