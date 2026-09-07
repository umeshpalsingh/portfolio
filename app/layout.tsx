import { Fraunces, Manrope, Space_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Umesh Pal Singh — Developer & Creator",
  description:
    "Umesh Pal Singh — developer, dreamer, and full-time human. A personal corner of the internet covering who I am, what I do, and everything in between.",
  metadataBase: new URL("https://umeshpalsingh.vercel.app"),
  openGraph: {
    title: "Umesh Pal Singh — Developer & Creator",
    description:
      "Developer, dreamer, and full-time human. Explore my projects, interests, and everything in between.",
    url: "https://umeshpalsingh.vercel.app",
    siteName: "Umesh Pal Singh",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Umesh Pal Singh — Developer & Creator",
    description:
      "Developer, dreamer, and full-time human. Explore my projects, interests, and everything in between.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${manrope.variable} ${spaceMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var currentTheme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', currentTheme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
