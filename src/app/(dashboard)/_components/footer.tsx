import Image from "next/image"

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-1 mt-8 text-sm text-gray-500">
      <Image 
        src="/11.svg"
        alt="Logo"
        width={200}
        height={200}
        className="opacity-80"
      />
    </footer>
  )
}

