import { StatusCard } from "./_components/status-card"
import { MenuGrid } from "./_components/menu-grid"
import { Footer } from "./_components/footer"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-8 max-w-4xl mx-auto">
      <StatusCard />
      <Separator />
      <MenuGrid />
      <Footer />
    </main>
  )
}