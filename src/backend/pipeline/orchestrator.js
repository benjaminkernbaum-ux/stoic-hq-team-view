/**
 * ═══════════════════════════════════════════════════════════
 * 🎬 DESENHOS ANIMADOS THIAGERA — Orquestrador de Produção
 * ═══════════════════════════════════════════════════════════
 * 
 * Pipeline completo de produção de um episódio de animação.
 * Coordena todas as etapas desde a geração de roteiro até
 * o upload para o YouTube.
 * 
 * Cada etapa é uma função stub que loga o que faria e
 * retorna dados mock. Conforme os serviços forem integrados,
 * substituiremos os mocks pelas chamadas reais.
 * 
 * Pipeline sequencial:
 *   1. Gerar roteiro
 *   2. Gerar storyboard
 *   3. Gerar referências de personagens
 *   4. Gerar cenas visuais
 *   5. Gerar vídeos das cenas
 *   6. Gerar vozes/diálogos
 *   7. Gerar música de fundo
 *   8. Compor vídeo final
 *   9. Upload para YouTube
 */

import { EventEmitter } from 'events';

// ══════════════════════════════════════════════════════════
// 🔧 Utilitários
// ══════════════════════════════════════════════════════════

/**
 * Gera timestamp formatado para logs.
 * @returns {string} Timestamp ISO
 */
function timestamp() {
  return new Date().toISOString();
}

/**
 * Log padronizado do pipeline com emoji, timestamp e etapa.
 * @param {string} emoji — Emoji indicador
 * @param {number} step — Número da etapa (1-9)
 * @param {string} message — Mensagem do log
 */
function log(emoji, step, message) {
  const stepLabel = step > 0 ? `[Etapa ${step}/9]` : '[Pipeline]';
  console.log(`${emoji} [${timestamp()}] ${stepLabel} ${message}`);
}

/**
 * Mede o tempo de execução de uma função assíncrona.
 * @param {string} label — Nome da operação
 * @param {Function} fn — Função async a executar
 * @returns {Promise<{result: any, durationMs: number}>}
 */
async function measureTime(label, fn) {
  const start = performance.now();
  const result = await fn();
  const durationMs = Math.round(performance.now() - start);
  const durationSec = (durationMs / 1000).toFixed(1);
  console.log(`⏱️  [${timestamp()}] "${label}" concluído em ${durationSec}s`);
  return { result, durationMs };
}

/**
 * Simula processamento com delay (para modo mock).
 * @param {number} ms — Milissegundos de delay
 * @returns {Promise<void>}
 */
function simulateDelay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ══════════════════════════════════════════════════════════
// 📊 Emitter de Progresso
// ══════════════════════════════════════════════════════════

/**
 * Event emitter para reportar progresso do pipeline.
 * Eventos emitidos:
 *   'progress' — { step, totalSteps, stepName, percent, message }
 *   'step:start' — { step, stepName }
 *   'step:complete' — { step, stepName, durationMs }
 *   'complete' — { totalDurationMs, totalCost }
 *   'error' — { step, stepName, error }
 */
export const pipelineEvents = new EventEmitter();

/**
 * Emite evento de progresso padronizado.
 * @param {number} step — Etapa atual
 * @param {string} stepName — Nome da etapa
 * @param {string} message — Mensagem de progresso
 */
function emitProgress(step, stepName, message) {
  const percent = Math.round((step / 9) * 100);
  pipelineEvents.emit('progress', {
    step,
    totalSteps: 9,
    stepName,
    percent,
    message,
    timestamp: timestamp(),
  });
}

// ══════════════════════════════════════════════════════════
// 📝 Etapa 1 — Gerar Roteiro
// ══════════════════════════════════════════════════════════

/**
 * Gera o roteiro do episódio a partir do conceito.
 * [STUB] Retorna roteiro mock — será substituído por chamada à LLM.
 * 
 * @param {string} concept — Conceito/ideia do episódio
 * @returns {Promise<object>} Roteiro gerado
 */
