/**
 * Red River Transportation inter-city fare schedule.
 * Powers the fare calculator on the transit page.
 *
 * ⚠️ VERIFY WITH CADC — fares change and the legacy site gave no effective date.
 * Once confirmed, ask CADC for the effective date and surface it on the page so
 * riders know the quote is current.
 *
 * All fares are calculated on ROUND-TRIP mileage.
 */

export type RiderType = "standard" | "reduced";

export interface FareBand {
  /** Inclusive lower bound, round-trip miles. */
  minMiles: number;
  /** Inclusive upper bound. null = no upper bound (per-mile rate applies). */
  maxMiles: number | null;
  /** Flat fare in dollars. null when perMile applies instead. */
  flat: number | null;
  perMile?: number;
  label: string;
}

/** General public. */
export const standardFares: FareBand[] = [
  { minMiles: 1,   maxMiles: 10,   flat: 8,  label: "1–10 miles" },
  { minMiles: 11,  maxMiles: 30,   flat: 15, label: "11–30 miles" },
  { minMiles: 31,  maxMiles: 50,   flat: 30, label: "31–50 miles" },
  { minMiles: 51,  maxMiles: 100,  flat: 45, label: "51–100 miles" },
  { minMiles: 101, maxMiles: 150,  flat: 60, label: "101–150 miles" },
  { minMiles: 151, maxMiles: 249,  flat: 80, label: "151–249 miles" },
  { minMiles: 250, maxMiles: null, flat: null, perMile: 0.4, label: "250+ miles" },
];

/** Seniors 55+ and persons with disabilities. */
export const reducedFares: FareBand[] = [
  { minMiles: 1,   maxMiles: 10,   flat: 8,  label: "1–10 miles" },
  { minMiles: 11,  maxMiles: 30,   flat: 15, label: "11–30 miles" },
  { minMiles: 31,  maxMiles: 50,   flat: 20, label: "31–50 miles" },
  { minMiles: 51,  maxMiles: 100,  flat: 30, label: "51–100 miles" },
  { minMiles: 101, maxMiles: 150,  flat: 40, label: "101–150 miles" },
  { minMiles: 151, maxMiles: 249,  flat: 60, label: "151–249 miles" },
  { minMiles: 250, maxMiles: null, flat: null, perMile: 0.4, label: "250+ miles" },
];

export const reducedEligibilityNote =
  "Reduced fares apply to riders age 55 and older and to persons with disabilities.";

/** Charged after the first hour of wait time. */
export const waitTimeHourlyRate = 10;

export const fareNotes = [
  "Fares are calculated on round-trip mileage.",
  `Wait time is charged at $${waitTimeHourlyRate.toFixed(2)} per hour after the first hour.`,
  "All vehicles are ADA lift or ramp equipped.",
] as const;

export const fleet = { vehicles: 110, counties: 16 } as const;

// ─── Calculator ──────────────────────────────────────────────────────────────

export interface FareQuote {
  amount: number;
  band: FareBand;
  isPerMile: boolean;
}

/**
 * Quote a fare for a given round-trip mileage.
 * Returns null for non-positive input so the UI can prompt rather than show $0.
 */
export function quoteFare(
  roundTripMiles: number,
  rider: RiderType = "standard"
): FareQuote | null {
  if (!Number.isFinite(roundTripMiles) || roundTripMiles <= 0) return null;

  const table = rider === "reduced" ? reducedFares : standardFares;
  const band = table.find(
    (b) => roundTripMiles >= b.minMiles && (b.maxMiles === null || roundTripMiles <= b.maxMiles)
  );
  if (!band) return null;

  if (band.flat !== null) {
    return { amount: band.flat, band, isPerMile: false };
  }
  return {
    amount: Math.round(roundTripMiles * (band.perMile ?? 0) * 100) / 100,
    band,
    isPerMile: true,
  };
}

export const formatUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
