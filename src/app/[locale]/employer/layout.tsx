// import type { Metadata } from 'next';
// import { NextIntlClientProvider } from 'next-intl';
// import { getMessages, setRequestLocale } from 'next-intl/server';
// import { notFound } from 'next/navigation';
// import { routing } from './..';

// import '../globals.css';

// export const metadata: Metadata = {
//   title: 'JobPlatform | Find Your Dream Job',
//   description: 'Find jobs and connect with companies.',
// };

// type Props = {
//   children: React.ReactNode;
//   params: Promise<{ locale: string }>;
// };

// export function generateStaticParams() {
//   return routing.locales.map((locale) => ({ locale }));
// }

// export default async function LocaleLayout({
//   children,
//   params,
// }: Props) {
//   const { locale } = await params;

//   if (!routing.locales.includes(locale as 'en' | 'si' | 'ta')) {
//     notFound();
//   }

//   setRequestLocale(locale);

//   const messages = await getMessages();

//   return (
//     <html lang={locale}>
//       <body>
//         <NextIntlClientProvider messages={messages}>
//           {children}
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}