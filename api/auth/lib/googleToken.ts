import { OAuth2Client } from 'google-auth-library';

const gci = process.env.G_CLIENT_ID;

/**
 * Fetch token's owner information, if it's valid.
 * @param token Google provided.
 */
export async function getGoogleUser(token: string) {
  const client = new OAuth2Client(gci);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: gci
  });
  const payload = ticket.getPayload();
  return {
    email: payload.email,
    name: payload.given_name,
    lastName: payload.family_name,
    image: payload.picture,
    verified: payload.email_verified
  };
}
