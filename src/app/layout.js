import { AuthProvider } from "../context/AuthContext";
import { Montserrat } from "next/font/google";
import GoogleAnalytics from '../lib/googleAnalytics'
import "./globals.css";
import ScrollToHashOnRouteChange from "../components/ScrollToHashOnRouteChange";
import getFooterData from "../lib/getFooterData";
import Footer from "../components/Footer";
import { Suspense } from 'react';

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
      <body className={`${montserrat.variable}`}>
        <AuthProvider>
          <Suspense>
            <ScrollToHashOnRouteChange />
            {children}
          </Suspense>
          <Footer data={footerData} />
        </AuthProvider>
        {/* <GoogleAnalytics GA_TRACKING_ID={GA_TRACKING_ID} /> */}
      </body>
    </html>
  );
}
