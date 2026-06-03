import crypto from "crypto";

const OPERATORS = ["+", "-"] as const;
const SECRET = process.env.CAPTCHA_SECRET || "captcha-secret-dev";

export function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const op = OPERATORS[Math.floor(Math.random() * OPERATORS.length)];
  const answer = op === "+" ? a + b : a - b;
  const token = crypto
    .createHash("sha256")
    .update(SECRET + answer)
    .digest("hex");
  return { question: `${a} ${op === "+" ? "+" : "-"} ${b}`, answer, token };
}

export function verifyCaptcha(answer: number, token: string): boolean {
  const expected = crypto
    .createHash("sha256")
    .update(SECRET + answer)
    .digest("hex");
  return expected === token;
}
