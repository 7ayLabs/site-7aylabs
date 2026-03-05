import { NextRequest } from "next/server";
import { isValidEmail, sanitizeInput, checkRateLimit, getClientIp } from "@/lib/api/validation";
import { successResponse, errorResponse } from "@/lib/api/response";
import { prisma } from "@/lib/db/prisma";
import type { WaitlistRequest } from "@/types/api";

const VALID_ROLES = ["developer", "validator", "community"] as const;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return errorResponse("Too many requests. Try again later.", 429);
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return errorResponse("Invalid request body.");
    }

    const { email, name, interest, role } = body as WaitlistRequest;

    if (!isValidEmail(email)) {
      return errorResponse("A valid email address is required.");
    }

    if (name !== undefined && typeof name !== "string") {
      return errorResponse("Name must be a string.");
    }

    if (interest !== undefined && typeof interest !== "string") {
      return errorResponse("Interest must be a string.");
    }

    if (role !== undefined && !VALID_ROLES.includes(role)) {
      return errorResponse("Role must be developer, validator, or community.");
    }

    try {
      await prisma.waitlistEntry.create({
        data: {
          email: email.trim().toLowerCase(),
          name: name ? sanitizeInput(name) : undefined,
          interest: interest ? sanitizeInput(interest) : undefined,
          role: role ?? undefined,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === "P2002"
      ) {
        return errorResponse("This email is already on the waitlist.", 409);
      }
      throw error;
    }

    return successResponse("Successfully added to the waitlist.");
  } catch {
    return errorResponse("Internal server error.", 500);
  }
}
