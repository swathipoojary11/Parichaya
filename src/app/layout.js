import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import DBInspector from "@/components/DBInspector";

export const metadata = {
  title: "PARICHAYA — AI Career Preparation Platform",
  description: "Know where you stand. Know what to improve. Become interview-ready. 100% on-device AI, zero cloud calls.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased min-h-screen"
        style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
            <DBInspector />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
