/**
 * ═══════════════════════════════════════════════════════════
 * 📺 DESENHOS ANIMADOS THIAGERA — Cliente YouTube
 * ═══════════════════════════════════════════════════════════
 * 
 * Cliente para YouTube Data API v3 usando googleapis.
 * Suporta upload de vídeos, atualização de metadados e analytics.
 * 
 * Variáveis de ambiente necessárias:
 *   YOUTUBE_CLIENT_ID — Client ID do OAuth2
 *   YOUTUBE_CLIENT_SECRET — Client Secret do OAuth2
 *   YOUTUBE_REFRESH_TOKEN — Refresh Token para renovar acesso
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// ── Configuração OAuth2 ──
const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const YOUTUBE_REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;

// ── Categoria padrão: Film & Animation ──
const DEFAULT_CATEGORY_ID = '1';

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
  console.log(`${emoji} [${timestamp()}] [YouTube] ${message}`);
}

/**
 * Verifica se as credenciais OAuth2 estão configuradas.
 * @throws {Error} Se alguma credencial estiver faltando
 */
function validateCredentials() {
  if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET || !YOUTUBE_REFRESH_TOKEN) {
    throw new Error(
      'Credenciais YouTube não configuradas. Defina YOUTUBE_CLIENT_ID, ' +
      'YOUTUBE_CLIENT_SECRET e YOUTUBE_REFRESH_TOKEN no .env'
    );
  }
}

/**
 * Cria e retorna um cliente OAuth2 autenticado.
 * Usa refresh token para obter access token automaticamente.
 * 
 * @returns {import('googleapis').Auth.OAuth2Client} Cliente OAuth2
 */
function getAuthClient() {
  validateCredentials();

  const oauth2Client = new google.auth.OAuth2(
    YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET,
    'http://localhost:3001/oauth2callback' // Redirect URI (não usado com refresh token)
  );

  // Define o refresh token — googleapis renova o access token automaticamente
  oauth2Client.setCredentials({
    refresh_token: YOUTUBE_REFRESH_TOKEN,
  });

  return oauth2Client;
}

/**
 * Retorna instância autenticada da YouTube Data API v3.
 * @returns {import('googleapis').youtube_v3.Youtube} API YouTube
 */
function getYouTubeClient() {
  const auth = getAuthClient();
  return google.youtube({ version: 'v3', auth });
}

// ══════════════════════════════════════════════════════════
// 📤 Upload de Vídeo
// ══════════════════════════════════════════════════════════

/**
 * Faz upload de um vídeo para o YouTube com tracking de progresso.
 * 
 * @param {string} filePath — Caminho absoluto do arquivo de vídeo
 * @param {object} metadata — Metadados do vídeo
 * @param {string} metadata.title — Título do vídeo
 * @param {string} metadata.description — Descrição do vídeo
 * @param {string[]} [metadata.tags] — Tags do vídeo
 * @param {string} [metadata.categoryId] — Categoria (padrão: 1 = Film & Animation)
 * @param {string} [metadata.privacyStatus] — Status (public/private/unlisted, padrão: private)
 * @param {string} [metadata.defaultLanguage] — Idioma (padrão: pt-BR)
 * @param {function} [onProgress] — Callback de progresso (recebe { bytesRead, totalBytes, percent })
 * @returns {Promise<{videoId: string, videoUrl: string, status: object}>}
 */