async function generateScript(concept) {
  log('📝', 1, `Gerando roteiro para conceito: "${concept}"`);
  emitProgress(1, 'generateScript', 'Gerando roteiro do episódio...');

  await simulateDelay(300);

  // Mock: roteiro estruturado com cenas
  const script = {
    title: `Episódio baseado em: ${concept}`,
    synopsis: `Uma aventura incrível sobre ${concept}. Os personagens enfrentam desafios e aprendem lições valiosas.`,
    scenes: [
      {
        number: 1,
        description: 'Abertura — apresentação dos personagens no cenário principal',
        dialogue: 'Olá, amigos! Hoje vamos viver uma aventura incrível!',
        duration: 10,
        mood: 'alegre',
      },
      {
        number: 2,
        description: 'Desenvolvimento — os personagens descobrem o desafio',
        dialogue: 'Vejam! Algo estranho está acontecendo por aqui...',
        duration: 15,
        mood: 'misterioso',
      },
      {
        number: 3,
        description: 'Clímax — momento de maior tensão e ação',
        dialogue: 'Precisamos trabalhar juntos para resolver isso!',
        duration: 15,
        mood: 'emocionante',
      },
      {
        number: 4,
        description: 'Resolução — o problema é resolvido',
        dialogue: 'Conseguimos! Juntos somos mais fortes!',
        duration: 10,
        mood: 'triunfante',
      },
      {
        number: 5,
        description: 'Encerramento — despedida e moral da história',
        dialogue: 'Até a próxima aventura, amigos! Lembrem-se: nunca desistam!',
        duration: 10,
        mood: 'alegre',
      },
    ],
    totalDuration: 60,
    estimatedCost: 0.05, // Custo estimado da geração do roteiro (LLM)
  };

  log('✅', 1, `Roteiro gerado: ${script.scenes.length} cenas, ${script.totalDuration}s total`);
  return script;
}

// ══════════════════════════════════════════════════════════
// 🎨 Etapa 2 — Gerar Storyboard
// ══════════════════════════════════════════════════════════

/**
 * Gera o storyboard visual a partir do roteiro.
 * [STUB] Retorna storyboard mock — será substituído por geração via Flux.
 * 
 * @param {object} script — Roteiro gerado na etapa anterior
 * @returns {Promise<object>} Storyboard com referências visuais por cena
 */
async function generateStoryboard(script) {
  log('🎨', 2, 'Gerando storyboard visual...');
  emitProgress(2, 'generateStoryboard', 'Criando storyboard visual...');

  await simulateDelay(300);

  const storyboard = {
    scenes: script.scenes.map((scene) => ({
      number: scene.number,
      description: scene.description,
      visualPrompt: `Cartoon style, vibrant colors, kid-friendly: ${scene.description}. Mood: ${scene.mood}`,
      thumbnailUrl: null, // Será preenchido quando gerar as imagens de fato
      cameraAngle: scene.number === 1 ? 'wide shot' : 'medium shot',
      transition: scene.number < script.scenes.length ? 'fade' : 'none',
    })),
    style: 'cartoon 2D colorido, estilo infantil brasileiro',
    estimatedCost: 0.10, // Custo estimado (Flux Dev)
  };

  log('✅', 2, `Storyboard gerado: ${storyboard.scenes.length} quadros`);
  return storyboard;
}

// ══════════════════════════════════════════════════════════
// 🎭 Etapa 3 — Gerar Referências de Personagens
// ══════════════════════════════════════════════════════════

/**
 * Gera imagens de referência para cada personagem.
 * [STUB] Retorna referências mock — será substituído por Flux + LoRA.
 * 
 * @param {Array<object>} characters — Lista de personagens do episódio
 * @returns {Promise<object>} Referências visuais dos personagens
 */
async function generateCharacterRefs(characters) {
  const charList = characters || [
    { name: 'Thiaguinho', description: 'menino aventureiro de 8 anos' },
    { name: 'Luna', description: 'menina cientista com óculos' },
  ];

  log('🎭', 3, `Gerando referências para ${charList.length} personagens...`);
  emitProgress(3, 'generateCharacterRefs', 'Gerando referências dos personagens...');

  await simulateDelay(300);

  const refs = charList.map((char) => ({
    name: char.name,
    description: char.description,
    referenceImageUrl: null, // Será preenchido com URL real do Flux
    stylePrompt: `Cartoon character, ${char.description}, vibrant colors, consistent design`,
    generated: false, // Flag para indicar que é mock
  }));

  const costPerImage = 0.04; // Flux Dev ~$0.04 por imagem
  const totalCost = refs.length * costPerImage;

  log('✅', 3, `Referências geradas para ${refs.length} personagens (custo: $${totalCost.toFixed(2)})`);

  return {
    characters: refs,
    estimatedCost: totalCost,
  };
}

