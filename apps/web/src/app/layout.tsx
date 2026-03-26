import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

/** Tab icons from `public/favicon.ico`, `public/icon.png`, `public/apple-icon.png` (regenerate: `npm run favicon -w @crm/web`). */
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
    <html lang="en" className="h-full antialiased">
      <body
        className="relative z-1 min-h-full flex flex-col bg-gray-50 font-normal dark:bg-gray-900"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
