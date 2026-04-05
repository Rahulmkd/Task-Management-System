import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display, DM_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TaskFlow — Manage Your Work',
  description: 'A clean, powerful task management system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} ${dmMono.variable}`}>
      <body className="font-sans bg-ink-50 text-ink-900 antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0f0f0f',
              color: '#f5f5f5',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
            },
            success: {
              iconTheme: { primary: '#e85d04', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}
