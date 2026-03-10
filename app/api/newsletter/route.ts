import { NextRequest } from "next/server";
import { isValidEmail, checkRateLimit, getClientIp } from "@/lib/api/validation";
import { successResponse, errorResponse } from "@/lib/api/response";
import { prisma } from "@/lib/db/prisma";
import type { NewsletterRequest } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return errorResponse("Too many requests. Try again later.", 429);
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || !("email" in body)) {
      return errorResponse("Request body must include an email field.");
    }

    const { email } = body as NewsletterRequest;

    if (!isValidEmail(email)) {
      return errorResponse("Invalid or disposable email address.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    await prisma.newsletterSubscriber.upsert({
      where: { email: normalizedEmail },
      create: { email: normalizedEmail, active: true },
      update: { active: true },
    });

    return successResponse("Successfully subscribed to the newsletter.");
  } catch {
    return errorResponse("Internal server error.", 500);
  }
}
