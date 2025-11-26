#!/bin/bash

echo "==================================="
echo "Testing Leaderboard API"
echo "==================================="
echo ""

# Test 1: Register user
echo "1. Registering new user 'player1'..."
RESPONSE=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "player1", "password": "password123"}')
echo "Response: $RESPONSE"
echo ""

# Extract token
TOKEN=$(echo $RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token. Trying to login instead..."
  
  # Try login if registration failed (user might already exist)
  RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username": "player1", "password": "password123"}')
  echo "Login Response: $RESPONSE"
  TOKEN=$(echo $RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
  echo ""
fi

echo "Token: $TOKEN"
echo ""

# Test 2: Submit score
echo "2. Submitting score for player1..."
curl -s -X POST http://localhost:3000/scores \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"playerName": "player1", "score": 1500}'
echo ""
echo ""

# Register and submit more scores
echo "3. Registering more players and submitting scores..."
for i in {2..5}; do
  SCORE=$((1000 + RANDOM % 2000))
  
  # Register
  RESP=$(curl -s -X POST http://localhost:3000/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"username\": \"player$i\", \"password\": \"password123\"}")
  
  # Get token
  T=$(echo $RESP | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
  
  if [ -z "$T" ]; then
    # Try login
    RESP=$(curl -s -X POST http://localhost:3000/auth/login \
      -H "Content-Type: application/json" \
      -d "{\"username\": \"player$i\", \"password\": \"password123\"}")
    T=$(echo $RESP | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
  fi
  
  # Submit score
  curl -s -X POST http://localhost:3000/scores \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $T" \
    -d "{\"playerName\": \"player$i\", \"score\": $SCORE}" > /dev/null
  
  echo "   Player$i: $SCORE points"
done
echo ""

# Test 3: Get leaderboard
echo "4. Fetching leaderboard (Top 10)..."
curl -s -X GET http://localhost:3000/leaderboard | python3 -m json.tool
echo ""

echo "==================================="
echo "✅ All tests completed!"
echo "==================================="
