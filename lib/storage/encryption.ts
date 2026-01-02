import crypto from "crypto";

const ALGO = "aes-256-gcm";

export function encrypt(text: string, key: Buffer): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("hex");
}

export function decrypt(data: string, key: Buffer): string {
  const buf = Buffer.from(data, "hex");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const text = buf.subarray(28);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(text), decipher.final()]).toString();
}
