import { NextRequest } from "next/server";
import { isValidEmail, sanitizeInput, checkRateLimit, getClientIp, isAllowedOrigin, validateFieldLength } from "@/lib/api/validation";
import { successResponse, errorResponse } from "@/lib/api/response";
import { prisma } from "@/lib/db/prisma";
import type { ContactRequest } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    if (!isAllowedOrigin(request)) {
      return errorResponse("Forbidden.", 403);
    }

    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return errorResponse("Too many requests. Try again later.", 429);
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return errorResponse("Invalid request body.");
    }

    const { email, name, subject, message } = body as ContactRequest;
    const errors: string[] = [];

    if (!isValidEmail(email)) errors.push("A valid email address is required.");
    if (!name || typeof name !== "string" || !name.trim()) errors.push("Name is required.");
    if (!message || typeof message !== "string" || !message.trim()) errors.push("Message is required.");

    if (!validateFieldLength(email, "email") || !validateFieldLength(name, "name") || !validateFieldLength(subject, "subject") || !validateFieldLength(message, "message")) {
      return errorResponse("Input exceeds maximum allowed length.");
    }

    if (errors.length > 0) {
      return errorResponse("Validation failed.", 400, errors);
    }

    await prisma.contactMessage.create({
      data: {
        email: email.trim().toLowerCase(),
        name: sanitizeInput(name),
        subject: subject ? sanitizeInput(subject) : undefined,
        message: sanitizeInput(message),
      },
    });

    return successResponse("Your message has been received.");
  } catch {
    return errorResponse("Internal server error.", 500);
  }
}
