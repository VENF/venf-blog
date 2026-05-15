import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const jetbrainsMono = localFont({
  src: [
    {
      path: "../../public/fonts/variable/JetBrainsMono[wght].ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/variable/JetBrainsMono-Italic[wght].ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "venf",
  description:
    "Blog personal donde comparto lo que voy aprendiendo: componentes, proyectos y cosas interesantes que voy creando.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
