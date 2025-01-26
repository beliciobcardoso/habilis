import { Card, CardContent } from "@/components/ui/card"

export function StatusCard() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="mb-8 border-2 border-purple-200 rounded-xl">
        <CardContent className="p-6">
          <div className="flex flex-col justify-between items-center">
            <p className="text-center">ENTREGA COMPATIBILIZAÇÃO R04 (03/02/25)</p>
            <p className="text-center">FALTAM 12 DIAS</p>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-8 border-2 border-purple-200 rounded-xl">
        <CardContent className="p-6">
          <div className="flex flex-col justify-between items-center">
            <p className="text-center">VOCÊ TEM (3) APONTAMENTOS EM PROJETOS</p>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-8 border-2 border-purple-200 rounded-xl">
        <CardContent className="p-6">
          <div className="flex flex-col justify-between items-center">
            <p className="text-center">PROJETOS APROVADOS 12/15</p>
            <p className="text-center">NOS ÚLTIMOS 90 DIAS</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

