# Relatório Técnico & Projeto Executivo: Lumina Study (Paleta Tons Pastéis)

> **Documento de Especificação Técnica e Plano de Execução** para um aplicativo web moderno de organização de estudos, combinando gestão de cronogramas, priorização de tarefas, listas/subtarefas, repositório de materiais, gráficos de progresso semanal e um sistema de gamificação com emblemas virtuais e metas diárias personalizáveis — com estética limpa, tons pastéis acolhedores e usabilidade intuitiva.

---

## Decisões Críticas e Preferências do Usuário

> [!IMPORTANT]
> Este plano atualizado incorpora suas diretrizes de estilo e usabilidade: **tons pastéis acolhedores**, **interface limpa e despoluída** e **extrema facilidade de uso**, combinadas a todas as funções especificadas (cronograma por prioridade, listas de subtarefas, progresso semanal e gamificação com emblemas).

- **Estética & Cores Pastéis**:
  - *Fundo Geral*: Creme suave e neutro relaxante (`#FAF8F5` / `#F8FAFC`).
  - *Superfícies*: Branco puro (`#FFFFFF`) com bordas ultrafinas pastéis (`#E2E8F0` / `#E5E7EB`).
  - *Pastel Menta* (`bg-emerald-50 text-emerald-800 border-emerald-200`): Foco ativo, hábitos cumpridos e itens concluídos.
  - *Pastel Lavanda* (`bg-violet-50 text-violet-800 border-violet-200`): Gamificação, pontos de XP e níveis de maestria.
  - *Pastel Pêssego/Coral* (`bg-rose-50 text-rose-800 border-rose-200`): Alta Prioridade 🔴 e lembretes urgentes.
  - *Pastel Âmbar/Manteiga* (`bg-amber-50 text-amber-800 border-amber-200`): Média Prioridade 🟡.
  - *Pastel Céu* (`bg-sky-50 text-sky-800 border-sky-200`): Baixa Prioridade 🔵 e leituras complementares.
  - *Pastel Lilás/Rosa Suave* (`bg-pink-50 text-pink-800 border-pink-200`): Repositório de materiais e resumos.
- **Princípio de Usabilidade Simples**:
  - Adição de tarefas em 1 clique ou atalho `Enter`.
  - Timer Pomodoro sempre visível e controlável com 1 toque (Iniciar / Pausar / Concluir).
  - Filtros rápidos por prioridade sem menus complexos.
  - Checklists expansíveis diretamente no card da atividade.
- **Persistência de Dados**: Motor 100% local com `localStorage`, offline-first, sem login obrigatório e com botão de exportar/importar dados para segurança.

---

## 1. Visão Geral e Conceito do Aplicativo

### 1.1 O Que É o Lumina Study
O **Lumina Study** é um planejador e companheiro de estudos pessoal que transforma a rotina acadêmica em uma jornada serena, organizada e motivadora. Ao substituir designs escuros e agressivos por uma estética suave em tons pastéis, o app cria uma atmosfera de calma mental (*mindful studying*), ideal para quem passa longas horas estudando para concursos, faculdade ou vestibulares.

### 1.2 Recursos Centrais Integrados:
1. **Painel do Dia (Dashboard)**: Anel circular de progresso da meta diária, cronômetro Pomodoro integrado e lista de prioridades imediatas.
2. **Cronograma com Prioridades (Alta / Média / Baixa)**: Organização clara por dias da semana com ordenação inteligente e filtros rápidos.
3. **Listas de Subtarefas por Atividade**: Cada bloco de estudo contém seu próprio checklist (ex: "Ler págs 15 a 30", "Fazer 10 exercícios", "Revisar flashcards"), com mini-barra de progresso e micro-XP por item marcado.
4. **Repositório de Materiais & Disciplinas**: Cadastro de matérias com cores pastéis personalizadas, resumos em notas e links de videoaulas.
5. **Gráficos Semanais de Progresso**: Horas líquidas por dia da semana (Segunda a Domingo), distribuição percentual por matéria e consistência de dias (ofensiva/streak).
6. **Gamificação Completa**: Sistema de XP, níveis, ofensiva diária com *Escudo de Descanso* e catálogo de 18 emblemas virtuais colecionáveis.

---

## 2. Experiência do Usuário (UX) & Design Visual Limpo

