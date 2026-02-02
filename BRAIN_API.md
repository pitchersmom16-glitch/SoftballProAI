# 🧠 Brain API Documentation

## Overview

The Brain API provides AI-powered softball coaching analysis, drill recommendations, and mental training content. It analyzes player mechanics and suggests corrective drills based on detected issues.

---

## Endpoints

### 1. POST /api/brain/analyze

**Purpose:** Analyze softball mechanics and get personalized drill recommendations

**Request Body:**
```json
{
  "skillType": "PITCHING" | "HITTING" | "CATCHING" | "FIELDING",
  "detectedIssues": ["hunched forward", "weak leg drive"],
  "athleteLevel": "Beginner" | "Intermediate" | "Advanced",
  "limit": 3
}
```

**Response:**
```json
{
  "analyzedIssues": ["hunched forward", "weak leg drive"],
  "recommendations": [
    {
      "id": 1,
      "name": "Posture Reset Drill",
      "category": "PITCHING",
      "difficulty": "Intermediate",
      "description": "Focus on maintaining upright posture through the motion",
      "videoUrl": "https://...",
      "expertSource": "Amanda Scarborough",
      "relevanceScore": 0.95,
      "matchReason": "Directly addresses hunched forward issue"
    }
  ]
}
```

**Example curl:**
```bash
curl -X POST http://localhost:5000/api/brain/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "skillType": "PITCHING",
    "detectedIssues": ["hunched forward", "weak leg drive"],
    "athleteLevel": "Intermediate",
    "limit": 3
  }'
```

---

### 2. GET /api/brain/corrective-drills

**Purpose:** Get drills that address specific mechanical issues

**Query Parameters:**
- `issues` (required): Comma-separated list of issues
- Example: `?issues=hunched forward,weak leg drive`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Posture Reset Drill",
    "category": "PITCHING",
    "difficulty": "Intermediate",
    "description": "Focus on maintaining upright posture",
    "videoUrl": "https://...",
    "mechanicTags": ["posture", "spine-angle", "balance"],
    "expertSource": "Amanda Scarborough"
  }
]
```

**Example curl:**
```bash
curl "http://localhost:5000/api/brain/corrective-drills?issues=hunched%20forward,weak%20leg%20drive"
```

---

### 3. GET /api/brain/drills-by-tag

**Purpose:** Find drills by specific mechanic tags

**Query Parameters:**
- `tag` (required): The mechanic tag to search for
- `limit` (optional): Max results (default: 10)

**Example:**
```bash
curl "http://localhost:5000/api/brain/drills-by-tag?tag=arm-circle&limit=5"
```

**Response:**
```json
[
  {
    "id": 5,
    "name": "Arm Circle Focus Drill",
    "category": "PITCHING",
    "mechanicTags": ["arm-circle", "shoulder-rotation"],
    "description": "...",
    "videoUrl": "https://..."
  }
]
```

---

### 4. GET /api/brain/drills-by-expert

**Purpose:** Get all drills from a specific expert coach

**Query Parameters:**
- `expert` (required): Expert name (e.g., "Amanda Scarborough")
- `limit` (optional): Max results (default: 10)

**Available Experts:**
- Amanda Scarborough
- Monica Abbott
- Cat Osterman
- Denny Dunn
- Rachel Garcia
- Kelly Kretschman

**Example:**
```bash
curl "http://localhost:5000/api/brain/drills-by-expert?expert=Amanda%20Scarborough&limit=5"
```

---

### 5. POST /api/brain/train/drill

**Purpose:** Add a new drill to the Brain's knowledge base (admin/coach)

**Request Body:**
```json
{
  "name": "New Drill Name",
  "category": "PITCHING",
  "difficulty": "Intermediate",
  "description": "Detailed drill description",
  "videoUrl": "https://youtube.com/...",
  "mechanicTags": ["posture", "leg-drive"],
  "expertSource": "Amanda Scarborough",
  "equipment": ["ball", "net"],
  "ageRange": "10U-18U",
  "issueAddressed": "hunched forward"
}
```

**Response:**
```json
{
  "message": "Drill added successfully",
  "drill": {
    "id": 42,
    "name": "New Drill Name",
    ...
  }
}
```

---

### 6. POST /api/brain/train/mental-edge

**Purpose:** Add mental training content to the Brain

**Request Body:**
```json
{
  "title": "Pre-Game Visualization",
  "contentType": "principle",
  "category": "Confidence",
  "content": "Detailed mental training content...",
  "source": "Sports Psychology Research",
  "tags": ["pre-game", "visualization", "confidence"],
  "usageContext": "before-game"
}
```

**Response:**
```json
{
  "message": "Mental edge content added",
  "content": {
    "id": 15,
    "title": "Pre-Game Visualization",
    ...
  }
}
```

---

### 7. POST /api/brain/feedback (NEW - Continuous Learning)

**Purpose:** Log user reactions to Brain recommendations for learning and adaptation

**Authentication:** Required

**Request Body:**
```json
{
  "brainDecisionId": "brain_1738515234567_abc123def",
  "role": "coach" | "player" | "parent" | "instructor" | "team_coach",
  "decisionType": "drill" | "goal" | "plan" | "mental_content",
  "decisionRefId": 42,  // Optional: drill_id, goal_id, etc.
  "skillType": "PITCHING",
  "athleteAge": 12,
  "athleteLevel": "Intermediate",
  "detectedIssues": ["hunched forward", "weak leg drive"],
  "rating": 5,  // 1-5 stars, optional
  "action": "accepted" | "rejected" | "edited" | "skipped" | "completed",
  "pushbackText": "Optional feedback text",
  "editedVersion": {}  // Optional: what user changed it to
}
```

**Response:**
```json
{
  "message": "Feedback recorded",
  "eventId": 1
}
```

**Example curl:**
```bash
curl -X POST http://localhost:5000/api/brain/feedback \
  -H "Content-Type: application/json" \
  -H "Cookie: your_session_cookie" \
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
  }'
