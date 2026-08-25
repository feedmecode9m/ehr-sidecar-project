import { NextResponse } from "next/server";
import { z } from "zod";

import { getNoteById } from "@/lib/fhir/mock/notes";
import {
  summarizeClinicalNote,
  type ClinicalSummary,
} from "@/lib/fhir/summarize-note";

const SIMULATED_LATENCY_MS = 800;

const summarizeRequestSchema = z.object({
  noteId: z.string().trim().min(1, "noteId is required"),
});

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = summarizeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { noteId } = parsed.data;
  const note = getNoteById(noteId);

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

  const summary: ClinicalSummary = summarizeClinicalNote(note);

  return NextResponse.json(summary);
}

export function GET(): NextResponse {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
