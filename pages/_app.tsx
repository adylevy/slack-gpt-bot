import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "@next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.variable}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
