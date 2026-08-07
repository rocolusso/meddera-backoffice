import { createRemoteJWKSet, jwtVerify } from "jose";

const TELEGRAM_ISSUER = "https://oauth.telegram.org";
const JWKS_URL = "https://oauth.telegram.org/.well-known/jwks.json";

export interface TelegramUser {
  id: number;
  name?: string;
  username?: string;
  picture?: string;
}

export async function verifyTelegramIdToken(
  idToken: string
): Promise<TelegramUser | null> {
  const clientId = process.env.TELEGRAM_CLIENT_ID;
  if (!clientId) {
    throw new Error("TELEGRAM_CLIENT_ID is not set");
  }

  try {
    const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: TELEGRAM_ISSUER,
      audience: clientId,
    });

    const id = payload["id"] ?? payload["sub"];
    if (!id) return null;

    return {
      id: Number(id),
      name: payload["name"] as string | undefined,
      username: payload["preferred_username"] as string | undefined,
      picture: payload["picture"] as string | undefined,
    };
  } catch {
    return null;
  }
}
