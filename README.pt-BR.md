# Devspeak

Um plugin para Claude Code que treina devs brasileiros em inglês técnico para vagas remotas internacionais — através de role-play com um time internacional fictício, praticando com o seu próprio código real.

[Read in English (README.md)](README.md)

> Gostou do projeto? Deixa uma ⭐ no repositório — ajuda outros devs brasileiros a acharem o Devspeak.

## O que é isso, exatamente?

Você abre o Claude Code, digita um comando, e um colega de time fictício (Sarah, tech lead americana; Priya, engenheira sênior indiana; Marco, PM português) começa uma conversa de trabalho em inglês com você — uma daily, uma PR review, um papo de sexta. Você responde em inglês (do seu jeito, com erro e tudo), e a cada resposta o Devspeak te dá uma correção rápida em português, sem quebrar o clima da conversa. No final, ele resume o que você fez bem, o que travou, e monta um mini-exercício focado no seu erro mais comum.

Não é curso, não é app separado, não precisa instalar nada além do que você já usa pra programar. É zero custo, zero servidor, zero API key pro uso normal.

## Pra quem é

Pra dev brasileiro que:
- Já se vira em inglês técnico escrito (lendo docs, código), mas trava na hora de falar/escrever numa call ou num PR review de verdade.
- Quer treinar situações específicas de trabalho remoto internacional (standup, defender uma decisão técnica, incident call), não inglês genérico de escola.
- Prefere errar e ser corrigido num ambiente sem julgamento antes de errar na entrevista ou na call real com o time.

## Por que é diferente

1. **Você pratica com o seu próprio código.** `/devspeak:explicar-codigo` e `/devspeak:revisao-pr` usam o seu `git diff` real, então você ensaia explicar ou defender *o seu trabalho de verdade* — do jeito que você precisaria fazer numa daily, num PR review ou numa call de incidente.
2. **Feito para quem fala português.** O feedback é explicado em PT-BR por padrão, e o coach usa um banco com mais de 50 erros típicos de falantes de português (falsos cognatos, tempos verbais, preposições, ordem de substantivos, jargão de dev) para explicar *por que* algo soou estranho, não só *que* soou.

Tudo roda localmente, na sua própria assinatura do Claude — sem servidor, sem API key. Seu histórico de prática fica só na sua máquina.

## Pré-requisitos

