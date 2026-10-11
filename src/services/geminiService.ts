import { BestMandiRecommendation } from '../utils/recommendationEngine';
import { MandiEconomics } from '../utils/revenueCalculator';

export interface AiExplanationResponse {
  source: 'gemini-ai' | 'deterministic-engine';
  recommendationTitle: string;
  narrativeSummary: string;
  practicalActionAdvice: string[];
  keyTradeoff: string;
  riskNotice: string;
  rateLimited?: boolean;
  retryAfterSeconds?: number;
}

// In-memory cache for client side to avoid redundant API requests
interface ClientCacheEntry {
  data: AiExplanationResponse;
  timestamp: number;
}

const clientCache = new Map<string, ClientCacheEntry>();
const CLIENT_CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes
let clientCooldownUntil = 0;

/**
 * Builds deterministic fallback advice based on accurate APMC revenue calculation.
 */
function buildDeterministicAdvice(
  recommendation: BestMandiRecommendation,
  rateLimited = false,
  retryAfterSeconds = 0
): AiExplanationResponse {
  const { bestMandi, runnerUpMandi, tradeoffAnalysis, detailedReason, riskAndLimitations } = recommendation;
  if (!bestMandi) {
    return {
      source: 'deterministic-engine',
      recommendationTitle: 'No Active Recommendation',
      narrativeSummary: 'Select mandis with available price data to generate comparative intelligence.',
      practicalActionAdvice: ['Check back when daily mandi price arrivals are filed.'],
      keyTradeoff: 'No comparable price points found.',
      riskNotice: 'Data currently unavailable.',
    };
  }

  return {
    source: 'deterministic-engine',
    rateLimited,
    retryAfterSeconds,
    recommendationTitle: `Recommended Dispatch: ${bestMandi.mandi.name}`,
    narrativeSummary: detailedReason,
    practicalActionAdvice: [
      `Confirm transport rate with vehicle operator: estimated ₹${bestMandi.transportCost.toLocaleString('en-IN')} for ${bestMandi.transportResult.roadDistanceKm} km freight.`,
      `Target arrival at ${bestMandi.mandi.name} yard before early morning open auction bidding (usually 7:00 AM - 9:00 AM).`,
      `Verify grading and moisture sorting of ${bestMandi.crop.name} to command the modal price of ₹${bestMandi.modalPrice.toLocaleString('en-IN')}/qtl or higher.`,
    ],
    keyTradeoff: tradeoffAnalysis,
    riskNotice: riskAndLimitations[0] || 'Market auction rates fluctuate depending on daily arrivals.',
  };
}

/**
 * Requests AI-assisted explanation from backend API endpoint,
 * with client caching, debouncing, and deterministic fallback when rate-limited.
 */
export async function getAiRecommendationExplanation(
  recommendation: BestMandiRecommendation,
  allEconomics: MandiEconomics[],
  bypassCache = false
): Promise<AiExplanationResponse> {
  const { bestMandi, runnerUpMandi } = recommendation;

  if (!bestMandi) {
    return buildDeterministicAdvice(recommendation);
  }

  const cacheKey = `${bestMandi.crop.id}_${bestMandi.quantityQuintals}_${bestMandi.mandi.id}_${runnerUpMandi?.mandi.id || 'none'}`;

  // 1. Return from client cache if available and not explicitly bypassed
  if (!bypassCache && clientCache.has(cacheKey)) {
    const cached = clientCache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < CLIENT_CACHE_TTL_MS) {
      return cached.data;
    }
  }

  // 2. If client is in known rate-limit cooldown, provide instant deterministic advice without network call
  if (!bypassCache && Date.now() < clientCooldownUntil) {
    const retrySec = Math.ceil((clientCooldownUntil - Date.now()) / 1000);
    return buildDeterministicAdvice(recommendation, true, retrySec);
  }

  // 3. Attempt to call server-side proxy
  try {
    const payload = {
      cropName: bestMandi.crop.name,
      quantityQuintals: bestMandi.quantityQuintals,
      bypassCache,
      bestMandi: {
        name: bestMandi.mandi.name,
        district: bestMandi.mandi.district,
        modalPrice: bestMandi.modalPrice,
        grossRevenue: bestMandi.grossRevenue,
        transportCost: bestMandi.transportCost,
        handlingCost: bestMandi.handlingCost,
        spoilageLoss: bestMandi.spoilageLossAmount,
        estimatedNetRevenue: bestMandi.estimatedNetRevenue,
        distanceKm: bestMandi.transportResult.roadDistanceKm,
      },
      runnerUpMandi: runnerUpMandi ? {
        name: runnerUpMandi.mandi.name,
        district: runnerUpMandi.mandi.district,
        modalPrice: runnerUpMandi.modalPrice,
        grossRevenue: runnerUpMandi.grossRevenue,
        transportCost: runnerUpMandi.transportCost,
        handlingCost: runnerUpMandi.handlingCost,
        spoilageLoss: runnerUpMandi.spoilageLossAmount,
        estimatedNetRevenue: runnerUpMandi.estimatedNetRevenue,
        distanceKm: runnerUpMandi.transportResult.roadDistanceKm,
      } : null,
      allComparisons: allEconomics.map((e) => ({
        mandi: e.mandi.name,
        modalPrice: e.modalPrice,
        distanceKm: e.transportResult.roadDistanceKm,
        netRevenue: e.estimatedNetRevenue,
      })),
    };

    const response = await fetch('/api/recommendation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.rateLimited && data.retryAfterSeconds) {
        clientCooldownUntil = Date.now() + (data.retryAfterSeconds * 1000);
      }

      if (data.success && data.aiExplanation) {
        const result: AiExplanationResponse = {
          source: data.source === 'gemini-ai' ? 'gemini-ai' : 'deterministic-engine',
          rateLimited: data.rateLimited,
          retryAfterSeconds: data.retryAfterSeconds,
          recommendationTitle: data.aiExplanation.recommendationTitle || `AI Dispatch Recommendation: ${bestMandi.mandi.name}`,
          narrativeSummary: data.aiExplanation.narrativeSummary || recommendation.detailedReason,
          practicalActionAdvice: data.aiExplanation.practicalActionAdvice || [
            'Confirm truck freight booking rate with the driver before loading.',
            'Target arrival at the APMC yard before early morning auction bidding commences (usually 7:00 AM - 9:00 AM).',
            'Keep APMC registration slip / farmer ID ready for entry gate concessions.',
          ],
          keyTradeoff: data.aiExplanation.keyTradeoff || recommendation.tradeoffAnalysis,
          riskNotice: data.aiExplanation.riskNotice || recommendation.riskAndLimitations[0],
        };

        // Cache the valid explanation
        clientCache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });

        return result;
      }
    }
  } catch (err) {
    console.info('Using local deterministic recommendation engine fallback:', err);
  }

  // 4. Deterministic fallback
  return buildDeterministicAdvice(recommendation);
}

