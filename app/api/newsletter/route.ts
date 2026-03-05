import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NewsletterRequest {
  email: string;
}

interface ApiSuccessResponse {
  success: true;
  message: string;
}

interface ApiErrorResponse {
  success: false;
  error: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && EMAIL_REGEX.test(email);
}

// ---------------------------------------------------------------------------
// POST /api/newsletter
// ---------------------------------------------------------------------------

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body: unknown = await request.json();

    if (
      body === null ||
      typeof body !== "object" ||
      !("email" in (body as Record<string, unknown>))
    ) {
      return NextResponse.json(
        { success: false, error: "Request body must include an email field." },
        { status: 400 },
      );
    }

    const { email } = body as NewsletterRequest;

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 },
      );
    }

    // TODO: Replace with actual newsletter provider integration.
    console.log("[newsletter] New signup:", email);

    return NextResponse.json(
      { success: true, message: "Successfully subscribed to the newsletter." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
}
