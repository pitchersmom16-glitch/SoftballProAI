# 🧪 Complete Testing Guide - Brain + Feedback System

**Ready to test when you return!** This guide walks through testing the entire Brain and continuous learning system.

---

## ⚡ Quick Start (5 Minutes)

```bash
# 1. Ensure dependencies installed
npm install

# 2. Verify clean room
npm run check  # Should show 0 errors

# 3. Setup database
npm run db:push

# 4. Start server
npm run dev

# 5. Run complete test suite (in another terminal)
./test-brain-complete.sh
```

---

## 📋 Testing Checklist

### ✅ Phase 1: Environment Setup
- [ ] Dependencies installed (`npm install`)
- [ ] TypeScript compiles (`npm run check` → 0 errors)
- [ ] Database created (`npm run db:push`)
- [ ] Server starts (`npm run dev`)
- [ ] Server accessible at http://localhost:5000

### ✅ Phase 2: Brain API Testing
- [ ] POST /api/brain/analyze returns recommendations
- [ ] Brain returns `brainDecisionId` in every response
- [ ] GET /api/brain/corrective-drills works
- [ ] GET /api/brain/drills-by-tag works
- [ ] GET /api/brain/drills-by-expert works

### ✅ Phase 3: Feedback System Testing
- [ ] POST /api/brain/feedback accepts valid feedback
- [ ] GET /api/brain/feedback/summary retrieves feedback
- [ ] Feedback requires authentication
- [ ] Invalid feedback data is rejected

### ✅ Phase 4: End-to-End Flow
- [ ] Get recommendation from Brain
- [ ] Capture brainDecisionId
- [ ] Log user reaction
- [ ] Query feedback summary
- [ ] Verify data persisted

---

## 🚀 Test Methods

### Method 1: Automated Script (Easiest)

```bash
./test-brain-complete.sh
```

**What it tests:**
- All Brain endpoints (analyze, corrective drills, by tag, by expert)
- Decision ID generation
- Feedback endpoints (shows 401 without auth - expected)
- Edge cases (empty issues, invalid types)
- Response format validation

**Expected output:**
```
========================================
🧠 SoftballProAI Complete Test Suite
========================================
...
✓ PASSED (HTTP 200)
→ Captured brainDecisionId: brain_1738515234567_abc123
...
📊 Test Results Summary
Total Tests: 15
Passed: 15
Failed: 0
Warnings: 0
🎉 All tests passed perfectly!
```

### Method 2: Manual curl Commands

#### Test Brain Analysis
```bash
curl -X POST http://localhost:5000/api/brain/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "skillType": "PITCHING",
    "detectedIssues": ["hunched forward", "weak leg drive"],
    "athleteLevel": "Intermediate",
    "limit": 3
  }' | jq .
```

**Expected response:**
```json
{
  "brainDecisionId": "brain_1738515234567_abc123def",
  "skillType": "PITCHING",
  "analyzedIssues": ["hunched forward", "weak leg drive"],
  "recommendations": [
    {
      "id": 42,
      "name": "Posture Reset Drill",
      "relevanceScore": 0.95,
      "matchReason": "Directly addresses hunched forward issue",
      ...
    }
  ],
  "totalDrillsSearched": 87
}
```

#### Test Feedback Logging (Requires Auth)

First, login to get session cookie, then:

```bash
# Save session cookie
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"coach@test.com","password":"password"}' \
  -c cookies.txt

# Log feedback with cookie
curl -X POST http://localhost:5000/api/brain/feedback \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "brainDecisionId": "brain_1738515234567_abc123def",
    "role": "coach",
    "decisionType": "drill",
    "skillType": "PITCHING",
    "athleteAge": 12,
    "athleteLevel": "Intermediate",
    "detectedIssues": ["hunched forward"],
    "rating": 5,
    "action": "accepted"
  }' | jq .
```

**Expected response:**
```json
{
  "message": "Feedback recorded",
  "eventId": 1
}
```

#### Query Feedback Summary
```bash
curl http://localhost:5000/api/brain/feedback/summary?skillType=PITCHING&limit=10 \
  -b cookies.txt | jq .
```

### Method 3: Postman Collection

1. Import `Brain_API.postman_collection.json`
2. Set `baseUrl` variable to `http://localhost:5000`
3. Login to get session
4. Test endpoints one by one

---

## 🧪 Test Scenarios

### Scenario 1: Drill Recommendation Flow

**Steps:**
1. Call POST /api/brain/analyze with issues
2. Receive recommendations + brainDecisionId
3. User accepts a drill
4. Log feedback with "accepted" action
5. Query feedback to verify

**Manual test:**
```bash
# 1. Get recommendation
RESPONSE=$(curl -s -X POST http://localhost:5000/api/brain/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "skillType": "PITCHING",
    "detectedIssues": ["hunched forward"],
    "athleteLevel": "Intermediate",
    "limit": 1
  }')

# 2. Extract decision ID
DECISION_ID=$(echo $RESPONSE | jq -r '.brainDecisionId')
echo "Decision ID: $DECISION_ID"

# 3. Log acceptance (with auth cookie)
curl -X POST http://localhost:5000/api/brain/feedback \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{
    \"brainDecisionId\": \"$DECISION_ID\",
    \"role\": \"coach\",
    \"decisionType\": \"drill\",
    \"skillType\": \"PITCHING\",
    \"athleteAge\": 12,
    \"athleteLevel\": \"Intermediate\",
    \"detectedIssues\": [\"hunched forward\"],
    \"rating\": 5,
    \"action\": \"accepted\"
  }" | jq .
```

