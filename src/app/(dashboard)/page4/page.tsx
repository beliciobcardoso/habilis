import Image from "next/image"

export default function Page4() {
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

