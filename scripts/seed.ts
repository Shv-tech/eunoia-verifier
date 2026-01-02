import { saveVerification } from "../lib/storage/db";

saveVerification({
  userId: "seed",
  content: "initial",
  result: { score: 0, band: "Unverified", claims: [], risks: [] },
});
console.log("Seeded");
