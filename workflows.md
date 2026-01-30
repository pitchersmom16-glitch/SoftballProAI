#
**Document Version:** 1.1 - Parent-First Flow Update  
**Last Updated:** January 30, 2026  
**Purpose:** Complete technical documentation of all user flows, database requirements, API endpoints, and validation rules

---

## 🔁 Live Updates (canonical change log)
Keep this section current. Whenever code, routes, or user flows are changed, add a short entry with: **date**, **one-line summary**, **commit hash**, and **author**. This is the single source of truth for other agents (e.g., Claude) and collaborators.

- 2026-01-30 — chore(workflows): auto-sync root and Claude workflows; update rules (commit: `b15186a`) — author: pitchersmom16-glitch
- 2026-01-30 — chore(workflows): use .cjs helper so script runs in repo with type=module (commit: `0671793`) — author: pitchersmom16-glitch
- 2026-01-30 — Removed `READY_TO_TEST.md` and `FIXES_FOR_TOMORROW.md` (commit: `7dd0c97`) — Commit message: "chore: remove READY_TO_TEST.md and FIXES_FOR_TOMORROW.md — workflows.md is canonical" — author: GitHub Copilot

**How to add an entry:**
1. Edit this file and prepend the latest entry to this list.  
2. Include a short summary (1 sentence), the commit hash, and a link to the PR or commit when possible.  
3. Commit with message: `docs(workflows): <short summary>` and push to `main`.

---

