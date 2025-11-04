import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json<ApiResponse<T>>({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  });
}

export function errorResponse(error: string, status = 400) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}
