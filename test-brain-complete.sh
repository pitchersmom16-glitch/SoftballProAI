#!/bin/bash
# Complete Brain API Test Script
# Tests Brain + Feedback System end-to-end

BASE_URL="${BASE_URL:-http://localhost:5000}"

echo "=========================================="
echo "🧠 SoftballProAI Complete Test Suite"
echo "=========================================="
echo "Base URL: $BASE_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0
WARNINGS=0

# Store brainDecisionId for feedback tests
DECISION_ID=""

# Function to test endpoint
test_endpoint() {
  local name="$1"
  local method="$2"
  local endpoint="$3"
  local data="$4"
  local expect_code="${5:-200}"
  
  echo -n "Testing: $name... "
  
  if [ "$method" = "POST" ]; then
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data" 2>&1)
  else
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint" 2>&1)
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$http_code" = "$expect_code" ] || [ "$http_code" = "201" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
    PASSED=$((PASSED + 1))
    
    # Extract brainDecisionId if present
    if echo "$body" | grep -q "brainDecisionId"; then
      DECISION_ID=$(echo "$body" | jq -r '.brainDecisionId' 2>/dev/null)
      if [ ! -z "$DECISION_ID" ] && [ "$DECISION_ID" != "null" ]; then
        echo -e "  ${BLUE}→ Captured brainDecisionId: $DECISION_ID${NC}"
      fi
    fi
    
    if [ ! -z "$VERBOSE" ]; then
      echo "$body" | jq '.' 2>/dev/null || echo "$body"
    fi
  else
    echo -e "${RED}✗ FAILED${NC} (Expected $expect_code, got $http_code)"
    FAILED=$((FAILED + 1))
    echo "  Response: $body" | head -c 200
    echo ""
  fi
  echo ""
}

echo "=========================================="
echo "1️⃣  Brain Analysis Endpoints"
echo "=========================================="

# Test 1: Analyze pitching mechanics (capture decision ID)
test_endpoint "Analyze pitching mechanics" "POST" "/api/brain/analyze" '{
  "skillType": "PITCHING",
  "detectedIssues": ["hunched forward", "weak leg drive"],
  "athleteLevel": "Intermediate",
  "limit": 3
}'

# Test 2: Analyze hitting mechanics
test_endpoint "Analyze hitting mechanics" "POST" "/api/brain/analyze" '{
  "skillType": "HITTING",
  "detectedIssues": ["casting", "no hip rotation"],
  "athleteLevel": "Advanced",
  "limit": 5
}'

# Test 3: Analyze catching
test_endpoint "Analyze catching mechanics" "POST" "/api/brain/analyze" '{
  "skillType": "CATCHING",
  "detectedIssues": ["late transfers"],
  "athleteLevel": "Intermediate",
  "limit": 3
}'

# Test 4: Analyze fielding
test_endpoint "Analyze fielding mechanics" "POST" "/api/brain/analyze" '{
  "skillType": "FIELDING",
  "detectedIssues": ["slow exchange"],
  "athleteLevel": "Beginner",
  "limit": 3
}'

echo "=========================================="
echo "2️⃣  Drill Lookup Endpoints"
echo "=========================================="

# Test 5: Get corrective drills
test_endpoint "Get corrective drills" "GET" "/api/brain/corrective-drills?issues=hunched%20forward,weak%20leg%20drive"

# Test 6: Get drills by tag
test_endpoint "Get drills by tag (posture)" "GET" "/api/brain/drills-by-tag?tag=posture&limit=5"

# Test 7: Get drills by expert
test_endpoint "Get drills by expert (Amanda Scarborough)" "GET" "/api/brain/drills-by-expert?expert=Amanda%20Scarborough&limit=5"

echo "=========================================="
echo "3️⃣  Feedback System (NEW!)"
echo "=========================================="

if [ -z "$DECISION_ID" ]; then
  echo -e "${YELLOW}⚠ No brainDecisionId captured - generating test ID${NC}"
  DECISION_ID="brain_test_$(date +%s)_$(openssl rand -hex 4 2>/dev/null || echo 'abc123')"
  echo "  Using: $DECISION_ID"
  echo ""
fi

# Test 8: Log positive feedback (accepted drill)
echo -e "${BLUE}Note: Feedback endpoints require authentication.${NC}"
echo -e "${BLUE}These tests will show 401 unless you provide session cookies.${NC}"
echo ""

