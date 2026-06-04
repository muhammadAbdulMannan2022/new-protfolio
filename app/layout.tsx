import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollProvider from "@/components/ScrollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://abdulmannandev.vercel.app"),
  title: "Md. Abdul Mannan | React Developer & Node Developer | Immersive 3D Portfolio",
  description: "Immersive 3D WebGL portfolio of Md. Abdul Mannan, a professional React Developer & Node Developer. Specializing in high-performance Next.js layouts, cross-platform React Native apps, and secure Node.js WebSocket API servers.",
  keywords: [
    "React Developer",
    "React Dev",
    "Node Developer",
    "Node Dev",
    "NodeJS Developer",
    "Full-Stack React Developer",
    "Full-Stack Node Developer",
    "Remote React Developer",
    "Remote Node Developer",
    "Frontend React Dev",
    "Backend Node Dev",
    "Md. Abdul Mannan",
    "Abdul Mannan",
    "Three.js Developer",
    "3D Developer Portfolio",
    "React Three Fiber Portfolio",
    "Creative Developer Portfolio",
    "Full-Stack Developer Dhaka",
    "Next.js Developer Portfolio",
    "React Native Mobile Developer",
    "WebGL Web Developer",
    "3D projects search",
    "dev keyword search"
  ],
  authors: [{ name: "Md. Abdul Mannan", url: "https://github.com/muhammadAbdulMannan2022" }],
  creator: "Md. Abdul Mannan",
  publisher: "Md. Abdul Mannan",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://abdulmannandev.vercel.app",
    title: "Md. Abdul Mannan | React Developer & Node Developer | 3D Portfolio",
    description: "Immersive 3D WebGL portfolio of Md. Abdul Mannan, a professional React Developer & Node Developer. Specializing in Next.js, React Native, and Node.js.",
    siteName: "Md. Abdul Mannan Portfolio",
    images: [
      {
        url: "/dashboard.png",
        width: 1200,
        height: 630,
        alt: "Md. Abdul Mannan React & Node Developer Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Md. Abdul Mannan | React Developer & Node Developer | 3D Portfolio",
    description: "Immersive 3D WebGL portfolio of Md. Abdul Mannan. Specializing in Next.js, React Native, and Node.js.",
    images: ["/dashboard.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Md. Abdul Mannan",
    "jobTitle": "Full-Stack / Frontend Developer",
    "url": "https://abdulmannandev.vercel.app",
    "sameAs": [
      "https://github.com/muhammadAbdulMannan2022",
      "https://www.linkedin.com/in/muhammad-abdul-mannan-625299280/"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dhaka",
      "addressCountry": "Bangladesh"
    },
    "knowsAbout": [
      "React.js",
      "Next.js",
      "React Native",
      "Expo",
      "Three.js",
      "React Three Fiber",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "VPS Deployment"
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Structured Schema JSON-LD Data for SEO crawler prioritization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ScrollProvider>{children}</ScrollProvider>
      </body>
    </html>
  );
}
