import { Crop } from '../data/crops';
import { Mandi } from '../data/locations';
import { PriceRecord } from '../data/demoPrices';
import { calculateTransportCost, TransportInputs, TransportCalculationResult } from './transportCalculator';

export interface MandiEconomics {
  mandi: Mandi;
  crop: Crop;
  priceRecord: PriceRecord | null;
  hasPriceData: boolean;
  quantityQuintals: number;
  modalPrice: number;
  priceUnit: string;
  grossRevenue: number;
  transportResult: TransportCalculationResult;
  transportCost: number;
  handlingCost: number; // mandi cess, weighment, porterage
  spoilagePercentage: number;
  spoilageLossAmount: number;
  otherApplicableCosts: number;
  totalDeductions: number;
  estimatedNetRevenue: number;
  netRevenuePerQuintal: number;
  isViable: boolean;
  statusBadge: 'Highest Net Return' | 'Eligible' | 'High Transport Drag' | 'No Price Data';
}

export interface CalculationOptions {
  crop: Crop;
  quantityQuintals: number;
  originName: string;
  originDistrict: string;
  mandis: Mandi[];
  getPriceFn: (cropId: string, mandiId: string) => PriceRecord | null;
  getDistanceFn: (originName: string, originDistrict: string, mandi: Mandi) => number;
  vehicleRatePerKm?: number;
  vehicleCapacityQuintals?: number;
  baseLoadingFee?: number;
  mandiHandlingCessPerQuintal?: number; // APMC market entry / cess / porterage typical ~₹15/qtl
}

/**
 * Calculates net revenue, transport expenses, handling, and spoilage for a single mandi.
 */
export function calculateSingleMandiEconomics(
  mandi: Mandi,
  options: {
    crop: Crop;
    quantityQuintals: number;
    priceRecord: PriceRecord | null;
    roadDistanceKm: number;
    ratePerKm: number;
    vehicleCapacityQuintals: number;
    baseLoadingFee: number;
    mandiHandlingCessPerQuintal?: number;
  }
): MandiEconomics {
  const {
    crop,
    quantityQuintals,
    priceRecord,
    roadDistanceKm,
    ratePerKm,
    vehicleCapacityQuintals,
    baseLoadingFee,
    mandiHandlingCessPerQuintal = 15,
  } = options;

  const hasPriceData = !!priceRecord && priceRecord.status !== 'Unavailable';
  const modalPrice = hasPriceData ? priceRecord!.modalPrice : 0;
  const priceUnit = '₹ / quintal';

  // 1. Gross Revenue = Expected Selling Price × Quantity
  const grossRevenue = Math.round(modalPrice * quantityQuintals);

  // 2. Transport Cost
  const transportInputs: TransportInputs = {
    roadDistanceKm,
    produceQuantityQuintals: quantityQuintals,
    ratePerKm,
    loadingHandlingFee: baseLoadingFee,
    vehicleCapacityQuintals,
  };
  const transportResult = calculateTransportCost(transportInputs);
  const transportCost = transportResult.totalTransportCost;

  // 3. APMC Mandi Handling Cost (porterage, weighing charges, market entry fee)
  const handlingCost = Math.round(quantityQuintals * mandiHandlingCessPerQuintal);

  // 4. Spoilage Loss (distance-based degradation for perishable produce like tomato, onion, grapes)
  let spoilagePercentage = 0;
  let spoilageLossAmount = 0;

  if (crop.perishable) {
    // E.g. Tomato at 1.8% per 100km. If 200km => 3.6% spoilage value loss
    const distanceFactor = Math.min(6, (roadDistanceKm / 100) * crop.baseSpoilageRatePer100Km);
    spoilagePercentage = Number(distanceFactor.toFixed(2));
    spoilageLossAmount = Math.round((grossRevenue * spoilagePercentage) / 100);
  }

  // 5. Other applicable costs (packaging wear & tear, transit toll approximation)
  const tollAndIncidentals = roadDistanceKm > 80 ? Math.round((roadDistanceKm / 80) * 120) : 0;
  const otherApplicableCosts = tollAndIncidentals;

  // 6. Estimated Net Revenue = Gross Revenue − Transport Cost − Handling Cost − Spoilage Loss − Other Costs
  const totalDeductions = transportCost + handlingCost + spoilageLossAmount + otherApplicableCosts;
  const estimatedNetRevenue = hasPriceData ? Math.round(grossRevenue - totalDeductions) : 0;
  const netRevenuePerQuintal = quantityQuintals > 0 && hasPriceData
    ? Number((estimatedNetRevenue / quantityQuintals).toFixed(2))
    : 0;

  const isViable = hasPriceData && estimatedNetRevenue > 0;

  let statusBadge: MandiEconomics['statusBadge'] = 'Eligible';
  if (!hasPriceData) {
    statusBadge = 'No Price Data';
  } else if (transportCost > grossRevenue * 0.35) {
    statusBadge = 'High Transport Drag';
  }

  return {
    mandi,
    crop,
    priceRecord,
    hasPriceData,
    quantityQuintals,
    modalPrice,
    priceUnit,
    grossRevenue,
    transportResult,
    transportCost,
    handlingCost,
    spoilagePercentage,
    spoilageLossAmount,
    otherApplicableCosts,
    totalDeductions,
    estimatedNetRevenue,
    netRevenuePerQuintal,
    isViable,
    statusBadge,
  };
}

/**
 * Calculates economics for all selected mandis and sorts/ranks them.
 */
export function calculateAllMandisEconomics(options: CalculationOptions): MandiEconomics[] {
  const {
    crop,
    quantityQuintals,
    originName,
    originDistrict,
    mandis,
    getPriceFn,
    getDistanceFn,
    vehicleRatePerKm = 28,
    vehicleCapacityQuintals = 40,
    baseLoadingFee = 800,
    mandiHandlingCessPerQuintal = 15,
  } = options;

  const results: MandiEconomics[] = mandis.map((mandi) => {
    const priceRecord = getPriceFn(crop.id, mandi.id);
    const roadDistanceKm = getDistanceFn(originName, originDistrict, mandi);

    return calculateSingleMandiEconomics(mandi, {
      crop,
      quantityQuintals,
      priceRecord,
      roadDistanceKm,
      ratePerKm: vehicleRatePerKm,
      vehicleCapacityQuintals,
      baseLoadingFee,
      mandiHandlingCessPerQuintal,
    });
  });

  // Find the highest net revenue among eligible mandis
  const validPricedMandis = results.filter((r) => r.hasPriceData);
  if (validPricedMandis.length > 0) {
    const maxNet = Math.max(...validPricedMandis.map((r) => r.estimatedNetRevenue));
    results.forEach((item) => {
      if (item.hasPriceData && item.estimatedNetRevenue === maxNet && maxNet > 0) {
        item.statusBadge = 'Highest Net Return';
      }
    });
  }

  return results;
}
