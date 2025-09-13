# app.py
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import httpx
import os
import uuid
import subprocess
import shutil
from pathlib import Path
from .downloader_file import tiktok_to_uploadfile

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create data directory
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

# Mount static files to serve frames
app.mount("/static", StaticFiles(directory="data"), name="static")

TARGET_ENDPOINT = "https://example.com/upload"  # wherever you need to send the UploadFile

class VideoURL(BaseModel):
    url: str

def extract_frames_from_video(input_path: Path, frames_dir: Path, video_id: str):
    """Extract frames from video using FFmpeg"""
    # Try different FFmpeg paths
    ffmpeg_paths = [
        "ffmpeg",  # System PATH
        "/c/Users/saura/AppData/Local/Packages/PythonSoftwareFoundation.Python.3.10_qbz5n2kfra8p0/LocalCache/local-packages/Python310/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe",
        "C:\\Users\\saura\\AppData\\Local\\Packages\\PythonSoftwareFoundation.Python.3.10_qbz5n2kfra8p0\\LocalCache\\local-packages\\Python310\\site-packages\\imageio_ffmpeg\\binaries\\ffmpeg-win-x86_64-v7.1.exe"
    ]
    
    ffmpeg_cmd = None
    for path in ffmpeg_paths:
        try:
            subprocess.run([path, "-version"], capture_output=True, check=True)
            ffmpeg_cmd = path
            break
        except (subprocess.CalledProcessError, FileNotFoundError):
            continue
    
    if not ffmpeg_cmd:
        raise HTTPException(
            status_code=500, 
            detail="FFmpeg not found. Please install FFmpeg or ensure it's in your PATH."
        )
    
    # Extract frames using FFmpeg
    try:
        frame_pattern = str(frames_dir / "frame_%03d.jpg")
        cmd = [
            ffmpeg_cmd,
            "-i", str(input_path),
            "-vf", "fps=1,scale=720:-1",
            "-frames:v", "10",
            "-y",  # overwrite output files
            frame_pattern
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        
        # Get list of generated frames
        frame_files = list(frames_dir.glob("frame_*.jpg"))
        frame_urls = [f"/static/{video_id}/frames/{frame.name}" for frame in frame_files]
        
        return frame_urls
        
    except subprocess.CalledProcessError as e:
        raise HTTPException(
            status_code=500, 
            detail=f"FFmpeg failed: {e.stderr}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Frame extraction failed: {e}")

@app.get("/api")
async def api_status():
    return {"message": "InstaShopper API is running!", "endpoints": ["/docs", "/ingest_tiktok", "/analyze-video"]}

@app.post("/ingest_tiktok")
async def ingest_tiktok(url: str):
    try:
        upload = tiktok_to_uploadfile(url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Download failed: {e}")

    # forward as multipart/form-data
    async with httpx.AsyncClient(timeout=120) as client:
        files = {"file": (upload.filename, upload.file, upload.content_type)}
        r = await client.post(TARGET_ENDPOINT, files=files)
        r.raise_for_status()
        return {"status": "ok", "forward_resp": r.json() if r.headers.get("content-type","").startswith("application/json") else r.text}


@app.post("/analyze-video")
async def analyze_video(file: UploadFile = File(...)):
    # Generate unique video ID
    video_id = str(uuid.uuid4())
    
    # Create directories
    video_dir = DATA_DIR / video_id
    frames_dir = video_dir / "frames"
    video_dir.mkdir(exist_ok=True)
    frames_dir.mkdir(exist_ok=True)
    
    # Save uploaded video
    input_path = video_dir / "input.mp4"
    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save video: {e}")
    
    # Extract frames
    try:
        frame_urls = extract_frames_from_video(input_path, frames_dir, video_id)
        
        return {
            "video_id": video_id,
            "status": "success",
            "frames": frame_urls,
            "frame_count": len(frame_urls)
        }
        
    except Exception as e:
        # Clean up on error
        if video_dir.exists():
            shutil.rmtree(video_dir)
        raise e

# Mount frontend after API routes
app.mount("/", StaticFiles(directory="static", html=True), name="frontend")
