import { Domain } from "../../intake/domain-classifier";

export function mapDomainRisk(domain: Domain): number {
  switch (domain) {
    case "legal":
      return 30;
    case "finance":
      return 25;
    case "research":
      return 15;
    case "product":
      return 10;
    default:
      return 5;
  }
}
