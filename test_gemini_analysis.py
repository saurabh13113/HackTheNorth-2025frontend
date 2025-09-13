#!/usr/bin/env python3

import requests
import json
from pathlib import Path

def test_analyze_video():
    """Test the analyze-video endpoint with the test video"""
    api_url = "http://localhost:8000/analyze-video"
    test_video_path = Path("test_video.mp4")

    if not test_video_path.exists():
        print("ERROR: test_video.mp4 not found. Please add a test video file.")
        return

    # Check if file is too small (likely empty/corrupted)
    if test_video_path.stat().st_size < 1000:
        print("ERROR: test_video.mp4 is too small or corrupted. Please add a valid video file.")
        print("TIP: You can download a sample video or use a real TikTok/Instagram video.")
        return

    print("Testing video analysis endpoint...")

    try:
        with open(test_video_path, "rb") as video_file:
            files = {"file": ("test_video.mp4", video_file, "video/mp4")}

            response = requests.post(api_url, files=files, timeout=120)
            response.raise_for_status()

            result = response.json()

            print("Analysis completed successfully!")
            print(f"Video ID: {result.get('video_id')}")
            print(f"Frames extracted: {result.get('frame_count')}")

            analysis = result.get("analysis", {})
            print(f"Products detected: {analysis.get('total_products_detected', 0)}")
            print(f"Unique products: {len(analysis.get('consolidated_products', []))}")

            # Print summary
            summary = analysis.get("summary", {})
            if summary.get("product_types"):
                print("\nProduct Types Found:")
                for ptype, count in summary["product_types"].items():
                    print(f"  - {ptype}: {count}")

            if summary.get("dominant_colors"):
                print("\nColors Detected:")
                for color, count in summary["dominant_colors"].items():
                    print(f"  - {color}: {count}")

            if summary.get("brands_detected"):
                print("\nBrands Found:")
                for brand in summary["brands_detected"]:
                    print(f"  - {brand}")

            # Print detailed products
            products = analysis.get("consolidated_products", [])
            if products:
                print(f"\nTop {min(3, len(products))} Products:")
                for i, product in enumerate(products[:3], 1):
                    print(f"\n{i}. {product.get('type', 'Unknown').title()}")
                    print(f"   Color: {product.get('color', 'Unknown')}")
                    print(f"   Material: {product.get('material', 'Unknown')}")
                    if product.get('brand_text'):
                        print(f"   Brand: {product.get('brand_text')}")
                    print(f"   Confidence: {product.get('average_confidence', 0):.2f}")
                    print(f"   Seen in frames: {product.get('frames_seen', [])}")
                    print(f"   Description: {product.get('description', '')}")

    except requests.exceptions.RequestException as e:
        print(f"ERROR: Request failed: {e}")
    except Exception as e:
        print(f"ERROR: Test failed: {e}")

def test_analyze_tiktok():
    """Test the analyze-tiktok endpoint with a sample TikTok URL"""
    api_url = "http://localhost:8000/analyze-tiktok"

    # This is a placeholder - you'll need a real TikTok URL
    test_url = input("Enter a TikTok URL to test (or press Enter to skip): ").strip()

    if not test_url:
        print(" Skipping TikTok test")
        return

    print(f" Testing TikTok analysis with: {test_url}")

    try:
        data = {"url": test_url}
        response = requests.post(api_url, json=data, timeout=180)
        response.raise_for_status()

        result = response.json()

        print("SUCCESS: TikTok analysis completed successfully!")
        print(f"📊 Video ID: {result.get('video_id')}")
        print(f"🖼️ Frames extracted: {result.get('frame_count')}")

        analysis = result.get("analysis", {})
        print(f"👗 Products detected: {analysis.get('total_products_detected', 0)}")

        # Print summary like above
        summary = analysis.get("summary", {})
        if summary.get("product_types"):
            print("\n📝 Product Types Found:")
            for ptype, count in summary["product_types"].items():
                print(f"  - {ptype}: {count}")

    except requests.exceptions.RequestException as e:
        print(f"ERROR: Request failed: {e}")
    except Exception as e:
        print(f"ERROR: Test failed: {e}")

def test_api_status():
    """Test the API status endpoint"""
    api_url = "http://localhost:8000/api"

    try:
        response = requests.get(api_url, timeout=10)
        response.raise_for_status()

        result = response.json()
        print("SUCCESS: API is running!")
        print(f" Available endpoints: {', '.join(result.get('endpoints', []))}")

        return True
    except Exception as e:
        print(f"ERROR: API not accessible: {e}")
        print("TIP: Make sure to start the server with: cd fastapi-backend && uvicorn app.app:app --reload")
        return False

if __name__ == "__main__":
    print("InstaShopper API Test Suite")
    print("=" * 40)

    # Check if API is running
    if not test_api_status():
        exit(1)

    print("\n" + "=" * 40)

    # Test video analysis
    test_analyze_video()

    print("\n" + "=" * 40)

    # Test TikTok analysis
    test_analyze_tiktok()

    print("\n Testing completed!")