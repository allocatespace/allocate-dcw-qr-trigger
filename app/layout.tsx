import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Door Access | Allocate Space',
  description: 'Secure event door access by Allocate Space.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
