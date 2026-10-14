import { createSign } from "crypto";

// SERVER-ONLY. Direktang Firestore REST API ang gamit dito (hindi na
// firebase-admin), dahil napakabigat ng grpc dependency ng firebase-admin
// at nagdudulot ito ng "out of memory" crash habang nagbi-build, kahit
// sa Vercel cloud. Walang native dependencies ang paraang ito — fetch()
// at ang built-in na crypto module ng Node lang ang ginagamit.

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/datastore";

let cachedToken: { value: string; expiresAt: number } | null = null;

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function getEnv() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin env vars (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)."
    );
  }

  return { projectId, clientEmail, privateKey };
}

// Kumukuha ng access token gamit ang service account (JWT bearer flow),
// cinache ito sa memory hanggang bago mag-expire.
async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }

  const { clientEmail, privateKey } = getEnv();
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: clientEmail,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(
    JSON.stringify(claim)
  )}`;

  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = base64url(signer.sign(privateKey));

  const jwt = `${unsigned}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get access token: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

// Firestore REST document's "fields" object -> plain JS values.
export function parseFields(fields: Record<string, unknown> = {}): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(fields)) {
    const field = raw as Record<string, unknown>;
    if ("stringValue" in field) out[key] = field.stringValue;
    else if ("integerValue" in field) out[key] = Number(field.integerValue);
    else if ("doubleValue" in field) out[key] = field.doubleValue;
    else if ("booleanValue" in field) out[key] = field.booleanValue;
    else if ("timestampValue" in field)
      out[key] = new Date(field.timestampValue as string).getTime();
    else if ("nullValue" in field) out[key] = null;
  }
  return out;
}

export type FirestoreDoc = {
  name: string;
  fields: Record<string, unknown>;
};

// Nagpapadala ng :runQuery request sa Firestore REST API.
export async function runQuery(structuredQuery: Record<string, unknown>): Promise<FirestoreDoc[]> {
  const { projectId } = getEnv();
  const token = await getAccessToken();

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ structuredQuery }),
  });

  if (!res.ok) {
    throw new Error(`Firestore query failed: ${res.status} ${await res.text()}`);
  }

  const rows = (await res.json()) as Array<{ document?: { name: string; fields?: Record<string, unknown> } }>;

  return rows
    .filter((row) => row.document)
    .map((row) => ({
      name: row.document!.name,
      fields: parseFields(row.document!.fields ?? {}),
    }));
}

// Kinukuha ang doc id mula sa buong resource name
// (".../documents/vehicles/wigo" -> "wigo").
export function docId(name: string): string {
  const parts = name.split("/");
  return parts[parts.length - 1];
}

// Plain JS values -> Firestore REST "fields" format.
// Strings at Date lang ang sinusuportahan (sapat para sa inquiries).
function toFields(data: Record<string, string | Date>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Date) out[key] = { timestampValue: value.toISOString() };
    else out[key] = { stringValue: value };
  }
  return out;
}

// Gumagawa ng bagong document (auto-ID) sa isang collection.
export async function createDocument(
  collection: string,
  data: Record<string, string | Date>
): Promise<string> {
  const { projectId } = getEnv();
  const token = await getAccessToken();

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: toFields(data) }),
  });

  if (!res.ok) {
    throw new Error(`Firestore create failed: ${res.status} ${await res.text()}`);
  }

  const doc = (await res.json()) as { name: string };
  return docId(doc.name);
}