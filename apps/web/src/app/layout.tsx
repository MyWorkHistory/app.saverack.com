import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const outfit = Outfit({
  subsets: ["latin"],
});

/** Tab icons from `public/favicon.ico`, `src/app/icon.png`, `src/app/apple-icon.png` (regenerate: `npm run favicon -w @crm/web`). */
export const metadata: Metadata = {
  title: {
    default: "SaveRack",
    template: "%s · SaveRack",
  },
  description: "SaveRack CRM admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.className} h-full antialiased`}>
      <body
        className="relative z-1 min-h-full flex flex-col bg-gray-50 font-normal dark:bg-gray-900"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
