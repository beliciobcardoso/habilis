import { prisma } from "@/lib/db/prisma";

export async function GET() {
	try {
		const result = await prisma.user.findMany();
		
		if (result.length === 0) {
			return new Response(JSON.stringify({ status: 'ok', message: 'Conectado ao banco de dados.' }), {
				status: 200,
				headers: {
				  'Content-Type': 'application/json',
				},
			  });
		}

		if (result) {
			return new Response(JSON.stringify(result), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			});
		} 
	} catch (error) {
		new Response(JSON.stringify(error), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}
