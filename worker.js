export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // REST API - Obter Cardápio
    if (url.pathname === '/api/cardapio' && request.method === 'GET') {
      const data = await env.cardapio_dubai.get('cardapio_data');
      return new Response(data || JSON.stringify({ categorias: [], itens: [] }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // REST API - Salvar/Atualizar Cardápio
    if (url.pathname === '/api/cardapio' && request.method === 'POST') {
      try {
        const body = await request.text();
        // Valida se é um JSON válido
        JSON.parse(body);
        await env.cardapio_dubai.put('cardapio_data', body);
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'JSON inválido ou erro no KV' }), { status: 400 });
      }
    }

    // Se estiver usando Cloudflare Pages ou Workers Assets, repassa requisições comuns
    return env.ASSETS ? env.ASSETS.fetch(request) : fetch(request);
  }
};