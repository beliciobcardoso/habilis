import { Card } from "@/components/ui/card"
import { BarChart3, FileText, Building2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Page3() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <div className="min-h-screen p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <h1 className="mb-8 text-2xl font-bold tracking-tight">{"GESTÃO DE CUSTOS"}</h1>

      {/* Navigation Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:border-purple-400">
          <div className="rounded-lg bg-gray-100 p-2">
            <BarChart3 className="h-6 w-6" />
          </div>
          <span className="font-semibold">SMART CONTRACTS</span>
        </Card>

        <Link href="/page4">
          <Card className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:border-purple-400">
            <div className="rounded-lg bg-gray-100 p-4">
              <FileText className="h-6 w-6" />
            </div>
            <span className="font-semibold">TRANSAÇÕES</span>
          </Card>
        </Link>

        <Card className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:border-purple-400">
          <div className="rounded-lg bg-gray-100 p-2">
            <Building2 className="h-6 w-6" />
          </div>
          <span className="font-semibold">COMPARTILHAR LINK CRIPTOGRAFADO</span>
        </Card>
      </div>

      {/* Visualization Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden p-2">
          <div className="relative aspect-[2/2]">
            <Image
              src={"/gcard01.png"}
              alt={"Visualization "}
              fill
              className="object-cover"
            />
          </div>
        </Card>
        <Card className="overflow-hidden p-2">
          <div className="relative aspect-[2/2]">
            <Image
              src={"/gcard02.png"}
              alt={"Visualization "}
              fill
              className="object-cover"
            />
          </div>
        </Card>
        <Card className="overflow-hidden p-2">
          <div className="relative aspect-[2/2]">
            <Image
              src={"/gcard03.png"}
              alt={"Visualization "}
              fill
              className="object-cover"
            />
          </div>
        </Card>

      </div>
    </div>
  )
}

