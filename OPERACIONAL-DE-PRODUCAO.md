# 🎬 MANUAL OPERACIONAL DE PRODUÇÃO — DESENHOS ANIMADOS THIAGERA

> **Versão:** 1.0 | **Última atualização:** 2026-05-27
> **Objetivo:** Guia step-by-step completo para produzir episódios de animação com IA — do conceito ao upload no YouTube.

---

## 📋 ÍNDICE

1. [Visão Geral do Pipeline](#1-visão-geral-do-pipeline)
2. [Fase 1: Conceito & Roteiro](#2-fase-1-conceito--roteiro)
3. [Fase 2: Storyboard & Design Visual](#3-fase-2-storyboard--design-visual)
4. [Fase 3: Geração de Imagens (Golden References)](#4-fase-3-geração-de-imagens-golden-references)
5. [Fase 4: Geração de Vídeo (AI Animation)](#5-fase-4-geração-de-vídeo-ai-animation)
6. [Fase 5: Produção de Áudio](#6-fase-5-produção-de-áudio)
7. [Fase 6: Composição & Montagem Final](#7-fase-6-composição--montagem-final)
8. [Fase 7: Thumbnail & Packaging](#8-fase-7-thumbnail--packaging)
9. [Fase 8: Upload & SEO](#9-fase-8-upload--seo)
10. [Calendário de Produção](#10-calendário-de-produção)
11. [Custos & Orçamento](#11-custos--orçamento)
12. [Checklist de Qualidade](#12-checklist-de-qualidade)
13. [Templates & Prompts Prontos](#13-templates--prompts-prontos)

---

## 1. VISÃO GERAL DO PIPELINE

```
 CONCEITO ──→ ROTEIRO ──→ STORYBOARD ──→ IMAGENS ──→ VÍDEO ──→ ÁUDIO ──→ COMPOSIÇÃO ──→ THUMBNAIL ──→ UPLOAD
   (1h)        (1h)        (30min)       (1h)       (2h)      (1h)       (1h)          (30min)      (30min)
                                                                                              TOTAL: ~8h por episódio
```

### Stack Tecnológica Operacional

| Fase | Ferramenta Principal | Backup | Custo/uso |
|:---|:---|:---|:---|
| **Roteiro** | Claude/ChatGPT | Manual | ~R$0.25 |
| **Storyboard** | Flux Dev (Fal.ai) | SDXL | ~R$1-2 |
| **Imagens de Referência** | Flux Dev (Fal.ai) | Midjourney | ~R$3-5 |
| **Geração de Vídeo** | Kling 3.0 (Fal.ai) | Wan 2.7 / Runway Gen-4.5 | ~R$50-80 |
| **Vozes** | ElevenLabs v3 | Coqui TTS | ~R$8-15 |
| **Música/BGM** | Stable Audio 3.0 | AudioCraft (local/grátis) | ~R$5-10 |
| **SFX** | AudioCraft AudioGen | Freesound.org | R$0-3 |
| **Composição** | Remotion + FFmpeg | MoviePy | R$0 |
| **Thumbnail** | Flux Dev | Canva | ~R$1-2 |
| **Upload** | YouTube Data API v3 | Manual | R$0 |
| **TOTAL POR EPISÓDIO** | | | **~R$66-115** |

### Specs Técnicos de Output

| Parâmetro | Valor |
|:---|:---|
| Resolução | 1920x1080 (1080p) |
| Frame Rate | 24fps |
| Codec | H.264 |
| Container | MP4 |
| Áudio | AAC-LC, 48kHz, 384kbps |
| Duração (Long-form) | 7-15 minutos |
| Duração (Shorts) | 15-60 segundos |
| Thumbnail | 1280x720, PNG, <2MB |

---

## 2. FASE 1: CONCEITO & ROTEIRO

### Tempo estimado: 1-2 horas

### 2.1 Pesquisa de Temas (15 min)

**Fontes de trending topics:**
- YouTube Trending Brasil (filtro: Animação/Infantil)
- TikTok BR trending sounds e temas
- Google Trends Brasil (categoria: Entretenimento)
- Comentários do canal (o que pedem?)

**Fórmulas narrativas comprovadas (baseado em ShanePlays):**

| Fórmula | Exemplo THIAGERA | Apelo |
|:---|:---|:---|
| **"Abandonado por..."** | "Abandonado Pelos Pais Superherois" | Emoção + drama |
| **"O mais rico/pobre..."** | "A Criança Mais Rica do Brasil" | Aspiracional |
| **"Adotado por..."** | "Adotado Por Uma Família de Mágicos" | Família + fantasia |
| **"Primeiro dia de..."** | "Primeiro Dia Na Escola Mágica" | Relatable + aventura |
| **"Desafio/Competição"** | "Quem Sobrevive 24 Horas Na Floresta?" | Suspense + ação |
| **"Transformação"** | "O Menino Que Virou Um Monstro" | Fantasia + conflito |

### 2.2 Estrutura do Roteiro

Todo episódio DEVE seguir esta estrutura de 3 atos:

```
ATO 1 — HOOK (0:00 - 2:00)
├── Cena de impacto nos primeiros 5 segundos
├── Apresentação do conflito central
└── "O que vai acontecer?" — criar curiosidade

ATO 2 — DESENVOLVIMENTO (2:00 - 8:00)
├── Tentativa 1 de resolver o problema (falha)
├── Complicação / plot twist
├── Momento de aprendizado
└── Tentativa 2 com nova abordagem

ATO 3 — RESOLUÇÃO (8:00 - 10:00)
├── Clímax emocional
├── Resolução do conflito
├── Lição / moral (sutil, não pregadora)
└── HOOK PARA PRÓXIMO EPISÓDIO (cliffhanger)
```

### 2.3 Prompt de Roteirização (para Claude/ChatGPT)

```
Você é um roteirista especializado em animação infantil brasileira.

CONTEXTO DO CANAL:
- Canal: DESENHOS ANIMADOS THIAGERA
- Público: Crianças brasileiras (6-12 anos)
- Estilo: Cartoon colorido tipo Cartoon Network + Turma da Mônica moderna
- Idioma: PT-BR

PERSONAGENS DISPONÍVEIS:
- Tiago (10 anos) — protagonista, curioso, camiseta amarela
- Luna (10 anos) — melhor amiga, inteligente, óculos roxos
- Pixel — mascote mágico digital, formato cubo, fofo
- Dona Celeste (68) — avó mentora, sábia
- Sombrix — antagonista de sombras, olhos vermelhos
- Zeca (11) — amigo grandão, medroso mas corajoso quando precisa

REGRAS DE ROTEIRO:
1. HOOK nos primeiros 5 SEGUNDOS — ação, mistério ou pergunta
2. Duração total: 7-10 minutos (máximo 12 minutos)
3. 5-8 cenas, cada uma com 60-120 segundos
4. Diálogos CURTOS e naturais — crianças brasileiras reais
5. Humor visual + verbal
6. Uma lição sutil (amizade, coragem, respeito)
7. CLIFFHANGER final para o próximo episódio
8. SEM violência explícita, SEM linguagem adulta
9. Referências à cultura brasileira (comida, locais, expressões)

FORMATO DE OUTPUT:
Para CADA CENA, forneça:
- Número e título da cena
- Duração estimada
- Descrição visual detalhada (para prompts de IA)
- Diálogo completo em PT-BR
- Mood/emoção da cena
- Música sugerida (estilo)
- SFX necessários

TAREFA:
Escreva um roteiro completo para o episódio: [TÍTULO DO EPISÓDIO]
Tema: [TEMA]
```

### 2.4 Output do Roteiro

Salvar como `episodes/EPXXX/script.md` com a estrutura:

```markdown
# EP[XXX] — [TÍTULO]

## Sinopse
[1-2 parágrafos]

## Cena 1: [Título]
- **Duração:** 90s
- **Personagens:** Tiago, Luna
- **Local:** Quintal da Dona Celeste
- **Visual:** Dia ensolarado, plantas tropicais, quintal brasileiro
- **Mood:** Curioso, alegre
- **Música:** Acústica leve, violão
- **SFX:** Pássaros, vento nas folhas

### Diálogo
**TIAGO:** Luna! Vem ver o que eu achei!
**LUNA:** *ajustando os óculos* O que foi, Tiago? Eu tava no meio de um experimento super importante.
...

### Prompt de Vídeo (Kling 3.0)
"Young Brazilian boy with curly brown hair and yellow star t-shirt,
running excitedly through a sunny tropical backyard, lush green plants,
warm afternoon light, cartoon animation style, Cartoon Network quality,
vibrant colors, 24fps smooth animation"
```

### 2.5 Checklist do Roteiro

- [ ] Hook nos primeiros 5 segundos?
- [ ] Conflito claro e urgente?
- [ ] Diálogos naturais em PT-BR?
- [ ] Humor presente (mín. 3 momentos)?
- [ ] Lição sutil (não pregadora)?
- [ ] Cliffhanger final?
- [ ] Cada cena tem prompt visual detalhado?
- [ ] Duração total entre 7-12 minutos?
- [ ] Máximo 8 cenas?

---

## 3. FASE 2: STORYBOARD & DESIGN VISUAL

### Tempo estimado: 30-60 minutos

### 3.1 Storyboard com Imagens AI

Para cada cena do roteiro, gerar 1-2 imagens de referência que sirvam como "storyboard visual".

**Prompt base para storyboard:**
```
Storyboard frame, cartoon animation style, [DESCRIÇÃO DA CENA],
[PERSONAGEM] in [AÇÃO], [CENÁRIO], vibrant colors,
clean cartoon lines, Cartoon Network style, Brazilian animation,
16:9 aspect ratio, cinematic composition, [MOOD] lighting
```

### 3.2 Composição Cinematográfica (lições do ShanePlays)

Aplicar regras de cinematografia em CADA prompt:

| Regra | Aplicação no Prompt | Exemplo |
|:---|:---|:---|
| **Regra dos Terços** | Posicionar personagem em 1/3 lateral | "character positioned on right third of frame" |
| **FOV Cinematográfico** | Ângulos de câmera variados | "low angle shot", "close-up", "wide establishing shot" |
| **Profundidade** | Foreground + midground + background | "foreground plants, character in middle, mountains in background" |
| **Iluminação Emocional** | Luz = mood da cena | "warm golden hour light" vs "cold blue moonlight" |
| **Letterboxing** | Adicionar em pós-produção | Barras 2.35:1 para cenas dramáticas |

### 3.3 Shot List por Cena

Para CADA cena, definir os shots necessários:

```
CENA 1 — O QUINTAL MÁGICO
├── Shot 1: WIDE — Establishing shot do quintal (5s)
├── Shot 2: MEDIUM — Tiago brincando, descobre algo (8s)
├── Shot 3: CLOSE-UP — Rosto de Tiago surpreso (3s)
├── Shot 4: POV — O que Tiago vê (luz brilhante) (4s)
└── Shot 5: WIDE — Tiago correndo para a luz (5s)
Total de shots gerados: ~5 clips de vídeo
```

### 3.4 Output do Storyboard

Salvar como `episodes/EPXXX/storyboard/`:

```
episodes/EPXXX/
├── storyboard/
│   ├── scene01_shot01_wide.png
│   ├── scene01_shot02_medium.png
│   ├── scene01_shot03_closeup.png
│   └── ...
├── script.md
└── metadata.json
```

---

## 4. FASE 3: GERAÇÃO DE IMAGENS (GOLDEN REFERENCES)

### Tempo estimado: 1 hora

### 4.1 O Que São Golden References?

São imagens de referência de ALTA QUALIDADE que serão usadas como input para:
- **Subject Binding** (Kling 3.0) — manter consistência de personagem
- **Image-to-Video** — transformar em animação
- **Character Sheets** — referência visual definitiva

### 4.2 Geração de Character Sheets (Fazer UMA VEZ)

Para CADA personagem, gerar 1 character sheet definitivo:

**API: Flux Dev via Fal.ai**
```javascript
// Exemplo: Gerar character sheet do Tiago
const result = await fal.subscribe("fal-ai/flux/dev", {
  input: {
    prompt: "Character design sheet, young Brazilian boy, 10 years old, curly brown hair, big expressive brown eyes, yellow t-shirt with star, blue shorts, red sneakers, cartoon style, clean lines, vibrant colors, front view and three quarter view and side view and back view, white background, professional character design, Cartoon Network style, cute and expressive, multiple poses showing different emotions happy surprised scared determined",
    image_size: "landscape_16_9",
    num_images: 1,
    num_inference_steps: 28,
    guidance_scale: 3.5
  }
});
```

**Custo:** ~$0.04 por imagem × 6 personagens = **~$0.25 total**

### 4.3 Geração de Reference Images por Cena

Para cada shot do storyboard, gerar a imagem de referência:

```javascript
// Exemplo: Cena 1, Shot 1 — Quintal
const result = await fal.subscribe("fal-ai/flux/dev", {
  input: {
    prompt: "Cartoon background art, sunny tropical Brazilian backyard, lush green plants, big mango tree, colorful flowers, small wooden fence, warm afternoon light, vibrant colors, clean art style, detailed environment, no characters, 16:9 aspect ratio, animation background art, Studio Ghibli meets Cartoon Network",
    image_size: "landscape_16_9",
    num_images: 1,
    num_inference_steps: 28,
    guidance_scale: 3.5
  }
});
```

### 4.4 Checklist de Imagens por Episódio

| Item | Quantidade | Custo est. |
|:---|:---|:---|
| Character sheets (1x, reutilizável) | 6 | R$1.30 |
| Background references por cena | 6-8 | R$1.50 |
| Key frame references por shot | 15-25 | R$4.00 |
| Thumbnail reference | 1-2 | R$0.40 |
| **TOTAL por episódio** | 28-41 imagens | **~R$3-7** |

---

## 5. FASE 4: GERAÇÃO DE VÍDEO (AI ANIMATION)

### Tempo estimado: 2-3 horas (inclui tempo de geração das APIs)

### 5.1 Estratégia de Geração

Cada episódio de 10 minutos = **600 segundos** de vídeo.

Cada clip de vídeo AI = **5-10 segundos**.

**Quantidade de clips necessários:** 60-120 clips

**Estratégia de otimização:**
- Gerar 1.5x o necessário (90-180 clips) para ter opções
- Descartar clips com artifacts
- Reutilizar cenários estáticos entre cenas

### 5.2 Modelos de Geração por Tipo de Shot

| Tipo de Shot | Modelo | Método | Custo/clip |
|:---|:---|:---|:---|
| **Cenas com personagem (consistente)** | Kling 3.0 Pro | Subject Binding (image ref) | $0.145 (5s) |
| **Cenários/establishing shots** | Wan 2.7 | Text-to-Video | $0.25 (5s) |
| **Close-ups emocionais** | Kling 3.0 Pro | Image-to-Video | $0.145 (5s) |
| **Ação rápida/transição** | Kling 3.0 Standard | Text-to-Video | $0.058 (5s) |
| **Cenas premium (backup)** | Runway Gen-4.5 | Image-to-Video | $0.25 (5s) |

### 5.3 Prompt Engineering para Vídeo

**Template de prompt para Kling 3.0:**
```
[ESTILO] [PERSONAGEM] [AÇÃO] [CENÁRIO] [CÂMERA] [LUZ] [DETALHES]
```

**Exemplo completo:**
```
Cartoon animation style, young Brazilian boy with curly brown hair
wearing yellow star t-shirt, running excitedly with arms raised,
through a sunny tropical backyard with lush green plants and a
big mango tree, camera slowly zooming in, warm golden afternoon
sunlight with lens flare, vibrant saturated colors, smooth fluid
animation, Cartoon Network quality, 24fps
```

**Regras de prompt para melhores resultados:**

1. **SEMPRE comece com o estilo:** "Cartoon animation style" ou "2D animated cartoon"
2. **DESCREVA movimento:** "running", "jumping", "turning head slowly"
3. **ESPECIFIQUE câmera:** "camera panning left", "static shot", "dolly zoom in"
4. **INCLUA iluminação:** "warm sunset light", "cool blue nighttime"
5. **ADICIONE qualidade:** "smooth fluid animation", "high quality", "vibrant colors"
6. **EVITE:** "realistic", "3D render", "photorealistic", "dark", "scary"

### 5.4 Subject Binding (Consistência de Personagem) — Kling 3.0

**O passo MAIS IMPORTANTE para qualidade profissional.**

```javascript
// Gerar vídeo com Subject Binding — mantém o personagem consistente
const result = await fal.subscribe("fal-ai/kling-video/v3/pro/image-to-video", {
  input: {
    prompt: "Cartoon animation, the boy runs through the backyard excitedly, smooth animation, vibrant colors, warm sunlight",
    image_url: "URL_DA_GOLDEN_REFERENCE_DO_TIAGO.png",
    duration: "5",
    aspect_ratio: "16:9"
  }
});
```

**Regras de Subject Binding:**
- Use SEMPRE a Golden Reference Image do personagem
- Mantenha o prompt consistente com a imagem
- Gere 2-3 variações e escolha a melhor
- Se o resultado for ruim, ajuste o prompt, NÃO a imagem

### 5.5 Workflow de Geração em Batch

```
PARA CADA CENA:
  1. Carregar Golden Reference dos personagens da cena
  2. Para cada shot no shot list:
     a. Gerar 2-3 variações do clip
     b. Esperar resultado (~2-4 min por clip)
     c. Review: selecionar o melhor clip
     d. Descartar clips com artifacts
  3. Salvar clips selecionados em episodes/EPXXX/clips/

ORGANIZAÇÃO DE ARQUIVOS:
episodes/EPXXX/
├── clips/
│   ├── scene01/
│   │   ├── shot01_take01.mp4  ← selecionado
│   │   ├── shot01_take02.mp4  ← descartado
│   │   ├── shot02_take01.mp4  ← selecionado
│   │   └── ...
│   ├── scene02/
│   └── ...
```

### 5.6 Estimativa de Custos de Vídeo

| Cenário | Clips | Modelo | Custo |
|:---|:---|:---|:---|
| **Econômico** | 60 clips × 5s = 300s | Kling Standard | ~R$18 |
| **Padrão** | 90 clips × 5s = 450s | Kling Pro (mix) | ~R$50 |
| **Premium** | 120 clips × 5s = 600s | Kling Pro + Runway | ~R$100 |
| **Com over-generation (1.5x)** | 135 clips | Kling Pro | ~R$75 |

**RECOMENDADO: Padrão (90 clips, ~R$50 por episódio)**

---

## 6. FASE 5: PRODUÇÃO DE ÁUDIO

### Tempo estimado: 1-2 horas

### 6.1 Vozes dos Personagens (ElevenLabs v3)

**Setup inicial (fazer UMA VEZ):**

| Personagem | Tipo de Voz | Voice ID ElevenLabs | Stability | Similarity | Style |
|:---|:---|:---|:---|:---|:---|
| **Tiago** | Menino jovem, entusiasmado | (configurar) | 0.40 | 0.80 | 0.70 |
| **Luna** | Menina inteligente, confiante | (configurar) | 0.50 | 0.80 | 0.60 |
| **Pixel** | Criatura fofa, eletrônico | (configurar) | 0.30 | 0.60 | 0.90 |
| **Dona Celeste** | Idosa carinhosa, sábia | (configurar) | 0.70 | 0.80 | 0.40 |
| **Sombrix** | Grave, reverberada, misteriosa | (configurar) | 0.60 | 0.70 | 0.80 |
| **Zeca** | Menino animado, voz grossa | (configurar) | 0.50 | 0.75 | 0.60 |

**Geração de falas:**

```javascript
// Exemplo: Gerar fala do Tiago
const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}", {
  method: "POST",
  headers: {
    "xi-api-key": process.env.ELEVENLABS_API_KEY,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    text: "Luna! Vem ver o que eu achei atrás da árvore!",
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.40,
      similarity_boost: 0.80,
      style: 0.70,
      use_speaker_boost: true
    }
  })
});
// Salvar como episodes/EPXXX/audio/voices/scene01_tiago_001.mp3
```

**Dicas para vozes naturais em PT-BR:**
- Adicionar pontuação expressiva no texto: "!!", "...", "?!"
- Incluir interjeições brasileiras: "Uau!", "Eita!", "Caramba!", "Que legal!"
- Para sussurros: adicionar "(sussurrando)" antes do texto
- Para gritos: usar CAPS LOCK no texto
- Gerar 2 variações e escolher a mais natural

### 6.2 Música / BGM (Stable Audio 3.0)

**Gerar 2-3 trilhas por episódio:**

| Tipo | Prompt | Duração |
|:---|:---|:---|
| **Tema de Aventura** | "Upbeat cartoon adventure theme, orchestral with playful woodwinds, Brazilian rhythms, cheerful and exciting, children's animation soundtrack, 120 BPM" | 120s |
| **Tema Emocional** | "Soft emotional cartoon music, gentle piano with strings, heartfelt and warm, children's show tender moment, 80 BPM" | 90s |
| **Tema de Tensão** | "Mysterious cartoon suspense theme, minor key, subtle electronic elements, building tension, children-safe scary music, 100 BPM" | 60s |

```javascript
// Exemplo: Gerar BGM de aventura
const result = await fetch("https://api.stability.ai/v2beta/audio/generate", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    prompt: "Upbeat cartoon adventure theme, orchestral with playful woodwinds, Brazilian rhythms, cheerful and exciting, children's animation soundtrack, 120 BPM",
    duration: 120,
    output_format: "mp3"
  })
});
// Salvar como episodes/EPXXX/audio/music/adventure_theme.mp3
```

### 6.3 Efeitos Sonoros (SFX)

**Biblioteca de SFX base (criar UMA VEZ e reutilizar):**

| Categoria | Sons | Fonte |
|:---|:---|:---|
| **Ambientação** | Pássaros, vento, chuva, rio | AudioCraft AudioGen / Freesound |
| **Ações** | Passos, porta, pular, correr | Freesound.org |
| **Cartoon** | Boing, pop, whoosh, slide whistle | Freesound / criação própria |
| **Magia** | Brilho, sparkle, transformação | AudioCraft AudioGen |
| **Emocionais** | Riso, surpresa, medo, suspense | AudioCraft / Bark |
| **Pixel** | Sons eletrônicos, beeps, glitch | AudioCraft AudioGen |

**Gerar SFX com AudioCraft (local, grátis):**
```python
# Exemplo: Gerar som de magia do Pixel
from audiocraft.models import AudioGen

model = AudioGen.get_pretrained("facebook/audiogen-medium")
model.set_generation_params(duration=3)
descriptions = ["magical sparkling sound effect, digital fairy, cartoon style"]
wav = model.generate(descriptions)
# Salvar como assets/sfx/magic_sparkle.wav
```

### 6.4 Estrutura de Áudio por Episódio

```
episodes/EPXXX/audio/
├── voices/
│   ├── scene01_tiago_001.mp3
│   ├── scene01_tiago_002.mp3
│   ├── scene01_luna_001.mp3
│   └── ...
├── music/
│   ├── adventure_theme.mp3
│   ├── emotional_theme.mp3
│   └── tension_theme.mp3
├── sfx/
│   ├── scene01_birds.mp3
│   ├── scene01_footsteps.mp3
│   └── ...
└── mix/
    └── final_audio_mix.mp3
```

---

## 7. FASE 6: COMPOSIÇÃO & MONTAGEM FINAL

### Tempo estimado: 1-2 horas

### 7.1 Workflow de Composição

```
1. IMPORT — Importar todos os clips de vídeo selecionados
2. ARRANGE — Organizar na timeline por cena/shot
3. TRIM — Cortar e ajustar duração de cada clip
4. TRANSITIONS — Adicionar transições entre cenas
5. AUDIO SYNC — Sincronizar vozes com movimentos de boca
6. BGM LAYER — Adicionar música de fundo (volume -12dB)
7. SFX LAYER — Adicionar efeitos sonoros nos momentos certos
8. COLOR — Color grading para consistência visual
9. TEXT — Adicionar título e créditos
10. LETTERBOX — Adicionar barras cinematográficas (cenas épicas)
11. EXPORT — Render final em H.264 1080p 24fps
```

### 7.2 Composição com Remotion (Programática)

```javascript
// Exemplo simplificado de composição Remotion
import { Composition, Sequence, Audio, Video } from 'remotion';

export const Episode = () => {
  return (
    <>
      {/* CENA 1 */}
      <Sequence from={0} durationInFrames={24 * 90}>
        <Video src="clips/scene01/shot01.mp4" />
        <Audio src="audio/voices/scene01_tiago_001.mp3" startFrom={24 * 3} />
        <Audio src="audio/music/adventure_theme.mp3" volume={0.3} />
        <Audio src="audio/sfx/birds.mp3" volume={0.15} />
      </Sequence>

      {/* TRANSIÇÃO */}
      <Sequence from={24 * 88} durationInFrames={24 * 2}>
        {/* Crossfade de 2 segundos */}
      </Sequence>

      {/* CENA 2 */}
      <Sequence from={24 * 90} durationInFrames={24 * 120}>
        <Video src="clips/scene02/shot01.mp4" />
        ...
      </Sequence>
    </>
  );
};
```

### 7.3 Composição com FFmpeg (Linha de Comando)

```bash
# 1. Concatenar clips de vídeo de uma cena
ffmpeg -f concat -safe 0 -i scene01_clips.txt -c copy scene01_raw.mp4

# 2. Mixar áudio (vozes + bgm + sfx)
ffmpeg -i voices_scene01.mp3 -i bgm.mp3 -i sfx_scene01.mp3 \
  -filter_complex "[0:a]volume=1.0[v];[1:a]volume=0.3[m];[2:a]volume=0.6[s];[v][m][s]amix=inputs=3" \
  audio_mix_scene01.mp3

# 3. Combinar vídeo + áudio final
ffmpeg -i video_all_scenes.mp4 -i audio_final_mix.mp3 \
  -c:v libx264 -preset medium -crf 18 \
  -c:a aac -b:a 384k -ar 48000 \
  -r 24 -s 1920x1080 \
  EP001_final.mp4

# 4. Adicionar letterboxing (opcional, para cenas dramáticas)
ffmpeg -i input.mp4 -vf "pad=1920:816:0:132:black" output_letterbox.mp4
```

### 7.4 Transições Recomendadas

| Tipo | Quando Usar | FFmpeg Filter |
|:---|:---|:---|
| **Crossfade** | Passagem de tempo | `xfade=transition=fade:duration=1` |
| **Cut direto** | Ação rápida | Sem filtro (corte seco) |
| **Fade to black** | Fim de ato | `fade=t=out:st=X:d=1` |
| **Wipe** | Mudança de local | `xfade=transition=wipeleft:duration=0.5` |
| **Zoom in/out** | Foco emocional | `zoompan=z='min(zoom+0.001,1.5)'` |

### 7.5 Mix de Áudio — Níveis

| Camada | Volume | Nota |
|:---|:---|:---|
| **Vozes/Diálogo** | 0 dB (referência) | SEMPRE audível e claro |
| **BGM (música)** | -12 dB a -18 dB | Abaixar durante diálogo |
| **SFX** | -6 dB a -12 dB | Pontual, não constante |
| **Ambientação** | -18 dB a -24 dB | Subtle, quase subliminar |

---

## 8. FASE 7: THUMBNAIL & PACKAGING

### Tempo estimado: 30 minutos

### 8.1 Regras de Thumbnail (baseado em ShanePlays)

**A thumbnail é o FATOR #1 de cliques. Tratar como POSTER DE FILME.**

| Regra | Implementação |
|:---|:---|
| **Personagem em destaque** | 1-2 personagens principais, ocupando 40-60% do frame |
| **Expressão exagerada** | Surpresa, medo, felicidade extrema |
| **Cores vibrantes** | Saturação alta, contraste forte |
| **Fundo estilizado** | Background dramático, NÃO screenshot do vídeo |
| **Texto mínimo** | Máximo 3-5 palavras, fonte bold |
| **Composição dramática** | Personagem olhando para algo fora do frame |
| **Bordas/Drop shadow** | Efeito 3D nos personagens sobre o fundo |

### 8.2 Prompt de Thumbnail (Flux Dev)

```
YouTube thumbnail, [DESCRIÇÃO DRAMÁTICA DA CENA],
[PERSONAGEM] com expressão de [EMOÇÃO EXAGERADA],
cartoon style, vibrant saturated colors, dramatic lighting,
bold composition, eye-catching, professional quality,
1280x720, no text, no watermark
```

**Exemplo:**
```
YouTube thumbnail, young Brazilian boy with curly brown hair and
yellow star t-shirt looking up in complete amazement at a glowing
magical cube creature floating in the air, dramatic sunset
background with golden light rays, cartoon style, vibrant saturated
colors, cinematic dramatic lighting, bold composition, eye-catching,
1280x720
```

### 8.3 Adicionar Texto na Thumbnail

Usar ImageMagick ou Canvas API:
```bash
# Adicionar título na thumbnail com ImageMagick
convert thumbnail_raw.png \
  -font "Outfit-Bold" -pointsize 72 \
  -stroke '#000000' -strokewidth 4 -fill '#FFFFFF' \
  -gravity South -annotate +0+30 "O DESPERTAR DE PIXEL" \
  thumbnail_final.png
```

---

## 9. FASE 8: UPLOAD & SEO

### Tempo estimado: 30 minutos

### 9.1 Template de Título

**Fórmula: [EMOÇÃO] + [AÇÃO] + [CONTEXTO] — [SÉRIE]**

Exemplos:
- `TIAGO ENCONTRA UMA CRIATURA MÁGICA NO QUINTAL! 😱 | As Aventuras de Tiago e Luna`
- `A SOMBRA MISTERIOSA ATACOU À NOITE! 🌑 | Desenhos Animados THIAGERA`
- `PIXEL FOI SEQUESTRADO! 😰 Será que vão conseguir salvar? | THIAGERA`

**Regras:**
- ALL CAPS para a parte principal
- Emoji estratégico (1-2 máximo)
- Série/canal ao final após " | "
- Máximo 70 caracteres (60 ideal)

### 9.2 Template de Descrição

```
🎬 [TÍTULO DO EPISÓDIO]

[SINOPSE em 2-3 frases — spoiler-free, criar curiosidade]

━━━━━━━━━━━━━━━━━━━━━━
📺 TEMPORADA [X] | EPISÓDIO [XX]
🎭 Personagens: Tiago, Luna, Pixel, Dona Celeste, Zeca
━━━━━━━━━━━━━━━━━━━━━━

🔔 INSCREVA-SE para não perder nenhum episódio!
👍 LIKE se você gostou!
💬 COMENTE: O que vai acontecer com [PERSONAGEM]?

━━━━━━━━━━━━━━━━━━━━━━
📱 Siga o canal:
• Instagram: @thiagaraanimacao
• TikTok: @thiagaraanimacao
━━━━━━━━━━━━━━━━━━━━━━

🔍 Tags:
desenho animado, animação brasileira, cartoon, infantil,
tiago e luna, pixel, aventura, magia, THIAGERA,
desenho animado brasileiro, animação infantil, cartoon em português

#DesenhoAnimado #Animação #Cartoon #THIAGERA #AnimaçãoBrasileira
#DesenhoInfantil #CartoonBrasileiro #TiagoELuna
```

### 9.3 Tags Padrão (YouTube)

```json
[
  "desenho animado",
  "animação",
  "cartoon",
  "infantil",
  "animação brasileira",
  "cartoon em português",
  "desenho para crianças",
  "tiago e luna",
  "thiagera",
  "aventura",
  "magia",
  "desenho animado brasileiro",
  "cartoon brasileiro",
  "animação infantil",
  "desenho novo",
  "animação 2026"
]
```

### 9.4 Upload Automatizado (YouTube Data API v3)

```javascript
// Upload via API
const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

const response = await youtube.videos.insert({
  part: 'snippet,status',
  requestBody: {
    snippet: {
      title: 'TIAGO ENCONTRA UMA CRIATURA MÁGICA! 😱 | As Aventuras de Tiago e Luna EP01',
      description: descriptionTemplate,
      tags: defaultTags,
      categoryId: '1', // Film & Animation
      defaultLanguage: 'pt-BR',
      defaultAudioLanguage: 'pt-BR'
    },
    status: {
      privacyStatus: 'private', // Mudar para 'public' quando pronto
      publishAt: '2026-06-04T18:00:00.000Z', // Schedule
      selfDeclaredMadeForKids: true
    }
  },
  media: {
    body: fs.createReadStream('episodes/EP001/EP001_final.mp4')
  }
});

// Upload thumbnail
await youtube.thumbnails.set({
  videoId: response.data.id,
  media: {
    body: fs.createReadStream('episodes/EP001/thumbnail_final.png')
  }
});
```

---

## 10. CALENDÁRIO DE PRODUÇÃO

### 10.1 Calendário Semanal

| Dia | Atividade | Output |
|:---|:---|:---|
| **Segunda** | Conceito + Roteiro (episódio A) | script.md |
| **Terça** | Geração de Imagens + Vídeo (episódio A) | clips/ |
| **Quarta** | Áudio + Composição (episódio A) + **UPLOAD Long-form** | EP final + Upload |
| **Quinta** | Conceito + Roteiro (episódio B) | script.md |
| **Sexta** | Geração de Imagens + Vídeo (episódio B) | clips/ |
| **Sábado** | Áudio + Composição (episódio B) | EP final |
| **Domingo** | Shorts (extrair momentos) + Planejamento semanal | 3-5 Shorts |

### 10.2 Schedule de Upload

| Formato | Dia | Horário | Frequência |
|:---|:---|:---|:---|
| **Long-form** | Quarta-feira | 18:00 BRT | 1x/semana (escalar para 2x) |
| **Long-form** | Sábado | 10:00 BRT | 1x/semana (quando escalar) |
| **Shorts** | Seg/Qua/Sex | 12:00 BRT | 3x/semana |

### 10.3 Batch Processing (Produção em Lote)

Para máxima eficiência, agrupar tarefas similares:

```
DIA DE ROTEIRO (2-3 roteiros de uma vez):
  → Manhã: Pesquisa de temas + 2 roteiros
  → Tarde: 1 roteiro + storyboards

DIA DE GERAÇÃO (imagens e vídeos em batch):
  → Manhã: Disparar geração de imagens (Flux)
  → Enquanto gera: preparar prompts de vídeo
  → Tarde: Disparar geração de vídeo (Kling)
  → Review e seleção de clips

DIA DE ÁUDIO + MONTAGEM:
  → Manhã: Gerar todas as vozes (ElevenLabs)
  → Tarde: Composição + mix + export
  → Noite: Thumbnail + upload scheduled
```

---

## 11. CUSTOS & ORÇAMENTO

### 11.1 Custo por Episódio (10 minutos)

| Componente | Mín. | Padrão | Premium |
|:---|:---|:---|:---|
| Roteiro (Claude API) | R$0.15 | R$0.25 | R$0.50 |
| Imagens de referência (Flux) | R$2.00 | R$3.50 | R$7.00 |
| Vídeo AI (Kling 3.0) | R$18.00 | R$50.00 | R$100.00 |
| Vozes (ElevenLabs) | R$5.00 | R$8.00 | R$15.00 |
| Música (Stable Audio) | R$3.00 | R$5.00 | R$10.00 |
| SFX (AudioCraft) | R$0.00 | R$0.00 | R$3.00 |
| Thumbnail (Flux) | R$0.50 | R$1.00 | R$2.00 |
| **TOTAL** | **R$28.65** | **R$67.75** | **R$137.50** |

### 11.2 Custo Mensal (8 episódios/mês + Shorts)

| Cenário | Eps/mês | Custo/mês | Budget suficiente? |
|:---|:---|:---|:---|
| **Conservador** | 4 eps + 12 Shorts | R$350 | ✅ Sim (budget R$1000) |
| **Padrão** | 8 eps + 20 Shorts | R$650 | ✅ Sim (budget R$1000) |
| **Agressivo** | 12 eps + 30 Shorts | R$1100 | ⚠️ Acima do budget |

### 11.3 ROI Estimado

| Métrica | Mês 1-3 | Mês 4-6 | Mês 7-12 |
|:---|:---|:---|:---|
| Subscribers | 0 → 1K | 1K → 10K | 10K → 50K+ |
| Views/mês | 5K | 50K | 500K+ |
| Receita AdSense | R$0 | R$50-200 | R$500-2000 |
| Custo/mês | R$650 | R$650 | R$650 |
| **ROI** | Negativo | Breakeven | Positivo |

---

## 12. CHECKLIST DE QUALIDADE

### Checklist Pré-Upload (OBRIGATÓRIO antes de publicar)

#### Conteúdo
- [ ] Hook nos primeiros 5 segundos é impactante?
- [ ] Storytelling tem início, meio e fim?
- [ ] Diálogos soam naturais em PT-BR?
- [ ] Humor presente e adequado para crianças?
- [ ] Cliffhanger para próximo episódio?
- [ ] Nenhum conteúdo inadequado para crianças?

#### Visual
- [ ] Personagens consistentes entre cenas?
- [ ] Sem artifacts visuais graves?
- [ ] Cores vibrantes e saturadas?
- [ ] Transições suaves entre cenas?
- [ ] Resolução 1080p limpa?
- [ ] Letterboxing nas cenas dramáticas?

#### Áudio
- [ ] Vozes audíveis e claras?
- [ ] BGM não compete com diálogo?
- [ ] SFX sincronizados com ação?
- [ ] Mix de áudio balanceado?
- [ ] Sem silêncios mortos (>3s)?
- [ ] Volume consistente ao longo do episódio?

#### SEO & Packaging
- [ ] Título emocionante com <70 caracteres?
- [ ] Thumbnail é eye-catching mesmo em tamanho pequeno?
- [ ] Descrição completa com CTAs?
- [ ] Tags relevantes aplicadas?
- [ ] End screen e cards configurados?
- [ ] Marcado como "Made for Kids"?

#### Técnico
- [ ] Export em H.264 / MP4?
- [ ] 1080p, 24fps?
- [ ] Áudio AAC 384kbps 48kHz?
- [ ] Arquivo não excede 256GB?
- [ ] Thumbnail PNG 1280x720 <2MB?

---

## 13. TEMPLATES & PROMPTS PRONTOS

### 13.1 Prompts de Personagem (Reutilizáveis)

**Tiago:**
```
young Brazilian boy, 10 years old, curly brown hair, big expressive
brown eyes, yellow t-shirt with star, blue shorts, red sneakers,
cartoon style, Cartoon Network quality, vibrant colors
```

**Luna:**
```
young Brazilian girl, 10 years old, straight black hair with bangs,
round purple glasses, lilac dress with star details, backpack with
patches, cartoon style, smart confident expression
```

**Pixel:**
```
cute magical cube creature, rounded edges, glowing cyan and purple,
enormous adorable eyes, floating, cartoon mascot style, kawaii design
```

**Dona Celeste:**
```
elderly Brazilian grandmother, warm smile, gray hair in bun with
flowers, golden half-moon glasses, colorful embroidered apron,
cartoon style, wise and loving expression
```

**Sombrix:**
```
shadow entity villain, fluid dark smoke body, glowing red eyes,
black and dark purple, mysterious and menacing, cartoon villain
design, ethereal and shape-shifting
```

**Zeca:**
```
large but gentle Brazilian boy, 11 years old, undercut hairstyle,
green soccer t-shirt, always holding a snack, big backpack,
cartoon style, friendly nervous expression
```

### 13.2 Prompts de Cenário (Reutilizáveis)

**Quintal da Dona Celeste (dia):**
```
Cartoon background, sunny tropical Brazilian backyard, lush green
plants, big mango tree, colorful flowers, small wooden fence,
clothesline with colorful clothes, warm afternoon light, vibrant
colors, 16:9, animation background art
```

**Interior da casa (aconchegante):**
```
Cartoon background, cozy Brazilian home interior, warm colors,
wooden furniture, family photos on walls, handmade quilts,
plants on windowsills, warm indoor lighting, 16:9
```

**Floresta mágica (noite):**
```
Cartoon background, enchanted forest at night, bioluminescent
plants, glowing fireflies, mysterious blue and purple atmosphere,
ancient trees, moonlight filtering through canopy, magical, 16:9
```

**Escola brasileira:**
```
Cartoon background, Brazilian school exterior, tropical trees,
playground, colorful walls, Brazilian flag, sunny day, children's
animation style, vibrant colors, 16:9
```

### 13.3 Estrutura de Pastas por Episódio

```
episodes/EPXXX/
├── metadata.json          ← Dados do episódio
├── script.md              ← Roteiro completo
├── storyboard/            ← Imagens de referência
│   ├── scene01_shot01.png
│   └── ...
├── references/            ← Golden References
│   ├── tiago_ref.png
│   └── ...
├── clips/                 ← Clips de vídeo gerados
│   ├── scene01/
│   │   ├── shot01.mp4
│   │   └── ...
│   └── ...
├── audio/                 ← Todos os áudios
│   ├── voices/
│   ├── music/
│   ├── sfx/
│   └── mix/
├── composition/           ← Projeto de composição
│   ├── timeline.json
│   └── remotion/
├── output/                ← Output final
│   ├── EPXXX_final.mp4
│   ├── EPXXX_thumbnail.png
│   └── EPXXX_shorts/
│       ├── short01.mp4
│       └── ...
└── logs/                  ← Logs de produção
    ├── generation_log.json
    └── cost_report.json
```

---

## 📌 RESUMO EXECUTIVO

| Métrica | Valor |
|:---|:---|
| **Tempo por episódio** | ~8 horas (1 dia de trabalho) |
| **Custo por episódio** | ~R$68 (padrão) |
| **Clips de vídeo por episódio** | 60-120 |
| **Frequência de upload** | 2x/semana long-form + 3x/semana Shorts |
| **Custo mensal (8 eps)** | ~R$650 |
| **Budget mensal** | R$1.000 |
| **Meta de subscribers (6 meses)** | 10.000+ |
| **Break-even estimado** | Mês 4-6 |

---

> **🎯 REGRA DE OURO:** Cada episódio deve fazer o viewer pensar:
> *"Isso foi feito por um estúdio profissional"* — e não *"Isso foi feito por uma IA"*.
> A diferença está no STORYTELLING, na CONSISTÊNCIA e no CUIDADO com cada detalhe.

---

*Documento vivo — atualizar conforme o pipeline evolui.*
*Feito com 🤖 + ❤️ por THIAGERA Studio*
