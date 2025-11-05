import type { Metadata } from 'next';
import Script from 'next/script';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'بوت صدام الولي',
  description: 'اكسب المكافآت من خلال إتمام المهام',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function MiniAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script 
        src="https://telegram.org/js/telegram-web-app.js" 
        strategy="beforeInteractive"
      />
      <AuthProvider>
        {children}
      </AuthProvider>
    </>
  );
}
