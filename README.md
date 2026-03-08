# Riordan Calculator

An interactive web application for computing and visualizing [Riordan matrices](https://en.wikipedia.org/wiki/Riordan_group) and their properties. Riordan matrices are infinite lower triangular matrices used extensively in combinatorics.

**Live at [riordancalculator.com](https://riordancalculator.com)**

## Features

- Compute Riordan matrices from user-defined G and F generating sequences
- 40+ built-in mathematical sequences (Catalan, Fibonacci, Motzkin, Delannoy, etc.)
- Multiple computation modes: Normal, Bell, Appell, Derivative, Associated, Two-Bell
- Classic and Exponential meta-modes
- Matrix outputs: Normal, Inverse, and Stieltjes transforms with star sequences (A, B, Z)
- [OEIS](https://oeis.org/) sequence lookup and integration
- User accounts with query history and custom sequence management
- Shareable matrix computations via deep links

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (static export) |
| UI | React 18, Styled Components, Radix UI |
| Language | TypeScript / JavaScript |
| Animation | Framer Motion |
| Auth | AWS Cognito via Amplify |
| Backend | AWS API Gateway + Lambda (Python 3.12) |
| Hosting | AWS Amplify (GitHub deploy) |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser Client                           │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      _app.tsx                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │                  PageLayout.tsx                      │  │  │
│  │  │  ┌───────────────────────────────────────────────┐  │  │  │
│  │  │  │             UserProvider (Context)             │  │  │  │
│  │  │  │  Auth state, tokens, user queries/sequences   │  │  │  │
│  │  │  │  ┌───────────────────────────────────────┐    │  │  │  │
│  │  │  │  │        DataProvider (Context)          │    │  │  │  │
│  │  │  │  │  G/F sequences, mode, matrix state,   │    │  │  │  │
│  │  │  │  │  OEIS data, custom sequences          │    │  │  │  │
│  │  │  │  │  ┌───────────────────────────────┐    │    │  │  │  │
│  │  │  │  │  │        Page Routes             │    │    │  │  │  │
│  │  │  │  │  │  / (Home) /about /sequences   │    │    │  │  │  │
│  │  │  │  │  │  /history /papers              │    │    │  │  │  │
│  │  │  │  │  └───────────────────────────────┘    │    │  │  │  │
│  │  │  │  └───────────────────────────────────────┘    │  │  │  │
│  │  │  └───────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
┌──────────────────────┐     ┌──────────────────────────┐
│  Unauthenticated API │     │    Authenticated API     │
│  (API Gateway)       │     │    (API Gateway+Cognito) │
│                      │     │                          │
│  PUT /queries        │     │  PUT /queries            │
│  GET /queries        │     │  GET /queries            │
│  GET /stats          │     │  GET /stats              │
│                      │     │  GET/PUT/DELETE /query    │
│                      │     │  GET /oeis               │
│                      │     │  GET/PUT/DELETE /sequence │
│                      │     │  PUT /preset             │
│                      │     │  GET/PUT /email           │
└──────────┬───────────┘     └────────────┬─────────────┘
           │                              │
           └──────────────┬───────────────┘
                          ▼
              ┌───────────────────────┐
              │   Lambda (Python 3.12)│
              │   Shared deployment   │
              │   artifact on S3      │
              └───────────────────────┘
```

### Home Page Component Tree

```
Home
├── NavBar
│   ├── AuthDialog (login/signup/confirm modal)
│   └── UserDropdown (settings, logout)
├── Header
├── ModeComboBox (Normal, Bell, Appell, Derivative, Associated, TwoBell)
├── OEISInput + OEISSequenceDisplay
├── MatrixHeader + ShareDialog
├── SequenceControlPanel
│   ├── Sequence [G] → NumberBox[] (editable cells)
│   └── Sequence [F] → NumberBox[] (editable cells)
├── WindowControls (augment / truncate sequence length)
├── SubmitButton → triggers API computation
├── Matrix (normal)
├── Matrix (inverse)
├── Matrix (stieltjes)
├── StarSequence (A)
├── StarSequence (B)
└── StarSequence (Z)
```

### Data Flow

```
User selects sequences & mode
            │
            ▼
┌───────────────────────┐
│    DataProvider        │
│                        │
│  G sequence ──┐        │
│  F sequence ──┤        │     ┌──────────────────┐
│  Mode ────────┤ ──────►│────►│  PUT /queries     │
│  MetaMode ────┘        │     │  (API Gateway)    │
│                        │     └────────┬─────────┘
│  Mode transforms:      │              │
│  • Bell: F = [0, ...G] │              ▼
│  • Appell: F = [0,1,0] │     ┌──────────────────┐
│  • Derivative: G = F'  │     │  Lambda computes  │
│  • Associated: G=[1,0] │     │  Riordan matrix   │
│  • TwoBell: F = conv²  │     └────────┬─────────┘
│                        │              │
│  ◄────────────────────────────────────┘
│  Receives: matrix, inverse,           │
│  stieltjes, star sequences,           │
│  shareid                               │
└───────────────────────┘
```

## Project Structure

```
rc/
├── pages/                    # Next.js routes (all client-side only)
│   ├── _app.tsx              # App wrapper, global CSS imports
│   ├── index.tsx             # Home page
│   ├── about.tsx             # About page
│   ├── sequences.tsx         # Custom sequence editor
│   ├── history.tsx           # User query history
│   └── papers.tsx            # Research papers
├── src/
│   ├── next/                 # Route wrappers with PageLayout
│   │   └── PageLayout.tsx    # Provides UserProvider + DataProvider
│   ├── components/           # ~35 component directories
│   │   ├── UserProvider/     # Auth context (Cognito, tokens, user data)
│   │   ├── DataProvider/     # App state context (sequences, matrix, modes)
│   │   ├── Home/             # Main calculator UI
│   │   ├── Matrix/           # Matrix display
│   │   ├── Sequence/         # Sequence display with editable NumberBoxes
│   │   ├── NavBar/           # Navigation + auth
│   │   ├── SequenceEditor/   # Custom sequence CRUD
│   │   └── ...               # Other UI components
│   ├── hooks/
│   │   ├── use-interval.hook.js   # Declarative setInterval
│   │   └── use-keydown.hook.js    # Keyboard event handler
│   ├── data.js               # 40+ built-in sequence definitions
│   ├── utils.js              # Helpers (formatDate, range)
│   ├── constants.js          # App constants
│   ├── styles.css            # Global styles + CSS variables
│   └── reset.css             # CSS reset
├── oeis/                     # OEIS data files + upload script
├── next.config.mjs           # Static export config
├── tsconfig.json
└── package.json
```

## Development

### Prerequisites

- Node.js
- npm

### Setup

```bash
cd rc
npm install
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on localhost:3000 |
| `npm run build` | Build static export to `out/` |
| `npm start` | Serve the built site |
| `npm run typecheck` | Run TypeScript type checking |

### Environment Variables

Create `rc/.env` with:

```
NEXT_PUBLIC_MATRIX_URL=<unauthenticated API endpoint>
NEXT_PUBLIC_MATRIX_URL_AUTH=<authenticated API endpoint>
NEXT_PUBLIC_API_KEY=<API Gateway key>
NEXT_PUBLIC_AWS_USER_POOL_ID=<Cognito user pool ID>
NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=<Cognito client ID>
NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID=<Cognito identity pool ID>
```

## Deployment

Static export (`output: 'export'`) with `trailingSlash: true` — each route exports as `route/index.html`. Deployed to AWS Amplify via GitHub integration. All rendering is client-side (`ssr: false` on every page).

## TODOs

Found in `rc/src/components/DataProvider/DataProvider.js`:

- **Line 349**: `// Note incorporate functionality back into handleSequenceChange` — dead `handleAddZero` function (commented out, lines 350-358) should be refactored into `handleSequenceChange`
- **Line 360**: `// Note incorporate functionality back into handleSequenceChange` — dead `handleLeftShift` function (commented out, lines 361-369) should be refactored into `handleSequenceChange`

## License

MIT — Copyright (c) 2024 James Shapiro
