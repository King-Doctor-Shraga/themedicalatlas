import { Playfair_Display, Inter, Noto_Naskh_Arabic, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { supportedLanguages, getDirection, type Lang } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";

// Latin fonts
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

// Arabic fonts
const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-heading-ar",
  display: "swap",
  weight: ["500", "700"],
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-body-ar",
  display: "swap",
  weight: ["400", "500", "600"],
});

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!supportedLanguages.includes(lang as Lang)) {
    notFound();
  }

  const typedLang = lang as Lang;
  const direction = getDirection(typedLang);
  const dict = await getDictionary(typedLang);

  const isArabic = typedLang === "ar";
  const fontHeadingVar = isArabic ? notoNaskhArabic.variable : playfairDisplay.variable;
  const fontBodyVar = isArabic ? ibmPlexArabic.variable : inter.variable;

  return (
    <html lang={typedLang} dir={direction} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3053188645293857"
          crossOrigin="anonymous"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GN9NTRZM7L" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GN9NTRZM7L');
            `,
          }}
        />
      </head>
      <body
        className={`${fontHeadingVar} ${fontBodyVar} antialiased bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]`}
        style={{
          fontFamily: isArabic
            ? "var(--font-body-ar), sans-serif"
            : "var(--font-body), system-ui, sans-serif",
        }}
      >
        <Header lang={typedLang} dict={dict} />
        <main className="min-h-screen pt-[var(--navbar-height)]">{children}</main>
        <Footer lang={typedLang} dict={dict} />
        <MobileNav lang={typedLang} dict={dict} />
      </body>
    </html>
  );
}
