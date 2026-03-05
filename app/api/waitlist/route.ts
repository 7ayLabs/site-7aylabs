import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WaitlistRequest {
  email: string;
  name?: string;
  interest?: string;
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

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

// ---------------------------------------------------------------------------
// POST /api/waitlist
// ---------------------------------------------------------------------------

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body: unknown = await request.json();

    if (body === null || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body." },
        { status: 400 },
      );
    }

    const { email, name, interest } = body as WaitlistRequest;

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 },
      );
    }

    if (!isOptionalString(name)) {
      return NextResponse.json(
        { success: false, error: "Name must be a string." },
        { status: 400 },
      );
    }

    if (!isOptionalString(interest)) {
      return NextResponse.json(
        { success: false, error: "Interest must be a string." },
        { status: 400 },
      );
    }

    // TODO: Replace with actual waitlist storage integration.
    console.log("[waitlist] New submission:", { email, name, interest });

    return NextResponse.json(
      { success: true, message: "Successfully added to the waitlist." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
}
