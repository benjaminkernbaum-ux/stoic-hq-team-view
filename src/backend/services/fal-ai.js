/**
 * ═══════════════════════════════════════════════════════════
 * 🎨 DESENHOS ANIMADOS THIAGERA — Cliente Fal.ai
 * ═══════════════════════════════════════════════════════════
 * 
 * Cliente para a API da Fal.ai usando fetch nativo (Node 22+).
 * Suporta geração de vídeo (Kling 3.0, Wan 2.7) e imagens (Flux Dev).
 * 
 * Variáveis de ambiente necessárias:
 *   FAL_API_KEY — chave de API da Fal.ai
 */

// ── Configuração ──
const FAL_API_KEY = process.env.FAL_API_KEY;
const BASE_URL = 'https://queue.fal.run';

// ── Constantes de retry ──
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000; // 1 segundo

// ══════════════════════════════════════════════════════════
// 🔧 Funções Utilitárias
// ══════════════════════════════════════════════════════════

/**
 * Gera timestamp formatado para logs.
 * @returns {string} Timestamp no formato ISO
 */
function timestamp() {
  return new Date().toISOString();
}

/**
 * Log padronizado com emoji e timestamp.
 * @param {string} emoji — Emoji indicador
 * @param {string} message — Mensagem do log
 */
function log(emoji, message) {
  console.log(`${emoji} [${timestamp()}] [Fal.ai] ${message}`);
}

/**
 * Verifica se a API key está configurada.
 * @throws {Error} Se FAL_API_KEY não estiver definida
 */
function validateApiKey() {
  if (!FAL_API_KEY) {
    throw new Error('FAL_API_KEY não está configurada. Defina no arquivo .env');
  }
}

/**
 * Aguarda um tempo especificado (para backoff entre retries).
 * @param {number} ms — Milissegundos para aguardar
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Faz uma requisição HTTP com retry e exponential backoff.
 * 
 * @param {string} url — URL completa da requisição
 * @param {object} options — Opções do fetch (method, headers, body)
 * @param {number} retries — Número de tentativas restantes
 * @returns {Promise<object>} Resposta parseada como JSON
 */
