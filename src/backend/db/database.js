/**
 * ═══════════════════════════════════════════════════════════
 * 🗄️ DESENHOS ANIMADOS THIAGERA — Gerenciador de Banco de Dados
 * ═══════════════════════════════════════════════════════════
 * 
 * Gerenciador SQLite usando better-sqlite3.
 * Fornece CRUD para todas as tabelas e queries úteis.
 * 
 * O banco de dados é criado em data/thiagera.db
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ── Resolve caminhos em ES Modules ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Caminhos do banco ──
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const DATA_DIR = path.resolve(PROJECT_ROOT, 'data');
const DB_PATH = path.resolve(DATA_DIR, 'thiagera.db');
const SCHEMA_PATH = path.resolve(__dirname, 'schema.sql');

// ── Instância do banco de dados (singleton) ──
let dbInstance = null;

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
  console.log(`${emoji} [${timestamp()}] [Database] ${message}`);
}

// ══════════════════════════════════════════════════════════
// 🚀 Inicialização do Banco
// ══════════════════════════════════════════════════════════

/**
 * Inicializa o banco de dados SQLite.
 * Cria o diretório data/ se necessário e executa o schema.sql
 * para criar as tabelas se elas não existirem.
 * 
 * @returns {Database} Instância do banco de dados
 */
export function initDatabase() {
  if (dbInstance) {
    log('ℹ️', 'Banco de dados já inicializado');
    return dbInstance;
  }

  // Garante que o diretório data/ existe
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    log('📁', `Diretório criado: ${DATA_DIR}`);
  }

  log('🗄️', `Abrindo banco de dados: ${DB_PATH}`);

  // Cria/abre o banco de dados
  dbInstance = new Database(DB_PATH, {
    verbose: null, // Pode ativar para debug: (msg) => console.log(`[SQL] ${msg}`)
  });

  // Configurações de performance do SQLite
  dbInstance.pragma('journal_mode = WAL');     // Write-Ahead Logging para melhor concorrência
  dbInstance.pragma('foreign_keys = ON');       // Habilita foreign keys
  dbInstance.pragma('busy_timeout = 5000');     // Timeout de 5s para locks

  // Executa o schema SQL para criar tabelas
  if (fs.existsSync(SCHEMA_PATH)) {
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    dbInstance.exec(schema);
    log('✅', 'Schema executado — tabelas criadas/verificadas');
  } else {
    log('⚠️', `Arquivo schema.sql não encontrado em: ${SCHEMA_PATH}`);
  }

  log('✅', 'Banco de dados inicializado com sucesso');
  return dbInstance;
}

/**
 * Retorna a instância do banco de dados.
 * Inicializa se ainda não foi inicializado.
 * @returns {Database}
 */
function getDb() {
  if (!dbInstance) {
    initDatabase();
  }
  return dbInstance;
}

// ══════════════════════════════════════════════════════════
// 📺 CRUD — Episodes
// ══════════════════════════════════════════════════════════

