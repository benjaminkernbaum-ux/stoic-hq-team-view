# 🎬 DESENHOS ANIMADOS THIAGERA

> Estúdio de animação brasileiro alimentado por Inteligência Artificial

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)]()
[![Stack](https://img.shields.io/badge/stack-Node.js%20%2B%20AI%20APIs-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

## 🌟 Sobre

**THIAGERA** é um estúdio de animação que utiliza as mais avançadas tecnologias de IA para produzir desenhos animados de alta qualidade para o YouTube. Nosso pipeline automatizado transforma conceitos criativos em episódios completos usando APIs de geração de vídeo, vozes, música e muito mais.

## 🏗️ Arquitetura

```
📝 Roteiro → 🎨 Storyboard → 👤 Personagens → 🖼️ Cenas → 🎬 Vídeo → 🔊 Áudio → 🎵 Música → ✂️ Composição → 📤 Upload
```

## 🛠️ Stack Tecnológica

| Categoria | Ferramenta |
|:---|:---|
| **Geração de Vídeo** | Kling 3.0 via Fal.ai |
| **Geração de Imagens** | Flux Dev via Fal.ai |
| **Vozes (PT-BR)** | ElevenLabs v3 |
| **Animação** | Higgsfield Cinema Studio 3.0 |
| **Música** | Stable Audio 3.0 / AudioCraft |
| **Composição** | FFmpeg / Remotion |
| **Backend** | Node.js + Express |
| **Dashboard** | HTML + CSS + JavaScript |
| **Database** | SQLite |
| **Upload** | YouTube Data API v3 |

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 22+
- FFmpeg instalado
- Chaves de API (Fal.ai, ElevenLabs, etc.)

### Instalação

```bash
# Clonar o repositório
git clone <repo-url>
cd "DESENHOS ANIMADOS THIAGERA"

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
# Editar .env com suas API keys

# Iniciar o servidor
npm run dev
```

### Acessar Dashboard
Abra `http://localhost:3001` no navegador.

## 📁 Estrutura do Projeto

```
├── src/
│   ├── dashboard/          # Frontend - Production Dashboard
│   │   └── index.html      # App single-page
│   ├── backend/            # Backend - API & Pipeline
│   │   ├── server.js       # Servidor Express
│   │   ├── services/       # Clientes de APIs de IA
│   │   ├── pipeline/       # Pipeline de produção
│   │   └── db/             # Database SQLite
│   └── engine/             # Templates e workflows
├── config/                 # Configurações do canal
├── assets/                 # Assets de mídia
├── episodes/               # Episódios produzidos
└── scripts/                # Scripts utilitários
```

## 👥 Personagens

| Personagem | Papel | Descrição |
|:---|:---|:---|
| 🟡 **Tiago** | Protagonista | Menino curioso e aventureiro |
| 🟣 **Luna** | Co-protagonista | Inteligente, adora ciência |
| 🔵 **Pixel** | Mascote | Criatura mágica digital |
| 🌸 **Dona Celeste** | Mentora | Avó sábia e carinhosa |
| ⚫ **Sombrix** | Antagonista | Entidade de sombra enigmática |
| 🟢 **Zeca** | Amigo | Grandão gentil e medroso |

## 📊 Custos Estimados

| Componente | Custo/Episódio |
|:---|:---|
| Geração de Vídeo | ~R$ 50 |
| Vozes | ~R$ 8 |
| Música/SFX | ~R$ 5 |
| Imagens | ~R$ 3 |
| Roteiro | ~R$ 0.25 |
| **Total** | **~R$ 66** |

## 📝 Licença

MIT License — Veja [LICENSE](LICENSE) para detalhes.

---

Feito com ❤️ e 🤖 por **THIAGERA Studio**
