# 🚀 Development Environment Setup Guide

## Quick Start (5 minutes)

```bash
# 1. Clone and install
git clone <repo-url>
cd SoftballProAI
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your credentials

# 3. Set up database
npm run db:push

# 4. Start development server
npm run dev

# 5. Test the Brain
./test-brain.sh
```

---

## Detailed Setup

### 1. Prerequisites

**Required:**
- Node.js 18+ ([download](https://nodejs.org))
- PostgreSQL 14+ (local or hosted)
- Git

**Optional but Recommended:**
- [Postman](https://www.postman.com/downloads/) for API testing
- [pgAdmin](https://www.pgadmin.org/download/) for database management
- [VS Code](https://code.visualstudio.com/) with recommended extensions

---

### 2. Environment Variables

Create `.env` file from template:

```bash
cp .env.example .env
```

**Required Variables:**

```env
# Database (REQUIRED)
DATABASE_URL=postgresql://user:password@localhost:5432/softballproai

# Session (REQUIRED)
SESSION_SECRET=your_long_random_string_here

# OpenAI (REQUIRED for AI features)
AI_INTEGRATIONS_OPENAI_API_KEY=sk-...

# Stripe (REQUIRED for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# App Config
BASE_URL=http://localhost:5000
PORT=5000
NODE_ENV=development
```

**How to get credentials:**

**DATABASE_URL:**
- **Local PostgreSQL:**
  ```bash
  # Install PostgreSQL
  # macOS: brew install postgresql
  # Ubuntu: sudo apt-get install postgresql
  
  # Create database
  psql -U postgres
  CREATE DATABASE softballproai;
  CREATE USER softballuser WITH PASSWORD 'yourpassword';
  GRANT ALL PRIVILEGES ON DATABASE softballproai TO softballuser;
  
  # Your DATABASE_URL:
  postgresql://softballuser:yourpassword@localhost:5432/softballproai
  ```

- **Supabase (Hosted):**
  1. Go to [supabase.com](https://supabase.com)
  2. Create new project
  3. Go to Settings → Database
  4. Copy "Connection String" (URI format)
  5. Paste as DATABASE_URL

**OPENAI_API_KEY:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up/login
3. Go to API Keys section
4. Create new secret key
5. Copy and paste into .env

**STRIPE KEYS:**
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Get Test API keys (for development)
3. Copy Secret and Publishable keys

---

### 3. Database Setup

**Option A: Automatic Setup (Recommended)**

```bash
# Push schema to database
npm run db:push

# Optional: Seed with test data
npm run seed  # (if seed script exists)
```

**Option B: Manual Migration**

```bash
# Generate migration
npx drizzle-kit generate

# Apply migration
npx drizzle-kit push
```

**Verify Database:**

```bash
# Using psql
psql $DATABASE_URL -c "\dt"

# Should see tables: users, athletes, assessments, drills, etc.
```

---

### 4. Install Dependencies

```bash
npm install
```

**If you encounter errors:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### 5. Start Development Server

```bash
npm run dev
```

**Expected output:**
```
Server starting...
Database connected
serving on port 5000
```

**Open in browser:**
- Frontend: http://localhost:5000
- API: http://localhost:5000/api

---

### 6. Verify Setup

**Test TypeScript compilation:**
```bash
npm run check
# Should output: No errors!
```

**Test Brain API:**
```bash
./test-brain.sh
# Should show all tests passing
```

**Manual API test:**
```bash
curl http://localhost:5000/api/brain/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "skillType": "PITCHING",
    "detectedIssues": ["hunched forward"],
    "athleteLevel": "Intermediate",
    "limit": 3
  }'
```

---

## Common Issues & Solutions

### Issue: "DATABASE_URL must be set"

**Solution:**
```bash
# Verify .env file exists
ls -la .env

# Check DATABASE_URL is set
cat .env | grep DATABASE_URL

# If missing, add it:
echo 'DATABASE_URL=postgresql://user:password@localhost:5432/softballproai' >> .env
```

### Issue: "Cannot connect to database"

**Solution:**
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1"

# If fails, check:
# 1. PostgreSQL is running
# 2. Credentials are correct
# 3. Database exists
# 4. Firewall allows connection
```

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3000 npm run dev
```

### Issue: "npm run dev" doesn't start

**Solution:**
```bash
# Check Node version (need 18+)
node --version

# Install tsx globally
npm install -g tsx

# Try again
npm run dev
```

### Issue: "Brain endpoints return 500 error"

**Possible causes:**
1. Database not connected
2. Missing tables (run db:push)
3. OpenAI API key missing (for some features)

**Debug:**
```bash
# Check server logs
# Look for specific error messages

# Test database
psql $DATABASE_URL -c "SELECT * FROM drills LIMIT 1"

# Verify .env
cat .env
```

---

## Development Workflow

### Daily Workflow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Apply any new migrations
npm run db:push

# 4. Start dev server
npm run dev

# 5. Make changes

# 6. Test your changes
npm run check      # TypeScript
./test-brain.sh    # Brain API
npm test          # Unit tests

# 7. Commit and push
git add .
git commit -m "Description"
git push
```

### Testing Workflow

```bash
# Run TypeScript check
npm run check

# Run unit tests
npm test

# Run Brain tests
./test-brain.sh

# Test specific endpoint
curl http://localhost:5000/api/brain/analyze \
  -H "Content-Type: application/json" \
  -d @test-data/pitching-analysis.json
```

### Database Workflow

```bash
# View current schema
npx drizzle-kit introspect

# Generate migration after schema changes
npx drizzle-kit generate

# Push changes to database
npm run db:push

# View database in studio (if available)
npx drizzle-kit studio
```

---

## Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "PostgreSQL.vscode-postgresql",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

## Project Structure

```
SoftballProAI/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   └── hooks/         # React hooks
├── server/                # Express backend
│   ├── brain/            # 🧠 AI Brain module
│   │   ├── analyze_mechanics.ts
│   │   ├── analysis_engine.ts
│   │   └── knowledge bases
│   ├── routes.ts         # API endpoints
│   ├── db.ts             # Database connection
│   └── index.ts          # Server entry point
├── shared/               # Shared code
│   ├── schema.ts         # Database schema
│   └── routes.ts         # API types
├── migrations/           # Database migrations
├── .env                  # Environment variables (create this)
├── .env.example          # Template
└── package.json
```

---

## Next Steps

**After setup:**

1. **Explore the Brain:**
   - Read `BRAIN_API.md` for API docs
   - Review `server/brain/README.md` for Brain architecture
   - Check `server/brain/INTEGRATION_GUIDE.md` for integration examples

2. **Test Endpoints:**
   - Use Postman collection (if available)
   - Run `./test-brain.sh`
   - Try manual curl commands

3. **Start Development:**
   - Pick a task from the project board
   - Create feature branch
   - Make changes
   - Test thoroughly
   - Submit PR

---

## Getting Help

**Resources:**
- Brain API Docs: `BRAIN_API.md`
- Brain Integration: `server/brain/INTEGRATION_GUIDE.md`
- Brain README: `server/brain/README.md`
- Project README: `README.md`

**If stuck:**
1. Check this setup guide
2. Review error messages
3. Search issues on GitHub
4. Ask in team chat

---

## Production Deployment

**Not covered in dev setup, but important:**

1. Set `NODE_ENV=production`
2. Use strong SESSION_SECRET
3. Use production Stripe keys
4. Set up database backups
5. Enable HTTPS
6. Set up monitoring
7. Configure CORS properly
8. Set up error tracking (Sentry, etc.)

---

**Setup time:** ~5-15 minutes
**Last updated:** February 2, 2026
