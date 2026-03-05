export type ApiResponse<T = undefined> =
  | { success: true; message: string; data?: T }
  | { success: false; message: string; errors?: string[] };

export interface NewsletterRequest {
  email: string;
}

export type WaitlistRole = "developer" | "validator" | "community";

export interface WaitlistRequest {
  email: string;
  name?: string;
  interest?: string;
  role?: WaitlistRole;
}

export interface ContactRequest {
  email: string;
  name: string;
  subject?: string;
  message: string;
}
