import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Header from '@/components/Header';

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'Abstrak-to - ERC-4337 Account Abstraction Portal',
  description: 'Developer portal for ERC-4337 Account Abstraction featuring Smart Accounts, Gas Sponsorship, and Session Keys',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans`}>
        <ErrorBoundary>
          <Providers>
            <Header />
            <main className="pt-16">
              {children}
            </main>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
