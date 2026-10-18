"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSession, createSession, destroySession, verifyCredentials, hashPassword } from "@/lib/auth";
import { getModel, type FieldDef } from "./registry";
import { slugify } from "@/lib/utils";
import { SETTING_FIELDS } from "@/lib/settings";
import bcrypt from "bcryptjs";
import { describeDbError } from "@/lib/db-status";

export interface ActionState {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
}

type Delegate = {
  findUnique: (args: unknown) => Promise<unknown>;
  create: (args: { data: Record<string, unknown> }) => Promise<{ id: string }>;
  update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<{ id: string }>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
};

function delegate(key: string): Delegate {
  const d = (prisma as unknown as Record<string, Delegate>)[key];
  if (!d) throw new Error(`Unknown model ${key}`);
  return d;
}

function coerce(field: FieldDef, raw: FormDataEntryValue | null): { value: unknown; error?: string } {
  const str = typeof raw === "string" ? raw.trim() : "";
  switch (field.type) {
    case "checkbox":
      return { value: raw === "on" || raw === "true" };
    case "number": {
      if (str === "") return field.required ? { value: null, error: "Required" } : { value: 0 };
      const n = Number(str);
      if (!Number.isFinite(n)) return { value: null, error: "Must be a number" };
      return { value: Math.trunc(n) };
    }
    case "date": {
      if (str === "") return field.required ? { value: null, error: "Required" } : { value: null };
      const d = new Date(str);
      if (Number.isNaN(d.getTime())) return { value: null, error: "Invalid date" };
      return { value: d };
    }
    case "url": {
      if (str === "") return field.required ? { value: null, error: "Required" } : { value: null };
      if (!/^(https?:\/\/|\/)/i.test(str)) return { value: null, error: "Must start with http(s):// or /" };
      return { value: str };
    }
    case "email": {
      if (str === "") return field.required ? { value: null, error: "Required" } : { value: null };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) return { value: null, error: "Invalid e-mail address" };
      return { value: str };
    }
    default: {
      if (str === "") {
        if (field.required) return { value: null, error: "Required" };
        // optional strings: keep nullable fields null, required-by-schema strings empty
        return { value: field.type === "markdown" ? "" : null };
      }
      return { value: str };
    }
  }
}

function publicPathsFor(modelKey: string) {
  const paths = ["/"];
  switch (modelKey) {
    case "newsPost":
      paths.push("/news");
      break;
    case "publication":
      paths.push("/publications");
      break;
    case "teamMember":
      paths.push("/team");
      break;
    case "partner":
      paths.push("/about", "/contact");
      break;
    case "mediaItem":
      paths.push("/media");
      break;
    case "resource":
      paths.push("/resources", "/research");
      break;
    case "workPackage":
    case "milestone":
      paths.push("/about");
      break;
  }
  return paths;
}

function revalidateModel(modelKey: string) {
  for (const p of publicPathsFor(modelKey)) revalidatePath(p);
  revalidatePath(`/admin/${modelKey}`);
}

/** Non-nullable string columns in the Prisma schema that may be left empty in the form. */
const NON_NULLABLE_STRINGS: Record<string, string[]> = {
  newsPost: ["content"],
  workPackage: ["objectives"],
};

export async function saveEntry(modelKey: string, id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();
  const model = getModel(modelKey);
  if (!model) return { error: "Unknown content type." };

  const data: Record<string, unknown> = {};
  const fieldErrors: Record<string, string> = {};
  const values: Record<string, string> = {};

  for (const field of model.fields) {
    const raw = formData.get(field.name);
    values[field.name] = typeof raw === "string" ? raw : "";
    const { value, error } = coerce(field, raw);
    if (error) fieldErrors[field.name] = error;
    else data[field.name] = value;
  }

  for (const name of NON_NULLABLE_STRINGS[modelKey] ?? []) {
    if (data[name] == null) data[name] = "";
  }

  if (modelKey === "newsPost") {
    const title = String(data.title ?? "");
    let slug = typeof data.slug === "string" && data.slug ? slugify(data.slug) : slugify(title);
    if (!slug) slug = `post-${Date.now()}`;
    const clash = await prisma.newsPost.findFirst({ where: { slug, NOT: id ? { id } : undefined } });
    if (clash) slug = `${slug}-${Date.now().toString(36)}`;
    data.slug = slug;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Please correct the highlighted fields.", fieldErrors, values };
  }

  try {
    if (id) {
      await delegate(modelKey).update({ where: { id }, data });
    } else {
      await delegate(modelKey).create({ data });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { error: `Could not save: ${message}`, values };
  }

  revalidateModel(modelKey);
  redirect(`/admin/${modelKey}?saved=1`);
}

export async function deleteEntry(modelKey: string, id: string) {
  await requireSession();
  const model = getModel(modelKey);
  if (!model) throw new Error("Unknown content type.");
  await delegate(modelKey).delete({ where: { id } });
  revalidateModel(modelKey);
  redirect(`/admin/${modelKey}?deleted=1`);
}

export async function toggleBoolean(modelKey: string, id: string, field: string, value: boolean) {
  await requireSession();
  const model = getModel(modelKey);
  const def = model?.fields.find((f) => f.name === field && f.type === "checkbox");
  if (!model || !def) throw new Error("Invalid field.");
  await delegate(modelKey).update({ where: { id }, data: { [field]: value } });
  revalidateModel(modelKey);
}

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Please enter your e-mail address and password." };

  let user: Awaited<ReturnType<typeof verifyCredentials>>;
  try {
    user = await verifyCredentials(email, password);
  } catch (e) {
    const { error, hint } = describeDbError(e);
    return { error: `${error} ${hint}`.trim() };
  }
  if (!user) return { error: "Invalid e-mail address or password." };

  await createSession({ userId: user.id, email: user.email, name: user.name });
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSession();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 10) return { error: "The new password must be at least 10 characters long." };
  if (next !== confirm) return { error: "The new passwords do not match." };

  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) {
    return { error: "The current password is incorrect." };
  }
  await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(next) } });
  return { ok: true };
}

export async function saveSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();
  for (const field of SETTING_FIELDS) {
    const value = String(formData.get(field.key) ?? "").trim();
    await prisma.siteSetting.upsert({
      where: { key: field.key },
      create: { key: field.key, value },
      update: { value },
    });
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Public contact form
// ---------------------------------------------------------------------------

export async function sendContactMessage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const honeypot = String(formData.get("website") ?? "");

  const values = { name, email, subject, message };
  if (honeypot) return { ok: true }; // bots
  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Please enter a valid e-mail address.";
  if (subject.length < 3) fieldErrors.subject = "Please enter a subject.";
  if (message.length < 10) fieldErrors.message = "Please write a few more words.";
  if (Object.keys(fieldErrors).length) return { error: "Please check the form.", fieldErrors, values };

  await prisma.contactMessage.create({ data: { name, email, subject, message: message.slice(0, 5000) } });
  revalidatePath("/admin/contactMessage");
  return { ok: true };
}
