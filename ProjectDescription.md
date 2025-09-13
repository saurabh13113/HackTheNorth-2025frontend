# InstaShopper: From Reel to Real

## Overview
**InstaShopper** transforms social media fashion inspiration into instant shopping.  
Scrolling through TikTok or Instagram, people often see outfits they love but struggle to find them online. InstaShopper bridges that gap by taking short-form videos, detecting fashion items inside them, and curating similar or matching products directly from Shopify stores.  

The result: a seamless experience that turns reels into real shopping journeys.  

---

## How It Works

### 1. Video Ingestion
- Users upload a TikTok or Instagram clip.  
- **FFmpeg** extracts key snapshots (e.g., 1–2 frames per second).  

### 2. Visual Understanding
- Snapshots are passed to the **Gemini API (Vision)**.  
- Gemini detects clothing and accessories, generating structured details like:  
  - Type (e.g., sneakers, hoodie)  
  - Color/pattern  
  - Material  
  - Logos or visible text  

### 3. Product Matching
- Detected attributes are converted into embeddings with **Cohere**.  
- **pgvector** in Postgres stores and compares embeddings for similarity search.  
- **Shopify Storefront API** provides:  
  - Real-time product catalogs  
  - Prices and availability  
- Products are re-ranked by vector similarity for best matches.  

### 4. Shopping Experience
- Users see curated product cards with images, price, and buy links.  
- With **VAPI**, users can refine results by voice commands like:  
  - “Show under $100”  
  - “Women’s sizes only”  

---

## Tech Stack

- **FFmpeg** → Frame extraction from TikTok/Instagram videos  
- **Gemini API (Vision + Text)** → Detects products and generates structured descriptions  
- **Cohere** → Embeddings for semantic product similarity matching  
- **Shopify Storefront API** → Product catalog, availability, and checkout  
- **AWS (Lambda, API Gateway, optional S3)** → Serverless backend and media handling  
- **Postgres + pgvector** → Vector similarity search across Shopify products  
- **VAPI** → Real-time voice queries and spoken results  
- **React/Next.js** → Frontend with video upload, product display, and checkout flow  

---

## Why It’s Cool

- **Solves a real-world pain point** → No more guessing keywords to find outfits from social media.  
- **Multi-modal integration** → Video → Vision (Gemini) → NLP (Cohere) → Commerce (Shopify) → Voice (VAPI).  
- **Sponsor-heavy** → Direct use of Gemini, Cohere, Shopify, AWS, and VAPI.  
- **Visual + interactive demo** → Extract frames, detect outfits, show instant buy options, refine by voice.  

---

## Demo Flow

1. Upload a TikTok/Instagram clip.  
2. **FFmpeg** extracts ~5 frames.  
3. **Gemini Vision** detects items (e.g., *red high-top sneakers*, *black oversized hoodie*).  
4. **Shopify API** pulls matching products → curated product cards appear.  
5. User says: “Show only hoodies under $80.” → **VAPI** updates results live.  
6. One tap → direct checkout on Shopify.  

---

## Future Improvements
- Multi-item outfit detection across frames for complete look matching.  
- Integration with multiple e-commerce platforms beyond Shopify.  
- Personalization: recommend based on user history and preferences.  
