import { Card } from "@/components/ui/card"
import { BarChart3, FileText, Building2 } from "lucide-react"
import Image from "next/image"

export default function Page2() {
  return (
    <div className="min-h-screen p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <h1 className="mb-8 text-2xl font-bold tracking-tight">{"GERENCIAMENTO DE PROJETOS > PLANEJAMENTO DE ATIVIDADES"}</h1>

      {/* Navigation Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:border-purple-400">
          <div className="rounded-lg bg-gray-100 p-2">
            <BarChart3 className="h-6 w-6" />
          </div>
          <span className="font-semibold">GRÁFICO DE GANTT</span>
        </Card>

        <Card className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:border-purple-400">
          <div className="rounded-lg bg-gray-100 p-2">
            <FileText className="h-6 w-6" />
          </div>
          <span className="font-semibold">LINHA DE BALANÇO</span>
        </Card>

        <Card className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:border-purple-400">
          <div className="rounded-lg bg-gray-100 p-2">
            <Building2 className="h-6 w-6" />
          </div>
          <span className="font-semibold">CARDS DE ATIVIDADES</span>
        </Card>
      </div>

      {/* Visualization Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden p-2">
            <div className="relative aspect-[4/3]">
              <Image
                src={"/card22.png"}
                alt={"Visualization"}
                fill
                className="object-cover"
              />
            </div>
          </Card>
          <Card className="overflow-hidden p-2">
            <div className="relative aspect-[4/3]">
              <Image
                src={"/card21.png"}
                alt={"Visualization"}
                fill
                className="object-cover"
              />
            </div>
          </Card>
          <Card className="overflow-hidden p-2">
            <div className="relative aspect-[4/3]">
              <Image
                src={"/card.png"}
                alt={"Visualization"}
                fill
                className="object-cover"
              />
            </div>
          </Card>
          <Card className="overflow-hidden p-2">
            <div className="relative aspect-[4/3]">
              <Image
                src={"/card22.png"}
                alt={"Visualization"}
                fill
                className="object-cover"
              />
            </div>
          </Card>
          <Card className="overflow-hidden p-2">
            <div className="relative aspect-[4/3]">
              <Image
                src={"/card21.png"}
                alt={"Visualization"}
                fill
                className="object-cover"
              />
            </div>
          </Card>
      </div>
    </div>
  )
}

