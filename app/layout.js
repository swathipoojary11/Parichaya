import "./globals.css";
import AppShell from "@/components/layout/AppShell";

export const metadata = {
  title: "PARICHAYA — AI-Powered Resume & Interview Coach",
  description: "100% On-Device, Privacy-First Career Acceleration Suite powered by local Qwen2.5 3B"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
