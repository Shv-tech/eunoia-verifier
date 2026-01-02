export interface Constraint {
  type: "regulatory" | "ethical" | "technical";
  description: string;
}

export function extractConstraints(text: string): Constraint[] {
  const constraints: Constraint[] = [];

  if (text.toLowerCase().includes("gdpr")) {
    constraints.push({
      type: "regulatory",
      description: "Subject to GDPR compliance",
    });
  }

  if (text.toLowerCase().includes("should not harm")) {
    constraints.push({
      type: "ethical",
      description: "Implicit ethical boundary detected",
    });
  }

  return constraints;
}
