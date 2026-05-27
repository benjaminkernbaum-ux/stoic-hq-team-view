/**
 * ═══════════════════════════════════════════════════════════
 * 🎙️ DESENHOS ANIMADOS THIAGERA — Cliente ElevenLabs
 * ═══════════════════════════════════════════════════════════
 * 
 * Cliente para a API da ElevenLabs — geração de fala (TTS),
 * listagem de vozes e efeitos sonoros.
 * 
 * Variáveis de ambiente necessárias:
 *   ELEVENLABS_API_KEY — chave de API da ElevenLabs
 */

// ── Configuração ──
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const BASE_URL = 'https://api.elevenlabs.io/v1';

// ── Constantes de retry ──
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

// ══════════════════════════════════════════════════════════
// 🔧 Funções Utilitárias
// ══════════════════════════════════════════════════════════

/**
 * Gera timestamp formatado para logs.
 * @returns {string} Timestamp ISO
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
  console.log(`${emoji} [${timestamp()}] [ElevenLabs] ${message}`);
}

/**
 * Verifica se a API key está configurada.
 * @throws {Error} Se ELEVENLABS_API_KEY não estiver definida
 */
function validateApiKey() {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY não está configurada. Defina no arquivo .env');
  }
}

/**
 * Aguarda um tempo especificado (backoff entre retries).
 * @param {number} ms — Milissegundos para aguardar
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Monta os headers padrão para a API da ElevenLabs.
 * @param {boolean} isJson — Se o body é JSON (padrão: true)
 * @returns {object} Headers com autenticação
 */
