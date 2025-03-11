import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/lib/auth";
import getUserByEmail from "@/actions/login";

export type User = {
	email: string
	name: string
	image: string | null;
	role: string;
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth()
	const user = session?.user as User
	let dataUser: User | null = null
	if (session) {
		dataUser = await getUserByEmail(user.email)
	}
	return (
		<main>
			<SidebarProvider>
				{dataUser && <AppSidebar userData={dataUser} />}
				{children}
			</SidebarProvider>
		</main>
	);
}
