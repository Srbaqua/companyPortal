import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Outfit, Manrope } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NIT Hamirpur · Company Suggestion Portal",
  description:
    "Submit placement recommendations and manage the admin dashboard — NIT Hamirpur Placements.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${manrope.variable}`}>
      <body className="font-body bg-obsidian text-white antialiased selection:bg-blue-500/30 selection:text-white">
        {/* Ambient backdrop */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#05050A] via-[#0D1117] to-[#05050A]" />
          <div
            className="absolute inset-0 opacity-[0.18] mix-blend-screen"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/29644165/pexels-photo-29644165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              maskImage:
                "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)",
            }}
          />
          <div
            className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]"
          />
          <div
            className="absolute bottom-[-10%] right-[-5%] h-[420px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px]"
          />
          {/* subtle grain */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
