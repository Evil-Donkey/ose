import { AuthProvider } from "../context/AuthContext";
import { Montserrat } from "next/font/google";
import GoogleAnalytics from '../lib/googleAnalytics'
import "./globals.css";
import HeaderWithMeganavLinks from "@/components/Header/HeaderWithMeganavLinks";
import ScrollToHashOnRouteChange from "@/components/ScrollToHashOnRouteChange";
import { Suspense } from 'react';

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = {
  title: "Oxford Science Enterprises",
  description: "We help transform Oxford's cutting-edge research into world-changing companies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable}`}>
        <AuthProvider>
          <HeaderWithMeganavLinks />
          <Suspense fallback={<div>Loading...</div>}>
            <ScrollToHashOnRouteChange />
            {children}
          </Suspense>
        </AuthProvider>
        {/* <GoogleAnalytics GA_TRACKING_ID={GA_TRACKING_ID} /> */}
      </body>
    </html>
  );
}
