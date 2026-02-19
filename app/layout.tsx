import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Review Generator',
  description: 'AI-powered review generation tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
