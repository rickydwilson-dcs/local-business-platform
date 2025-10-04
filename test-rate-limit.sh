#!/bin/bash

# Test script for rate limiting
# This will send 6 requests to the contact API
# Expected: First 5 succeed (200), 6th fails with 429

echo "Testing rate limiting on contact API..."
echo "Expected: First 5 requests succeed, 6th request gets rate limited (429)"
echo ""

for i in {1..6}; do
  echo "Request $i:"
  response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"message\":\"Test message $i\"}")

  http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d':' -f2)
  body=$(echo "$response" | grep -v "HTTP_CODE:")

  echo "Status: $http_code"
  echo "Response: $body"
  echo "---"

  sleep 0.5
done

echo ""
echo "✅ Test complete!"
echo "If request 6 showed status 429, rate limiting is working correctly."
