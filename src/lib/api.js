const API = import.meta.env.VITE_API_BASE_URL;

export async function ping() {
  const r = await fetch(`${API}/health`);
  return r.json();
}

export async function analyzeVideo(formData) {
  const r = await fetch(`${API}/analyze-video`, {
    method: 'POST',
    body: formData
  });
  return r.json();
}

export async function findSimilarItems(product) {
  const r = await fetch(`${API}/find-similar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  });
  return r.json();
}

export async function findSimilarWithGemini(product) {
  const r = await fetch(`${API}/find-similar-gemini`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  });
  return r.json();
}