async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      log('📡', `Requisição (tentativa ${attempt}/${retries}): ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, options);

      // Se a resposta não for OK, tenta extrair detalhes do erro
      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Sem detalhes');
        const errorMsg = `HTTP ${response.status}: ${response.statusText} — ${errorBody}`;

        // Erros 4xx (exceto 429) não devem fazer retry
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw new Error(`Erro do cliente: ${errorMsg}`);
        }

        throw new Error(`Erro do servidor: ${errorMsg}`);
      }

      // Verifica se a resposta tem conteúdo
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return await response.json();
      }

      // Retorna texto se não for JSON
      return { raw: await response.text() };

    } catch (err) {
      log('⚠️', `Tentativa ${attempt} falhou: ${err.message}`);

      // Se for a última tentativa, propaga o erro
      if (attempt === retries) {
        log('❌', `Todas as ${retries} tentativas falharam`);
        throw err;
      }

      // Espera com backoff exponencial antes da próxima tentativa
      const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
      log('⏳', `Aguardando ${backoffMs}ms antes da próxima tentativa...`);
      await sleep(backoffMs);
    }
  }
}

/**
 * Monta os headers padrão para a API da Fal.ai.
 * @returns {object} Headers com autenticação e content-type
 */
function getHeaders() {
  return {
    'Authorization': `Key ${FAL_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

// ══════════════════════════════════════════════════════════
// 🎬 Geração de Vídeo (Text-to-Video)
// ══════════════════════════════════════════════════════════

/**
 * Gera um vídeo a partir de um prompt de texto.
 * 
 * @param {string} prompt — Descrição do vídeo desejado
 * @param {object} options — Opções adicionais
 * @param {string} [options.model] — Modelo a usar (padrão: Kling 3.0 Pro)
 * @param {number} [options.duration] — Duração em segundos (5 ou 10)
 * @param {string} [options.aspect_ratio] — Proporção (16:9, 9:16, 1:1)
 * @param {string} [options.resolution] — Resolução (720p, 1080p)
 * @returns {Promise<{requestId: string, status: string, videoUrl: string|null}>}
 */
export async function generateVideo(prompt, options = {}) {
  validateApiKey();

  const model = options.model || 'fal-ai/kling-video/v3/pro/text-to-video';

  log('🎬', `Gerando vídeo com modelo: ${model}`);
  log('📝', `Prompt: "${prompt.substring(0, 100)}..."`);

  const payload = {
    prompt,
    ...(options.duration && { duration: options.duration }),
    ...(options.aspect_ratio && { aspect_ratio: options.aspect_ratio }),
    ...(options.resolution && { resolution: options.resolution }),
  };

  const result = await fetchWithRetry(`${BASE_URL}/${model}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  log('✅', `Vídeo enfileirado — Request ID: ${result.request_id || 'N/A'}`);

  return {
    requestId: result.request_id || null,
    status: result.status || 'IN_QUEUE',
    videoUrl: result.video?.url || result.output?.video?.url || null,
    raw: result,
  };
}

// ══════════════════════════════════════════════════════════
// 🖼️➡🎬 Imagem para Vídeo (Image-to-Video)
// ══════════════════════════════════════════════════════════

/**
 * Gera um vídeo a partir de uma imagem de referência + prompt.
 * 
 * @param {string} imageUrl — URL da imagem de referência
 * @param {string} prompt — Descrição do movimento/ação desejada
 * @param {object} options — Opções adicionais
 * @param {string} [options.model] — Modelo (padrão: Kling 3.0 Pro Image-to-Video)
 * @param {number} [options.duration] — Duração em segundos
 * @param {string} [options.aspect_ratio] — Proporção
 * @returns {Promise<{requestId: string, status: string, videoUrl: string|null}>}
 */
export async function imageToVideo(imageUrl, prompt, options = {}) {
  validateApiKey();

  const model = options.model || 'fal-ai/kling-video/v3/pro/image-to-video';

  log('🖼️➡🎬', `Convertendo imagem para vídeo com modelo: ${model}`);
  log('🔗', `Imagem: ${imageUrl}`);
  log('📝', `Prompt: "${prompt.substring(0, 100)}..."`);

  const payload = {
    image_url: imageUrl,
    prompt,
    ...(options.duration && { duration: options.duration }),
    ...(options.aspect_ratio && { aspect_ratio: options.aspect_ratio }),
  };

  const result = await fetchWithRetry(`${BASE_URL}/${model}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  log('✅', `Image-to-Video enfileirado — Request ID: ${result.request_id || 'N/A'}`);

  return {
    requestId: result.request_id || null,
    status: result.status || 'IN_QUEUE',
    videoUrl: result.video?.url || result.output?.video?.url || null,
    raw: result,
  };
}

// ══════════════════════════════════════════════════════════
// 🎨 Geração de Imagem (Text-to-Image)
// ══════════════════════════════════════════════════════════

/**
 * Gera uma imagem a partir de um prompt de texto usando Flux Dev.
 * 
 * @param {string} prompt — Descrição da imagem desejada
 * @param {object} options — Opções adicionais
 * @param {string} [options.model] — Modelo (padrão: Flux Dev)
 * @param {string} [options.image_size] — Tamanho da imagem (ex: "landscape_16_9")
 * @param {number} [options.num_images] — Número de imagens a gerar (padrão: 1)
 * @param {number} [options.num_inference_steps] — Passos de inferência
 * @param {number} [options.guidance_scale] — Escala de guidance
 * @returns {Promise<{images: Array<{url: string, width: number, height: number}>}>}
 */
export async function generateImage(prompt, options = {}) {
  validateApiKey();

  const model = options.model || 'fal-ai/flux/dev';

  log('🎨', `Gerando imagem com modelo: ${model}`);
  log('📝', `Prompt: "${prompt.substring(0, 100)}..."`);

  const payload = {
    prompt,
    image_size: options.image_size || 'landscape_16_9',
    num_images: options.num_images || 1,
    ...(options.num_inference_steps && { num_inference_steps: options.num_inference_steps }),
    ...(options.guidance_scale && { guidance_scale: options.guidance_scale }),
  };

  const result = await fetchWithRetry(`${BASE_URL}/${model}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  // Normaliza a resposta — Flux retorna em formatos ligeiramente diferentes
  const images = result.images || result.output?.images || [];

  log('✅', `${images.length} imagem(ns) gerada(s) com sucesso`);

  return {
    images: images.map((img) => ({
      url: img.url || img,
      width: img.width || null,
      height: img.height || null,
    })),
    raw: result,
  };
}

// ══════════════════════════════════════════════════════════
// 🔍 Verificar Status de Requisição
// ══════════════════════════════════════════════════════════

/**
 * Verifica o status de uma requisição assíncrona na Fal.ai.
 * 
 * @param {string} requestId — ID da requisição retornado pela API
 * @param {string} model — Nome do modelo usado na requisição original
 * @returns {Promise<{status: string, result: object|null}>}
 */
export async function checkStatus(requestId, model) {
  validateApiKey();

  if (!requestId) {
    throw new Error('requestId é obrigatório para verificar status');
  }

  if (!model) {
    throw new Error('model é obrigatório para verificar status');
  }

  log('🔍', `Verificando status — Request ID: ${requestId}`);

  const statusUrl = `${BASE_URL}/${model}/requests/${requestId}/status`;

  const result = await fetchWithRetry(statusUrl, {
    method: 'GET',
    headers: getHeaders(),
  });

  const status = result.status || 'UNKNOWN';
  log('📊', `Status atual: ${status}`);

  // Se concluído, busca o resultado
  if (status === 'COMPLETED') {
    const resultUrl = `${BASE_URL}/${model}/requests/${requestId}`;
    const fullResult = await fetchWithRetry(resultUrl, {
      method: 'GET',
      headers: getHeaders(),
    });

    log('✅', 'Resultado disponível!');
    return { status: 'COMPLETED', result: fullResult };
  }

  return {
    status,
    result: null,
    ...(result.queue_position !== undefined && { queuePosition: result.queue_position }),
  };
}

// ══════════════════════════════════════════════════════════
// 📊 Exportação de informações do módulo
// ══════════════════════════════════════════════════════════

/**
 * Retorna informações sobre o cliente e modelos disponíveis.
 * Útil para debug e documentação.
 */
export function getServiceInfo() {
  return {
    name: 'Fal.ai',
    configured: !!FAL_API_KEY,
    baseUrl: BASE_URL,
    models: {
      textToVideo: [
        'fal-ai/kling-video/v3/pro/text-to-video',
        'fal-ai/wan/v2.1/text-to-video',
      ],
      imageToVideo: [
        'fal-ai/kling-video/v3/pro/image-to-video',
        'fal-ai/wan/v2.1/image-to-video',
      ],
      textToImage: [
        'fal-ai/flux/dev',
        'fal-ai/flux/pro',
      ],
    },
  };
}
