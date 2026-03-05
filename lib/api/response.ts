import type { ApiResponse } from "@/types/api";
import { NextResponse } from "next/server";

export function successResponse<T = null>(
  message: string,
  data?: T,
  status = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function errorResponse(
  message: string,
  status = 400,
  errors?: string[],
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, message, errors },
    { status },
  );
}
