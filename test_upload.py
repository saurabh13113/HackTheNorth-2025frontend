#!/usr/bin/env python3
"""
Test script to demonstrate video upload and frame extraction
"""
import requests
import json

# Test the API status
try:
    response = requests.get("http://localhost:8000/api")
    print("✅ API Status:", response.json())
except Exception as e:
    print("❌ Server not running:", e)
    exit(1)

# Create a small test file (simulating video upload)
test_content = b"fake video content for testing"
files = {"file": ("test.mp4", test_content, "video/mp4")}

try:
    response = requests.post("http://localhost:8000/analyze-video", files=files)
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Upload successful!")
        print(f"📁 Video ID: {result['video_id']}")
        print(f"🎬 Frames extracted: {result['frame_count']}")
        print("🖼️  Frame URLs:")
        for i, frame_url in enumerate(result['frames'], 1):
            print(f"   {i}. http://localhost:8000{frame_url}")
    else:
        error_info = response.json()
        print(f"❌ Upload failed ({response.status_code}):")
        print(f"   {error_info['detail']}")
        
except Exception as e:
    print(f"❌ Request failed: {e}")