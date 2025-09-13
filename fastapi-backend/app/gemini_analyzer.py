import google.generativeai as genai
import os
from PIL import Image
from typing import List, Dict, Any
from pathlib import Path
import json

class GeminiAnalyzer:
    def __init__(self, api_key: str = None):
        if not api_key:
            api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def analyze_frame(self, image_path: Path) -> Dict[str, Any]:
        """Analyze a single frame for fashion products"""
        try:
            image = Image.open(image_path)

            prompt = """
            Analyze this image and identify all fashion and accessory items. For each item detected, return a JSON object with the following structure:

            {
                "products": [
                    {
                        "type": "sneaker|hoodie|bag|shirt|pants|dress|jacket|hat|watch|sunglasses|jewelry|other",
                        "color": "primary color description",
                        "pattern": "solid|striped|polka_dot|plaid|floral|geometric|animal_print|tie_dye|other|none",
                        "material": "cotton|leather|denim|silk|wool|synthetic|metal|fabric|other",
                        "brand_text": "any visible brand text, logos, or distinctive markings",
                        "description": "detailed description of the item including style, fit, and notable features",
                        "confidence": 0.0-1.0,
                        "position": "description of where the item is located in the image"
                    }
                ]
            }

            Only include items you can clearly see and identify. Be specific with colors and descriptions. If no fashion items are visible, return an empty products array.
            Respond ONLY with valid JSON, no additional text.
            """

            response = self.model.generate_content([prompt, image])
            response_text = response.text.strip()

            # Clean up response to ensure it's valid JSON
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            response_text = response_text.strip()

            try:
                result = json.loads(response_text)
                return result
            except json.JSONDecodeError:
                # Fallback: try to extract JSON from the response
                import re
                json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
                else:
                    return {"products": [], "error": "Could not parse Gemini response as JSON"}

        except Exception as e:
            return {"products": [], "error": f"Analysis failed: {str(e)}"}

    def analyze_all_frames(self, frames_dir: Path) -> Dict[str, Any]:
        """Analyze all frames in a directory and consolidate results"""
        frame_files = sorted(list(frames_dir.glob("frame_*.jpg")))

        all_products = []
        frame_analyses = []

        for i, frame_file in enumerate(frame_files):
            print(f"Analyzing frame {i+1}/{len(frame_files)}: {frame_file.name}")
            frame_result = self.analyze_frame(frame_file)

            frame_analysis = {
                "frame_number": i + 1,
                "frame_file": frame_file.name,
                "products": frame_result.get("products", []),
                "error": frame_result.get("error")
            }
            frame_analyses.append(frame_analysis)

            # Collect all products
            for product in frame_result.get("products", []):
                product["frame_number"] = i + 1
                product["frame_file"] = frame_file.name
                all_products.append(product)

        # Consolidate similar products across frames
        consolidated_products = self._consolidate_products(all_products)

        return {
            "total_frames_analyzed": len(frame_files),
            "total_products_detected": len(all_products),
            "consolidated_products": consolidated_products,
            "frame_by_frame_analysis": frame_analyses,
            "summary": self._generate_summary(consolidated_products)
        }

    def _consolidate_products(self, products: List[Dict]) -> List[Dict]:
        """Group similar products across frames"""
        if not products:
            return []

        consolidated = []

        # Simple consolidation: group by type and similar color
        product_groups = {}

        for product in products:
            # Create a key based on type and color
            key = f"{product.get('type', 'unknown')}_{product.get('color', 'unknown').lower()}"

            if key not in product_groups:
                product_groups[key] = {
                    "type": product.get("type"),
                    "color": product.get("color"),
                    "pattern": product.get("pattern"),
                    "material": product.get("material"),
                    "brand_text": product.get("brand_text"),
                    "descriptions": [product.get("description", "")],
                    "confidence_scores": [product.get("confidence", 0.0)],
                    "frames_seen": [product.get("frame_number")],
                    "frame_files": [product.get("frame_file")]
                }
            else:
                # Merge information
                group = product_groups[key]
                group["descriptions"].append(product.get("description", ""))
                group["confidence_scores"].append(product.get("confidence", 0.0))
                group["frames_seen"].append(product.get("frame_number"))
                group["frame_files"].append(product.get("frame_file"))

                # Update with better information if available
                if product.get("brand_text") and not group.get("brand_text"):
                    group["brand_text"] = product.get("brand_text")
                if product.get("pattern") and group.get("pattern") == "none":
                    group["pattern"] = product.get("pattern")

        # Convert groups to final format
        for group in product_groups.values():
            consolidated_product = {
                "type": group["type"],
                "color": group["color"],
                "pattern": group["pattern"],
                "material": group["material"],
                "brand_text": group["brand_text"],
                "description": max(group["descriptions"], key=len) if group["descriptions"] else "",
                "average_confidence": sum(group["confidence_scores"]) / len(group["confidence_scores"]) if group["confidence_scores"] else 0.0,
                "frames_seen": sorted(list(set(group["frames_seen"]))),
                "frame_count": len(set(group["frames_seen"])),
                "all_descriptions": list(set(group["descriptions"]))
            }
            consolidated.append(consolidated_product)

        # Sort by confidence and frame count
        consolidated.sort(key=lambda x: (-x["average_confidence"], -x["frame_count"]))

        return consolidated

    def _generate_summary(self, consolidated_products: List[Dict]) -> Dict[str, Any]:
        """Generate a summary of detected products"""
        if not consolidated_products:
            return {"message": "No fashion products detected in the video"}

        summary = {
            "total_unique_products": len(consolidated_products),
            "product_types": {},
            "dominant_colors": {},
            "brands_detected": []
        }

        for product in consolidated_products:
            # Count by type
            ptype = product.get("type", "unknown")
            summary["product_types"][ptype] = summary["product_types"].get(ptype, 0) + 1

            # Count by color
            color = product.get("color", "unknown")
            summary["dominant_colors"][color] = summary["dominant_colors"].get(color, 0) + 1

            # Collect brands
            brand = product.get("brand_text")
            if brand and brand not in summary["brands_detected"]:
                summary["brands_detected"].append(brand)

        # Sort by frequency
        summary["product_types"] = dict(sorted(summary["product_types"].items(), key=lambda x: -x[1]))
        summary["dominant_colors"] = dict(sorted(summary["dominant_colors"].items(), key=lambda x: -x[1]))

        return summary