const episodes = {
  /**
   * Cria um novo episódio.
   * @param {object} data — Dados do episódio
   * @returns {object} Episódio criado com ID
   */
  create(data) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO episodes (title, description, script_text, status)
      VALUES (@title, @description, @script_text, @status)
    `);
    const result = stmt.run({
      title: data.title,
      description: data.description || '',
      script_text: data.script_text || '',
      status: data.status || 'draft',
    });
    log('📺', `Episódio criado: ID ${result.lastInsertRowid}`);
    return this.getById(result.lastInsertRowid);
  },

  /**
   * Busca episódio por ID.
   * @param {number|string} id — ID do episódio
   * @returns {object|undefined} Episódio encontrado
   */
  getById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM episodes WHERE id = ?').get(id);
  },

  /**
   * Lista todos os episódios (ordenados por data de criação, mais recentes primeiro).
   * @returns {Array<object>} Lista de episódios
   */
  getAll() {
    const db = getDb();
    return db.prepare('SELECT * FROM episodes ORDER BY created_at DESC').all();
  },

  /**
   * Busca episódios por status.
   * @param {string} status — Status a filtrar (draft/production/rendering/published)
   * @returns {Array<object>}
   */
  getByStatus(status) {
    const db = getDb();
    return db.prepare('SELECT * FROM episodes WHERE status = ? ORDER BY created_at DESC').all(status);
  },

  /**
   * Busca os episódios mais recentes.
   * @param {number} limit — Quantidade máxima (padrão: 10)
   * @returns {Array<object>}
   */
  getRecent(limit = 10) {
    const db = getDb();
    return db.prepare('SELECT * FROM episodes ORDER BY created_at DESC LIMIT ?').all(limit);
  },

  /**
   * Atualiza um episódio existente.
   * @param {number|string} id — ID do episódio
   * @param {object} data — Campos a atualizar
   * @returns {object|null} Episódio atualizado ou null se não encontrado
   */
  update(id, data) {
    const db = getDb();

    // Monta SET dinâmico apenas com campos fornecidos
    const fields = [];
    const values = {};

    const allowedFields = [
      'title', 'description', 'status', 'duration_seconds', 'cost_total',
      'youtube_id', 'youtube_url', 'views', 'likes', 'thumbnail_url',
      'script_text', 'published_at',
    ];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = @${field}`);
        values[field] = data[field];
      }
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    // Sempre atualiza updated_at
    fields.push("updated_at = datetime('now')");
    values.id = id;

    const sql = `UPDATE episodes SET ${fields.join(', ')} WHERE id = @id`;
    const result = db.prepare(sql).run(values);

    if (result.changes === 0) return null;

    log('📺', `Episódio atualizado: ID ${id}`);
    return this.getById(id);
  },

  /**
   * Remove um episódio.
   * @param {number|string} id — ID do episódio
   * @returns {boolean} True se removido com sucesso
   */
  delete(id) {
    const db = getDb();
    const result = db.prepare('DELETE FROM episodes WHERE id = ?').run(id);
    if (result.changes > 0) {
      log('🗑️', `Episódio removido: ID ${id}`);
    }
    return result.changes > 0;
  },
};

// ══════════════════════════════════════════════════════════
// 🎭 CRUD — Characters
// ══════════════════════════════════════════════════════════

const characters = {
  /**
   * Cria um novo personagem.
   * @param {object} data — Dados do personagem
   * @returns {object} Personagem criado
   */
  create(data) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO characters (name, description, voice_id_elevenlabs, reference_image_url, style_prompt, lora_model_path)
      VALUES (@name, @description, @voice_id_elevenlabs, @reference_image_url, @style_prompt, @lora_model_path)
    `);
    const result = stmt.run({
      name: data.name,
      description: data.description || '',
      voice_id_elevenlabs: data.voice_id_elevenlabs || null,
      reference_image_url: data.reference_image_url || null,
      style_prompt: data.style_prompt || '',
      lora_model_path: data.lora_model_path || null,
    });
    log('🎭', `Personagem criado: "${data.name}" (ID: ${result.lastInsertRowid})`);
    return this.getById(result.lastInsertRowid);
  },

  /**
   * Busca personagem por ID.
   * @param {number|string} id
   * @returns {object|undefined}
   */
  getById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM characters WHERE id = ?').get(id);
  },

  /**
   * Lista todos os personagens.
   * @returns {Array<object>}
   */
  getAll() {
    const db = getDb();
    return db.prepare('SELECT * FROM characters ORDER BY name ASC').all();
  },

  /**
   * Atualiza um personagem.
   * @param {number|string} id
   * @param {object} data
   * @returns {object|null}
   */
  update(id, data) {
    const db = getDb();
    const fields = [];
    const values = {};

    const allowedFields = [
      'name', 'description', 'voice_profile_id', 'voice_id_elevenlabs',
      'reference_image_url', 'style_prompt', 'lora_model_path',
    ];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = @${field}`);
        values[field] = data[field];
      }
    }

    if (fields.length === 0) return this.getById(id);

    values.id = id;
    const sql = `UPDATE characters SET ${fields.join(', ')} WHERE id = @id`;
    const result = db.prepare(sql).run(values);

    if (result.changes === 0) return null;

    log('🎭', `Personagem atualizado: ID ${id}`);
    return this.getById(id);
  },

  /**
   * Remove um personagem.
   * @param {number|string} id
   * @returns {boolean}
   */
  delete(id) {
    const db = getDb();
    const result = db.prepare('DELETE FROM characters WHERE id = ?').run(id);
    if (result.changes > 0) log('🗑️', `Personagem removido: ID ${id}`);
    return result.changes > 0;
  },
};