```

---

### 8. GET /api/brain/feedback/summary (NEW - Continuous Learning)

**Purpose:** Query feedback events for analytics and learning

**Authentication:** Required

**Query Parameters:**
- `skillType` (optional): Filter by PITCHING, HITTING, etc.
- `decisionType` (optional): Filter by drill, goal, plan
- `userId` (optional): Filter by specific user
- `limit` (optional): Max results (default: 50)

**Response:**
```json
[
  {
    "id": 1,
    "userId": "user_123",
    "role": "coach",
    "brainDecisionId": "brain_1738515234567_abc123def",
    "decisionType": "drill",
    "skillType": "PITCHING",
    "rating": 5,
    "action": "accepted",
    "createdAt": "2026-02-02T16:00:00Z"
  }
]
```

**Example curl:**
```bash
curl "http://localhost:5000/api/brain/feedback/summary?skillType=PITCHING&limit=10" \
  -H "Cookie: your_session_cookie"
```

---

## Common Use Cases

### Use Case 1: Video Analysis Flow

```javascript
// 1. Athlete uploads video
const videoUrl = await uploadVideo(file);

// 2. Create assessment
const assessment = await fetch('/api/assessments', {
  method: 'POST',
  body: JSON.stringify({
    athleteId: 123,
    skillType: 'PITCHING',
    videoUrl,
    date: new Date()
  })
});

// 3. Analyze with Brain
const analysis = await fetch('/api/brain/analyze', {
  method: 'POST',
  body: JSON.stringify({
    skillType: 'PITCHING',
    detectedIssues: ['hunched forward', 'weak leg drive'],
    athleteLevel: 'Intermediate',
    limit: 5
  })
});

// 4. Display recommendations to user
const { brainDecisionId, recommendations } = await analysis.json();

// 5. NEW: Log user reaction to recommendation
if (userAcceptedDrill) {
  await fetch('/api/brain/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      brainDecisionId,
      role: 'coach',
      decisionType: 'drill',
      skillType: 'PITCHING',
      athleteAge: 12,
      athleteLevel: 'Intermediate',
      detectedIssues: ['hunched forward', 'weak leg drive'],
      rating: 5,
      action: 'accepted'
    })
  });
}
```

### Use Case 2: Quick Drill Lookup

```javascript
// Coach wants drills for specific issue
const response = await fetch(
  '/api/brain/corrective-drills?issues=casting,no hip rotation'
);
const drills = await response.json();
```

### Use Case 3: Browse Expert Drills

```javascript
// Browse drills from Amanda Scarborough
const response = await fetch(
  '/api/brain/drills-by-expert?expert=Amanda Scarborough&limit=10'
);
const expertDrills = await response.json();
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Additional error details (dev mode only)"
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding for production deployment.

