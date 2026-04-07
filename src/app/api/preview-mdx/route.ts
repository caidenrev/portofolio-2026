import { NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { source?: unknown };
    const source = typeof body.source === "string" ? body.source : "";

    const preview = await serialize(source, {
      blockJS: true,
      blockDangerousJS: true,
    });

    return NextResponse.json(preview);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Gagal membuat preview markdown.",
      },
      { status: 400 },
    );
  }
}