// ══════════════════════════════════════════════════════════
// 🎬 CRUD — Scenes
// ══════════════════════════════════════════════════════════

const scenes = {
  /**
   * Cria uma nova cena.
   * @param {object} data — Dados da cena
   * @returns {object} Cena criada
   */
  create(data) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO scenes (episode_id, scene_number, description, visual_prompt, duration_seconds, status)
      VALUES (@episode_id, @scene_number, @description, @visual_prompt, @duration_seconds, @status)
    `);
    const result = stmt.run({
      episode_id: data.episode_id,
      scene_number: data.scene_number || 1,
      description: data.description || '',
      visual_prompt: data.visual_prompt || '',
      duration_seconds: data.duration_seconds || 0,
      status: data.status || 'pending',
    });
    log('🎬', `Cena criada: Episódio ${data.episode_id}, Cena ${data.scene_number}`);
    return this.getById(result.lastInsertRowid);
  },

  /**
   * Busca cena por ID.
   * @param {number|string} id
   * @returns {object|undefined}
   */
  getById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM scenes WHERE id = ?').get(id);
  },

  /**
   * Busca todas as cenas de um episódio (ordenadas por número).
   * @param {number|string} episodeId
   * @returns {Array<object>}
   */
  getByEpisode(episodeId) {
    const db = getDb();
    return db.prepare(
      'SELECT * FROM scenes WHERE episode_id = ? ORDER BY scene_number ASC'
    ).all(episodeId);
  },

  /**
   * Atualiza uma cena.
   * @param {number|string} id
   * @param {object} data
   * @returns {object|null}
   */
  update(id, data) {
    const db = getDb();
    const fields = [];
    const values = {};

    const allowedFields = [
      'scene_number', 'description', 'visual_prompt',
      'duration_seconds', 'video_url', 'audio_url', 'status',
    ];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = @${field}`);
        values[field] = data[field];
      }
    }

    if (fields.length === 0) return this.getById(id);

    values.id = id;
    const sql = `UPDATE scenes SET ${fields.join(', ')} WHERE id = @id`;
    const result = db.prepare(sql).run(values);

    if (result.changes === 0) return null;
    return this.getById(id);
  },

  /**
   * Remove uma cena.
   * @param {number|string} id
   * @returns {boolean}
   */
  delete(id) {
    const db = getDb();
    const result = db.prepare('DELETE FROM scenes WHERE id = ?').run(id);
    return result.changes > 0;
  },
};

// ══════════════════════════════════════════════════════════
// 📦 CRUD — Assets
// ══════════════════════════════════════════════════════════

