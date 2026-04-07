import { NextResponse } from "next/server";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

function isAuthorized(request: Request) {
  const setupToken = process.env.FIREBASE_ADMIN_SETUP_TOKEN;
  const requestToken = request.headers.get("x-setup-token");

  if (!setupToken) {
    throw new Error("FIREBASE_ADMIN_SETUP_TOKEN belum diisi.");
  }

  return requestToken === setupToken;
}

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as {
      uid?: string;
      email?: string;
      admin?: boolean;
    };

    if (!body.uid && !body.email) {
      return NextResponse.json(
        { message: "Kirim uid atau email untuk set custom claim." },
        { status: 400 },
      );
    }

    const auth = getFirebaseAdminAuth();
    const userRecord = body.uid
      ? await auth.getUser(body.uid)
      : await auth.getUserByEmail(body.email as string);

    const nextAdminValue = body.admin ?? true;

    await auth.setCustomUserClaims(userRecord.uid, {
      ...(userRecord.customClaims ?? {}),
      admin: nextAdminValue,
    });

    return NextResponse.json({
      ok: true,
      uid: userRecord.uid,
      email: userRecord.email,
      admin: nextAdminValue,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Gagal mengatur custom claim admin.",
      },
      { status: 400 },
    );
  }
}
