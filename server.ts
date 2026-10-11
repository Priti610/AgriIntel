import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// In-memory cache & rate limit protection for Gemini API
interface CacheEntry {
  aiExplanation: any;
  timestamp: number;
}
const aiCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes cache
let rateLimitCooldownUntil = 0;

function generateFallbackExplanation(
  cropName: string,
  quantityQuintals: number,
  bestMandi: any,
  runnerUpMandi: any
) {
  const diff = runnerUpMandi ? (bestMandi.estimatedNetRevenue - runnerUpMandi.estimatedNetRevenue) : 0;
  const netPerQtl = Math.round(bestMandi.estimatedNetRevenue / (quantityQuintals || 1));
  const advantageText = runnerUpMandi
    ? ` This provides an estimated net profit advantage of ₹${diff.toLocaleString('en-IN')} over ${runnerUpMandi.name} (${runnerUpMandi.district}).`
    : '';

  return {
    recommendationTitle: `Recommended Dispatch: ${bestMandi.name} (${bestMandi.district})`,
    narrativeSummary: `${bestMandi.name} delivers the highest net farmer realization of ₹${bestMandi.estimatedNetRevenue.toLocaleString('en-IN')} (approx ₹${netPerQtl}/quintal in hand) for ${quantityQuintals} quintals of ${cropName}.${advantageText}`,
    keyTradeoff: `Even after accounting for ₹${bestMandi.transportCost.toLocaleString('en-IN')} in road freight (${bestMandi.distanceKm} km) and ₹${bestMandi.handlingCost.toLocaleString('en-IN')} in APMC fees, the ₹${bestMandi.modalPrice}/qtl modal rate yields superior net revenue compared to alternative markets.`,
    practicalActionAdvice: [
      `Pre-confirm truck freight booking rate with the driver at or below ₹${bestMandi.transportCost.toLocaleString('en-IN')}.`,
      `Target arrival at ${bestMandi.name.includes('APMC') ? bestMandi.name : `${bestMandi.name} APMC`} auction yard before 8:00 AM to secure favorable bidding lots.`,
      `Ensure proper sorting and moisture control for ${cropName} to maximize bid attainment at or above the ₹${bestMandi.modalPrice}/qtl modal rate.`,
    ],
    riskNotice: 'Mandi auction rates fluctuate dynamically based on daily APMC arrival volumes and produce grade.',
  };
}

