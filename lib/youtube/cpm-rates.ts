/**
 * Niche-specific CPM (cost per mille) ranges and region multipliers for the
 * YouTube Money Calculator.
 *
 * CPM = what advertisers pay per 1,000 ad impressions, in USD.
 * RPM ≈ CPM × 0.55 × monetized-playback-ratio (creator's actual share after
 * YouTube's 45% cut and accounting for views that don't see ads).
 *
 * Numbers below are 2024-2026 industry averages aggregated from Tubular,
 * Influencer Marketing Hub, and creator-shared CPM screenshots. Treat as
 * order-of-magnitude estimates — actual results vary by season, ad fill,
 * and audience demographics.
 */

export type Niche = {
  id: string;
  label: string;
  emoji: string;
  cpmLow: number;
  cpmHigh: number;
};

export const NICHES: Niche[] = [
  // Highest-CPM verticals
  { id: "finance",      label: "Finance & investing",   emoji: "💸", cpmLow: 15, cpmHigh: 30 },
  { id: "insurance",    label: "Insurance & legal",     emoji: "🛡️", cpmLow: 18, cpmHigh: 40 },
  { id: "real-estate",  label: "Real estate",           emoji: "🏠", cpmLow: 12, cpmHigh: 25 },
  { id: "business",     label: "Business & marketing",  emoji: "📈", cpmLow: 10, cpmHigh: 20 },
  // Mid-CPM verticals
  { id: "tech",         label: "Tech reviews",          emoji: "💻", cpmLow: 5,  cpmHigh: 15 },
  { id: "automotive",   label: "Automotive",            emoji: "🚗", cpmLow: 5,  cpmHigh: 12 },
  { id: "travel",       label: "Travel",                emoji: "✈️", cpmLow: 5,  cpmHigh: 10 },
  { id: "health",       label: "Health & fitness",      emoji: "💪", cpmLow: 4,  cpmHigh: 10 },
  { id: "sports",       label: "Sports",                emoji: "⚽", cpmLow: 4,  cpmHigh: 10 },
  { id: "beauty",       label: "Beauty & fashion",      emoji: "💄", cpmLow: 4,  cpmHigh: 8 },
  { id: "cooking",      label: "Cooking & food",        emoji: "🍳", cpmLow: 4,  cpmHigh: 8 },
  { id: "education",    label: "Education",             emoji: "📚", cpmLow: 3,  cpmHigh: 8 },
  { id: "diy",          label: "DIY & home",            emoji: "🔨", cpmLow: 3,  cpmHigh: 7 },
  { id: "lifestyle",    label: "Lifestyle & vlogs",     emoji: "🌿", cpmLow: 3,  cpmHigh: 7 },
  { id: "news",         label: "News & politics",       emoji: "📰", cpmLow: 3,  cpmHigh: 8 },
  // Lower-CPM verticals
  { id: "gaming",       label: "Gaming",                emoji: "🎮", cpmLow: 2,  cpmHigh: 5 },
  { id: "comedy",       label: "Comedy",                emoji: "😂", cpmLow: 2,  cpmHigh: 5 },
  { id: "music",        label: "Music & entertainment", emoji: "🎵", cpmLow: 1,  cpmHigh: 4 },
  { id: "kids",         label: "Kids (COPPA limits)",   emoji: "🧸", cpmLow: 1,  cpmHigh: 3 },
];

export type Region = {
  id: string;
  label: string;
  multiplier: number;
  hint: string;
};

export const REGIONS: Region[] = [
  { id: "us-uk-au-ca", label: "US, UK, Canada, Australia", multiplier: 1.0,  hint: "Tier-1 advertiser markets" },
  { id: "western-eu",  label: "Western Europe (DE, FR, NL…)", multiplier: 0.7, hint: "Strong but slightly below US rates" },
  { id: "asia-tier1",  label: "Japan, South Korea, Singapore", multiplier: 0.65, hint: "Premium Asian markets" },
  { id: "global-avg",  label: "Mixed global audience",       multiplier: 0.5,  hint: "Default if you don't know" },
  { id: "eastern-eu",  label: "Eastern Europe, MENA",        multiplier: 0.35, hint: "Lower ad rates" },
  { id: "latam-sea",   label: "Latin America, SEA, India",  multiplier: 0.2,  hint: "Lowest CPMs but largest reach" },
];

/** YouTube's revenue share to the creator (Partner Program). */
export const CREATOR_REVENUE_SHARE = 0.55;

/** Fraction of views that actually see ads (typical estimate). */
export const MONETIZED_PLAYBACK_RATIO = 0.6;

export type EarningsEstimate = {
  views: number;
  niche: Niche;
  region: Region;
  effectiveCpmLow: number;
  effectiveCpmHigh: number;
  effectiveCpmAvg: number;
  /** Creator-side revenue in USD: low / avg / high */
  earningsLow: number;
  earningsAvg: number;
  earningsHigh: number;
};

export function estimateEarnings(
  views: number,
  niche: Niche,
  region: Region
): EarningsEstimate {
  const effectiveCpmLow = niche.cpmLow * region.multiplier;
  const effectiveCpmHigh = niche.cpmHigh * region.multiplier;
  const effectiveCpmAvg = (effectiveCpmLow + effectiveCpmHigh) / 2;

  const monetizedViews = views * MONETIZED_PLAYBACK_RATIO;
  const cpmFactor = monetizedViews / 1000;

  return {
    views,
    niche,
    region,
    effectiveCpmLow,
    effectiveCpmHigh,
    effectiveCpmAvg,
    earningsLow: cpmFactor * effectiveCpmLow * CREATOR_REVENUE_SHARE,
    earningsAvg: cpmFactor * effectiveCpmAvg * CREATOR_REVENUE_SHARE,
    earningsHigh: cpmFactor * effectiveCpmHigh * CREATOR_REVENUE_SHARE,
  };
}