const assets = {
  /**
   * Cria um novo asset.
   * @param {object} data
   * @returns {object}
   */
  create(data) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO assets (type, name, file_path, url, episode_id)
      VALUES (@type, @name, @file_path, @url, @episode_id)
    `);
    const result = stmt.run({
      type: data.type,
      name: data.name,
      file_path: data.file_path || null,
      url: data.url || null,
      episode_id: data.episode_id || null,
    });
    log('📦', `Asset criado: "${data.name}" (${data.type})`);
    return this.getById(result.lastInsertRowid);
  },

  /**
   * Busca asset por ID.
   * @param {number|string} id
   * @returns {object|undefined}
   */
  getById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM assets WHERE id = ?').get(id);
  },

  /**
   * Lista todos os assets.
   * @returns {Array<object>}
   */
  getAll() {
    const db = getDb();
    return db.prepare('SELECT * FROM assets ORDER BY created_at DESC').all();
  },

  /**
   * Busca assets por tipo.
   * @param {string} type — image, video, audio, music, sfx
   * @returns {Array<object>}
   */
  getByType(type) {
    const db = getDb();
    return db.prepare('SELECT * FROM assets WHERE type = ? ORDER BY created_at DESC').all(type);
  },

  /**
   * Busca assets de um episódio.
   * @param {number|string} episodeId
   * @returns {Array<object>}
   */
  getByEpisode(episodeId) {
    const db = getDb();
    return db.prepare('SELECT * FROM assets WHERE episode_id = ? ORDER BY created_at DESC').all(episodeId);
  },

  /**
   * Remove um asset.
   * @param {number|string} id
   * @returns {boolean}
   */
  delete(id) {
    const db = getDb();
    const result = db.prepare('DELETE FROM assets WHERE id = ?').run(id);
    return result.changes > 0;
  },
};

// ══════════════════════════════════════════════════════════
// ⚙️ CRUD — Render Jobs
// ══════════════════════════════════════════════════════════

const renderJobs = {
  /**
   * Cria um novo render job.
   * @param {object} data
   * @returns {object}
   */
  create(data) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO render_jobs (episode_id, status, started_at)
      VALUES (@episode_id, @status, @started_at)
    `);
    const result = stmt.run({
      episode_id: data.episode_id || null,
      status: data.status || 'queued',
      started_at: data.status === 'processing' ? new Date().toISOString() : null,
    });
    log('⚙️', `Render job criado: ID ${result.lastInsertRowid}`);
    return this.getById(result.lastInsertRowid);
  },

  /**
   * Busca render job por ID.
   * @param {number|string} id
   * @returns {object|undefined}
   */
  getById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM render_jobs WHERE id = ?').get(id);
  },

  /**
   * Lista todos os render jobs.
   * @returns {Array<object>}
   */
  getAll() {
    const db = getDb();
    return db.prepare('SELECT * FROM render_jobs ORDER BY id DESC').all();
  },

  /**
   * Busca render jobs por status.
   * @param {string} status
   * @returns {Array<object>}
   */
  getByStatus(status) {
    const db = getDb();
    return db.prepare('SELECT * FROM render_jobs WHERE status = ? ORDER BY id DESC').all(status);
  },

  /**
   * Atualiza um render job.
   * @param {number|string} id
   * @param {object} data
   * @returns {object|null}
   */
  update(id, data) {
    const db = getDb();
    const fields = [];
    const values = {};

    const allowedFields = ['episode_id', 'status', 'progress', 'started_at', 'completed_at', 'error_message'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = @${field}`);
        values[field] = data[field];
      }
    }

    if (fields.length === 0) return this.getById(id);

    values.id = id;
    const sql = `UPDATE render_jobs SET ${fields.join(', ')} WHERE id = @id`;
    const result = db.prepare(sql).run(values);

    if (result.changes === 0) return null;
    return this.getById(id);
  },

  /**
   * Remove um render job.
   * @param {number|string} id
   * @returns {boolean}
   */
  delete(id) {
    const db = getDb();
    const result = db.prepare('DELETE FROM render_jobs WHERE id = ?').run(id);
    return result.changes > 0;
  },
};

// ══════════════════════════════════════════════════════════
// 💰 CRUD — Costs
// ══════════════════════════════════════════════════════════

const costs = {
  /**
   * Registra um novo custo.
   * @param {object} data
   * @returns {object}
   */
  create(data) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO costs (episode_id, api_name, operation, amount_usd, amount_brl)
      VALUES (@episode_id, @api_name, @operation, @amount_usd, @amount_brl)
    `);
    const result = stmt.run({
      episode_id: data.episode_id || null,
      api_name: data.api_name,
      operation: data.operation,
      amount_usd: data.amount_usd || 0,
      amount_brl: data.amount_brl || 0,
    });
    log('💰', `Custo registrado: ${data.api_name}/${data.operation} — $${data.amount_usd || 0}`);
    return this.getById(result.lastInsertRowid);
  },

  /**
   * Busca custo por ID.
   * @param {number|string} id
   * @returns {object|undefined}
   */
  getById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM costs WHERE id = ?').get(id);
  },

  /**
   * Lista todos os custos.
   * @returns {Array<object>}
   */
  getAll() {
    const db = getDb();
    return db.prepare('SELECT * FROM costs ORDER BY created_at DESC').all();
  },

  /**
   * Busca custos de um episódio.
   * @param {number|string} episodeId
   * @returns {Array<object>}
   */
  getByEpisode(episodeId) {
    const db = getDb();
    return db.prepare('SELECT * FROM costs WHERE episode_id = ? ORDER BY created_at DESC').all(episodeId);
  },

  /**
   * Calcula o custo total acumulado (geral e por API).
   * @returns {object} { totalUsd, totalBrl, byApi: [...] }
   */
  getTotal() {
    const db = getDb();

    // Total geral
    const total = db.prepare(`
      SELECT 
        COALESCE(SUM(amount_usd), 0) as total_usd,
        COALESCE(SUM(amount_brl), 0) as total_brl,
        COUNT(*) as total_operations
      FROM costs
    `).get();

    // Total por API
    const byApi = db.prepare(`
      SELECT 
        api_name,
        COALESCE(SUM(amount_usd), 0) as total_usd,
        COALESCE(SUM(amount_brl), 0) as total_brl,
        COUNT(*) as operations
      FROM costs
      GROUP BY api_name
      ORDER BY total_usd DESC
    `).all();

    // Total por episódio
    const byEpisode = db.prepare(`
      SELECT 
        c.episode_id,
        e.title as episode_title,
        COALESCE(SUM(c.amount_usd), 0) as total_usd,
        COALESCE(SUM(c.amount_brl), 0) as total_brl,
        COUNT(*) as operations
      FROM costs c
      LEFT JOIN episodes e ON c.episode_id = e.id
      WHERE c.episode_id IS NOT NULL
      GROUP BY c.episode_id
      ORDER BY total_usd DESC
    `).all();

    return {
      totalUsd: total.total_usd,
      totalBrl: total.total_brl,
      totalOperations: total.total_operations,
      byApi,
      byEpisode,
    };
  },
};

