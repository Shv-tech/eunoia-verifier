import { Claim } from "./claim-decomposer";

export interface ClaimLink {
  from: string;
  to: string;
}

export function linkClaims(claims: Claim[]): ClaimLink[] {
  const links: ClaimLink[] = [];

  for (let i = 1; i < claims.length; i++) {
    links.push({
      from: claims[i - 1].id,
      to: claims[i].id,
    });
  }

  return links;
}