### Scenario 2: Drill Rejection with Pushback

**Steps:**
1. Get recommendation
2. User rejects drill
3. User provides pushback text
4. Log feedback with "rejected" action + text
5. Verify Brain can learn from pushback

**Test:**
```bash
curl -X POST http://localhost:5000/api/brain/feedback \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "brainDecisionId": "brain_xyz_123",
    "role": "coach",
    "decisionType": "drill",
    "skillType": "PITCHING",
    "athleteAge": 10,
    "athleteLevel": "Beginner",
    "detectedIssues": ["weak leg drive"],
    "rating": 2,
    "action": "rejected",
    "pushbackText": "This drill is too advanced for 10U beginners. Need simpler foundational drill."
  }' | jq .
```

### Scenario 3: Drill Rating After Completion

**Steps:**
1. Get recommendation (saved earlier)
2. Athlete completes drill
3. User rates the drill
4. Log feedback with rating + "completed" action

**Test:**
```bash
curl -X POST http://localhost:5000/api/brain/feedback \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "brainDecisionId": "brain_completed_drill_123",
    "role": "player",
    "decisionType": "drill",
    "skillType": "HITTING",
    "athleteAge": 14,
    "athleteLevel": "Advanced",
    "detectedIssues": ["casting"],
    "rating": 4,
    "action": "completed",
    "pushbackText": "Drill helped, but video example could be clearer"
  }' | jq .
```

### Scenario 4: Coach Analytics View

**Steps:**
1. Query all feedback for PITCHING
2. Filter by high ratings (≥4)
3. Identify most effective drills
4. Find common pushback patterns

**Test:**
```bash
# Get all PITCHING feedback
curl http://localhost:5000/api/brain/feedback/summary?skillType=PITCHING&limit=100 \
  -b cookies.txt | jq '[.[] | select(.rating >= 4)]'

# Get rejected drills with pushback
curl http://localhost:5000/api/brain/feedback/summary?skillType=PITCHING&limit=100 \
  -b cookies.txt | jq '[.[] | select(.action == "rejected" and .pushbackText != null)]'
```

---

## 🔍 Verification Checklist

### Brain API
- [ ] Returns brainDecisionId with every recommendation
- [ ] Decision ID format: `brain_{timestamp}_{random}`
- [ ] All 4 skill types work (PITCHING, HITTING, CATCHING, FIELDING)
- [ ] Recommendations ranked by relevance score
- [ ] Empty issues handled gracefully
- [ ] Invalid skill types rejected with 400

### Feedback System
- [ ] POST /feedback requires authentication (401 without)
- [ ] POST /feedback validates input with Zod
- [ ] POST /feedback stores all required fields
- [ ] GET /feedback/summary requires authentication
- [ ] GET /feedback/summary filters work (skillType, decisionType)
- [ ] Feedback persists in database

### Data Quality
- [ ] brainDecisionId is unique per recommendation
- [ ] User context captured (age, level, issues)
- [ ] Ratings are 1-5 integers
- [ ] Actions are valid enums
- [ ] Timestamps are accurate

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port is in use
lsof -i :5000
kill -9 <PID>

# Check environment variables
cat .env

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Database errors
```bash
# Reset database
npm run db:push

# Check connection
psql $DATABASE_URL -c "SELECT 1"
```

### TypeScript errors
```bash
# Verify clean room
npm run check

# Should show 0 errors
# If not, check which files have errors
```

### Authentication issues
```bash
# Create test user (if needed)
# Login through UI or API
# Save session cookie for tests
```

### Feedback not saving
```bash
# Check database has feedbackEvents table
psql $DATABASE_URL -c "\d feedback_events"

# Check logs for errors
# Verify request body matches schema
```

---

## 📊 Expected Test Results

### Automated Script
```
Total Tests: 15
Passed: 15
Failed: 0
Warnings: 0
```

### Manual Testing
- Brain endpoints: 200 OK with valid JSON
- Feedback endpoints: 401 (without auth) or 201 (with auth)
- Invalid requests: 400 Bad Request

### Database
After testing, check database:
```sql
-- Should have feedback events
SELECT COUNT(*) FROM feedback_events;

-- Should have various actions
SELECT action, COUNT(*) FROM feedback_events GROUP BY action;

-- Should have ratings
SELECT AVG(rating) FROM feedback_events WHERE rating IS NOT NULL;
```

---

## ✅ Success Criteria

**The system is working if:**
1. ✅ All automated tests pass
2. ✅ Brain returns decision IDs
3. ✅ Feedback can be logged (with auth)
4. ✅ Feedback can be queried (with auth)
5. ✅ Data persists in database
6. ✅ No TypeScript errors
7. ✅ Server runs without crashes

---

## 🚀 Next Steps After Testing

Once testing is complete:

### If everything works ✅
1. Proceed to frontend integration
2. Wire feedback buttons in UI
3. Test end-to-end with browser
4. Deploy to staging

### If issues found ❌
1. Document specific errors
2. Check logs for stack traces
3. Verify schema matches code
4. Fix issues one by one
5. Re-run tests

---

## 📝 Notes

- Feedback endpoints require authentication by design
- Tests show 401 for feedback endpoints when not authenticated (expected)
- Brain endpoints work without authentication (for testing)
- Use cookies.txt or Postman for authenticated testing
- Database must be seeded with at least one user to login

---

**Status:** Ready to test! 🎉  
**Last Updated:** February 2, 2026  
**Test Coverage:** Complete Brain + Feedback system
