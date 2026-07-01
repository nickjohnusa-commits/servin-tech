/**
 * Runtime env validation. Call getEnv() inside route handlers or server
 * functions — never at module level, so builds don't fail when vars are absent.
 */
export function getEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Set it in Vercel → Settings → Environment Variables.`
    );
  }
  return val;
}