function getHeaders(isJson = true) {
  const headers = {
    'xi-api-key': ELEVENLABS_API_KEY,
  };
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

/**
 * Faz requisição HTTP com retry e backoff exponencial.
 * 
 * @param {string} url — URL da requisição
 * @param {object} options — Opções do fetch
 * @param {string} responseType — Tipo de resposta esperada ('json' ou 'buffer')
 * @param {number} retries — Número máximo de tentativas
 * @returns {Promise<object|Buffer>}
 */
async function fetchWithRetry(url, options, responseType = 'json', retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      log('📡', `Requisição (tentativa ${attempt}/${retries}): ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, options);

      // Tratamento de erros HTTP
      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Sem detalhes');
        const errorMsg = `HTTP ${response.status}: ${response.statusText} — ${errorBody}`;

        // Erros 4xx (exceto 429 Rate Limit) não fazem retry
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw new Error(`Erro do cliente: ${errorMsg}`);
        }

        throw new Error(`Erro do servidor: ${errorMsg}`);
      }

      // Retorna de acordo com o tipo esperado
      if (responseType === 'buffer') {
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }

      return await response.json();

    } catch (err) {
      log('⚠️', `Tentativa ${attempt} falhou: ${err.message}`);

      if (attempt === retries) {
        log('❌', `Todas as ${retries} tentativas falharam`);
        throw err;
      }

      // Backoff exponencial
      const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
      log('⏳', `Aguardando ${backoffMs}ms antes da próxima tentativa...`);
      await sleep(backoffMs);
    }
  }
}

// ══════════════════════════════════════════════════════════
// 🗣️ Text-to-Speech (TTS)
// ══════════════════════════════════════════════════════════

/**
 * Gera fala a partir de texto usando uma voz específica.
 * Usa o modelo multilingual v2 que suporta PT-BR nativamente.
 * 
 * @param {string} text — Texto a ser convertido em fala (PT-BR)
 * @param {string} voiceId — ID da voz na ElevenLabs
 * @param {object} options — Opções de geração
 * @param {string} [options.model_id] — Modelo TTS (padrão: eleven_multilingual_v2)
 * @param {number} [options.stability] — Estabilidade da voz (0-1, padrão: 0.5)
 * @param {number} [options.similarity_boost] — Boost de similaridade (0-1, padrão: 0.75)
 * @param {number} [options.style] — Expressividade do estilo (0-1, padrão: 0.5)
 * @param {string} [options.output_format] — Formato de saída (padrão: mp3_44100_128)
 * @returns {Promise<Buffer>} Buffer de áudio MP3
 */
export async function textToSpeech(text, voiceId, options = {}) {
  validateApiKey();

  if (!text || !voiceId) {
    throw new Error('text e voiceId são obrigatórios para text-to-speech');
  }

  log('🗣️', `Gerando fala para voz: ${voiceId}`);
  log('📝', `Texto (${text.length} chars): "${text.substring(0, 80)}..."`);

  const modelId = options.model_id || 'eleven_multilingual_v2';
  const outputFormat = options.output_format || 'mp3_44100_128';

  const payload = {
    text,
    model_id: modelId,
    voice_settings: {
      stability: options.stability ?? 0.5,
      similarity_boost: options.similarity_boost ?? 0.75,
      style: options.style ?? 0.5,
      use_speaker_boost: true,
    },
  };

  const url = `${BASE_URL}/text-to-speech/${voiceId}?output_format=${outputFormat}`;

  const audioBuffer = await fetchWithRetry(url, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  }, 'buffer');

  const sizeKB = (audioBuffer.length / 1024).toFixed(1);
  log('✅', `Áudio gerado com sucesso — ${sizeKB} KB`);

  return audioBuffer;
}

// ══════════════════════════════════════════════════════════
// 📋 Listar Vozes Disponíveis
// ══════════════════════════════════════════════════════════

/**
 * Lista todas as vozes disponíveis na conta ElevenLabs.
 * Inclui vozes padrão e vozes clonadas.
 * 
 * @returns {Promise<Array<{voice_id: string, name: string, labels: object, preview_url: string}>>}
 */
export async function getVoices() {
  validateApiKey();

  log('📋', 'Listando vozes disponíveis...');

  const result = await fetchWithRetry(`${BASE_URL}/voices`, {
    method: 'GET',
    headers: getHeaders(false),
  });

  const voices = (result.voices || []).map((voice) => ({
    voice_id: voice.voice_id,
    name: voice.name,
    category: voice.category || 'unknown',
    labels: voice.labels || {},
    preview_url: voice.preview_url || null,
    description: voice.description || '',
  }));

  log('✅', `${voices.length} vozes encontradas`);

  return voices;
}

// ══════════════════════════════════════════════════════════
// 🔊 Geração de Efeitos Sonoros (SFX)
// ══════════════════════════════════════════════════════════

/**
 * Gera efeito sonoro a partir de uma descrição em texto.
 * Usa o endpoint de Sound Generation da ElevenLabs.
 * 
 * @param {string} description — Descrição do efeito sonoro desejado
 *   Exemplos: "footsteps on gravel", "thunder rumbling", "cartoon boing"
 * @param {number} [duration] — Duração aproximada em segundos (padrão: 3)
 * @returns {Promise<Buffer>} Buffer de áudio do efeito sonoro
 */
export async function generateSFX(description, duration = 3) {
  validateApiKey();

  if (!description) {
    throw new Error('description é obrigatória para geração de SFX');
  }

  log('🔊', `Gerando efeito sonoro: "${description}"`);
  log('⏱️', `Duração solicitada: ${duration}s`);

  const payload = {
    text: description,
    duration_seconds: duration,
  };

  const audioBuffer = await fetchWithRetry(`${BASE_URL}/sound-generation`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  }, 'buffer');

  const sizeKB = (audioBuffer.length / 1024).toFixed(1);
  log('✅', `Efeito sonoro gerado com sucesso — ${sizeKB} KB`);

  return audioBuffer;
}

// ══════════════════════════════════════════════════════════
// 📊 Informações do Serviço
// ══════════════════════════════════════════════════════════

/**
 * Retorna informações sobre o cliente ElevenLabs.
 * Útil para debug e documentação.
 */
export function getServiceInfo() {
  return {
    name: 'ElevenLabs',
    configured: !!ELEVENLABS_API_KEY,
    baseUrl: BASE_URL,
    features: [
      'text-to-speech (multilingual v2 — PT-BR)',
      'voice listing',
      'sound effects generation',
    ],
    defaultModel: 'eleven_multilingual_v2',
    defaultVoiceSettings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.5,
    },
  };
}
