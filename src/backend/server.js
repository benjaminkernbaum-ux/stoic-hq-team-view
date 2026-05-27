/**
 * ═══════════════════════════════════════════════════════════
 * 🎬 DESENHOS ANIMADOS THIAGERA — Servidor Principal
 * ═══════════════════════════════════════════════════════════
 * 
 * Servidor Express que serve a API REST e o dashboard estático.
 * Todas as rotas da API ficam sob o prefixo /api.
 * 
 * Variáveis de ambiente necessárias:
 *   PORT — porta do servidor (padrão: 3001)
 */

// ── Carrega variáveis de ambiente (.env) ──
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// ── Serviços internos ──
import { initDatabase, db as database } from './db/database.js';

// ── Resolve __dirname em ES Modules ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Caminhos importantes ──
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const DASHBOARD_DIR = path.resolve(PROJECT_ROOT, 'src', 'dashboard');
const DATA_DIR = path.resolve(PROJECT_ROOT, 'data');

// ── Garante que o diretório data/ existe ──
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('📁 Diretório data/ criado com sucesso');
}

// ══════════════════════════════════════════════════════════
// 🚀 Inicialização do Express
// ══════════════════════════════════════════════════════════

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middlewares globais ──

// Habilita CORS para todas as origens (desenvolvimento)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse de JSON no body das requisições (limite de 50mb para uploads de scripts grandes)
app.use(express.json({ limit: '50mb' }));

// Parse de URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Middleware de logging de requisições ──
app.use((req, _res, next) => {
  const agora = new Date().toISOString();
  console.log(`📡 [${agora}] ${req.method} ${req.url}`);
  next();
});

// ── Serve arquivos estáticos do dashboard ──
if (fs.existsSync(DASHBOARD_DIR)) {
  app.use(express.static(DASHBOARD_DIR));
  console.log(`📊 Dashboard estático servido de: ${DASHBOARD_DIR}`);
}

// ══════════════════════════════════════════════════════════
// 📺 ROTAS — /api/episodes
// ══════════════════════════════════════════════════════════

/**
 * GET /api/episodes — Lista todos os episódios
 * GET /api/episodes/:id — Busca episódio por ID
 * POST /api/episodes — Cria novo episódio
 * PUT /api/episodes/:id — Atualiza episódio
 * DELETE /api/episodes/:id — Remove episódio
 */
app.get('/api/episodes', (_req, res, next) => {
  try {
    const episodes = database.episodes.getAll();
    res.json({ success: true, data: episodes, count: episodes.length });
  } catch (err) {
    next(err);
  }
});

app.get('/api/episodes/status/:status', (req, res, next) => {
  try {
    const episodes = database.episodes.getByStatus(req.params.status);
    res.json({ success: true, data: episodes, count: episodes.length });
  } catch (err) {
    next(err);
  }
});

app.get('/api/episodes/recent/:limit', (req, res, next) => {
  try {
    const limit = parseInt(req.params.limit, 10) || 10;
    const episodes = database.episodes.getRecent(limit);
    res.json({ success: true, data: episodes, count: episodes.length });
  } catch (err) {
    next(err);
  }
});

app.get('/api/episodes/:id', (req, res, next) => {
  try {
    const episode = database.episodes.getById(req.params.id);
    if (!episode) {
      return res.status(404).json({ success: false, error: 'Episódio não encontrado' });
    }
    res.json({ success: true, data: episode });
  } catch (err) {
    next(err);
  }
});

app.post('/api/episodes', (req, res, next) => {
  try {
    const { title, description, script_text } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Título é obrigatório' });
    }
    const episode = database.episodes.create({ title, description, script_text });
    console.log(`🎬 Episódio criado: "${title}" (ID: ${episode.id})`);
    res.status(201).json({ success: true, data: episode });
  } catch (err) {
    next(err);
  }
});