```
┌────────────────────────────────────────────────────────────────────────┐
│               LUMINA STUDY - INTERFACE EM TONS PASTÉIS                │
├────────────────────────────────────────────────────────────────────────┤
│ [🌸 Lumina Study]    Dashboard   Cronograma   Materiais   Progresso   Emblemas │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │ 🎯 Meta de Hoje (Pastel)│  │ ⏱️ Timer de Foco (Lavanda & Menta)   │  │
│  │ 85 de 120 min (71%)     │  │ 25:00 [▶ Iniciar] [Pomodoro 25/5]   │  │
│  │ [██████████░░░]         │  │ Estudando: Biologia Celular         │  │
│  └─────────────────────────┘  └─────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 📅 Cronograma & Prioridades               [+ Nova Atividade]      │  │
│  │ Filtros: [Todas] [🔴 Alta] [🟡 Média] [🔵 Baixa] [Ordenar Prior.] │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ 🔴 ALTA PRIORIDADE | Matemática - Funções Quadráticas (60 min)   │  │
│  │    Checklist: [✓] Teoria [✓] 10 Exercícios [ ] Prova anterior     │  │
│  │    Progresso: 2/3 (66%) ──────────────────────── [▶ Focar]       │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ 🟡 MÉDIA | História Geral - Revolução Francesa (45 min)          │  │
│  │    Checklist: [✓] Ler resumo [ ] Mapa mental                      │  │
│  │    Progresso: 1/2 (50%) ──────────────────────── [▶ Focar]       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────┐  ┌────────────────────────────┐  │
│  │ 📊 Progresso Semanal (Gráfico)   │  │ 🏆 Gamificação & Emblemas  │  │
│  │ Seg Ter Qua Qui Sex Sab Dom      │  │ Nível 5 • 580 XP • 🔥 5 D  │  │
│  │ ▇   ▇   ▇   ▇   ▇                │  │ 🏅 7 de 18 Desbloqueados   │  │
│  │ Total: 14.5 horas na semana      │  │ [Ver Galeria de Conquistas]│  │
│  └──────────────────────────────────┘  └────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Roteiro Passo a Passo de Construção Técnica

Ao receber a aprovação para iniciar o código, a construção do aplicativo será realizada nas seguintes etapas:

### Passo 1: Arquitetura de Tipos e Estado Global (`StudyContext`)
- Criação dos tipos TypeScript para `StudyActivity`, `ActivityChecklistItem`, `Subject`, `StudySession`, `UserProfile`, `DailyGoalConfig` e `Badge`.
- Criação de dados de exemplo iniciais (*seed data*) com matérias reais, atividades com prioridades e checklists pré-carregados para o app já abrir pronto para uso imediato.
- Persistência reativa com `localStorage` sob chave unificada.

### Passo 2: Navegação & Componentes de Layout com Tons Pastéis
- Top bar limpa e elegante com logotipo floral minimalista, contador de streak 🔥, barra de XP ⚡ e abas de navegação (Dashboard, Cronograma, Materiais, Progresso, Conquistas).
- Configuração de tokens de cores pastéis para cada matéria e prioridade.

### Passo 3: Módulo de Cronograma com Filtros de Prioridade & Checklists
- Card de atividade interativo:
  - Badge suave de prioridade (Alta 🔴, Média 🟡, Baixa 🔵).
  - Componente de checklist expansível com adição rápida de itens, marcação instantânea com ganho de +5 XP e barra de progresso individual.
  - Filtros rápidos por prioridade e ordenação automática ("Mais Prioritárias no Topo").
  - Modal intuitivo para criar/editar atividades com escolha de data, matéria, duração estimada e lista de subtarefas.

### Passo 4: Timer de Foco Pomodoro & Cronômetro
- Modo Pomodoro (25 min foco / 5 min pausa) e Modo Livre.
- Vinculação com a atividade selecionada no cronograma.
- Som suave de sino opcional e ganho de XP calculado com bônus de 50% para atividades de Alta Prioridade.

### Passo 5: Central de Materiais e Disciplinas
- Grid de matérias com cores pastéis harmoniosas.
- Organização de resumos em markdown, links de aulas e flashcards rápidos.

### Passo 6: Gráficos de Progresso Semanal (SVG Nativo & Limpo)
- Gráfico de barras verticais para os 7 dias da semana (Segunda a Domingo) comparando horas estudadas com a meta diária.
- Gráfico Donut de distribuição percentual por matéria.
- Indicador de consistência semanal com heatmap dos 7 dias.

### Passo 7: Gamificação, Emblemas e Modal de Metas
- Avaliador em tempo real dos 18 emblemas virtuais com pop-up comemorativo e confetes.
- Modal de configuração de metas diárias (ajuste de minutos e metas por dia da semana).

---

## 4. Confirmação para Início

O plano está alinhado com a paleta em tons pastéis, interface limpa e facilidade de navegação.

> Clique no botão **Proceed** no topo ou confirme no chat para executarmos o desenvolvimento e entregar o aplicativo completo e funcional!
