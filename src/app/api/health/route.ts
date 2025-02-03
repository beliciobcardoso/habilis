export async function GET() {
    return new Response(JSON.stringify({ status: 'ok', message: 'API de saúde está funcionando corretamente.' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }