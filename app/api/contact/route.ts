import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ContactRequest {
  email: string;
  name: string;
  message: string;
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

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// ---------------------------------------------------------------------------
// POST /api/contact
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

    const { email, name, message } = body as ContactRequest;

    // --- Validation --------------------------------------------------------

    const errors: string[] = [];

    if (!isValidEmail(email)) {
      errors.push("A valid email address is required.");
    }

    if (!isNonEmptyString(name)) {
      errors.push("Name is required.");
    }

    if (!isNonEmptyString(message)) {
      errors.push("Message is required.");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(" ") },
        { status: 400 },
      );
    }

    // TODO: Replace with actual email / CRM integration.
    console.log("[contact] New message:", { email, name, message });

    return NextResponse.json(
      { success: true, message: "Your message has been received." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
}
