# Devspeak

Um plugin para Claude Code que treina devs brasileiros em inglês técnico para vagas remotas internacionais — através de role-play com um time internacional fictício, praticando com o seu próprio código real.

[Read in English (README.md)](README.md)

## Por quê

A maioria das ferramentas de prática de inglês para devs é genérica. O Devspeak é diferente em dois pontos:

1. **Você pratica com o seu próprio código.** `/devspeak:explain-code` e `/devspeak:pr-talk` usam o seu `git diff` real, então você ensaia explicar ou defender *o seu trabalho de verdade* — do jeito que você precisaria fazer numa daily, num PR review ou numa call de incidente.
2. **Feito para quem fala português.** O feedback é explicado em PT-BR por padrão, e o coach usa um banco com mais de 50 erros típicos de falantes de português (falsos cognatos, tempos verbais, preposições, ordem de substantivos, jargão de dev) para explicar *por que* algo soou estranho, não só *que* soou.

Tudo roda localmente, na sua própria assinatura do Claude — sem servidor, sem API key. Seu histórico de prática fica só na sua máquina.

## Exemplo de sessão

```
> /devspeak:standup

Sarah: Morning! Let's do a quick standup — what did you work on yesterday?

Você: Yesterday I fix the login bug and I working on the API since morning.

Sarah: Nice, glad that's sorted. What's the plan for the rest of today then?

Você: today I finish the API and start review the PR from Priya

Sarah: Sounds good. Any blockers on the PR review, or should be quick?

Você: done

Sarah: Alright, let's wrap up the role-play here.

---
**Nível estimado: A2** — estrutura ontem/hoje clara, mas a mistura de tempos
verbais ("I fix", "I working") acontece com frequência suficiente para
dificultar o entendimento de quem ouve.

| Você disse                     | Forma natural                          | Por quê |
|----------------------------------|------------------------------------------|---------|
| "I fix the login bug"            | "I fixed the login bug"                  | Ação concluída no passado → simple past, não presente. |
| "I working on the API"           | "I've been working on the API"           | Ação contínua desde um ponto no passado → present perfect continuous. |
| "start review the PR"            | "start reviewing the PR"                 | Depois de "start", use gerúndio (-ing). |
...
```

## Instalação

```
/plugin marketplace add rodrigoscharp/devspeak
/plugin install devspeak@devspeak
```

## Comandos

| Comando | O que faz |
|---|---|
| `/devspeak:standup` | Pratica uma daily standup com a Sarah (tech lead). Usa `git log --since=yesterday` como contexto se você estiver num repo git. |
| `/devspeak:explain-code [arquivo\|--staged]` | Explica uma mudança real de código para a Sarah — mudanças não commitadas por padrão, `--staged`, ou um arquivo específico. |
| `/devspeak:pr-talk` | Responde aos comentários de review da Priya (engenheira sênior) no seu diff atual. |
| `/devspeak:smalltalk` | Papo casual de sexta-feira com um colega de time aleatório — sem pressão técnica. |
| `/devspeak:practice <scenario-id>` | Vai direto para qualquer cenário. Rode sem argumento para listar todos. |
| `/devspeak:progress` | Veja seu histórico de sessões, evolução de nível, principais erros recorrentes e sugestão do próximo cenário. |
| `/devspeak:english-review` | Revisa prompts reais em inglês que você escreveu no uso normal (precisa do `passive_mode` ativado, veja abaixo). |
| `/devspeak:vocab` | Testa o vocabulário que está pra revisar hoje (repetição espaçada). |

O Devspeak também traz a skill `tech-english-vocab`, que é ativada automaticamente sempre que você perguntar "como eu digo X em inglês?" sobre algo do trabalho — sem precisar de comando. As frases que você pesquisa assim são adicionadas automaticamente na fila de repetição espaçada do `/devspeak:vocab`.

## Modo de voz (opcional)

