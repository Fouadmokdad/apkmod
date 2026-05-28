import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const metadata = {
  title: {
    default: "Mod Apk Store - Download Premium MOD APKs Free",
    template: "%s | Mod Apk Store",
  },
  description:
    "Download Premium MOD APKs - Safe, Fast & Free. Get the latest modded Android apps with unlimited features unlocked.",
  keywords: [
    "mod apk",
    "modded apps",
    "premium apk",
    "android mods",
    "free apk download",
  ],
  openGraph: {
    type: "website",
    siteName: "Mod Apk Store",
    title: "Mod Apk Store - Download Premium MOD APKs Free",
    description: "Download Premium MOD APKs - Safe, Fast & Free.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mod Apk Store",
    description: "Download Premium MOD APKs Free.",
  },
  robots: { index: true, follow: true },
  themeColor: "#3DDC84",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#1A1A2E",
          color: "#FFFFFF",
          fontFamily: "'Inter', sans-serif",
          minHeight: "100vh",
        }}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