// ══════════════════════════════════════════════════════════
// 🖼️ Etapa 4 — Gerar Cenas Visuais
// ══════════════════════════════════════════════════════════

/**
 * Gera as imagens de cada cena do storyboard.
 * [STUB] Retorna cenas mock — será substituído por geração via Flux.
 * 
 * @param {object} storyboard — Storyboard gerado na etapa 2
 * @param {object} characterRefs — Referências de personagens da etapa 3
 * @returns {Promise<object>} Cenas com imagens geradas
 */
async function generateScenes(storyboard, characterRefs) {
  log('🖼️', 4, `Gerando ${storyboard.scenes.length} cenas visuais...`);
  emitProgress(4, 'generateScenes', 'Gerando imagens das cenas...');

  await simulateDelay(300);

  const scenes = storyboard.scenes.map((scene) => ({
    number: scene.number,
    description: scene.description,
    visualPrompt: scene.visualPrompt,
    imageUrl: null, // Será preenchido com URL real
    status: 'mock',
  }));

  const costPerScene = 0.04;
  const totalCost = scenes.length * costPerScene;

  log('✅', 4, `${scenes.length} cenas visuais geradas (custo: $${totalCost.toFixed(2)})`);

  return {
    scenes,
    estimatedCost: totalCost,
  };
}

// ══════════════════════════════════════════════════════════
// 🎬 Etapa 5 — Gerar Vídeos das Cenas
// ══════════════════════════════════════════════════════════

/**
 * Gera vídeos animados para cada cena (image-to-video ou text-to-video).
 * [STUB] Retorna vídeos mock — será substituído por Kling 3.0 / Wan 2.7.
 * 
 * @param {object} scenesData — Cenas com imagens da etapa 4
 * @returns {Promise<object>} Vídeos gerados por cena
 */
async function generateVideos(scenesData) {
  log('🎬', 5, `Gerando vídeos para ${scenesData.scenes.length} cenas...`);
  emitProgress(5, 'generateVideos', 'Gerando vídeos das cenas com IA...');

  await simulateDelay(500);

  const videos = scenesData.scenes.map((scene) => ({
    sceneNumber: scene.number,
    videoUrl: null, // Será preenchido com URL real do Kling/Wan
    duration: 10, // Segundos
    model: 'fal-ai/kling-video/v3/pro/text-to-video',
    status: 'mock',
    requestId: `mock-req-${scene.number}-${Date.now()}`,
  }));

  const costPerVideo = 0.35; // Kling 3.0 Pro ~$0.35 por 10s
  const totalCost = videos.length * costPerVideo;

  log('✅', 5, `${videos.length} vídeos gerados (custo: $${totalCost.toFixed(2)})`);

  return {
    videos,
    estimatedCost: totalCost,
  };
}

// ══════════════════════════════════════════════════════════
// 🗣️ Etapa 6 — Gerar Vozes / Diálogos
// ══════════════════════════════════════════════════════════

/**
 * Gera áudio de voz para cada diálogo no roteiro.
 * [STUB] Retorna áudios mock — será substituído por ElevenLabs TTS.
 * 
 * @param {object} script — Roteiro com diálogos
 * @param {Array<object>} characters — Personagens com voice IDs
 * @returns {Promise<object>} Áudios de voz gerados
 */
async function generateVoices(script, characters) {
  const dialogueCount = script.scenes.filter((s) => s.dialogue).length;
  log('🗣️', 6, `Gerando ${dialogueCount} diálogos com ElevenLabs...`);
  emitProgress(6, 'generateVoices', 'Gerando vozes dos personagens...');

  await simulateDelay(300);

  const voices = script.scenes
    .filter((scene) => scene.dialogue)
    .map((scene) => ({
      sceneNumber: scene.number,
      dialogue: scene.dialogue,
      audioUrl: null, // Será preenchido com URL/path real
      audioSizeKB: 0,
      voiceId: 'mock-voice-id',
      model: 'eleven_multilingual_v2',
      status: 'mock',
    }));

  // ElevenLabs cobra por caractere (~$0.30 por 1000 chars)
  const totalChars = voices.reduce((sum, v) => sum + v.dialogue.length, 0);
  const costPer1000Chars = 0.30;
  const totalCost = (totalChars / 1000) * costPer1000Chars;

  log('✅', 6, `${voices.length} áudios de voz gerados, ${totalChars} caracteres total (custo: $${totalCost.toFixed(2)})`);

  return {
    voices,
    totalCharacters: totalChars,
    estimatedCost: totalCost,
  };
}

