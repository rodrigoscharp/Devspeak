# Common mistakes for Brazilian Portuguese speakers

Reference bank used by `devspeak-coach` to recognize and explain recurring errors. Each entry: typical mistake → correct form → explanation (pt-BR). Grouped by category; category names are used as-is in `progress.mjs` mistake records.

## false-cognates

1. "I will actually do it" (meaning "de fato/realmente") when the intended meaning was "no momento" → correct: "I'm currently doing it" — **actually** = "na verdade", não "atualmente". Falso cognato clássico.
2. "I pretend to finish this today" → correct: "I intend to finish this today" / "I plan to finish this today" — **pretend** = "fingir", não "pretender".
3. "Can you push the button?" (meaning "apertar") → correct: "Can you press the button?" — **push** = "empurrar"; para botões físicos/UI usa-se **press** ou **click**.
4. "This is an exquisite bug" (tentando dizer "esquisito") → correct: "This is a weird/strange bug" — **exquisite** = "refinado, requintado", não "estranho".
5. "I'm assisting the meeting" (tentando dizer "assistir/participar") → correct: "I'm attending the meeting" — **assist** = "ajudar", não "comparecer".
6. "We need to realize this feature" (tentando dizer "perceber") → correct: "We need to realize [= notice] this issue" / "We need to build this feature" — **realize** = "perceber, dar-se conta", raramente "executar".
7. "I have the intention to apply for this vacancy" soa formal demais; "vacancy" ok, mas cuidado com "pretend" no mesmo contexto.
8. "It's a data of the past" (tentando dizer "dado") → correct: "It's data from the past" — **date** ≠ **data**; "data" em inglês já é o plural/incontável de "datum".
9. "I will cancel the meeting because I'm compromised" (tentando dizer "comprometido/ocupado") → correct: "...because I have a conflict" / "...because I'm busy" — **compromised** = "vulnerável, comprometido de forma negativa (segurança)".
10. "The library is deprecated, it's obsolete" usado corretamente, mas cuidado com "actual" → "The actual version is 2.0" (errado) → correct: "The current version is 2.0" — **actual** = "real, verdadeiro", não "atual".

## verb-tenses

11. "I have 5 years of experience with React" → correct: "I've been working with React for 5 years" / "I have 5 years of experience with React" (esta até funciona, mas o gerúndio com "for" soa mais natural em fala) — prefira **present perfect continuous + for** para duração contínua.
12. "I work here since 2020" → correct: "I've worked here since 2020" / "I've been working here since 2020" — ação que começou no passado e continua: **present perfect**, não present simple.
13. "Yesterday I have fixed the bug" → correct: "Yesterday I fixed the bug" — com marcador de tempo específico no passado (yesterday, last week), use **simple past**, não present perfect.
14. "I am working on this since morning" → correct: "I've been working on this since this morning" — presente contínuo não combina com "since"; precisa do present perfect continuous.
15. "When I will finish, I will tell you" → correct: "When I finish, I'll tell you" — orações temporais/condicionais com "when/if" não usam **will** na oração subordinada.
16. "I did the deploy yesterday, and today I am doing another one" está correto, mas erro comum: "I am doing the deploy since two hours" → correct: "I've been doing the deploy for two hours" — confusão entre **for** (duração) e **since** (ponto de início).
17. "If I would have more time, I would finish it" → correct: "If I had more time, I would finish it" — condicional tipo 2 usa **past simple** na cláusula com "if", não "would".

## prepositions

18. "It depends of the environment" → correct: "It depends on the environment" — **depend on**, não "depend of".
19. "I arrived in the office at 9am" (para lugares pequenos/específicos) → correct: "I arrived at the office at 9am" — **arrive at** para lugares pontuais (office, station); **arrive in** para cidades/países.
20. "We are discussing about the architecture" → correct: "We are discussing the architecture" — **discuss** é transitivo direto, sem "about".
21. "I'm agree with you" → correct: "I agree with you" — "agree" é verbo, não precisa de "am"; erro comum de tradução de "estou de acordo".
22. "Listen the standup recording" → correct: "Listen to the standup recording" — **listen to**, preposição obrigatória.
23. "I will explain you the bug" → correct: "I will explain the bug to you" — **explain** não aceita objeto indireto direto; precisa de "to".
24. "Compare to the old version" quando quer dizer "em comparação com" está ok, mas "different than" é menos formal que "different from" — prefira **different from** em contexto profissional escrito.
25. "I'm responsible to fix this" → correct: "I'm responsible for fixing this" — **responsible for**, seguido de gerúndio ou substantivo.
26. "On the other hand, depends on the case" (starting a sentence) → cuidado com "according with" → correct: "according to the docs" — **according to**, não "according with".

