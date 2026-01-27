# SwingAI - Softball Coaching Platform

## Overview

SwingAI is an AI-powered softball coaching platform that enables coaches to analyze athlete mechanics through video uploads, track athlete progress, manage teams, and assign personalized drills. The application uses AI video breakdown for performance analysis and provides a comprehensive dashboard for managing athletes and assessments.

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
- `drills` - Drill library with skill types and difficulty levels
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

### Key npm Dependencies
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `@tanstack/react-query`: Server state management
- `@uppy/core` / `@uppy/aws-s3`: File upload handling
- `openid-client`: OIDC authentication
- `express-session`: Session management
- `zod`: Schema validation across frontend and backend