import Image from "next/image"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Page4() {
    const session = await auth();
  if (!session?.user) redirect("/login");
    return (
        <div className="min-h-screen p-6 md:p-8 max-w-4xl mx-auto">
            {/* Header Section */}
            <h1 className="mb-8 text-2xl font-bold tracking-tight">{"GESTÃO DE CUSTOS > TRANSAÇÕES"}</h1>
            <div className="flex justify-center">
                <Image
                    src={"/page4.png"}
                    alt={"Visualization"}
                    width={800}
                    height={800}               
                    className="object-cover"
                />
            </div>
        </div>
    )
}

