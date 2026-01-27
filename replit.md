# SoftballProAI - Fastpitch Softball Coaching Platform

## Overview

SoftballProAI is an AI-powered FASTPITCH SOFTBALL coaching platform that enables coaches to analyze athlete mechanics through video uploads, track athlete progress, manage teams, and assign personalized drills. The application uses AI video breakdown for performance analysis with a focus on windmill pitching mechanics, drag foot technique, and softball-specific movements (rise ball, drop ball, curve ball, change-up).

## Visual Theme (Brand Palette)
- **Dark Mode Only**: Deepest black background (#050505)
- **Brand Colors**:
  - `brand-black`: #050505 (Body background)
  - `brand-neon`: #39FF14 (Primary green - headings, borders, glows)
  - `brand-pink`: #FF10F0 (Hot pink - CTA buttons with glow effect)
  - `brand-yellow`: #FAFF00 (Electric yellow - highlights, accents)
- **Typography**: 
  - h1, h2, h3: Neon green (#39FF14) or white with gradient
  - Body text: Light gray on dark backgrounds
- **Button Styles**:
  - Primary CTAs use `btn-primary-glow` class (pink with glowing box-shadow)
  - Secondary buttons use neon green borders
- **Cards/Containers**: Thin neon green or yellow borders to pop against black

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with hot module replacement

The frontend follows a page-based architecture with shared hooks for data fetching. Custom hooks (`use-athletes.ts`, `use-assessments.ts`, etc.) encapsulate API logic and provide React Query integration. The UI uses a sidebar navigation pattern with responsive mobile support via Sheet components.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful JSON API with Zod schema validation
- **Build**: esbuild for production bundling with selective dependency bundling

The server uses a route registration pattern where all API routes are defined in `server/routes.ts`. A shared route contract (`shared/routes.ts`) defines both input validation schemas and response types, enabling type-safe API calls between frontend and backend.

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)

Core entities include:
- `coaches` - Coach profiles linked to auth users
- `teams` - Team management with season tracking
- `athletes` - Athlete profiles with physical stats and positions
- `drills` - Drill library with skill types and difficulty levels (Pitching, Hitting, Catching, Throwing)
- `mentalEdge` - Mental performance content (visualization, mindset, motivation)
- `assessments` - Video assessments with AI analysis results
- `assessmentFeedback` - Coach feedback on assessments

### Authentication
- **Provider**: Replit Auth (OpenID Connect)
- **Session Storage**: PostgreSQL-backed sessions via `connect-pg-simple`
- **User Management**: Auto-upsert on login with session persistence

Authentication is handled through `server/replit_integrations/auth/` with Passport.js integration. The `isAuthenticated` middleware protects API routes.

### File Uploads
- **Storage**: Replit Object Storage (Google Cloud Storage compatible)
- **Upload Pattern**: Presigned URL flow - client requests URL, then uploads directly
- **Frontend Component**: `ObjectUploader` using Uppy with AWS S3 plugin

## External Dependencies

### Replit Integrations
- **Replit Auth**: OpenID Connect authentication with automatic user provisioning
- **Replit Object Storage**: File storage for video uploads with presigned URLs
- **Replit AI (OpenAI)**: AI analysis features accessed via `AI_INTEGRATIONS_OPENAI_API_KEY` and custom base URL

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Required Tables**: `sessions` and `users` tables are mandatory for Replit Auth

### AI/ML Services
- **OpenAI API**: Used for video analysis and voice features
- **Audio Processing**: ffmpeg for audio format conversion (WebM to WAV)

### AI Brain System
The Brain is the core mechanics analysis engine that recommends correction drills based on biomechanical issues. It supports the "whole athlete" model covering Pitching, Hitting, Catching, Throwing, and Mental performance.

**Key Components:**
- `server/brain/analyze_mechanics.ts` - Core analysis logic with issue-to-drill mapping
- `scripts/seed_drills.ts` - Knowledge Base seed script (30 expert drills + 10 Mental Edge items)
- `client/src/pages/TrainBrain.tsx` - Admin dashboard for continuous training

**Brain API Endpoints:**
- `POST /api/brain/analyze` - Analyze issues and get top 3 drill recommendations
- `POST /api/brain/train/drill` - Add new drill to knowledge base (validated with Zod)
- `POST /api/brain/train/mental-edge` - Add mental edge content (validated with Zod)
- `GET /api/brain/corrective-drills?skillType=pitching&issue=hunched+forward` - Quick lookup
- `GET /api/brain/drills-by-tag?tag=Internal+Rotation` - Search by mechanic tag
- `GET /api/brain/drills-by-expert?expert=Amanda+Scarborough` - Search by expert source

**Admin Training Dashboard:**
- Route: `/admin/train-brain`
- Tabs: Drill Knowledge, Mental Edge
- Features: Add drills with YouTube URLs, mechanic tags, categories; Add mental content with usage context
- Accessible via sidebar "Train Brain" link

**Knowledge Base Structure:**
Drills include: name, category (Pitching/Hitting/Catching/Throwing), expertSource, mechanicTags[], issueAddressed, videoUrl, difficulty
Mental Edge includes: title, contentType (visualization/mindset/quote/video), category, source, tags, usageContext (pre-game/mid-game/off-day)

**Seeded Content:**
- 30 expert drills emphasizing biomechanical physics (internal rotation, rotational mechanics)
- 10 Mental Edge items including 6 Kobe Bryant Mamba Mentality principles

**Issue Mapping:**
The Brain maps biomechanical issues to mechanic tags for intelligent drill matching:
- "hunched forward" → ["Posture", "Spine Angle", "Balance"]
- "weak leg drive" → ["Leg Drive", "Explosive Power", "Kinetic Chain"]
- "lunging" → ["Stay Back", "Load", "Balance"]

### Key npm Dependencies
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `@tanstack/react-query`: Server state management
- `@uppy/core` / `@uppy/aws-s3`: File upload handling
- `openid-client`: OIDC authentication
- `express-session`: Session management
- `zod`: Schema validation across frontend and backend