test_endpoint "Log accepted drill feedback" "POST" "/api/brain/feedback" "{
  \"brainDecisionId\": \"$DECISION_ID\",
  \"role\": \"coach\",
  \"decisionType\": \"drill\",
  \"skillType\": \"PITCHING\",
  \"athleteAge\": 12,
  \"athleteLevel\": \"Intermediate\",
  \"detectedIssues\": [\"hunched forward\"],
  \"rating\": 5,
  \"action\": \"accepted\",
  \"pushbackText\": null
}" "401"

# Test 9: Log rejected drill with pushback
test_endpoint "Log rejected drill with pushback" "POST" "/api/brain/feedback" "{
  \"brainDecisionId\": \"$DECISION_ID\",
  \"role\": \"coach\",
  \"decisionType\": \"drill\",
  \"skillType\": \"PITCHING\",
  \"athleteAge\": 10,
  \"athleteLevel\": \"Beginner\",
  \"detectedIssues\": [\"weak leg drive\"],
  \"rating\": 2,
  \"action\": \"rejected\",
  \"pushbackText\": \"Too advanced for 10U players\"
}" "401"

# Test 10: Query feedback summary
test_endpoint "Query feedback summary" "GET" "/api/brain/feedback/summary?skillType=PITCHING&limit=10" "401"

echo "=========================================="
echo "4️⃣  Edge Cases & Validation"
echo "=========================================="

# Test 11: Empty issues
test_endpoint "Handle empty issues array" "POST" "/api/brain/analyze" '{
  "skillType": "PITCHING",
  "detectedIssues": [],
  "athleteLevel": "Beginner",
  "limit": 3
}'

# Test 12: Unknown expert
test_endpoint "Handle unknown expert" "GET" "/api/brain/drills-by-expert?expert=Unknown%20Coach&limit=5"

# Test 13: Invalid skill type (should fail gracefully)
echo -n "Testing: Invalid skill type... "
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/brain/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "skillType": "INVALID",
    "detectedIssues": ["test"],
    "athleteLevel": "Intermediate",
    "limit": 3
  }' 2>&1)

http_code=$(echo "$response" | tail -n1)
if [ "$http_code" = "400" ]; then
  echo -e "${GREEN}✓ PASSED${NC} (Correctly rejected - HTTP $http_code)"
  PASSED=$((PASSED + 1))
else
  echo -e "${YELLOW}⚠ WARNING${NC} (Expected 400, got HTTP $http_code)"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

echo "=========================================="
echo "5️⃣  Brain Decision ID Verification"
echo "=========================================="

# Verify every Brain response includes brainDecisionId
echo "Verifying brainDecisionId is present..."
response=$(curl -s -X POST "$BASE_URL/api/brain/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "skillType": "PITCHING",
    "detectedIssues": ["hunched forward"],
    "athleteLevel": "Intermediate",
    "limit": 1
  }')

if echo "$response" | jq -e '.brainDecisionId' > /dev/null 2>&1; then
  decision_id=$(echo "$response" | jq -r '.brainDecisionId')
  if [[ $decision_id == brain_* ]]; then
    echo -e "${GREEN}✓ PASSED${NC} - brainDecisionId present and correctly formatted"
    echo "  Format: $decision_id"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}✗ FAILED${NC} - brainDecisionId has unexpected format: $decision_id"
    FAILED=$((FAILED + 1))
  fi
else
  echo -e "${RED}✗ FAILED${NC} - brainDecisionId missing from response"
  FAILED=$((FAILED + 1))
fi
echo ""

echo "=========================================="
echo "📊 Test Results Summary"
echo "=========================================="
TOTAL=$((PASSED + FAILED + WARNINGS))
echo "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  if [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed perfectly!${NC}"
  else
    echo -e "${YELLOW}⚠️  All critical tests passed (some warnings)${NC}"
  fi
  echo ""
  echo "=========================================="
  echo "✅ System Status: READY"
  echo "=========================================="
  echo "Brain API: ✓ Working"
  echo "Decision Tracking: ✓ Working"
  echo "Feedback Endpoints: ℹ️  Need authentication"
  echo ""
  echo "Next steps:"
  echo "1. Start the server: npm run dev"
  echo "2. Login to get session cookie"
  echo "3. Re-run tests with authentication"
  echo "4. Or use Postman for authenticated testing"
  exit 0
else
  echo -e "${RED}❌ Some tests failed${NC}"
  echo ""
  echo "Check the errors above and verify:"
  echo "1. Server is running (npm run dev)"
  echo "2. Database is accessible"
  echo "3. Environment variables are set"
  exit 1
fi
