# SoftballProAI - Fastpitch Softball Coaching Platform

## Overview
SoftballProAI is an AI-powered platform for fastpitch softball coaches. It provides tools for analyzing athlete mechanics via video uploads, tracking progress, managing teams, and assigning personalized drills. The core capability is AI video breakdown focused on windmill pitching, drag foot technique, and softball-specific movements (rise ball, drop ball, curve ball, change-up). The platform aims to revolutionize fastpitch softball training by offering data-driven insights and personalized coaching at scale.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Visual Theme
- **Dark Mode Only** with a primary color palette of `brand-black` (#050505), `brand-neon` (#39FF14), `brand-pink` (#FF10F0), `brand-yellow` (#FAFF00), and `brand-blue` (#2800FF).
- **Typography**: Neon green or white for headings; light gray for body text.
- **Button Styles**: Glowing pink for primary CTAs, neon green borders for secondary buttons.
- **Containers**: Thin neon green or yellow borders.

### Frontend
- **Framework**: React 18 with TypeScript.
- **Routing**: Wouter.
- **State Management**: TanStack React Query.
- **Styling**: Tailwind CSS with shadcn/ui (New York style).
- **Form Handling**: React Hook Form with Zod validation.
- **Build Tool**: Vite.
- **Architecture**: Page-based with shared hooks for API logic and React Query integration. Sidebar navigation with responsive mobile support.

### Backend
- **Framework**: Express.js with TypeScript.
- **API Pattern**: RESTful JSON API with Zod schema validation.
- **Build**: esbuild.
- **Architecture**: Route registration pattern with shared route contracts for type-safe API calls.

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM.
- **Schema**: `shared/schema.ts` defines all tables.
- **Migrations**: Drizzle Kit.
- **Core Entities**: `coaches`, `teams`, `athletes`, `drills`, `mentalEdge`, `assessments`, `assessmentFeedback`.
- **Athlete Fields**: `firstName`, `lastName`, `playerPhone`, `parentPhone`, `parentEmail`, `goals`, `preferredTrainingDays`, `graduationYear`, `school`.

### Authentication
- **Provider**: Replit Auth (OpenID Connect).
- **Session Storage**: PostgreSQL-backed sessions.
- **User Management**: Auto-upsert on login with session persistence.
- **Security**: Passport.js integration with `isAuthenticated` middleware.

### File Uploads
- **Storage**: Replit Object Storage (Google Cloud Storage compatible).
- **Pattern**: Presigned URL flow.
- **Component**: `ObjectUploader` using Uppy with AWS S3 plugin.

### Biomechanics Engine (MediaPipe Pose)
- **Component**: `client/src/components/PoseAnalyzer.tsx`.
- **Features**: Real-time pose detection, skeleton overlay, auto-detection of dominant side, tracking loss detection.
- **Metrics Calculated**: Arm Slot Angle, Knee Flexion, Torque Separation (2D estimates).
- **Integration**: Used in AssessmentDetail page for live biomechanics display.

### AI Brain System
- **Purpose**: Core mechanics analysis engine recommending corrective drills based on biomechanical issues. Supports Pitching, Hitting, Catching, Throwing, and Mental performance.
- **Core Logic**: `server/brain/analyze_mechanics.ts` for issue-to-drill mapping.
- **Knowledge Base**: Seeded with 30 expert drills and 10 Mental Edge items.
- **Admin Dashboard**: `/admin/train-brain` for continuous training, adding drills, and mental content.
- **Issue Mapping**: Maps biomechanical issues to mechanic tags for drill matching.

### Head Coach Mode - Team Referrals
- **Functionality**: Coaches invite players to teams via unique referral links (`/register?ref=TEAM_ABC123`).
- **Automation**: Players automatically assigned to teams upon registration.
- **Permissions**: Head coaches have full edit access to team athletes.
- **Flow**: Coach shares link, player registers, profile created, role set to "player", dashboard unlocked.

### Private Instructor Mode
- **Functionality**: Manages 1-on-1 remote training for up to 25 students.
- **Smart Invites**: Unique referral URLs (`/register?ref=COACH_ABC123`) link students to coaches.
- **Baseline Protocol**: Students must upload 4 videos for coach approval before dashboard access.
- **Coach Review**: Coaches approve baseline before training plan release.
- **Database**: `coaches.referralCode`, `coaches.specialty`, `studentInvites`, `baselineVideos`, `playerOnboarding`.

### Universal Notification Engine
- **Purpose**: Real-time alerts and bi-directional communication for all user types.
- **Notification Types**: `training_reminder`, `championship_mindset`, `video_uploaded`, `baseline_ready`, `high_soreness_alert`, `injury_alert`, `roadmap_ready`, `homework_assigned`.
- **Database**: `notifications` table.
- **Trigger Points**: Player check-ins, video uploads, baseline completions, baseline approvals.
- **UI**: `NotificationBell` in dashboard header with unread count.

## External Dependencies

### Replit Integrations
- **Replit Auth**: OpenID Connect authentication.
- **Replit Object Storage**: File storage for video uploads.
- **Replit AI (OpenAI)**: AI analysis features.

### Database
- **PostgreSQL**: Primary data store.

### AI/ML Services
- **OpenAI API**: Used for video analysis and voice features.
- **ffmpeg**: Audio format conversion.
- **MediaPipe Pose**: Real-time biomechanical pose detection.

### Key npm Dependencies
- `drizzle-orm` / `drizzle-kit`
- `@tanstack/react-query`
- `@uppy/core` / `@uppy/aws-s3`
- `openid-client`
- `express-session`
- `zod`
- `@mediapipe/pose`
- `@mediapipe/drawing_utils`
- `@mediapipe/camera_utils`