- [Claude Code](https://code.claude.com) instalado e logado (Mac, Linux ou Windows — cmd, PowerShell ou WSL, todos funcionam).
- Nenhuma conta ou chave extra pra usar o Devspeak no dia a dia. O plugin roda na sua assinatura normal do Claude Code.

## Instalação

Dentro do Claude Code, roda:

```
/plugin marketplace add rodrigoscharp/devspeak
/plugin install devspeak@devspeak
```

Pronto — os comandos `/devspeak:...` já aparecem.

### Já tinha instalado antes e os comandos ainda estão em inglês?

O Devspeak evoluiu rápido nas últimas atualizações (comandos renomeados pra português, correção automática, modo de voz). Se você instalou há um tempo e algo parece desatualizado, força a atualização:

```
/plugin marketplace update devspeak
/reload-plugins
```

## Exemplo de sessão

```
> /devspeak:diaria

Sarah: Morning! Let's do a quick standup — what did you work on yesterday?

Você: Yesterday I fix the login bug and I working on the API since morning.

[Dica rápida: "I fixed the login bug" (não "I fix") — ação já concluída no passado.]

Sarah: Nice, glad that's sorted. What's the plan for the rest of today then?

Você: today I finish the API and start review the PR from Priya

[Dica rápida: "start reviewing" (não "start review") — depois de "start", use gerúndio.]

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

Note que a correção `[Dica rápida: ...]` aparece **durante** a conversa, não só no final — isso é o comportamento padrão (veja [Correção automática](#correção-automática-durante-a-conversa) abaixo).

## Os comandos

Os nomes dos comandos são em português — o conteúdo da prática e as falas das personas continuam sempre em inglês, mas você não precisa saber inglês pra achar o comando certo.

| Comando | O que faz |
|---|---|
| `/devspeak:diaria` | Pratica uma daily standup com a Sarah (tech lead). Usa `git log --since=yesterday` como contexto se você estiver num repo git — ou seja, ela pergunta sobre commits que você fez de verdade. |
| `/devspeak:explicar-codigo [arquivo\|--staged]` | Explica uma mudança real de código para a Sarah — mudanças não commitadas por padrão, `--staged`, ou um arquivo específico. Ela pede "walk me through this" e faz perguntas técnicas sobre o seu diff de verdade. |
| `/devspeak:revisao-pr` | A Priya (engenheira sênior) comenta seu diff atual como um code review de verdade, e você precisa responder/defender em inglês. |
| `/devspeak:bate-papo` | Papo casual de sexta-feira com um colega de time aleatório (Sarah, Marco ou Priya) — sem pressão técnica, só pra soltar a língua. |
| `/devspeak:praticar <scenario-id>` | Vai direto para qualquer um dos 6 cenários. Rode sem argumento pra listar todos com nome e nível. |
| `/devspeak:progresso` | Mostra seu histórico de sessões, evolução de nível, principais erros que se repetem, e sugere o próximo cenário. |
| `/devspeak:revisar-ingles` | Analisa prompts reais em inglês que você escreveu no uso normal do Claude Code (fora de role-play) — precisa ativar `passive_mode` primeiro, veja [Configuração](#configuração). |
| `/devspeak:vocabulario` | Testa o vocabulário que está pra revisar hoje, com repetição espaçada (tipo flashcard). |

Além dos comandos, o Devspeak tem uma skill chamada `tech-english-vocab` que **ativa sozinha**, sem comando nenhum: sempre que você perguntar algo como "como eu digo X em inglês?" durante qualquer conversa com o Claude, ela responde com 2-3 formas naturais de dizer (formal, casual, Slack) e o que evitar. As frases que você pesquisa assim são adicionadas automaticamente na fila do `/devspeak:vocabulario`.

## Correção automática durante a conversa

Por padrão, toda vez que você responde com um erro notável (ortografia, gramática, tempo verbal, escolha de palavra), o Devspeak intercala uma correção curta em português — `[Dica rápida: ...]` — antes da persona continuar a conversa. Isso é automático, não precisa pedir.

Se preferir só receber o feedback completo no final da sessão (sem interrupção durante a conversa), mude `correction_mode` pra `end` na configuração do plugin.

## Modo de voz (opcional)

Qualquer comando de role-play pode rodar falado em vez de digitado — é só pedir ("vamos fazer isso por voz"). São dois lados independentes, e nenhum precisa de chave de API pra maioria das pessoas:

- **Pra Sarah te ouvir:** use o `/voice` nativo do próprio Claude Code (o atalho de ditado por microfone que já vem no Claude Code) pra falar suas respostas — zero setup, sem chave, funciona com qualquer login claude.ai. O Devspeak trata o texto ditado igual a uma mensagem digitada normal.
- **Pra você ouvir a persona:** o Devspeak lê as falas em voz alta usando o TTS nativo do seu sistema por padrão (`say` no macOS, `System.Speech` no Windows, `espeak-ng`/`spd-say` no Linux — instale um dos dois no Linux). Também sem chave.

`/voice` não funciona por SSH, no Claude Code na web, ou quando o Claude Code tá autenticado sem conta claude.ai (API key direta, Bedrock, Vertex, Foundry). Só nesse caso específico, o Devspeak também traz uma ferramenta de captura alternativa (`listen`) — precisa do [sox](http://sox.sourceforge.net/) mais uma chave gratuita da [Groq](https://console.groq.com/keys) ou um [whisper.cpp](https://github.com/ggerganov/whisper.cpp) local. Veja [mcp-server/README.md](mcp-server/README.md) pra esse setup, mais vozes opcionais via Piper (local) ou ElevenLabs (nuvem).

Pode pular esse setup todo e o Devspeak roda normal, em texto.

## Configuração

Defina ao instalar, ou depois via `/plugin`:

| Opção | Valores | Padrão |
|---|---|---|
| `level` | `auto`, `A2`, `B1`, `B2`, `C1` | `auto` (estimado pelo seu desempenho) |
| `correction_mode` | `inline`, `end` | `inline` (correção rápida, em `explanation_language`, depois de cada turno seu; `end` dá feedback só no fim da sessão) |
| `explanation_language` | `pt-BR`, `en` | `pt-BR` |
| `passive_mode` | `true`, `false` | `false` — **opt-in.** Quando ligado, registra silenciosamente prompts em inglês que você escreve no uso normal do Claude Code (fora de role-play), pra `/devspeak:revisar-ingles` analisar depois. |
| `tts_backend` | `system`, `piper`, `elevenlabs` | `system` — backend de texto-pra-fala do modo de voz. Sem setup pro `system`. |
| `piper_binary_path`, `piper_voice_path` | caminhos de arquivo | — só usados se `tts_backend` for `piper`. |
| `elevenlabs_api_key`, `elevenlabs_voice_id` | (sensível), string | — só usados se `tts_backend` for `elevenlabs`. |
| `stt_backend` | `groq`, `whispercpp` | `groq` — **só fallback.** Use o `/voice` nativo do Claude Code em vez disso; isso aqui é só pra ferramenta `listen`, necessária só quando `/voice` não tá disponível pra você (SSH, web, ou autenticação sem conta claude.ai). |
| `groq_api_key` | (sensível) | — só usada pelo fallback `listen` quando `stt_backend` for `groq`. |
| `whispercpp_binary_path`, `whispercpp_model_path` | caminhos de arquivo | — só usados pelo fallback `listen` quando `stt_backend` for `whispercpp`. |

## Dúvidas frequentes

**Os comandos são em português mas a Sarah fala em inglês. Isso é bug?**
Não, é de propósito. O comando em português te ajuda a achar a função sem precisar já saber inglês; o conteúdo da prática (fala da persona, correções sobre gramática) é em inglês porque é isso que você tá treinando. As explicações do *porquê* de cada correção são em português.

**Isso custa alguma coisa?**
Não. Roda na sua assinatura normal do Claude Code, sem servidor, sem chave de API. A única exceção é se você configurar o modo de voz num setup onde o `/voice` nativo não funciona (SSH, web) — aí sim você usaria sua própria chave gratuita da Groq. Pra 99% dos casos, isso nunca aparece.

**Atualizei mas nada mudou.**
Roda os dois comandos, nessa ordem, e espera terminar antes de testar:
```
/plugin marketplace update devspeak
/reload-plugins
```
Se ainda não atualizar, fecha e abre o Claude Code de novo.

**Funciona no Windows?**
Sim — cmd.exe, PowerShell ou WSL, os três funcionam, incluindo o modo de voz.

**Onde ficam meus dados?**
Local, na sua máquina, num diretório de dados do próprio plugin. Nunca é enviado pra lugar nenhum pelo Devspeak. Veja [Privacidade](#privacidade).

## Privacidade

O Devspeak roda inteiramente na sua máquina, usando a sua assinatura do Claude. Não há servidor nem API key obrigatória na experiência principal, incluindo o setup de voz recomendado (ditado `/voice` + TTS `system` padrão são ambos grátis e locais/first-party). Seu histórico de prática (`progress.json`), fila de vocabulário (`vocab.json`) e — só se você ativar o `passive_mode` — seus prompts registrados (`passive-log.json`) ficam salvos localmente no diretório de dados do plugin e nunca são enviados para lugar nenhum pelo Devspeak. `passive_mode` vem desligado por padrão; nada é registrado até você ligar.

A única exceção é a ferramenta **fallback `listen`**, e só se você estiver num setup onde `/voice` não funciona e decidir configurá-la: por padrão ela mandaria o áudio gravado pra API da Groq transcrever (usando sua própria chave). Troque `stt_backend` pra `whispercpp` pra manter isso 100% local. O `speak()` continua 100% local, a menos que você configure `elevenlabs` como `tts_backend`.

## Roadmap

Veja [ROADMAP.md](ROADMAP.md) para o que está planejado além da versão atual.

## Contribuindo

Contribuições são bem-vindas — especialmente novos cenários e adições ao banco de erros comuns. Viu um erro típico de brasileiro que não tá no banco? Manda! Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

MIT — veja [LICENSE](LICENSE).
