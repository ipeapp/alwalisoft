import { NextResponse } from 'next/server';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

export class ApiException extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

export function handleApiError(error: any): NextResponse<ApiError> {
  console.error('API Error:', error);

  // Handle Prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json({
          success: false,
          error: 'هذا السجل موجود بالفعل',
          code: 'DUPLICATE_RECORD',
          details: error.meta
        }, { status: 409 });
      
      case 'P2025':
        return NextResponse.json({
          success: false,
          error: 'السجل غير موجود',
          code: 'NOT_FOUND'
        }, { status: 404 });
      
      case 'P2003':
        return NextResponse.json({
          success: false,
          error: 'خطأ في العلاقة بين البيانات',
          code: 'FOREIGN_KEY_CONSTRAINT'
        }, { status: 400 });
      
      default:
        return NextResponse.json({
          success: false,
          error: 'خطأ في قاعدة البيانات',
          code: error.code
        }, { status: 500 });
    }
  }

  if (error instanceof PrismaClientValidationError) {
    return NextResponse.json({
      success: false,
      error: 'بيانات غير صحيحة',
      code: 'VALIDATION_ERROR'
    }, { status: 400 });
  }

  // Handle custom API exceptions
  if (error instanceof ApiException) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      details: error.details
    }, { status: error.statusCode });
  }

  // Handle generic errors
  return NextResponse.json({
    success: false,
    error: error.message || 'حدث خطأ غير متوقع',
    code: 'INTERNAL_ERROR'
  }, { status: 500 });
}

export function validateRequired(data: any, fields: string[]): void {
  const missing = fields.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new ApiException(
      `الحقول التالية مطلوبة: ${missing.join(', ')}`,
      400,
      'MISSING_REQUIRED_FIELDS',
      { missingFields: missing }
    );
  }
}

export function validatePositiveNumber(value: any, fieldName: string): void {
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    throw new ApiException(
      `${fieldName} يجب أن يكون رقماً موجباً`,
      400,
      'INVALID_NUMBER'
    );
  }
}

export async function withErrorHandling<T>(
  handler: () => Promise<T>
): Promise<T | NextResponse<ApiError>> {
  try {
    return await handler();
  } catch (error) {
    return handleApiError(error);
  }
}
