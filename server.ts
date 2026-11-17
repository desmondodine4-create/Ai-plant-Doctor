import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const MODEL_NAME = 'gemini-4-hydrogen';

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error('MISSING_API_KEY');
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isTransient = msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('ECONNRESET');
      if (!isTransient || attempt === maxAttempts) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, 800 * attempt));
    }
  }
  throw lastError;
}

function mapGeminiError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw === 'MISSING_API_KEY') {
    return {
      status: 503,
      message: 'GEMINI_API_KEY is not configured in the server environment secrets.',
    };
  }
  if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429')) {
    return {
      status: 429,
      message: 'Gemini API rate limit reached. Please wait briefly and try again.',
    };
  }
  if (raw.includes('API_KEY_INVALID') || raw.includes('PERMISSION_DENIED') || raw.includes('403') || raw.includes('400')) {
    return {
      status: 400,
      message: 'Gemini API rejected the request or key. Please check GEMINI_API_KEY in Settings > Secrets.',
    };
  }
  return {
    status: 500,
    message: 'Unable to complete AI analysis right now. Please check your connection and try again.',
  };
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '15mb' }));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'AI Plant Doctor Backend',
      model: MODEL_NAME,
      hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()),
      hasSourceZip: fs.existsSync(path.join(__dirname, 'public', 'downloads', 'AIPlantDoctor_Source.zip')),
    });
  });

  app.post('/api/diagnose', async (req, res) => {
    try {
      const { imageBase64, mimeType, plantHint, notes } = req.body ?? {};

      if (typeof imageBase64 !== 'string' || imageBase64.trim().length < 32) {
        res.status(400).json({ error: 'Please provide a valid plant photograph.' });
        return;
      }

      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '').trim();
      const safeMime =
        typeof mimeType === 'string' && mimeType.startsWith('image/')
          ? mimeType
          : 'image/jpeg';

      const ai = getGeminiClient();

      const promptLines = [
        'Analyze this photograph as a senior plant pathologist and agronomist.',
        plantHint ? `User-suggested plant/crop: ${String(plantHint).slice(0, 120)}` : '',
        notes ? `User field notes: ${String(notes).slice(0, 300)}` : '',
        '',
        'CRITICAL ACCURACY RULES:',
        '1. If the image does NOT show a plant, leaf, stem, root, fruit, or crop, set isPlantImage=false, isUncertain=true, and explain politely in uncertaintyReason that a clear plant photograph is required.',
        '2. If the image IS a plant but is too blurry, dark, distant, or obscured to make a reliable diagnosis, set isPlantImage=true, isUncertain=true, do NOT invent a disease, and explain what photo angle/lighting is needed in uncertaintyReason.',
        '3. If clearly healthy, set isHealthy=true, diseaseName="No Disease Detected", severity="None", and provide helpful preventive care.',
        '4. If a disease, pest damage, or nutrient deficiency is identifiable, provide clear, farmer-friendly diagnosis details, step-by-step practical treatment (including cultural/organic and targeted options), prevention tips, and follow-up monitoring care.',
      ]
        .filter(Boolean)
        .join('\n');

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: safeMime,
                  data: cleanBase64,
                },
              },
              { text: promptLines },
            ],
          },
          config: {
            systemInstruction:
              'You are AI Plant Doctor, an expert agricultural plant pathologist. Be scientifically grounded, practical for smallholder farmers and home gardeners, and strictly honest when an image is unclear or non-botanical.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isPlantImage: { type: Type.BOOLEAN },
                isUncertain: { type: Type.BOOLEAN },
                uncertaintyReason: { type: Type.STRING },
                plantName: { type: Type.STRING },
                scientificName: { type: Type.STRING },
                isHealthy: { type: Type.BOOLEAN },
                diseaseName: { type: Type.STRING },
                confidenceLevel: {
                  type: Type.STRING,
                  description: 'One of High, Medium, or Low',
                },
                confidenceScore: {
                  type: Type.INTEGER,
                  description: 'Integer percentage 0-100',
                },
                severity: {
                  type: Type.STRING,
                  description: 'One of None, Mild, Moderate, Severe, or Critical',
                },
                diseaseDescription: { type: Type.STRING },
                symptomsDetected: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                possibleCauses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                recommendedTreatment: { type: Type.STRING },
                stepByStepTreatment: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                preventionTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                followUpCare: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'isPlantImage',
                'isUncertain',
                'uncertaintyReason',
                'plantName',
                'scientificName',
                'isHealthy',
                'diseaseName',
                'confidenceLevel',
                'confidenceScore',
                'severity',
                'diseaseDescription',
                'symptomsDetected',
                'possibleCauses',
                'recommendedTreatment',
                'stepByStepTreatment',
                'preventionTips',
                'followUpCare',
              ],
            },
          },
        }),
      );

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText);
      res.json(parsed);
    } catch (err) {
      console.error('[POST /api/diagnose]', err);
      const mapped = mapGeminiError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  app.post('/api/assistant', async (req, res) => {
    try {
      const { question, history, cropContext } = req.body ?? {};
      if (typeof question !== 'string' || !question.trim()) {
        res.status(400).json({ error: 'Please enter a plant care question.' });
        return;
      }

      const ai = getGeminiClient();

      const priorTurns = Array.isArray(history)
        ? history
            .slice(-8)
            .map((m: { role?: string; text?: string }) =>
              `${m.role === 'user' ? 'Grower' : 'AI Plant Doctor'}: ${String(m.text ?? '').slice(0, 600)}`,
            )
            .join('\n')
        : '';

      const prompt = [
        cropContext ? `Crop focus: ${String(cropContext).slice(0, 100)}` : '',
        priorTurns ? `Recent conversation:\n${priorTurns}` : '',
        `Current question: ${question.trim().slice(0, 1000)}`,
      ]
        .filter(Boolean)
        .join('\n\n');

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: prompt,
          config: {
            systemInstruction:
              'You are AI Plant Doctor, a practical agricultural and plant health advisor for farmers, gardeners, and agronomy students. Answer clearly in structured, easy-to-follow paragraphs and concise bullet points. Include root causes, immediate practical steps, organic/cultural practices, and prevention. Never invent unsafe chemical dosages; remind users to follow local agricultural extension labels when using crop protection products.',
          },
        }),
      );

      res.json({ answer: (response.text ?? '').trim() });
    } catch (err) {
      console.error('[POST /api/assistant]', err);
      const mapped = mapGeminiError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  app.get('/api/download/source-zip', (_req, res) => {
    const zipPath = path.join(__dirname, 'public', 'downloads', 'AIPlantDoctor_Source.zip');
    if (!fs.existsSync(zipPath)) {
      res.status(404).json({ error: 'Source archive not built yet.' });
      return;
    }
    res.download(zipPath, 'AIPlantDoctor_Source.zip');
  });

  app.get('/api/download/readme', (_req, res) => {
    const readmePath = path.join(__dirname, 'README.md');
    if (!fs.existsSync(readmePath)) {
      res.status(404).json({ error: 'README.md not found.' });
      return;
    }
    res.download(readmePath, 'README.md');
  });

  app.use('/downloads', express.static(path.join(__dirname, 'public', 'downloads')));

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Plant Doctor server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start AI Plant Doctor server:', err);
  process.exit(1);
});
