import { AuthProvider } from "../context/AuthContext";
import { Montserrat } from "next/font/google";
import GoogleAnalytics from '../lib/googleAnalytics'
import "./globals.css";
import ScrollToHashOnRouteChange from "../components/ScrollToHashOnRouteChange";
import getFooterData from "../lib/getFooterData";
import Script from "next/script";
import PasswordWrapper from "../components/PasswordOverlay/PasswordWrapper";
import { Suspense } from 'react';
import LayoutClient from "../components/LayoutClient";
import NavigationLoading from "../components/NavigationLoading";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: 'swap', // This prevents render-blocking
  preload: true,   // This preloads the font
});

export const metadata = {
  title: "Oxford Science Enterprises",
  description: "We help transform Oxford's cutting-edge research into world-changing companies",
  // icons: {
  //   icon: [
  //     { url: '/icon.ico', sizes: 'any' },
  //     { url: '/favicon.ico', sizes: 'any' },
  //     { url: '/icon.ico', type: 'image/x-icon' },
  //     { url: '/favicon.ico', type: 'image/x-icon' }
  //   ],
  //   shortcut: '/favicon.ico',
  //   apple: '/favicon.ico',
  // },
};

export default async function RootLayout({ children }) {
  const footerData = await getFooterData();
  const GA_TRACKING_ID = process.env.GA_TRACKING_ID;
  return (
    <html lang="en">
      <body className={`${montserrat.variable} overflow-x-hidden`}>
        <AuthProvider>
          <PasswordWrapper>
            <NavigationLoading />
            <Suspense>
              <LayoutClient footerData={footerData}>
                <div className="min-h-screen overflow-clip">
                  <ScrollToHashOnRouteChange />
                  {children}
                </div>
              </LayoutClient>
            </Suspense>
          </PasswordWrapper>
        </AuthProvider>
        <Script src='https://cdn-cookieyes.com/client_data/057bd4483d07fa02fa3b4a27/script.js' strategy='beforeInteractive' />
        <GoogleAnalytics GA_TRACKING_ID={GA_TRACKING_ID} />
      </body>
    </html>
  );
}
