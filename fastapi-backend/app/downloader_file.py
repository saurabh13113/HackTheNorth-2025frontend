# downloader.py
from io import BytesIO
from tempfile import SpooledTemporaryFile
from fastapi import UploadFile
import yt_dlp

def tiktok_to_uploadfile(url: str) -> UploadFile:
    buf = BytesIO()

    ydl_opts = {
        "outtmpl": "-",              # write to stdout (BytesIO via 'progress_hooks' trick below)
        "format": "mp4/best",
        "noplaylist": True,
        "quiet": True,
    }

    # yt-dlp doesn't natively write to BytesIO; we intercept the final file via 'download' to temp file,
    # OR use 'ydl.extract_info' to get a direct url and stream ourselves.
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        # Prefer an MP4-like URL
        video_url = info.get("url")  # direct media URL
        if not video_url:
            raise RuntimeError("Could not resolve media URL")

    # Stream the media into memory
    import requests
    with requests.get(video_url, stream=True, timeout=60) as r:
        r.raise_for_status()
        for chunk in r.iter_content(chunk_size=1024 * 512):
            if chunk:
                buf.write(chunk)

    buf.seek(0)

    # Wrap as UploadFile (uses a spooled temp under the hood if you want)
    spooled = SpooledTemporaryFile(max_size=10_000_000)
    spooled.write(buf.read())
    spooled.seek(0)
    return UploadFile(filename="video.mp4", file=spooled, content_type="video/mp4")
