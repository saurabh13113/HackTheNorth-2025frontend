# app.py
from fastapi import FastAPI, HTTPException
import httpx
from downloader_file import tiktok_to_uploadfile

app = FastAPI()

TARGET_ENDPOINT = "https://example.com/upload"  # wherever you need to send the UploadFile

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
