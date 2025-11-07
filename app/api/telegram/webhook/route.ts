import { NextRequest, NextResponse } from 'next/server';
import { Telegraf } from 'telegraf';

// إنشاء instance للبوت
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

// تسجيل جميع handlers من ملف bot/index.ts
// Note: يجب استيراد وتسجيل جميع handlers هنا

export async function POST(request: NextRequest) {
  try {
    // الحصول على البيانات من Telegram
    const body = await request.json();
    
    // معالجة التحديث
    await bot.handleUpdate(body);
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// للتحقق من صحة webhook
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Telegram webhook endpoint is ready',
    botUsername: process.env.TELEGRAM_BOT_USERNAME || 'Not configured'
  });
}
