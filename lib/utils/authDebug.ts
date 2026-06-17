//lib>utils>authDebug.ts
const MASK_PREFIX = 6;
const MASK_SUFFIX = 4;

export const isAuthDebugEnabled = process.env.NEXT_PUBLIC_AUTH_DEBUG === "true";

export const maskToken = (value?: string | null) => {
  if (!value) return "none";
  if (value.length <= MASK_PREFIX + MASK_SUFFIX) {
    return `${value.slice(0, 2)}...${value.slice(-2)}`;
  }
  return `${value.slice(0, MASK_PREFIX)}...${value.slice(-MASK_SUFFIX)}`;
};

export const parseCookieHeader = (cookieHeader?: string | null) => {
  if (!cookieHeader) return {} as Record<string, string>;
  return cookieHeader
    .split(";")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, pair) => {
      const [name, ...rest] = pair.split("=");
      if (name) {
        acc[name] = rest.join("=");
      }
      return acc;
    }, {});
};

export const debugCookies = (cookieHeader?: string | null) => {
  const parsed = parseCookieHeader(cookieHeader);
  return {
    names: Object.keys(parsed),
    hasAccessToken: Boolean(parsed.accessToken),
    accessToken: maskToken(parsed.accessToken),
    hasRefreshToken: Boolean(parsed.refreshToken),
    refreshToken: maskToken(parsed.refreshToken),
  };
};

export const logAuthDebug = (
  context: string,
  details: Record<string, unknown>
) => {
  if (!isAuthDebugEnabled) return;
  console.log(`[auth-debug] ${context}`, JSON.stringify(details));
};
