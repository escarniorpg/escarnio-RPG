# 📖 Livro da Vida — React SPA

Sistema de fichas de RPG convertido para uma aplicação React completa com roteamento SPA usando **React Router v6** + **Vite**.

---

## 🗂 Estrutura do Projeto

```
livro-da-vida/
├── index.html                    # Shell HTML (Vite entry)
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                  # ReactDOM.render + imports CSS
    ├── App.jsx                   # BrowserRouter + todas as rotas
    │
    ├── styles/
    │   ├── global.css            # Variáveis, reset, tipografia, botões
    │   ├── navbar.css            # Navbar fixa com breadcrumb
    │   ├── ficha.css             # Ficha de herói
    │   ├── homebrew.css          # Criadores homebrew
    │   └── pages.css             # Home, Fichas, Campanhas
    │
    ├── hooks/
    │   └── useLocalStorage.js    # useState persistente no localStorage
    │
    ├── components/
    │   ├── Navbar.jsx            # Navbar com NavLinks ativos + URL display
    │   ├── Notification.jsx      # Toast de notificações
    │   └── HBListPanel.jsx       # Lista+Detalhe reutilizável p/ homebrew
    │
    └── pages/
        ├── Home.jsx              # /  — Página inicial com 3 cards
        ├── Fichas.jsx            # /fichas — Lista de fichas (até 5 slots)
        ├── FichaHeroi.jsx        # /fichas/:id — Ficha completa do personagem
        ├── Campanhas.jsx         # /campanhas — Hub de campanhas
        ├── Homebrew.jsx          # /homebrew — Hub homebrew
        └── homebrew/
            ├── HBEquipamentos.jsx  # /homebrew/equipamentos
            ├── HBRacas.jsx         # /homebrew/racas
            ├── HBCriaturas.jsx     # /homebrew/criaturas
            ├── HBCidades.jsx       # /homebrew/cidades
            └── HBAfiliacoes.jsx    # /homebrew/afiliacoes
```

---

## 🚀 Como Rodar

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18 ou superior
- npm (incluso com Node)

### Instalação e execução

```bash
# 1. Entrar na pasta do projeto
cd livro-da-vida

# 2. Instalar dependências
npm install

# 3. Iniciar em modo desenvolvimento
npm run dev
```

Acesse: **http://localhost:5173**

### Build para produção

```bash
npm run build
npm run preview
```

---

## 🗺 Rotas da Aplicação

| URL | Componente | Descrição |
|-----|------------|-----------|
| `/` | `Home` | Página inicial com cards de navegação |
| `/fichas` | `Fichas` | Lista de fichas de personagem (até 5 slots) |
| `/fichas/:id` | `FichaHeroi` | Ficha completa com atributos, habilidades, inventário |
| `/campanhas` | `Campanhas` | Hub de campanhas com criar/entrar |
| `/homebrew` | `Homebrew` | Hub com atalhos para cada seção |
| `/homebrew/equipamentos` | `HBEquipamentos` | Criador de equipamentos com raridade |
| `/homebrew/racas` | `HBRacas` | Criador de raças com bônus de atributos |
| `/homebrew/criaturas` | `HBCriaturas` | Bestiário com sistema de ND |
| `/homebrew/cidades` | `HBCidades` | Cidades com NPCs e pontos de interesse |
| `/homebrew/afiliacoes` | `HBAfiliacoes` | Guildas, facções e organizações |

---

## 🔧 Tecnologias

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| React | 18.3 | UI components |
| React Router DOM | 6.x | SPA routing (history.pushState) |
| Vite | 5.x | Build tool + HMR |
| CSS Variables | — | Theming dinâmico |
| localStorage | — | Persistência de dados local |

---

## 💾 Persistência de Dados

Todos os dados são salvos no **localStorage** do navegador:

| Chave | Conteúdo |
|-------|----------|
| `ldv_chars` | Array de fichas de personagem |
| `ldv_camps` | Array de campanhas |
| `ldv_hb_equip` | Equipamentos homebrew |
| `ldv_hb_racas` | Raças homebrew |
| `ldv_hb_criaturas` | Criaturas homebrew |
| `ldv_hb_cidades` | Cidades/regiões homebrew |
| `ldv_hb_afiliacoes` | Afiliações/guildas homebrew |

> Para integrar com **Firebase** (como o projeto original), substitua o `useLocalStorage` hook por chamadas ao Firestore nos componentes relevantes.

---

## 🎨 Temas

O sistema de temas do original está preservado via CSS variables. Para mudar o tema:

```js
document.body.setAttribute('data-theme', 'roxo') // vermelho | roxo | amarelo | rosa
```

---

## 🔗 Como o Roteamento Funciona

O `App.jsx` usa `<BrowserRouter>` do React Router, que utiliza internamente `history.pushState` para:

1. **Mudar a URL** sem recarregar a página
2. **Renderizar componentes diferentes** baseado na rota atual
3. **Manter o histórico** do navegador (botões Voltar/Avançar funcionam)

A `Navbar` usa `<NavLink>` que aplica automaticamente a classe `.active` na rota atual.

---

*Livro da Vida RPG · Sistema SPA com React Router*
