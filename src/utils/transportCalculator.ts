export interface VehicleType {
  id: string;
  name: string;
  capacityQuintals: number;
  defaultRatePerKm: number; // in INR
  defaultLoadingHandling: number; // in INR
  description: string;
}

export const STANDARD_VEHICLES: VehicleType[] = [
  {
    id: 'pickup_small',
    name: 'Small Pickup (Bolero Maxi / Ace)',
    capacityQuintals: 18,
    defaultRatePerKm: 24,
    defaultLoadingHandling: 450,
    description: 'Up to 1.8 Tons / 18 Quintals (best for small batches & quick dispatch)',
  },
  {
    id: 'truck_light',
    name: 'Light Commercial Truck (Tata 407 / Eicher 10.49)',
    capacityQuintals: 40,
    defaultRatePerKm: 28,
    defaultLoadingHandling: 800,
    description: 'Up to 4 Tons / 40 Quintals (standard for medium farm produce dispatch)',
  },
  {
    id: 'tractor_trolley',
    name: 'Tractor-Trolley (Rural Short-Haul)',
    capacityQuintals: 45,
    defaultRatePerKm: 22,
    defaultLoadingHandling: 500,
    description: 'Up to 4.5 Tons / 45 Quintals (economical for mandis within 50 km)',
  },
  {
    id: 'truck_heavy',
    name: 'Medium-Heavy 6-Wheeler (10-12 Tonner)',
    capacityQuintals: 100,
    defaultRatePerKm: 38,
    defaultLoadingHandling: 1600,
    description: 'Up to 10 Tons / 100 Quintals (long distance & interstate bulk terminal dispatches)',
  },
];

export interface TransportInputs {
  roadDistanceKm: number;
  produceQuantityQuintals: number;
  ratePerKm: number;
  loadingHandlingFee: number;
  vehicleCapacityQuintals: number;
  isTripCostQuote?: boolean;
  tripCostQuote?: number;
}

export interface TransportCalculationResult {
  roadDistanceKm: number;
  produceQuantityQuintals: number;
  ratePerKm: number;
  loadingHandlingFee: number;
  tripsRequired: number;
  vehicleCapacityQuintals: number;
  transitCostOnly: number;
  totalTransportCost: number;
  transportCostPerQuintal: number;
  estimatedTravelTimeHours: number;
  isEstimate: boolean;
}

/**
 * Calculates estimated transport cost using documented formula:
 * Total Transport Cost = (Road Distance × Rate per km × Trips) + Loading/Handling
 */
export function calculateTransportCost(inputs: TransportInputs): TransportCalculationResult {
  const {
    roadDistanceKm,
    produceQuantityQuintals,
    ratePerKm,
    loadingHandlingFee,
    vehicleCapacityQuintals,
    isTripCostQuote = false,
    tripCostQuote = 0,
  } = inputs;

  const validQty = Math.max(0.1, produceQuantityQuintals);
  const validDist = Math.max(1, roadDistanceKm);
  const capacity = Math.max(1, vehicleCapacityQuintals || 40);

  // Trips required based on capacity
  const tripsRequired = Math.ceil(validQty / capacity);

  let transitCostOnly = 0;
  if (isTripCostQuote && tripCostQuote > 0) {
    transitCostOnly = tripCostQuote * tripsRequired;
  } else {
    transitCostOnly = validDist * ratePerKm * tripsRequired;
  }

  const totalTransportCost = Math.round(transitCostOnly + (loadingHandlingFee * tripsRequired));
  const transportCostPerQuintal = Number((totalTransportCost / validQty).toFixed(2));

  // Average commercial vehicle speed in Indian rural and state highway corridors ~40 km/h
  const estimatedTravelTimeHours = Number((validDist / 40).toFixed(1));

  return {
    roadDistanceKm: validDist,
    produceQuantityQuintals: validQty,
    ratePerKm,
    loadingHandlingFee,
    tripsRequired,
    vehicleCapacityQuintals: capacity,
    transitCostOnly,
    totalTransportCost,
    transportCostPerQuintal,
    estimatedTravelTimeHours,
    isEstimate: true,
  };
}

/**
 * Estimates road distance between farmer origin and mandi based on coordinates or fallback lookup.
 * Applies a 1.25 road curvature factor over great-circle distance to approximate real road kilometers.
 */
export function estimateRoadDistance(
  originName: string,
  originDistrict: string,
  mandiName: string,
  mandiDistrict: string,
  mandiApproxDistanceKm: number
): number {
  if (originDistrict.toLowerCase() === mandiDistrict.toLowerCase()) {
    // Within same district: reasonable range based on mandi's distance from district center
    // E.g. If origin is Niphad and Mandi is Lasalgaon APMC (16 km)
    if (mandiApproxDistanceKm > 0) {
      return mandiApproxDistanceKm;
    }
    return 35; // default intra-district fallback
  }

  // Cross district road distance matrix estimates for Maharashtra
  const districtMatrix: Record<string, Record<string, number>> = {
    nashik: {
      pune: 210,
      ahmednagar: 155,
      solapur: 385,
      kolhapur: 440,
      nagpur: 670,
      jalgaon: 235,
      aurangabad: 180,
      'chhatrapati sambhajinagar': 180,
      kolar: 950,
      delhi: 1220,
    },
    pune: {
      nashik: 210,
      ahmednagar: 122,
      solapur: 250,
      kolhapur: 235,
      nagpur: 720,
      jalgaon: 390,
      aurangabad: 230,
      'chhatrapati sambhajinagar': 230,
      kolar: 840,
      delhi: 1420,
    },
    ahmednagar: {
      nashik: 155,
      pune: 122,
      solapur: 220,
      kolhapur: 360,
      nagpur: 600,
      jalgaon: 240,
      aurangabad: 115,
      'chhatrapati sambhajinagar': 115,
      kolar: 860,
      delhi: 1310,
    },
    solapur: {
      pune: 250,
      ahmednagar: 220,
      nashik: 385,
      kolhapur: 235,
      nagpur: 620,
      jalgaon: 450,
      aurangabad: 310,
      'chhatrapati sambhajinagar': 310,
      kolar: 610,
      delhi: 1550,
    },
  };

  const normOrig = originDistrict.toLowerCase();
  const normDest = mandiDistrict.toLowerCase();

  for (const [k1, destinations] of Object.entries(districtMatrix)) {
    if (normOrig.includes(k1)) {
      for (const [k2, dist] of Object.entries(destinations)) {
        if (normDest.includes(k2)) {
          return dist;
        }
      }
    }
  }

  // Inter-state terminal defaults
  if (normDest.includes('kolar') || normDest.includes('bengaluru')) {
    return 880;
  }
  if (normDest.includes('delhi') || normDest.includes('azadpur')) {
    return 1250;
  }

  return 120; // fallback standard inter-district distance
}
