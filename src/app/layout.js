import { AuthProvider } from "../context/AuthContext";
import { Montserrat } from "next/font/google";
import "./globals.css";
import getFooterData from "../lib/getFooterData";
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
});

export const metadata = {
  title: "Oxford Science Enterprises",
  description: "We help transform Oxford's cutting-edge research into world-changing companies",
};

export default async function RootLayout({ children }) {
  const footerData = await getFooterData();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://oxfordscienceenterprises-cms.com" />
      </head>
      <body className={`${montserrat.variable}`}>
        <AuthProvider>
          <PasswordWrapper>
            <NavigationLoading />
            <Suspense>
              <LayoutClient footerData={footerData}>
                <div className="min-h-screen">
                  <ScrollToHashOnRouteChange />
                  {children}
                </div>
              </LayoutClient>
            </Suspense>
          </PasswordWrapper>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <GoogleAnalytics />}
      </body>
    </html>
  );
}