---

## Authentication

Currently most Brain endpoints are unauthenticated for easy testing. Consider adding authentication for:
- POST /api/brain/train/* endpoints (admin only)

---

## Testing the Brain

### Quick Test Script

```bash
#!/bin/bash
# test-brain.sh

BASE_URL="http://localhost:5000"

echo "Testing Brain API..."

# Test 1: Analyze pitching
echo "\n1. Testing analyze endpoint..."
curl -X POST "$BASE_URL/api/brain/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "skillType": "PITCHING",
    "detectedIssues": ["hunched forward"],
    "athleteLevel": "Intermediate",
    "limit": 3
  }'

# Test 2: Get corrective drills
echo "\n\n2. Testing corrective drills..."
curl "$BASE_URL/api/brain/corrective-drills?issues=weak%20leg%20drive"

# Test 3: Get drills by tag
echo "\n\n3. Testing drills by tag..."
curl "$BASE_URL/api/brain/drills-by-tag?tag=posture&limit=3"

# Test 4: Get expert drills
echo "\n\n4. Testing expert drills..."
curl "$BASE_URL/api/brain/drills-by-expert?expert=Amanda%20Scarborough&limit=3"

echo "\n\nAll tests complete!"
```

### JavaScript Test

```javascript
async function testBrain() {
  const baseUrl = 'http://localhost:5000';
  
  // Test analysis
  const analysisResult = await fetch(`${baseUrl}/api/brain/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      skillType: 'PITCHING',
      detectedIssues: ['hunched forward', 'weak leg drive'],
      athleteLevel: 'Intermediate',
      limit: 5
    })
  });
  
  const data = await analysisResult.json();
  console.log('Analysis result:', data);
  
  // Test corrective drills
  const drillsResult = await fetch(
    `${baseUrl}/api/brain/corrective-drills?issues=casting`
  );
  const drills = await drillsResult.json();
  console.log('Corrective drills:', drills);
}

testBrain();
```

---

## Knowledge Base Info

The Brain's knowledge comes from:

### Pitching Experts
- **Amanda Scarborough** - Olympic player, ESPN analyst
- **Monica Abbott** - 77 mph record holder
- **Cat Osterman** - Olympic medalist
- **Denny Dunn** - Biomechanics Lab

### Hitting Experts
- **Kelly Kretschman** - Olympic gold, Alabama
- **Rachel Garcia** - UCLA, USA Softball

### Knowledge Domains
- Pitching mechanics (windmill, velocity, grip fundamentals)
- Hitting mechanics (swing sequencing, exit velocity)
- Catching (framing, blocking, pop time)
- Fielding (footwork, positioning, throwing)
- Mental training (Mamba Mentality, sports psychology)
- Strength training (CrossFit for softball, age-appropriate)
- Tournament rules (NFHS, PGF, USSSA, GSA, Titan)
- Practice planning (station-based, age-specific)

---

## Future Enhancements

Planned features:
1. **Real-time video analysis** - MediaPipe biomechanics extraction
2. **Personalized learning** - Adapt recommendations based on outcomes
3. **Coach feedback loop** - Learn from coach corrections
4. **Drill effectiveness tracking** - Measure which drills work best
5. **A/B testing** - Compare recommendation strategies
6. **Mental content generation** - AI-generated motivational content
7. **Pro model comparisons** - Side-by-side with elite athletes

---

## Support

For issues or questions:
1. Check this documentation
2. Review Brain README at `server/brain/README.md`
3. Check Integration Guide at `server/brain/INTEGRATION_GUIDE.md`
4. Review test files in `server/brain/__tests__/`

---

**Last Updated:** February 2, 2026
**Version:** 1.0
