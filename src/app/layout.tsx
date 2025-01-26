import type { Metadata } from "next";

import "./globals.css";

import Layout from "src/components/global/Layout";
import SessionWrapper from "src/components/global/SessionWrapper";

export const metadata: Metadata = {
    title: "Shark",
    description: "Funding for Startup and SMEs",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className="overflow-x-hidden">
                <SessionWrapper initialData={null}>
                    <Layout>{children}</Layout>
                </SessionWrapper>
            </body>
        </html>
    );
}
