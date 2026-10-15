import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml", "application/pdf"]);

/**
 * Admin-only upload endpoint.
 * - On Vercel (BLOB_READ_WRITE_TOKEN set): stores the file in Vercel Blob and returns its public URL.
 * - Locally: writes to /public/uploads and returns a relative URL.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File is larger than 8 MB" }, { status: 413 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: `Unsupported file type ${file.type}` }, { status: 415 });

  const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : "";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "upload";
  const filename = `${base}-${Date.now().toString(36)}${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`pathfold/${filename}`, file, { access: "public", addRandomSuffix: false });
    return NextResponse.json({ url: blob.url });
  }

  if (process.env.VERCEL) {
    return NextResponse.json(
      { error: "Uploads need Vercel Blob. Add a Blob store in the Vercel dashboard (Storage → Blob) and redeploy, or paste an image URL instead." },
      { status: 501 },
    );
  }

  const { mkdir, writeFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${filename}` });
}
