const RETRIES = [1000, 2000, 4000, 8000, 16000];

export async function fetchGeminiText(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY ?? '';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  for (let i = 0; i <= RETRIES.length; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Tidak ada respons dari AI.';
    } catch {
      if (i === RETRIES.length)
        return 'Gagal terhubung ke AI setelah beberapa kali percobaan. Silakan coba lagi nanti.';
      await new Promise((r) => setTimeout(r, RETRIES[i]));
    }
  }
  return '';
}
