export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Cabeçalhos CORS para permitir requisições locais e de produção
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Responder a requisições de preflight (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. REST API - Obter Cardápio (GET)
    if (url.pathname === '/api/cardapio' && request.method === 'GET') {
      const data = await env.cardapio_dubai.get('cardapio_data');
      return new Response(data || JSON.stringify({ categorias: [], itens: [] }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // 2. REST API - Salvar/Atualizar Cardápio (POST)
    if (url.pathname === '/api/cardapio' && request.method === 'POST') {
      try {
        const body = await request.text();
        // Valida se o corpo enviado é um JSON válido
        JSON.parse(body);
        
        // Salva no KV cardapio_dubai
        await env.cardapio_dubai.put('cardapio_data', body);

        return new Response(JSON.stringify({ success: true }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'JSON inválido ou erro ao gravar no KV' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }

    // 3. Servir arquivos estáticos (HTML, imagens, etc.)
    return env.ASSETS ? env.ASSETS.fetch(request) : new Response('Not Found', { status: 404 });
  }
};