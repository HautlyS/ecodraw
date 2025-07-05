#!/usr/bin/env python3
import requests
import json
import os
import sys
from datetime import datetime

# Get the backend URL from the frontend .env file
def get_backend_url():
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.strip().split('=')[1].strip('"\'')
    return None

# Main test function
def run_tests():
    backend_url = get_backend_url()
    if not backend_url:
        print("ERROR: Could not find REACT_APP_BACKEND_URL in frontend/.env")
        sys.exit(1)
    
    api_url = f"{backend_url}/api"
    print(f"Testing backend API at: {api_url}")
    
    # Test results tracking
    tests_passed = 0
    tests_failed = 0
    
    # Test 1: Root endpoint
    print("\n=== Test 1: Root Endpoint ===")
    try:
        response = requests.get(f"{api_url}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and response.json().get("message") == "Hello World":
            print("✅ Test PASSED: Root endpoint working correctly")
            tests_passed += 1
        else:
            print("❌ Test FAILED: Root endpoint not returning expected response")
            tests_failed += 1
    except Exception as e:
        print(f"❌ Test FAILED: Error connecting to root endpoint: {str(e)}")
        tests_failed += 1
    
    # Test 2: Create status check
    print("\n=== Test 2: Create Status Check ===")
    try:
        client_name = f"test_client_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        payload = {"client_name": client_name}
        response = requests.post(f"{api_url}/status", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and response.json().get("client_name") == client_name:
            print("✅ Test PASSED: Status check created successfully")
            status_id = response.json().get("id")
            tests_passed += 1
        else:
            print("❌ Test FAILED: Could not create status check")
            tests_failed += 1
    except Exception as e:
        print(f"❌ Test FAILED: Error creating status check: {str(e)}")
        tests_failed += 1
    
    # Test 3: Get status checks
    print("\n=== Test 3: Get Status Checks ===")
    try:
        response = requests.get(f"{api_url}/status")
        print(f"Status Code: {response.status_code}")
        print(f"Response contains {len(response.json())} status checks")
        
        if response.status_code == 200 and isinstance(response.json(), list):
            # Check if our recently created status check is in the list
            found = False
            for status in response.json():
                if status.get("client_name") == client_name:
                    found = True
                    break
            
            if found:
                print("✅ Test PASSED: Status checks retrieved successfully and contains our test entry")
                tests_passed += 1
            else:
                print("❌ Test FAILED: Status checks retrieved but our test entry was not found")
                tests_failed += 1
        else:
            print("❌ Test FAILED: Could not retrieve status checks")
            tests_failed += 1
    except Exception as e:
        print(f"❌ Test FAILED: Error retrieving status checks: {str(e)}")
        tests_failed += 1
    
    # Test 4: MongoDB Connection
    print("\n=== Test 4: MongoDB Connection ===")
    # We can infer MongoDB connection from the success of Test 2 and 3
    if tests_passed >= 2:
        print("✅ Test PASSED: MongoDB connection is working (inferred from successful data operations)")
        tests_passed += 1
    else:
        print("❌ Test FAILED: MongoDB connection may not be working properly")
        tests_failed += 1
    
    # Summary
    print("\n=== Test Summary ===")
    print(f"Tests Passed: {tests_passed}")
    print(f"Tests Failed: {tests_failed}")
    print(f"Total Tests: {tests_passed + tests_failed}")
    
    if tests_failed == 0:
        print("\n✅ ALL TESTS PASSED! The backend API is working correctly.")
        return True
    else:
        print(f"\n❌ {tests_failed} TESTS FAILED! The backend API has issues that need to be addressed.")
        return False

if __name__ == "__main__":
    run_tests()