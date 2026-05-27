#!/usr/bin/env node

/**
 * 🎬 THIAGERA — Script de Inicialização de Episódio
 * 
 * Uso: node scripts/init-episode.js EP002 "O Segredo de Luna"
 * 
 * Cria toda a estrutura de pastas e arquivos template para um novo episódio.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ═══════════════════════════════════════════════════
// ARGUMENTOS
// ═══════════════════════════════════════════════════

const episodeId = process.argv[2];
const episodeTitle = process.argv[3];

if (!episodeId || !episodeTitle) {
  console.error(`
╔══════════════════════════════════════════════════╗
║  🎬 THIAGERA — Inicializador de Episódio        ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  Uso:                                            ║
║    node scripts/init-episode.js EP002 "Título"   ║
║                                                  ║
║  Exemplo:                                        ║
║    node scripts/init-episode.js EP002            ║
║         "O Segredo de Luna"                      ║
║                                                  ║
╚══════════════════════════════════════════════════╝
  `);
  process.exit(1);
}

// ═══════════════════════════════════════════════════
// ESTRUTURA DE PASTAS
// ═══════════════════════════════════════════════════

const episodeDir = path.join(ROOT, 'episodes', episodeId);

const dirs = [
  '',
  'storyboard',
  'references',
  'clips/scene01',
  'clips/scene02',
  'clips/scene03',
  'clips/scene04',
  'clips/scene05',
  'clips/scene06',
  'audio/voices',
  'audio/music',
  'audio/sfx',
  'audio/mix',
  'composition/remotion',
  'output/shorts',
  'logs'
];

// ═══════════════════════════════════════════════════
// METADATA TEMPLATE
// ═══════════════════════════════════════════════════

const metadata = {
  episode: {
    id: episodeId,
    title: episodeTitle,
    series: "As Aventuras de Tiago e Luna",
    number: parseInt(episodeId.replace('EP', ''), 10),
    season: 1
  },
  synopsis: "[PREENCHER] Sinopse do episódio em 2-3 frases.",
  scenes: [
    {
      number: 1,
      title: "[Título da Cena]",
      duration: 90,
      description: "[Descrição visual da cena]",
      characters: ["char_001"],
      mood: "[Emoção da cena]",
      visualStyle: "[Estilo visual e iluminação]",
      shots: [
        { type: "WIDE", description: "Establishing shot", duration: 5 },
        { type: "MEDIUM", description: "[Ação principal]", duration: 8 },
        { type: "CLOSE-UP", description: "[Reação do personagem]", duration: 3 }
      ]
    }
  ],
  totalDuration: 600,
  music: {
    theme: "[Tema musical do episódio]",
    mood_per_scene: []
  },
  production: {
    status: "draft",
    created_at: new Date().toISOString().split('T')[0],
    estimated_cost_brl: 68,
    actual_cost_brl: 0,
    video_clips_generated: 0,
    video_clips_selected: 0,
    voice_lines_generated: 0
  }
};

// ═══════════════════════════════════════════════════
// SCRIPT TEMPLATE
// ═══════════════════════════════════════════════════

const scriptTemplate = `# ${episodeId} — ${episodeTitle}

> **Série:** As Aventuras de Tiago e Luna
> **Temporada:** 1 | **Episódio:** ${parseInt(episodeId.replace('EP', ''), 10)}
> **Duração alvo:** 7-10 minutos
> **Status:** Rascunho

---

## Sinopse
[PREENCHER — 2-3 frases, spoiler-free]

---

## Cena 1: [Título da Cena]
- **Duração:** 90s
- **Personagens:** [Listar]
- **Local:** [Local]
- **Visual:** [Descrição detalhada para prompt de IA]
- **Mood:** [Emoção]
- **Música:** [Estilo]
- **SFX:** [Sons necessários]

### Diálogo
**TIAGO:** [Fala]
**LUNA:** [Fala]

### Shot List
| # | Tipo | Descrição | Duração | Prompt de Vídeo |
|:--|:-----|:----------|:--------|:----------------|
| 1 | WIDE | Establishing shot | 5s | "[PROMPT]" |
| 2 | MEDIUM | [Ação] | 8s | "[PROMPT]" |
| 3 | CLOSE-UP | [Reação] | 3s | "[PROMPT]" |

---

## Cena 2: [Título da Cena]
[REPETIR ESTRUTURA]

---

## Cena 3: [Título da Cena]
[REPETIR ESTRUTURA]

---

## Cena 4: [Título da Cena]
[REPETIR ESTRUTURA]

---

## Cena 5: [Título da Cena]
[REPETIR ESTRUTURA]

---

## Cena 6: [Título da Cena — CLÍMAX + CLIFFHANGER]
[REPETIR ESTRUTURA]

---

## Notas de Produção

### Thumbnail
- **Conceito:** [Descrição da cena mais impactante]
- **Prompt:** "[PROMPT para Flux Dev]"

### YouTube
- **Título:** [TÍTULO ALL CAPS COM EMOJI]
- **Tags:** [Lista de tags]

### Checklist
- [ ] Roteiro finalizado
- [ ] Storyboard gerado
- [ ] Golden references criadas
- [ ] Clips de vídeo gerados
- [ ] Clips selecionados e organizados
- [ ] Vozes gravadas (ElevenLabs)
- [ ] BGM gerada
- [ ] SFX adicionados
- [ ] Composição montada
- [ ] Mix de áudio finalizado
- [ ] Export em 1080p 24fps
- [ ] Thumbnail criada
- [ ] Upload realizado
- [ ] SEO configurado
`;

// ═══════════════════════════════════════════════════
// PRODUCTION LOG TEMPLATE
// ═══════════════════════════════════════════════════

const productionLog = {
  episode_id: episodeId,
  title: episodeTitle,
  created_at: new Date().toISOString(),
  phases: {
    concept: { status: "pending", started_at: null, completed_at: null },
    script: { status: "pending", started_at: null, completed_at: null },
    storyboard: { status: "pending", started_at: null, completed_at: null },
    image_generation: { status: "pending", started_at: null, completed_at: null, images_generated: 0 },
    video_generation: { status: "pending", started_at: null, completed_at: null, clips_generated: 0, clips_selected: 0 },
    voice_generation: { status: "pending", started_at: null, completed_at: null, lines_generated: 0 },
    music_generation: { status: "pending", started_at: null, completed_at: null, tracks_generated: 0 },
    composition: { status: "pending", started_at: null, completed_at: null },
    thumbnail: { status: "pending", started_at: null, completed_at: null },
    upload: { status: "pending", started_at: null, completed_at: null, video_id: null }
  },
  costs: {
    images: 0,
    video: 0,
    voices: 0,
    music: 0,
    sfx: 0,
    total_usd: 0,
    total_brl: 0
  },
  api_calls: []
};

// ═══════════════════════════════════════════════════
// EXECUÇÃO
// ═══════════════════════════════════════════════════

console.log(`\n🎬 Inicializando episódio: ${episodeId} — "${episodeTitle}"\n`);

// Verificar se já existe
if (fs.existsSync(episodeDir)) {
  console.error(`❌ Erro: O episódio ${episodeId} já existe em ${episodeDir}`);
  process.exit(1);
}

// Criar diretórios
for (const dir of dirs) {
  const fullPath = path.join(episodeDir, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`  📁 Criado: episodes/${episodeId}/${dir || '.'}`);
}

// Criar metadata.json
fs.writeFileSync(
  path.join(episodeDir, 'metadata.json'),
  JSON.stringify(metadata, null, 2),
  'utf-8'
);
console.log(`  📄 Criado: episodes/${episodeId}/metadata.json`);

// Criar script.md
fs.writeFileSync(
  path.join(episodeDir, 'script.md'),
  scriptTemplate,
  'utf-8'
);
console.log(`  📝 Criado: episodes/${episodeId}/script.md`);

// Criar production_log.json
fs.writeFileSync(
  path.join(episodeDir, 'logs', 'production_log.json'),
  JSON.stringify(productionLog, null, 2),
  'utf-8'
);
console.log(`  📊 Criado: episodes/${episodeId}/logs/production_log.json`);

// Criar cost_report.json
fs.writeFileSync(
  path.join(episodeDir, 'logs', 'cost_report.json'),
  JSON.stringify({ episode_id: episodeId, costs: [], total_usd: 0, total_brl: 0 }, null, 2),
  'utf-8'
);
console.log(`  💰 Criado: episodes/${episodeId}/logs/cost_report.json`);

console.log(`
╔══════════════════════════════════════════════════╗
║  ✅ Episódio ${episodeId} inicializado!              ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  📝 Próximo passo:                               ║
║     1. Edite episodes/${episodeId}/script.md         ║
║     2. Preencha o roteiro completo               ║
║     3. Execute o pipeline de geração             ║
║                                                  ║
╚══════════════════════════════════════════════════╝
`);
