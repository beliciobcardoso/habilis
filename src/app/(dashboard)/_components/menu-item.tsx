import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image";
import Link from "next/link";

interface MenuItemProps {
  href: string
  src: string
  title: string
  isActive?: boolean
}

export function MenuItem({ href, src, title, isActive }: MenuItemProps) {
  return (
   <Link href={href}>
    <Card className={`transition-colors hover:border-purple-400 ${isActive ? 'border-2 border-purple-500' : ''}`}>
      <CardContent className="flex items-center gap-3 p-4">
        <Image src={src} alt="Icon" width={70} height={70} />
        <span className="font-medium">{title}</span>
      </CardContent>
    </Card>
   </Link>
  )
}

