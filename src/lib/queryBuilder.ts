import { productTypes, userGroups, capabilities, painPoints, domainHints } from "@/config/taxonomy";

export interface SearchFormData {
  productType: string;
  productTypeOther?: string;
  selectedUserGroups: string[];
  selectedCapabilities: string[];
  selectedPainPoints: string[];
  selectedDomains: string[];
  freeText: string;
}

function lookupLabels(ids: string[], options: { id: string; label: string }[]): string[] {
  return ids.map((id) => options.find((o) => o.id === id)?.label ?? id);
}

function joinNatural(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
}

function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max - 3).replace(/,?\s+\S*$/, "...");
}

export function buildQueries(data: SearchFormData): {
  primary: string;
  alternatives: string[];
  technical?: string;
} {
  const productLabel =
    data.productType === "other" && data.productTypeOther
      ? data.productTypeOther
      : productTypes.find((p) => p.id === data.productType)?.label ?? data.productType;

  const users = lookupLabels(data.selectedUserGroups, userGroups);
  const caps = lookupLabels(data.selectedCapabilities, capabilities);
  const pains = lookupLabels(data.selectedPainPoints, painPoints);
  const domains = lookupLabels(data.selectedDomains, domainHints);

  // Primary query: product + users + top capabilities
  const topCaps = caps.slice(0, 6);
  let primary = `${productLabel.toLowerCase()} service`;
  if (users.length > 0) primary += ` for ${joinNatural(users.slice(0, 3)).toLowerCase()}`;
  if (topCaps.length > 0) primary += ` with ${joinNatural(topCaps).toLowerCase()}`;
  if (data.freeText.trim()) primary += `, ${data.freeText.trim()}`;
  primary = truncate(primary, 220);

  // Alternative 1: focus on pain points
  const alternatives: string[] = [];
  if (pains.length > 0) {
    let alt1 = `digital service addressing ${joinNatural(pains.slice(0, 4)).toLowerCase()}`;
    if (users.length > 0) alt1 += ` for ${users[0].toLowerCase()}`;
    alt1 += ` in ${productLabel.toLowerCase()}`;
    alternatives.push(truncate(alt1, 220));
  }

  // Alternative 2: domain-focused
  if (domains.length > 0) {
    let alt2 = `${domains[0].toLowerCase()} sector ${productLabel.toLowerCase()}`;
    if (topCaps.length > 0) alt2 += ` with ${joinNatural(topCaps.slice(0, 4)).toLowerCase()}`;
    alternatives.push(truncate(alt2, 220));
  }

  // Alternative 3: capability-focused
  if (caps.length > 2) {
    const alt3 = `public sector service implementing ${joinNatural(caps.slice(0, 5)).toLowerCase()} capabilities`;
    alternatives.push(truncate(alt3, 220));
  }

  // Technical query
  let technical: string | undefined;
  const techCaps = caps.filter((c) =>
    ["API integration", "Integration with legacy systems", "Audit trail", "Role-based permissions", "Authentication and sign-in"].includes(c)
  );
  if (techCaps.length > 0) {
    technical = truncate(`technical implementation of ${joinNatural(techCaps).toLowerCase()} in government ${productLabel.toLowerCase()}`, 220);
  }

  return { primary, alternatives, technical };
}