## noun-order-and-articles

27. "Database of staging" → correct: "staging database" — inglês usa **substantivo modificador na frente** (noun + noun), não "substantivo de substantivo" como em português.
28. "The environment of production" → correct: "the production environment".
29. "A error happened" → correct: "An error happened" — **an** antes de som de vogal, não apenas letra vogal.
30. "The Sarah asked me..." → correct: "Sarah asked me..." — inglês não usa artigo antes de nomes próprios.
31. "I need make a change in code of the API" → correct: "I need to make a change in the API code" — ordem invertida de posse/modificação.

## plurals-and-uncountables

32. "I received a lot of informations" → correct: "I received a lot of information" — **information** é incontável, sem plural.
33. "We got a lot of feedbacks from the team" → correct: "We got a lot of feedback from the team" — **feedback** é incontável.
34. "There are many softwares installed" → correct: "There is a lot of software installed" / "There are many software packages installed" — **software** é incontável; use "pieces of software" se precisar contar.
35. "The equipments are broken" → correct: "The equipment is broken" — **equipment** é incontável.
36. "I have two advices for you" → correct: "I have two pieces of advice for you" / "I have some advice for you" — **advice** é incontável.

## dev-verbs-and-jargon

37. "I will up the environment to production" (tentando dizer "subir para produção") → correct: "I'll deploy to production" / "I'll push this to production" — não existe "to up" nesse sentido em inglês técnico.
38. "I will make a merge in the branches" (tentando traduzir "fazer um merge") → correct: "I'll merge the branches" — **merge** já é o verbo; evite "make a merge".
39. "I gave a deploy this morning" → correct: "I deployed this morning" / "I shipped this morning" — **deploy** funciona como verbo em inglês técnico; evite "give a deploy".
40. "I will drop a commit" (tentando dizer "vou fazer um commit rápido") → correct: "I'll make a quick commit" / "I'll commit this" — "drop a commit" em inglês nativo soa a "descartar", não "criar".
41. "The code is working in my machine" → correct: "The code works on my machine" — preposição correta é **on**, não "in", para "in my machine" nesse idiom clássico.
42. "I will rollback the deploy" está ok como substantivo/verbo compostos informais, mas prefira "I'll roll back the deployment" (verbo em duas palavras) em contexto mais formal.

## meeting-expressions

43. "Can you repeat?" (tentando pedir para repetir educadamente) → correct: "Could you say that again, please?" / "Sorry, could you repeat that?" — mais educado e natural em reuniões.
44. "I don't understood" → correct: "I don't understand" / "I didn't understand" — mistura de tempos verbais.
45. "Can I ask a doubt?" (tradução literal de "dúvida") → correct: "Can I ask a question?" — **doubt** em inglês implica desconfiança, não "dúvida" no sentido de pergunta.
46. "I will share my screen for you" → correct: "I'll share my screen with you" — **share with**, não "for" nesse sentido.
47. "Sorry for the delay to answer" → correct: "Sorry for the delay in answering" / "Sorry for the late reply" — gerúndio após "delay in", ou reformule.

## written-pronunciation-traps

Palavras cuja escrita engana falantes de português na hora de falar (não são erros de escrita, mas de pronúncia esperada a partir da grafia):

48. **developer** — pronunciado "dih-VEL-uh-per" (tônica na 2ª sílaba), não "dê-vê-LOU-per" como muitos brasileiros leem.
49. **chaos** — pronunciado "KAY-oss", não "tcháus" nem "cá-os" com C forte.
50. **suite** (como em "test suite") — pronunciado "sweet", não "su-i-tê".
51. **cache** — pronunciado "cash", não "cá-tchi" ou "quê-tche".
52. **queue** — pronunciado "kyoo" (rima com "cue"), não "qui-u-ê".
53. **debug** — tônica em "de-BUG", cuidado para não pronunciar como "dê-bug" com D forte de português.
