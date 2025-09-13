#!/usr/bin/env python3

import requests
import json

def test_api_status():
    """Test the API status endpoint"""
    try:
        response = requests.get("http://localhost:8000/api", timeout=10)
        response.raise_for_status()
        result = response.json()

        print("SUCCESS: API is running!")
        print(f"Available endpoints: {', '.join(result.get('endpoints', []))}")
        return True
    except Exception as e:
        print(f"ERROR: API not accessible: {e}")
        print("TIP: Make sure to start the server with: cd fastapi-backend && python -m uvicorn app.app:app --reload")
        return False

def test_gemini_integration():
    """Test that Gemini is properly integrated"""
    print("\nTesting Gemini Integration:")
    print("=" * 40)

    # Test that we can import the analyzer
    try:
        import sys
        sys.path.append('fastapi-backend')
        from app.gemini_analyzer import GeminiAnalyzer

        print("SUCCESS: GeminiAnalyzer module imports correctly")

        # Test initialization (this will check for GEMINI_API_KEY)
        try:
            analyzer = GeminiAnalyzer()
            print("SUCCESS: GeminiAnalyzer initializes with API key")
        except ValueError as e:
            print(f"INFO: {e}")
            print("TIP: Set GEMINI_API_KEY in fastapi-backend/.env file")

    except ImportError as e:
        print(f"ERROR: Cannot import GeminiAnalyzer: {e}")

def show_integration_summary():
    """Show summary of the integration"""
    print("\n" + "=" * 50)
    print("GEMINI INTEGRATION SUMMARY")
    print("=" * 50)

    print("\nCOMPLETED FEATURES:")
    print("  - FFmpeg frame extraction (5-10 frames at 1fps)")
    print("  - GeminiAnalyzer class with vision analysis")
    print("  - Product detection with structured output")
    print("  - Product consolidation across frames")
    print("  - API endpoints: /analyze-video and /analyze-tiktok")
    print("  - Error handling and logging")

    print("\nPRODUCT ANALYSIS STRUCTURE:")
    print("  - Type: sneaker, hoodie, bag, shirt, pants, etc.")
    print("  - Color: primary color description")
    print("  - Pattern: solid, striped, plaid, floral, etc.")
    print("  - Material: cotton, leather, denim, silk, etc.")
    print("  - Brand text: visible logos/brand text")
    print("  - Confidence scoring and frame tracking")

    print("\nNEXT STEPS:")
    print("  1. Add a real video file as test_video.mp4")
    print("  2. Set GEMINI_API_KEY in fastapi-backend/.env")
    print("  3. Test with: python test_gemini_analysis.py")
    print("  4. Try with TikTok URLs using /analyze-tiktok")

    print("\nAPI USAGE:")
    print("  - POST /analyze-video - Upload video file")
    print("  - POST /analyze-tiktok - Analyze TikTok URL")
    print("  - GET /docs - View interactive API documentation")

if __name__ == "__main__":
    print("InstaShopper - Gemini Integration Test")
    print("=" * 40)

    # Test API
    if test_api_status():
        # Test Gemini integration
        test_gemini_integration()

    # Show summary
    show_integration_summary()