// ══════════════════════════════════════════════════════════
// 🎵 Etapa 7 — Gerar Música de Fundo
// ══════════════════════════════════════════════════════════

/**
 * Gera música de fundo (BGM) para o episódio.
 * [STUB] Retorna música mock — será substituído por Stable Audio 3.0.
 * 
 * @param {string} mood — Clima/tom da música (ex: "alegre", "misterioso")
 * @param {number} duration — Duração em segundos
 * @returns {Promise<object>} Música gerada
 */
async function generateMusic(mood, duration) {
  log('🎵', 7, `Gerando música de fundo (${mood}, ${duration}s)...`);
  emitProgress(7, 'generateMusic', 'Gerando trilha sonora...');

  await simulateDelay(300);

  const music = {
    mood,
    duration,
    audioUrl: null, // Será preenchido com URL/path real
    prompt: `Upbeat cartoon background music, ${mood} mood, ${duration} seconds, orchestral, kid-friendly`,
    model: 'stable-audio-3.0',
    status: 'mock',
  };

  const costPerMinute = 0.05; // Stable Audio ~$0.05/min
  const totalCost = (duration / 60) * costPerMinute;

  log('✅', 7, `Música gerada: ${mood}, ${duration}s (custo: $${totalCost.toFixed(3)})`);

  return {
    music,
    estimatedCost: totalCost,
  };
}

// ══════════════════════════════════════════════════════════
// 🎞️ Etapa 8 — Compor Vídeo Final
// ══════════════════════════════════════════════════════════

/**
 * Compõe o vídeo final combinando vídeos, vozes e música.
 * [STUB] Retorna composição mock — será substituído por FFmpeg.
 * 
 * @param {object} videosData — Vídeos das cenas
 * @param {object} voicesData — Áudios de voz
 * @param {object} musicData — Música de fundo
 * @returns {Promise<object>} Vídeo final composto
 */
async function composeFinalVideo(videosData, voicesData, musicData) {
  log('🎞️', 8, 'Compondo vídeo final (vídeos + vozes + música)...');
  emitProgress(8, 'composeFinalVideo', 'Montando vídeo final...');

  await simulateDelay(400);

  const totalDuration = videosData.videos.reduce((sum, v) => sum + v.duration, 0);

  const composition = {
    outputPath: null, // Será preenchido com caminho real
    format: 'mp4',
    codec: 'h264',
    resolution: '1920x1080',
    fps: 30,
    totalDuration,
    videoTracks: videosData.videos.length,
    audioTracks: voicesData.voices.length + 1, // +1 para a música
    status: 'mock',
  };

  log('✅', 8, `Vídeo final composto: ${totalDuration}s, ${composition.resolution}, ${composition.fps}fps`);

  return {
    composition,
    estimatedCost: 0, // FFmpeg é local, sem custo de API
  };
}

// ══════════════════════════════════════════════════════════
// 📤 Etapa 9 — Upload para YouTube
// ══════════════════════════════════════════════════════════

/**
 * Faz upload do vídeo final para o YouTube.
 * [STUB] Retorna upload mock — será substituído pelo cliente YouTube real.
 * 
 * @param {object} compositionData — Vídeo final composto
 * @param {object} metadata — Metadados do vídeo
 * @returns {Promise<object>} Resultado do upload
 */
async function uploadToYouTube(compositionData, metadata) {
  log('📤', 9, `Fazendo upload para YouTube: "${metadata.title}"...`);
  emitProgress(9, 'uploadToYouTube', 'Enviando para o YouTube...');

  await simulateDelay(400);

  const upload = {
    videoId: `mock-yt-${Date.now()}`,
    videoUrl: `https://www.youtube.com/watch?v=mock-${Date.now()}`,
    title: metadata.title,
    status: 'mock', // Em produção: 'uploaded'
    privacyStatus: 'private',
  };

  log('✅', 9, `Upload concluído (mock): ${upload.videoUrl}`);

  return {
    upload,
    estimatedCost: 0, // Upload YouTube é gratuito
  };
}