export async function uploadVideo(filePath, metadata, onProgress = null) {
  validateCredentials();

  // Verifica se o arquivo existe
  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo de vídeo não encontrado: ${filePath}`);
  }

  const fileSize = fs.statSync(filePath).size;
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(1);

  log('📤', `Iniciando upload: "${metadata.title}"`);
  log('📁', `Arquivo: ${path.basename(filePath)} (${fileSizeMB} MB)`);

  const youtube = getYouTubeClient();

  // Monta o recurso do vídeo com metadados
  const resource = {
    snippet: {
      title: metadata.title,
      description: metadata.description || '',
      tags: metadata.tags || ['desenhos animados', 'thiagera', 'animação', 'cartoon'],
      categoryId: metadata.categoryId || DEFAULT_CATEGORY_ID,
      defaultLanguage: metadata.defaultLanguage || 'pt-BR',
      defaultAudioLanguage: metadata.defaultLanguage || 'pt-BR',
    },
    status: {
      privacyStatus: metadata.privacyStatus || 'private',
      selfDeclaredMadeForKids: true, // Conteúdo infantil
      embeddable: true,
    },
  };

  // Cria o stream de leitura para tracking de progresso
  const fileStream = fs.createReadStream(filePath);
  let bytesRead = 0;

  // Tracking de progresso
  fileStream.on('data', (chunk) => {
    bytesRead += chunk.length;
    const percent = ((bytesRead / fileSize) * 100).toFixed(1);

    if (onProgress) {
      onProgress({ bytesRead, totalBytes: fileSize, percent: parseFloat(percent) });
    }

    // Log a cada 10%
    if (parseInt(percent) % 10 === 0) {
      log('📊', `Progresso do upload: ${percent}%`);
    }
  });

  try {
    // Executa o upload
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: resource,
      media: {
        body: fileStream,
      },
    });

    const videoId = response.data.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    log('✅', `Upload concluído com sucesso!`);
    log('🔗', `URL: ${videoUrl}`);
    log('🆔', `Video ID: ${videoId}`);

    return {
      videoId,
      videoUrl,
      status: response.data.status,
      snippet: response.data.snippet,
    };
  } catch (err) {
    log('❌', `Falha no upload: ${err.message}`);
    throw err;
  }
}

// ══════════════════════════════════════════════════════════
// ✏️ Atualizar Metadados
// ══════════════════════════════════════════════════════════

/**
 * Atualiza metadados de um vídeo já publicado no YouTube.
 * 
 * @param {string} videoId — ID do vídeo no YouTube
 * @param {object} metadata — Metadados a atualizar
 * @param {string} [metadata.title] — Novo título
 * @param {string} [metadata.description] — Nova descrição
 * @param {string[]} [metadata.tags] — Novas tags
 * @param {string} [metadata.categoryId] — Nova categoria
 * @returns {Promise<{videoId: string, updated: object}>}
 */
export async function updateMetadata(videoId, metadata) {
  validateCredentials();

  if (!videoId) {
    throw new Error('videoId é obrigatório para atualizar metadados');
  }

  log('✏️', `Atualizando metadados do vídeo: ${videoId}`);

  const youtube = getYouTubeClient();

  // Primeiro busca os metadados atuais para merge
  const current = await youtube.videos.list({
    part: ['snippet'],
    id: [videoId],
  });

  if (!current.data.items || current.data.items.length === 0) {
    throw new Error(`Vídeo não encontrado: ${videoId}`);
  }

  const currentSnippet = current.data.items[0].snippet;

  // Merge dos metadados — mantém os atuais e sobrescreve apenas os fornecidos
  const updatedSnippet = {
    ...currentSnippet,
    ...(metadata.title && { title: metadata.title }),
    ...(metadata.description && { description: metadata.description }),
    ...(metadata.tags && { tags: metadata.tags }),
    ...(metadata.categoryId && { categoryId: metadata.categoryId }),
  };

  const response = await youtube.videos.update({
    part: ['snippet'],
    requestBody: {
      id: videoId,
      snippet: updatedSnippet,
    },
  });

  log('✅', `Metadados atualizados com sucesso`);

  return {
    videoId,
    updated: response.data.snippet,
  };
}

// ══════════════════════════════════════════════════════════
// 📊 Estatísticas do Canal
// ══════════════════════════════════════════════════════════

/**
 * Obtém estatísticas do canal do YouTube autenticado.
 * Inclui: total de inscritos, visualizações e vídeos.
 * 
 * @returns {Promise<{channelId: string, title: string, subscriberCount: number, viewCount: number, videoCount: number}>}
 */
export async function getChannelStats() {
  validateCredentials();

  log('📊', 'Buscando estatísticas do canal...');

  const youtube = getYouTubeClient();

  const response = await youtube.channels.list({
    part: ['snippet', 'statistics'],
    mine: true,
  });

  if (!response.data.items || response.data.items.length === 0) {
    throw new Error('Nenhum canal encontrado para esta conta');
  }

  const channel = response.data.items[0];
  const stats = channel.statistics;

  const result = {
    channelId: channel.id,
    title: channel.snippet.title,
    description: channel.snippet.description,
    customUrl: channel.snippet.customUrl || null,
    subscriberCount: parseInt(stats.subscriberCount, 10) || 0,
    viewCount: parseInt(stats.viewCount, 10) || 0,
    videoCount: parseInt(stats.videoCount, 10) || 0,
    thumbnailUrl: channel.snippet.thumbnails?.high?.url || null,
  };

  log('✅', `Canal: "${result.title}" — ${result.subscriberCount} inscritos, ${result.viewCount} views`);

  return result;
}

// ══════════════════════════════════════════════════════════
// 📈 Estatísticas de Vídeo Individual
// ══════════════════════════════════════════════════════════

/**
 * Obtém estatísticas de um vídeo específico.
 * 
 * @param {string} videoId — ID do vídeo
 * @returns {Promise<{videoId: string, title: string, viewCount: number, likeCount: number, commentCount: number}>}
 */
export async function getVideoStats(videoId) {
  validateCredentials();

  if (!videoId) {
    throw new Error('videoId é obrigatório');
  }

  log('📈', `Buscando estatísticas do vídeo: ${videoId}`);

  const youtube = getYouTubeClient();

  const response = await youtube.videos.list({
    part: ['snippet', 'statistics'],
    id: [videoId],
  });

  if (!response.data.items || response.data.items.length === 0) {
    throw new Error(`Vídeo não encontrado: ${videoId}`);
  }

  const video = response.data.items[0];
  const stats = video.statistics;

  const result = {
    videoId,
    title: video.snippet.title,
    publishedAt: video.snippet.publishedAt,
    viewCount: parseInt(stats.viewCount, 10) || 0,
    likeCount: parseInt(stats.likeCount, 10) || 0,
    commentCount: parseInt(stats.commentCount, 10) || 0,
  };

  log('✅', `"${result.title}" — ${result.viewCount} views, ${result.likeCount} likes`);

  return result;
}

// ══════════════════════════════════════════════════════════
// 📊 Informações do Serviço
// ══════════════════════════════════════════════════════════

/**
 * Retorna informações sobre o cliente YouTube.
 * Útil para debug e documentação.
 */
export function getServiceInfo() {
  return {
    name: 'YouTube Data API v3',
    configured: !!(YOUTUBE_CLIENT_ID && YOUTUBE_CLIENT_SECRET && YOUTUBE_REFRESH_TOKEN),
    features: [
      'upload de vídeo com progress tracking',
      'atualização de metadados',
      'estatísticas do canal',
      'estatísticas de vídeo individual',
    ],
    defaultCategory: `${DEFAULT_CATEGORY_ID} (Film & Animation)`,
    defaultLanguage: 'pt-BR',
  };
}
