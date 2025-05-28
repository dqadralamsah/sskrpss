import type { Metadata } from 'next';
import { Geist, Geist_Mono, Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: '400',
  variable: '--font-poppins',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Nasidiso',
  description: 'Nadiso app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