// ══════════════════════════════════════════════════════════
// 📊 Queries Úteis para Dashboard
// ══════════════════════════════════════════════════════════

const dashboard = {
  /**
   * Retorna um resumo geral do estúdio.
   * @returns {object} Resumo com contagens e totais
   */
  getSummary() {
    const db = getDb();

    const episodeCount = db.prepare('SELECT COUNT(*) as count FROM episodes').get();
    const characterCount = db.prepare('SELECT COUNT(*) as count FROM characters').get();
    const publishedCount = db.prepare("SELECT COUNT(*) as count FROM episodes WHERE status = 'published'").get();
    const totalViews = db.prepare('SELECT COALESCE(SUM(views), 0) as total FROM episodes').get();
    const totalLikes = db.prepare('SELECT COALESCE(SUM(likes), 0) as total FROM episodes').get();
    const costTotal = costs.getTotal();

    return {
      episodes: {
        total: episodeCount.count,
        published: publishedCount.count,
      },
      characters: characterCount.count,
      engagement: {
        totalViews: totalViews.total,
        totalLikes: totalLikes.total,
      },
      costs: {
        totalUsd: costTotal.totalUsd,
        totalBrl: costTotal.totalBrl,
      },
    };
  },
};

// ══════════════════════════════════════════════════════════
// 📤 Exportação
// ══════════════════════════════════════════════════════════

/**
 * Objeto centralizado com todos os módulos de acesso ao banco.
 * Uso: import { db } from './db/database.js';
 *      db.episodes.getAll();
 */
export const db = {
  episodes,
  characters,
  scenes,
  assets,
  renderJobs,
  costs,
  dashboard,
};

export default db;
