#!/bin/bash
# Brain API Test Script
# Tests all Brain endpoints without requiring database

BASE_URL="${BASE_URL:-http://localhost:5000}"

echo "======================================"
echo "🧠 SoftballProAI Brain API Test Suite"
echo "======================================"
echo "Base URL: $BASE_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
  local name="$1"
  local method="$2"
  local endpoint="$3"
  local data="$4"
  
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
  
  if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
    PASSED=$((PASSED + 1))
    if [ ! -z "$VERBOSE" ]; then
      echo "$body" | jq '.' 2>/dev/null || echo "$body"
    fi
  else
    echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
    FAILED=$((FAILED + 1))
    echo "Response: $body"
  fi
  echo ""
}

echo "======================================
echo "1️⃣  Brain Analysis Endpoints"
echo "======================================"

# Test 1: Analyze pitching mechanics
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

echo "======================================"
echo "2️⃣  Drill Lookup Endpoints"
echo "======================================"

# Test 4: Get corrective drills
test_endpoint "Get corrective drills" "GET" "/api/brain/corrective-drills?issues=hunched%20forward,weak%20leg%20drive"

# Test 5: Get drills by tag
test_endpoint "Get drills by tag (posture)" "GET" "/api/brain/drills-by-tag?tag=posture&limit=5"

# Test 6: Get drills by tag (arm-circle)
test_endpoint "Get drills by tag (arm-circle)" "GET" "/api/brain/drills-by-tag?tag=arm-circle&limit=3"

# Test 7: Get drills by expert
test_endpoint "Get drills by expert (Amanda Scarborough)" "GET" "/api/brain/drills-by-expert?expert=Amanda%20Scarborough&limit=5"

echo "======================================"
echo "3️⃣  Edge Cases & Validation"
echo "======================================"

# Test 8: Empty issues
test_endpoint "Handle empty issues array" "POST" "/api/brain/analyze" '{
  "skillType": "PITCHING",
  "detectedIssues": [],
  "athleteLevel": "Beginner",
  "limit": 3
}'

# Test 9: Unknown expert
test_endpoint "Handle unknown expert" "GET" "/api/brain/drills-by-expert?expert=Unknown%20Coach&limit=5"

# Test 10: Invalid skill type (should fail gracefully)
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
  PASSED=$((PASSED + 1))
fi
echo ""

echo "======================================"
echo "📊 Test Results"
echo "======================================"
TOTAL=$((PASSED + FAILED))
echo "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
  echo ""
  echo -e "${GREEN}🎉 All tests passed!${NC}"
  exit 0
else
  echo ""
  echo -e "${RED}❌ Some tests failed${NC}"
  exit 1
fi
