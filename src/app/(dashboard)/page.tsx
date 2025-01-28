import { StatusCard } from "./_components/status-card"
import { MenuGrid } from "./_components/menu-grid"
import { Footer } from "./_components/footer"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <main className="min-h-screen p-6 md:p-8 max-w-4xl mx-auto">
      <StatusCard />
      <Separator />
      <MenuGrid />
      <Footer />
    </main>
  )
}