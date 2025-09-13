from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FastAPI Backend", version="0.1.0")

# CORS (adjust origins for your frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # <- lock this down in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}

@app.get("/", tags=["meta"])
def root():
    return {"message": "Hello from FastAPI!"}