// ══════════════════════════════════════════════════════════
// 🚀 PIPELINE PRINCIPAL
// ══════════════════════════════════════════════════════════

/**
 * Executa o pipeline completo de produção de um episódio.
 * 
 * @param {object} config — Configuração do episódio
 * @param {string} config.title — Título do episódio
 * @param {string} config.concept — Conceito/ideia do episódio
 * @param {Array<object>} [config.characters] — Personagens (opcional)
 * @param {string} [config.style] — Estilo visual (opcional)
 * @param {number} [config.duration] — Duração alvo em segundos (opcional)
 * @returns {Promise<object>} Resultado completo da produção
 */
export async function produceEpisode(config) {
  const { title, concept, characters, style, duration } = config;

  console.log('');
  console.log('══════════════════════════════════════════════════════');
  console.log(`🎬 PIPELINE DE PRODUÇÃO — "${title}"`);
  console.log('══════════════════════════════════════════════════════');
  console.log(`📝 Conceito: ${concept}`);
  console.log(`🎨 Estilo: ${style || 'padrão (cartoon 2D)'}`);
  console.log(`⏱️  Duração alvo: ${duration || 60}s`);
  console.log(`🎭 Personagens: ${characters ? characters.length : 'padrão'}`);
  console.log('══════════════════════════════════════════════════════');
  console.log('');

  const pipelineStart = performance.now();
  const costLog = []; // Registro de custos de cada etapa

  try {
    // ── Etapa 1: Roteiro ──
    pipelineEvents.emit('step:start', { step: 1, stepName: 'generateScript' });
    const { result: script, durationMs: d1 } = await measureTime('Gerar Roteiro', () =>
      generateScript(concept)
    );
    costLog.push({ step: 1, name: 'Roteiro', cost: script.estimatedCost });
    pipelineEvents.emit('step:complete', { step: 1, stepName: 'generateScript', durationMs: d1 });

    // ── Etapa 2: Storyboard ──
    pipelineEvents.emit('step:start', { step: 2, stepName: 'generateStoryboard' });
    const { result: storyboard, durationMs: d2 } = await measureTime('Gerar Storyboard', () =>
      generateStoryboard(script)
    );
    costLog.push({ step: 2, name: 'Storyboard', cost: storyboard.estimatedCost });
    pipelineEvents.emit('step:complete', { step: 2, stepName: 'generateStoryboard', durationMs: d2 });

    // ── Etapa 3: Referências de Personagens ──
    pipelineEvents.emit('step:start', { step: 3, stepName: 'generateCharacterRefs' });
    const { result: charRefs, durationMs: d3 } = await measureTime('Gerar Referências', () =>
      generateCharacterRefs(characters)
    );
    costLog.push({ step: 3, name: 'Personagens', cost: charRefs.estimatedCost });
    pipelineEvents.emit('step:complete', { step: 3, stepName: 'generateCharacterRefs', durationMs: d3 });

    // ── Etapa 4: Cenas Visuais ──
    pipelineEvents.emit('step:start', { step: 4, stepName: 'generateScenes' });
    const { result: scenesData, durationMs: d4 } = await measureTime('Gerar Cenas', () =>
      generateScenes(storyboard, charRefs)
    );
    costLog.push({ step: 4, name: 'Cenas', cost: scenesData.estimatedCost });
    pipelineEvents.emit('step:complete', { step: 4, stepName: 'generateScenes', durationMs: d4 });

    // ── Etapa 5: Vídeos ──
    pipelineEvents.emit('step:start', { step: 5, stepName: 'generateVideos' });
    const { result: videosData, durationMs: d5 } = await measureTime('Gerar Vídeos', () =>
      generateVideos(scenesData)
    );
    costLog.push({ step: 5, name: 'Vídeos', cost: videosData.estimatedCost });
    pipelineEvents.emit('step:complete', { step: 5, stepName: 'generateVideos', durationMs: d5 });

    // ── Etapa 6: Vozes ──
    pipelineEvents.emit('step:start', { step: 6, stepName: 'generateVoices' });
    const { result: voicesData, durationMs: d6 } = await measureTime('Gerar Vozes', () =>
      generateVoices(script, characters)
    );
    costLog.push({ step: 6, name: 'Vozes', cost: voicesData.estimatedCost });
    pipelineEvents.emit('step:complete', { step: 6, stepName: 'generateVoices', durationMs: d6 });

    // ── Etapa 7: Música ──
    const mood = script.scenes[0]?.mood || 'alegre';
    const targetDuration = duration || script.totalDuration || 60;
    pipelineEvents.emit('step:start', { step: 7, stepName: 'generateMusic' });
    const { result: musicData, durationMs: d7 } = await measureTime('Gerar Música', () =>
      generateMusic(mood, targetDuration)
    );
    costLog.push({ step: 7, name: 'Música', cost: musicData.estimatedCost });
    pipelineEvents.emit('step:complete', { step: 7, stepName: 'generateMusic', durationMs: d7 });

    // ── Etapa 8: Composição Final ──
    pipelineEvents.emit('step:start', { step: 8, stepName: 'composeFinalVideo' });
    const { result: compositionData, durationMs: d8 } = await measureTime('Compor Vídeo Final', () =>
      composeFinalVideo(videosData, voicesData, musicData)
    );
    costLog.push({ step: 8, name: 'Composição', cost: compositionData.estimatedCost });
    pipelineEvents.emit('step:complete', { step: 8, stepName: 'composeFinalVideo', durationMs: d8 });

    // ── Etapa 9: Upload YouTube ──
    const metadata = {
      title,
      description: script.synopsis,
      tags: ['desenhos animados', 'thiagera', 'animação', 'cartoon', 'infantil'],
    };
    pipelineEvents.emit('step:start', { step: 9, stepName: 'uploadToYouTube' });
    const { result: uploadData, durationMs: d9 } = await measureTime('Upload YouTube', () =>
      uploadToYouTube(compositionData, metadata)
    );
    costLog.push({ step: 9, name: 'Upload', cost: uploadData.estimatedCost });
    pipelineEvents.emit('step:complete', { step: 9, stepName: 'uploadToYouTube', durationMs: d9 });

    // ── Relatório Final ──
    const totalDurationMs = Math.round(performance.now() - pipelineStart);
    const totalDurationSec = (totalDurationMs / 1000).toFixed(1);
    const totalCostUsd = costLog.reduce((sum, c) => sum + c.cost, 0);

    console.log('');
    console.log('══════════════════════════════════════════════════════');
    console.log(`✅ PRODUÇÃO CONCLUÍDA — "${title}"`);
    console.log('══════════════════════════════════════════════════════');
    console.log(`⏱️  Tempo total: ${totalDurationSec}s`);
    console.log(`💰 Custo total estimado: $${totalCostUsd.toFixed(2)} USD`);
    console.log('');
    console.log('📊 Detalhamento de custos:');
    costLog.forEach((c) => {
      console.log(`   ${c.step}. ${c.name}: $${c.cost.toFixed(3)}`);
    });
    console.log('══════════════════════════════════════════════════════');
    console.log('');

    // Emite evento de conclusão
    const result = {
      title,
      concept,
      script,
      storyboard,
      characterRefs: charRefs,
      scenes: scenesData,
      videos: videosData,
      voices: voicesData,
      music: musicData,
      composition: compositionData,
      upload: uploadData,
      costs: {
        breakdown: costLog,
        totalUsd: totalCostUsd,
        totalBrl: totalCostUsd * 5.5, // Câmbio aproximado
      },
      timing: {
        totalDurationMs,
        totalDurationSec: parseFloat(totalDurationSec),
      },
      status: 'completed',
      completedAt: timestamp(),
    };

    pipelineEvents.emit('complete', {
      totalDurationMs,
      totalCost: totalCostUsd,
      result,
    });

    return result;

  } catch (error) {
    const totalDurationMs = Math.round(performance.now() - pipelineStart);

    console.error('');
    console.error('══════════════════════════════════════════════════════');
    console.error(`❌ PRODUÇÃO FALHOU — "${title}"`);
    console.error('══════════════════════════════════════════════════════');
    console.error(`🚨 Erro: ${error.message}`);
    console.error(`⏱️  Tempo até falha: ${(totalDurationMs / 1000).toFixed(1)}s`);
    console.error('══════════════════════════════════════════════════════');

    pipelineEvents.emit('error', {
      error,
      totalDurationMs,
    });

    throw error;
  }
}

// ══════════════════════════════════════════════════════════
// 📤 Exportações
// ══════════════════════════════════════════════════════════

export default {
  produceEpisode,
  pipelineEvents,
};