Qualquer comando de role-play pode rodar falado em vez de digitado — é só pedir ("vamos fazer isso por voz"). Isso usa um MCP server opcional (`mcp-server/`) com duas ferramentas: `listen` (fala pra texto) e `speak` (texto pra fala).

Setup: `listen` precisa do [sox](http://sox.sourceforge.net/) instalado pra gravar, mais uma chave gratuita da [Groq](https://console.groq.com/keys) (padrão, `stt_backend: groq`) ou um [whisper.cpp](https://github.com/ggerganov/whisper.cpp) local (`stt_backend: whispercpp`, totalmente offline). `speak` já funciona de fábrica no macOS/Windows via TTS do sistema; no Linux, instale `espeak-ng` ou `spd-say`. Veja [mcp-server/README.md](mcp-server/README.md) pro setup completo, incluindo vozes opcionais via Piper (local) ou ElevenLabs (nuvem).

Essa é a única parte do Devspeak que chama uma API externa por padrão (Groq, pro `listen`) — o resto continua 100% local. Pode pular esse setup e o Devspeak roda normal, em texto.

## Configuração

Defina ao instalar, ou depois via `/plugin`:

| Opção | Valores | Padrão |
|---|---|---|
| `level` | `auto`, `A2`, `B1`, `B2`, `C1` | `auto` (estimado pelo seu desempenho) |
| `correction_mode` | `end`, `inline` | `end` (feedback só no fim da sessão) |
| `explanation_language` | `pt-BR`, `en` | `pt-BR` |
| `passive_mode` | `true`, `false` | `false` — **opt-in.** Quando ligado, registra silenciosamente prompts em inglês que você escreve no uso normal do Claude Code (fora de role-play), pra `/devspeak:english-review` analisar depois. |
| `stt_backend` | `groq`, `whispercpp` | `groq` — backend de fala-pra-texto do modo de voz (`listen()`). Veja [Modo de voz](#modo-de-voz-opcional). |
| `groq_api_key` | (sensível) | — chave da Groq, só usada se `stt_backend` for `groq`. |
| `whispercpp_binary_path`, `whispercpp_model_path` | caminhos de arquivo | — só usados se `stt_backend` for `whispercpp`. |
| `tts_backend` | `system`, `piper`, `elevenlabs` | `system` — backend de texto-pra-fala do modo de voz (`speak()`). |
| `piper_binary_path`, `piper_voice_path` | caminhos de arquivo | — só usados se `tts_backend` for `piper`. |
| `elevenlabs_api_key`, `elevenlabs_voice_id` | (sensível), string | — só usados se `tts_backend` for `elevenlabs`. |

## Privacidade

O Devspeak roda inteiramente na sua máquina, usando a sua assinatura do Claude. Não há servidor nem API key obrigatória na experiência principal. Seu histórico de prática (`progress.json`), fila de vocabulário (`vocab.json`) e — só se você ativar o `passive_mode` — seus prompts registrados (`passive-log.json`) ficam salvos localmente no diretório de dados do plugin e nunca são enviados para lugar nenhum pelo Devspeak. `passive_mode` vem desligado por padrão; nada é registrado até você ligar.

A única exceção é o **modo de voz**, e só se você usar: por padrão, o `listen()` manda o áudio gravado pra API da Groq transcrever (você usa sua própria chave). Troque `stt_backend` pra `whispercpp` pra manter a transcrição 100% local. O `speak()` continua 100% local, a menos que você configure `elevenlabs` como `tts_backend`.

## Roadmap

Veja [ROADMAP.md](ROADMAP.md) para o que está planejado além da versão atual: um modo passivo que revisa seus prompts em inglês do dia a dia, vocabulário com repetição espaçada, um MCP de voz opcional e avaliação de pronúncia por fonema.

## Contribuindo

Contribuições são bem-vindas, especialmente novos cenários e adições ao banco de erros comuns. Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

MIT — veja [LICENSE](LICENSE).
