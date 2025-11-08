import { ClientProviders } from './client-providers';

export const dynamic = 'force-dynamic';

export default function MiniAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <ClientProviders>{children}</ClientProviders>
    </div>
  );
}