// API: AI-Assisted Recommendation Explanation
app.post('/api/recommendation', async (req, res) => {
  try {
    const { cropName, quantityQuintals, bestMandi, runnerUpMandi, allComparisons, bypassCache } = req.body;

    if (!bestMandi || !cropName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: cropName and bestMandi',
      });
    }

    const cacheKey = `${cropName}_${quantityQuintals}_${bestMandi.name}_${runnerUpMandi?.name || 'none'}`;

    // 1. Check in-memory cache
    if (!bypassCache && aiCache.has(cacheKey)) {
      const cached = aiCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return res.json({
          success: true,
          cached: true,
          source: 'gemini-ai',
          aiExplanation: cached.aiExplanation,
        });
      }
    }

    // 2. Check if currently in rate limit cooldown
    if (Date.now() < rateLimitCooldownUntil) {
      const retrySecondsLeft = Math.ceil((rateLimitCooldownUntil - Date.now()) / 1000);
      const fallbackExplanation = generateFallbackExplanation(cropName, quantityQuintals, bestMandi, runnerUpMandi);
      return res.json({
        success: true,
        cached: false,
        rateLimited: true,
        retryAfterSeconds: retrySecondsLeft,
        source: 'deterministic-engine',
        aiExplanation: fallbackExplanation,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallbackExplanation = generateFallbackExplanation(cropName, quantityQuintals, bestMandi, runnerUpMandi);
      return res.status(200).json({
        success: true,
        fallback: true,
        source: 'deterministic-engine',
        aiExplanation: fallbackExplanation,
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are an expert Indian agricultural market intelligence advisor working for the "Prima-AgriIntel" platform.
A farmer has submitted the following produce and market options for comparison:

- Crop: ${cropName}
- Quantity: ${quantityQuintals} Quintals
- Top Ranked Mandi: ${bestMandi.name} (${bestMandi.district})
  - Distance: ${bestMandi.distanceKm} km
  - Headline Modal Price: ₹${bestMandi.modalPrice} / quintal
  - Gross Revenue: ₹${bestMandi.grossRevenue}
  - Estimated Transport Cost: ₹${bestMandi.transportCost}
  - Mandi Handling & Cess: ₹${bestMandi.handlingCost}
  - Estimated Spoilage Loss: ₹${bestMandi.spoilageLoss}
  - Estimated Net Revenue: ₹${bestMandi.estimatedNetRevenue}

${runnerUpMandi ? `- Second-Best Mandi (Runner Up): ${runnerUpMandi.name} (${runnerUpMandi.district})
  - Distance: ${runnerUpMandi.distanceKm} km
  - Headline Modal Price: ₹${runnerUpMandi.modalPrice} / quintal
  - Gross Revenue: ₹${runnerUpMandi.grossRevenue}
  - Estimated Transport Cost: ₹${runnerUpMandi.transportCost}
  - Estimated Net Revenue: ₹${runnerUpMandi.estimatedNetRevenue}
` : 'No runner up.'}

Other compared mandis:
${JSON.stringify(allComparisons, null, 2)}

TASK:
Provide a clear, farmer-friendly, practical decision analysis. Explain why the highest net revenue mandi was chosen, explain any trade-off between higher headline price vs transportation freight costs, and give 3 actionable dispatch steps.

Return ONLY valid JSON matching this schema:
{
  "recommendationTitle": "string",
  "narrativeSummary": "string (2-3 sentences in simple language)",
  "keyTradeoff": "string (explain price vs transport math clearly)",
  "practicalActionAdvice": ["string", "string", "string"],
  "riskNotice": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let aiExplanation;
    try {
      aiExplanation = JSON.parse(text);
    } catch {
      aiExplanation = generateFallbackExplanation(cropName, quantityQuintals, bestMandi, runnerUpMandi);
    }

    // Cache the successful AI result
    aiCache.set(cacheKey, {
      aiExplanation,
      timestamp: Date.now(),
    });

    res.json({
      success: true,
      source: 'gemini-ai',
      aiExplanation,
    });
  } catch (error: any) {
    const errorMsg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
    const isRateLimit =
      error?.status === 429 ||
      error?.code === 429 ||
      error?.status === 'RESOURCE_EXHAUSTED' ||
      errorMsg.includes('429') ||
      errorMsg.includes('quota') ||
      errorMsg.includes('RESOURCE_EXHAUSTED');

    const { cropName, quantityQuintals, bestMandi, runnerUpMandi } = req.body;
    const fallbackExplanation = bestMandi
      ? generateFallbackExplanation(cropName || 'Produce', quantityQuintals || 40, bestMandi, runnerUpMandi)
      : null;

    if (isRateLimit) {
      let retryDelayMs = 60000;
      const retryMatch = errorMsg.match(/retry in ([0-9.]+)s/i) || errorMsg.match(/"retryDelay":\s*"(\d+)s"/i);
      if (retryMatch) {
        retryDelayMs = Math.ceil(parseFloat(retryMatch[1]) * 1000) + 1000;
      }
      rateLimitCooldownUntil = Date.now() + retryDelayMs;
      const retrySec = Math.ceil(retryDelayMs / 1000);
      console.warn(`[Prima-AgriIntel] Gemini rate limit reached (5 RPM free tier). Cooling down for ${retrySec}s; using deterministic intelligence fallback.`);

      return res.status(200).json({
        success: true,
        rateLimited: true,
        retryAfterSeconds: retrySec,
        source: 'deterministic-engine',
        aiExplanation: fallbackExplanation,
      });
    }

    console.warn('[Prima-AgriIntel] Gemini API error, serving fallback analysis:', errorMsg);
    res.status(200).json({
      success: true,
      fallback: true,
      source: 'deterministic-engine',
      aiExplanation: fallbackExplanation,
    });
  }
});

// Start Vite middleware in dev or serve static in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Prima-AgriIntel server running on http://localhost:${PORT}`);
  });
}

startServer();
