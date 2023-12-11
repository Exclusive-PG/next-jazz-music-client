import "~/styles/globals.css";
import { ThemeProvider } from "@mui/material";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";

import { theme } from "./theme";
import { AudioProvider } from "./contexts/audio/provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Jazz App",
  description: "This is my first t3 jazz app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <ThemeProvider theme={theme}>
            <AudioProvider>{children}</AudioProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
