import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const COOKIE_NAME = "pathfold_admin";
const SESSION_DAYS = 7;

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET is missing or too short. Set it in .env (see .env.example).");
  }
  return new TextEncoder().encode(secret);
}

export interface Session {
  userId: string;
  email: string;
  name: string;
}

export async function createSession(session: Session) {
  const token = await new SignJWT({ email: session.email, name: session.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub) return null;
    return {
      userId: payload.sub,
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
    };
  } catch {
    return null;
  }
}

/** Use inside server actions / pages that must be authenticated. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function verifyCredentials(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  let user = await prisma.adminUser.findUnique({ where: { email: normalized } });

  // First-run bootstrap: if no admin exists yet, allow the credentials from the environment to create one.
  if (!user) {
    const count = await prisma.adminUser.count();
    const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD;
    if (count === 0 && envEmail && envPassword && normalized === envEmail && password === envPassword) {
      user = await prisma.adminUser.create({
        data: {
          email: envEmail,
          name: process.env.ADMIN_NAME || "Administrator",
          passwordHash: await bcrypt.hash(envPassword, 12),
        },
      });
      return user;
    }
    return null;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
