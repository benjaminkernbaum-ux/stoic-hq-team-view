-- ═══════════════════════════════════════════════════════════
-- 🎬 DESENHOS ANIMADOS THIAGERA — Schema do Banco de Dados
-- ═══════════════════════════════════════════════════════════
-- 
-- Banco de dados SQLite para o estúdio de animação.
-- Gerencia episódios, personagens, cenas, assets, jobs e custos.
--
-- Última atualização: 2026-05-26
-- ═══════════════════════════════════════════════════════════

-- ── Habilita foreign keys no SQLite ──
PRAGMA foreign_keys = ON;

-- ══════════════════════════════════════════════════════════
-- 📺 EPISODES — Episódios do canal
-- ══════════════════════════════════════════════════════════
-- Status possíveis: draft, production, rendering, published
CREATE TABLE IF NOT EXISTS episodes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           TEXT NOT NULL,
    description     TEXT DEFAULT '',
    status          TEXT NOT NULL DEFAULT 'draft' 
                        CHECK(status IN ('draft', 'production', 'rendering', 'published')),
    duration_seconds INTEGER DEFAULT 0,
    cost_total      REAL DEFAULT 0.0,
    youtube_id      TEXT DEFAULT NULL,
    youtube_url     TEXT DEFAULT NULL,
    views           INTEGER DEFAULT 0,
    likes           INTEGER DEFAULT 0,
    thumbnail_url   TEXT DEFAULT NULL,
    script_text     TEXT DEFAULT '',
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
    published_at    TEXT DEFAULT NULL
);

-- ══════════════════════════════════════════════════════════
-- 🎭 CHARACTERS — Personagens do estúdio
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS characters (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    name                TEXT NOT NULL UNIQUE,
    description         TEXT DEFAULT '',
    voice_profile_id    TEXT DEFAULT NULL,
    voice_id_elevenlabs TEXT DEFAULT NULL,
    reference_image_url TEXT DEFAULT NULL,
    style_prompt        TEXT DEFAULT '',
    lora_model_path     TEXT DEFAULT NULL,
    created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ══════════════════════════════════════════════════════════
-- 🎬 SCENES — Cenas de cada episódio
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS scenes (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    episode_id       INTEGER NOT NULL,
    scene_number     INTEGER NOT NULL,
    description      TEXT DEFAULT '',
    visual_prompt    TEXT DEFAULT '',
    duration_seconds REAL DEFAULT 0.0,
    video_url        TEXT DEFAULT NULL,
    audio_url        TEXT DEFAULT NULL,
    status           TEXT NOT NULL DEFAULT 'pending'
                        CHECK(status IN ('pending', 'generating', 'completed', 'failed')),
    created_at       TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE
);

-- ══════════════════════════════════════════════════════════
-- 📦 ASSETS — Arquivos gerados (imagens, vídeos, áudios)
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS assets (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    type        TEXT NOT NULL 
                    CHECK(type IN ('image', 'video', 'audio', 'music', 'sfx')),
    name        TEXT NOT NULL,
    file_path   TEXT DEFAULT NULL,
    url         TEXT DEFAULT NULL,
    episode_id  INTEGER DEFAULT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE SET NULL
);

-- ══════════════════════════════════════════════════════════
-- ⚙️ RENDER_JOBS — Jobs de renderização/produção
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS render_jobs (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    episode_id    INTEGER DEFAULT NULL,
    status        TEXT NOT NULL DEFAULT 'queued'
                      CHECK(status IN ('queued', 'processing', 'completed', 'failed')),
    progress      REAL DEFAULT 0.0,
    started_at    TEXT DEFAULT NULL,
    completed_at  TEXT DEFAULT NULL,
    error_message TEXT DEFAULT NULL,
    
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE SET NULL
);

-- ══════════════════════════════════════════════════════════
-- 💰 COSTS — Registro de custos por API
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS costs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    episode_id  INTEGER DEFAULT NULL,
    api_name    TEXT NOT NULL,
    operation   TEXT NOT NULL,
    amount_usd  REAL DEFAULT 0.0,
    amount_brl  REAL DEFAULT 0.0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE SET NULL
);

-- ══════════════════════════════════════════════════════════
-- 📊 ÍNDICES de Performance
-- ══════════════════════════════════════════════════════════

-- Busca rápida por status de episódio
CREATE INDEX IF NOT EXISTS idx_episodes_status ON episodes(status);

-- Busca rápida por data de criação (ordenação)
CREATE INDEX IF NOT EXISTS idx_episodes_created_at ON episodes(created_at);

-- Busca por YouTube ID (verificação de duplicatas)
CREATE INDEX IF NOT EXISTS idx_episodes_youtube_id ON episodes(youtube_id);

-- Busca de cenas por episódio
CREATE INDEX IF NOT EXISTS idx_scenes_episode_id ON scenes(episode_id);

-- Ordenação de cenas dentro do episódio
CREATE INDEX IF NOT EXISTS idx_scenes_episode_number ON scenes(episode_id, scene_number);

-- Busca de assets por episódio
CREATE INDEX IF NOT EXISTS idx_assets_episode_id ON assets(episode_id);

-- Busca de assets por tipo
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);

-- Busca de render jobs por episódio
CREATE INDEX IF NOT EXISTS idx_render_jobs_episode_id ON render_jobs(episode_id);

-- Busca de render jobs por status
CREATE INDEX IF NOT EXISTS idx_render_jobs_status ON render_jobs(status);

-- Busca de custos por episódio
CREATE INDEX IF NOT EXISTS idx_costs_episode_id ON costs(episode_id);

-- Busca de custos por API
CREATE INDEX IF NOT EXISTS idx_costs_api_name ON costs(api_name);
