import { AuthProvider } from "../context/AuthContext";
import { Montserrat } from "next/font/google";
import "./globals.css";
import getFooterData from "../lib/getFooterData";
import Script from "next/script";
import PasswordWrapper from "../components/PasswordOverlay/PasswordWrapper";
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for client-side components
const LayoutClient = dynamic(() => import("../components/LayoutClient"), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
});

const NavigationLoading = dynamic(() => import("../components/NavigationLoading"));

const ScrollToHashOnRouteChange = dynamic(() => import("../components/ScrollToHashOnRouteChange"));

const PasswordWrapper = dynamic(() => import("../components/PasswordOverlay/PasswordWrapper"));

// Google Analytics - load only in production
const GoogleAnalytics = dynamic(() => import('../lib/googleAnalytics'));

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: 'swap', // This prevents render-blocking
  preload: true,   // This preloads the font
});

export const metadata = {
  title: "Oxford Science Enterprises",
  description: "We help transform Oxford's cutting-edge research into world-changing companies",
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