## Table of Contents
1. [Player Mode Workflow - PARENT-FIRST](#player-mode-workflow)
2. [Private Instructor Workflow](#private-i)
 Role Select → Parent Account Setup → Position Select → Video Upload → AI Analysis → Dashboard
 ```

 ### Step 1: Role Selection
 - **Route**: After clicking "Get Started"
 - **Action**: User selects "Player" card
 - **Backend**: `POST /api/user/role` sets `role='player'`

 ### Step 2: Parent Account Setup (UPDATED - Parent-First Flow)
 - **Route**: `/profile/setup`
 - **Component**: `ProfileSetup.tsx` (**COMPLETED**)

 **Industry Research Results:**
 - ✅ **8/8 youth sports apps use parent-first flow**
 - ✅ Parents create accounts, manage athlete profiles
 - ✅ Parents handle payments (not athletes)
 - ✅ Athletes are sub-profiles under parent accounts

 **Required Fields:**
 - **Parent Information:** First Name, Last Name, Email, Phone
 - **Athlete Information:** First Name, Last Name, DOB, Grade, School
 - **Terms:** Accept Terms, Accept 14-day Trial
 - **Payment:** Stripe - 14-day free trial, then $14.99/mo

 **Database Updates:**
 ```sql
 -- users table (parent account)
 firstName, lastName, email (updated)

 -- athletes table (athlete profile linked to parent)
 userId (parent), firstName, lastName, dob, grade, school, parentEmail, parentPhone
 ```

 **Validation Rules:**
 - Parent email must be valid format
 - Athlete age: 5-25 years (reasonable range for youth sports)
 - Grade: 3rd-12th + College
 - All required fields must be filled

 ### Step 3: Position Selection  
 - **Route**: `/position/select`
 - **Component**: `PositionSelection.tsx` (**TO BE CREATED**)

 **Options:**
 - Primary Position: Pitcher | Catcher | Infield | Outfield (**required**)
 - Secondary Position: Same + None (optional)

 **Database Updates:**
 ```
 primaryPosition, secondaryPosition, positionSelectedAt
 ```

 ### Step 4: Baseline Videos (Position-Specific)
 - **Route**: `/player/onboarding`
 - **Component**: `PlayerOnboarding.tsx` (EXISTS)

 **PITCHER (4 videos):**
 1. Fastball - Side View (3-5 reps, show leg drive, hip rotation, release)
 2. Fastball - Rear View (3-5 reps, show stride alignment, glove side)
 3. Change-up (3-5 reps, show arm speed consistency)
 4. Movement Pitch - Curve/Rise/Drop (best pitch, spin mechanics)

 **CATCHER (4 videos):**
 1. Receiving/Framing (5-10 pitches from front, stay low)
 2. Blocking (5-10 balls in dirt from front)
 3. Pop Time/Throw-downs (throw to 2nd, show transfer speed)
 4. Footwork (side view of catch-to-throw transition)

 **INFIELD (4 videos):**
 1. Fielding Ground Balls - Front (5-10 balls hit at you)
 2. Fielding Backhand/Forehand (balls to left and right)
 3. Throwing - Side View (after fielding, full arm action)
 4. Slow Rollers (charging bunts/choppers, quick release)

 **OUTFIELD (4 videos):**
 1. Fly Balls - Front View (5-10 reps, tracking)
 2. Throwing to Bases (to 3rd/home, full arm extension)
 3. Fielding Ground Balls (quick throws to bases)
 4. First Step Reaction (balls over head or to sides)

 **Database Updates:**
 ```
 baselineVideos table: 4 video URLs + metadata
 baselineComplete = FALSE (until coach reviews)
 ```

 ### Step 5: AI Analysis
 - **Trigger**: After 4 videos uploaded
 - **Process**: MediaPipe biomechanics analysis
 - **Output**: 5 SMART goals based on mechanics
 - **Duration**: ~15-30 seconds

 ### Step 6: Dashboard Unlock
 - **Condition**: Coach reviews baseline OR auto-approve after 24hrs
 - **Action**: `dashboardUnlocked = TRUE`
 - **Features**: Goals, Drills, Progress, Daily Check-ins

 ---

 ## OnboardingGate Logic (UPDATED - Parent-First Flow)

 **Current Implementation:**
 ```javascript
 // Check if athlete profile exists for current user (parent)
 const { data: athlete } = useQuery(["/api/player/athlete"]);

 // Check onboarding status
 const { data: onboarding } = useQuery(["/api/player/onboarding"]);

 if (!athlete) {
   // No athlete profile found - redirect to profile setup
   redirect("/profile/setup");
   return;
 }

 if (!athlete.primaryPosition) {
   // Athlete exists but no position selected - redirect to position selection
   redirect("/position/select");
   return;
 }

 if (!onboarding?.dashboardUnlocked) {
   // Position selected but onboarding not complete - redirect to video upload
   redirect("/player/onboarding");
   return;
 }

 // All checks passed - show dashboard
 ```

 **Database Relationships:**
 ```sql
 -- Parent user account (from Replit Auth)
 users.id = parent_user_id

 -- Athlete profile linked to parent
 athletes.userId = parent_user_id
 athletes.id = athlete_id

 -- Onboarding status for athlete
 playerOnboarding.userId = parent_user_id
 ```

             ---

             ## Implementation Checklist

             ### Phase 1: Profile Setup (COMPLETED)
             - [x] Create `ProfileSetup.tsx` component with parent-first flow
             - [x] Add Stripe payment form integration
             - [x] Add age validation (5-25 years for athletes)
             - [x] Add parent fields (always required in parent-first flow)
             - [x] Create `POST /api/user/profile` endpoint for parent-athlete data
             - [x] Update database schema (athletes linked to parent users)
             - [x] Update OnboardingGate to check athlete profile existence
             - [x] Add `/api/player/athlete` endpoint
             - [x] Add `/api/player/onboarding` endpoint

             ### Phase 2: Position Selection (PRIORITY 2)
             - [x] Create `PositionSelection.tsx` component (COMPLETED)
             - [x] Add position cards with icons
             - [ ] Create `POST /api/user/position` endpoint (if needed)
             - [x] Update OnboardingGate to check `athlete.primaryPosition`

             ### Phase 3: Video Upload Updates (PRIORITY 3)
             - [ ] Update `PlayerOnboarding.tsx` to show position-specific prompts
             - [ ] Create position-specific prompt generator
             - [ ] Test all 4 positions

             ---

             **NEXT STEPS:**
             1. Get approval on this workflow
             2. Implement ProfileSetup component
             3. Implement PositionSelection component
             4. Update OnboardingGate logic
             5. Test complete flow



             ---

             ## AI Agent vs Workflow Mode (CRITICAL TRUST FEATURE)

             ### Purpose
             Give coaches control over AI-generated content to catch hallucinations and maintain quality.

             ### Settings Location
             - Private Instructor Settings
             - Team Coach Settings
             - Player Settings (if they have a connected coach)

             ### Two Modes

             **AI Agent Mode (Autonomous)**
             - AI generates analysis/goals/drills
             - Automatically sent to player immediately
             - Coach gets notification but no approval required
             - Faster, but less control

             **AI Workflow Mode (Human-in-the-Loop)**
             - AI generates analysis/goals/drills
             - Held in "Pending Review" status
             - Coach receives notification
             - Coach can: Approve | Edit | Reject | Add Notes
             - Only sent to player after coach approval
             - Slower, but quality-controlled

             ### Database Schema
             ```sql
             -- coaches table (instructors and team coaches)
             aiMode: ENUM('agent', 'workflow') DEFAULT 'workflow'
             autoApproveAnalysis: BOOLEAN DEFAULT FALSE
             autoApproveGoals: BOOLEAN DEFAULT FALSE
             autoApproveDrills: BOOLEAN DEFAULT FALSE

             -- analysis_queue table (new)
             id: UUID
             playerId: UUID
             coachId: UUID
             analysisType: ENUM('baseline', 'progress', 'goal_update')
             aiGeneratedContent: JSON
             status: ENUM('pending_review', 'approved', 'rejected', 'edited')
             coachNotes: TEXT
             generatedAt: TIMESTAMP
             reviewedAt: TIMESTAMP
             sentToPlayerAt: TIMESTAMP
             ```

             ### API Endpoints
             ```
             POST /api/coach/settings/ai-mode
             { aiMode: 'agent' | 'workflow' }

             GET /api/coach/pending-reviews
             Returns list of analyses waiting for approval

             POST /api/coach/review/:analysisId
             { action: 'approve' | 'reject' | 'edit', editedContent?: JSON, notes?: string }
             ```

             ### Implementation Priority
             **Phase 4** (After basic Player flow works)

             ---

             ## Player-Coach Connection (CRITICAL SALES FEATURE)

             ### Purpose
             Allow flexible relationships between players and coaches regardless of who signed up first.

             ### Two Connection Flows

             ### Flow A: Coach Invites Player (Already Building)
             1. Private Instructor signs up ($49.99/mo)
             2. Clicks "Add Player"
             3. Enters player email/phone
             4. System sends invite code via SMS/email
             5. Player clicks link → Creates account (FREE - covered by coach)
             6. Player completes profile + position
             7. Player uploads baseline videos
             8. Videos appear in Coach's roster

             ### Flow B: Player Invites Coach (NEW FEATURE)
             1. Player signs up as Individual ($14.99/mo)
             2. Completes profile, uploads videos
             3. Clicks "Connect to Coach" in settings
             4. Enters coach email or invite code
             5. Three scenarios:

             **Scenario B1: Coach already has account**
             - Coach receives connection request
             - Coach clicks Accept
             - Player appears in coach roster
             - Player keeps paying $14.99/mo
             - Coach sees player data (view-only or edit based on permissions)

             **Scenario B2: Coach doesn't have account**
             - Coach receives invite email
             - Coach signs up as Private Instructor
             - Automatically connected to player
             - Coach decides: Free (view only) or Manage ($49.99/mo to take over)

             **Scenario B3: Player transfers to coach**
             - Player cancels their $14.99 subscription
             - Coach adds player to their roster
             - Coach now pays for player
             - More complex billing logic

             ### Database Schema
             ```sql
             -- player_coach_relationships table (new)
             id: UUID
             playerId: UUID
             coachId: UUID
             relationshipType: ENUM('coach_invited', 'player_invited', 'transferred')
             initiatedBy: ENUM('player', 'coach')
             status: ENUM('pending', 'active', 'rejected', 'ended')
             permissions: JSON  -- ['view_videos', 'view_analysis', 'create_goals', 'assign_drills', 'approve_analysis']
             paymentResponsibility: ENUM('player', 'coach')
             createdAt: TIMESTAMP
             acceptedAt: TIMESTAMP
             endedAt: TIMESTAMP

             -- Add to users table
             connectedCoachId: UUID NULLABLE
             coachConnectionStatus: ENUM('none', 'invited', 'connected')
             ```

             ### API Endpoints
             ```
             POST /api/player/invite-coach
             { coachEmail: string, message?: string }

             GET /api/coach/connection-requests
             Returns pending player invites

             POST /api/coach/accept-player
             { playerId: UUID, permissions: string[] }

             POST /api/coach/reject-player
             { playerId: UUID, reason?: string }

             POST /api/player/transfer-to-coach
             { coachId: UUID }  -- Initiates billing transfer

             DELETE /api/player/disconnect-coach
             { coachId: UUID }
             ```

             ### UI Components Needed
             ```
             - ConnectCoachButton.tsx (in Player settings)
             - CoachInviteModal.tsx (player enters coach email)
             - ConnectionRequestsList.tsx (coach dashboard)
             - PermissionsSelector.tsx (coach chooses what they can do)
             - TransferConfirmation.tsx (if player transfers payment)
             ```

             ### Business Logic Rules
             1. Player can only connect to ONE coach at a time (MVP - multi-coach in v2)
             2. If player-initiated: Player keeps paying unless they explicitly transfer
             3. If coach-initiated: Coach always pays
             4. Coach can "release" player back to individual status
             5. Player can disconnect from coach anytime (keeps their data)

             ### Implementation Priority
             **Phase 5** (After AI Workflow mode works)

             ---

             ## Updated Implementation Roadmap

             ### PRIORITY 1: Basic Player Flow (COMPLETED ✅)
             - [x] Document workflows ✓
             - [x] ProfileSetup component with parent-first flow ✓
             - [x] PositionSelection component ✓
             - [x] Update OnboardingGate logic ✓
             - [x] Add `/api/player/athlete` endpoint ✓
             - [x] Add `/api/player/onboarding` endpoint ✓
             - [x] Add `PUT /api/athletes/:id` endpoint ✓
             - [x] Test complete parent-first signup flow (READY FOR TESTING)

             ### PRIORITY 2: Position-Specific Videos (NEXT)
             - [ ] Update PlayerOnboarding with position prompts
             - [ ] Test all 4 positions

             ### PRIORITY 3: Private Instructor Flow (AFTER VIDEOS)
             - [ ] Instructor signup form
             - [ ] "Add Player" functionality
             - [ ] Invite system

             ### PRIORITY 4: AI Agent/Workflow Mode (DAY 3)
             - [ ] Settings toggle
             - [ ] Pending review queue
             - [ ] Approval/edit/reject flow

             ### PRIORITY 5: Player-Coach Connection (DAY 4)
             - [ ] Player invite coach feature
             - [ ] Coach accept/reject
             - [ ] Permissions system
             - [ ] Billing transfer (optional)

             ### PRIORITY 6: Team Coach Mode (WEEK 2)
             - [ ] Team creation
             - [ ] Roster management
             - [ ] GameChanger integration

             ---

             **DOCUMENTATION COMPLETE! Ready to start coding.**

