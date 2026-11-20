import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import { Geist, Noto_Sans_Sinhala, Noto_Sans_Tamil } from 'next/font/google';
import '../globals.css';
export const instant = false;

export const metadata: Metadata = {
  title: 'JobPlatform | Find Your Dream Job in Sri Lanka',
  description: 'Find jobs and connect with companies across all 9 provinces.',
};

// Geist Font Setup
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const sinhala = Noto_Sans_Sinhala({ subsets: ['sinhala'], variable: '--font-sinhala' });
const tamil = Noto_Sans_Tamil({ subsets: ['tamil'], variable: '--font-tamil' });

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'si' | 'ta')) {
    notFound();
  }

  setRequestLocale(locale);

  // Load messages for the locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={`${geist.variable} ${sinhala.variable} ${tamil.variable}`}>
   
      <body className={`min-h-screen bg-white ${geist.className} text-[#161616]`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}