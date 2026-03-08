import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Sistem Antren Digital | Puskesmas Mesjid Raya",
    description: "Portal resmi Sistem Antrean Digital Puskesmas Mesjid Raya yang berlokasi di Gp. Beurandeh, Kec. Mesjid Raya, Kab. Aceh Besar, Aceh.",
    keywords: [
        "Puskesmas", "Portal", "Digital", "Portal Digital", "Website", "Mesjid Raya", 
        "Antrean", "Sistem Antran", "Sistem Digital", "Puskesmas Mesjid Raya"
    ]
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth`}
            >
                {children}
            </body>
        </html>
    );
}
