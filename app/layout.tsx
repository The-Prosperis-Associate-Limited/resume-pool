import type { Metadata } from "next";
import { AppProvider } from "./_components/provider";
import { geistMono, jakarta } from "./_lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Pool by Prosperis",
  description: "Hire from a pool of reviewed CVs, without posting a job.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full antialiased", jakarta.variable, geistMono.variable)}>
      <body className="bg-page flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