app.put('/api/episodes/:id', (req, res, next) => {
  try {
    const updated = database.episodes.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Episódio não encontrado' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

app.delete('/api/episodes/:id', (req, res, next) => {
  try {
    const deleted = database.episodes.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Episódio não encontrado' });
    }
    res.json({ success: true, message: 'Episódio removido com sucesso' });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════════════
// 🎭 ROTAS — /api/characters
// ══════════════════════════════════════════════════════════

/**
 * GET /api/characters — Lista todos os personagens
 * GET /api/characters/:id — Busca personagem por ID
 * POST /api/characters — Cria novo personagem
 * PUT /api/characters/:id — Atualiza personagem
 * DELETE /api/characters/:id — Remove personagem
 */
app.get('/api/characters', (_req, res, next) => {
  try {
    const characters = database.characters.getAll();
    res.json({ success: true, data: characters, count: characters.length });
  } catch (err) {
    next(err);
  }
});

app.get('/api/characters/:id', (req, res, next) => {
  try {
    const character = database.characters.getById(req.params.id);
    if (!character) {
      return res.status(404).json({ success: false, error: 'Personagem não encontrado' });
    }
    res.json({ success: true, data: character });
  } catch (err) {
    next(err);
  }
});

app.post('/api/characters', (req, res, next) => {
  try {
    const { name, description, voice_id_elevenlabs, reference_image_url, style_prompt } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Nome é obrigatório' });
    }
    const character = database.characters.create({
      name, description, voice_id_elevenlabs, reference_image_url, style_prompt,
    });
    console.log(`🎭 Personagem criado: "${name}" (ID: ${character.id})`);
    res.status(201).json({ success: true, data: character });
  } catch (err) {
    next(err);
  }
});

app.put('/api/characters/:id', (req, res, next) => {
  try {
    const updated = database.characters.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Personagem não encontrado' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

app.delete('/api/characters/:id', (req, res, next) => {
  try {
    const deleted = database.characters.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Personagem não encontrado' });
    }
    res.json({ success: true, message: 'Personagem removido com sucesso' });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════════════
// 🔧 ROTAS — /api/pipeline
// ══════════════════════════════════════════════════════════

/**
 * POST /api/pipeline/produce — Inicia produção de um episódio
 * GET /api/pipeline/status/:jobId — Status de um render job
 * GET /api/pipeline/jobs — Lista todos os render jobs
 */
app.post('/api/pipeline/produce', async (req, res, next) => {
  try {
    const { title, concept, characters, style, duration } = req.body;
    if (!title || !concept) {
      return res.status(400).json({
        success: false,
        error: 'Título e conceito são obrigatórios',
      });
    }

    // Importa o orquestrador dinamicamente (lazy load)
    const { produceEpisode } = await import('./pipeline/orchestrator.js');

    console.log(`🎬 Iniciando produção: "${title}"`);

    // Executa produção em background (não bloqueia a resposta)
    const jobPromise = produceEpisode({ title, concept, characters, style, duration });

    // Cria um render job no banco
    const job = database.renderJobs.create({
      episode_id: null, // Será vinculado durante a produção
      status: 'queued',
    });

    // Processa em background
    jobPromise
      .then((result) => {
        database.renderJobs.update(job.id, {
          status: 'completed',
          completed_at: new Date().toISOString(),
        });
        console.log(`✅ Produção concluída: "${title}"`);
      })
      .catch((err) => {
        database.renderJobs.update(job.id, {
          status: 'failed',
          error_message: err.message,
          completed_at: new Date().toISOString(),
        });
        console.error(`❌ Produção falhou: "${title}" — ${err.message}`);
      });

    res.status(202).json({
      success: true,
      message: 'Produção iniciada em background',
      data: { jobId: job.id },
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/pipeline/status/:jobId', (req, res, next) => {
  try {
    const job = database.renderJobs.getById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job não encontrado' });
    }
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

app.get('/api/pipeline/jobs', (_req, res, next) => {
  try {
    const jobs = database.renderJobs.getAll();
    res.json({ success: true, data: jobs, count: jobs.length });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════════════
// 💰 ROTAS — /api/costs
// ══════════════════════════════════════════════════════════

/**
 * GET /api/costs — Lista todos os custos
 * GET /api/costs/total — Custo total acumulado
 * GET /api/costs/episode/:episodeId — Custos de um episódio
 * POST /api/costs — Registra novo custo
 */
app.get('/api/costs', (_req, res, next) => {
  try {
    const costs = database.costs.getAll();
    res.json({ success: true, data: costs, count: costs.length });
  } catch (err) {
    next(err);
  }
});

app.get('/api/costs/total', (_req, res, next) => {
  try {
    const total = database.costs.getTotal();
    res.json({ success: true, data: total });
  } catch (err) {
    next(err);
  }
});

app.get('/api/costs/episode/:episodeId', (req, res, next) => {
  try {
    const costs = database.costs.getByEpisode(req.params.episodeId);
    res.json({ success: true, data: costs, count: costs.length });
  } catch (err) {
    next(err);
  }
});

app.post('/api/costs', (req, res, next) => {
  try {
    const { episode_id, api_name, operation, amount_usd, amount_brl } = req.body;
    if (!api_name || !operation) {
      return res.status(400).json({
        success: false,
        error: 'api_name e operation são obrigatórios',
      });
    }
    const cost = database.costs.create({
      episode_id, api_name, operation, amount_usd, amount_brl,
    });
    res.status(201).json({ success: true, data: cost });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════════════
// 🩺 ROTA DE SAÚDE
// ══════════════════════════════════════════════════════════

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'online',
    studio: 'DESENHOS ANIMADOS THIAGERA',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  });
});

// ══════════════════════════════════════════════════════════
// 🚨 Error Handling Middleware
// ══════════════════════════════════════════════════════════

/**
 * Middleware de tratamento de erros — captura qualquer erro
 * não tratado nas rotas e retorna resposta JSON padronizada.
 */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const agora = new Date().toISOString();
  console.error(`🚨 [${agora}] ERRO: ${err.message}`);
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor',
    timestamp: agora,
  });
});

// ── Rota 404 para caminhos de API não encontrados ──
app.use('/api/*', (_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
  });
});

// ══════════════════════════════════════════════════════════
// 🎬 Inicialização do Servidor
// ══════════════════════════════════════════════════════════

/**
 * Inicializa o banco de dados e levanta o servidor.
 */
async function startServer() {
  try {
    // Inicializa o banco de dados (cria tabelas se necessário)
    initDatabase();
    console.log('🗄️  Banco de dados SQLite inicializado');

    // Levanta o servidor HTTP
    app.listen(PORT, () => {
      console.log('');
      console.log('══════════════════════════════════════════════════════');
      console.log('🎬 DESENHOS ANIMADOS THIAGERA — Studio Backend');
      console.log('══════════════════════════════════════════════════════');
      console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
      console.log(`📊 Dashboard:           http://localhost:${PORT}`);
      console.log(`📡 API Base:            http://localhost:${PORT}/api`);
      console.log(`🩺 Health Check:        http://localhost:${PORT}/api/health`);
      console.log(`🗄️  Banco de dados:      ${path.resolve(DATA_DIR, 'thiagera.db')}`);
      console.log('══════════════════════════════════════════════════════');
      console.log('');
    });
  } catch (err) {
    console.error('💀 Falha ao iniciar o servidor:', err.message);
    process.exit(1);
  }
}

// Inicia o servidor
startServer();

// ── Exporta o app para testes ──
export default app;
