import { Car } from 'lucide-react'

export function Header() {
  return (
    <header className="flex items-center gap-2 mb-6">
      <Car className="w-8 h-8 text-purple-600" />
      <h1 className="text-xl font-bold tracking-tight">COCKPIT DE PROJETOS</h1>
    </header>
  )
}

