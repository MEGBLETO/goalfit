"use client";

import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { PopupWidget }  from "../components/PopupWidget";
const inter = Inter({ subsets: ["latin"] });
import { usePathname } from 'next/navigation';


// export const metadata = {
//   title: "GoalFit || Here to help you achieve your dreams",
//   description: "Here to help you achieve your dreams",
// };

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebar = (data) => {
    setSidebarOpen(data);
  };
  
  return (
     <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          { pathname === "/" || pathname === "/login" || pathname === "/register" ||  pathname === "/account" ||  pathname === "/subscription" ||  pathname === "/verify-email" ||  pathname === "/verify-prompt"  ||  pathname === "/checkout/success" ||  pathname === "/checkout/cancel" ||  pathname === "/loader"  ||  pathname === "/request-password-reset" ||  pathname === "/reset-password" ?
            (<div>{children}</div>) :
            (<div className="flex overflow-hidden w-full min-h-screen min-w-screen bg-gray-50 dark:bg-gray-900">
              {/* Navbar */}
              <Header handleSidebar={handleSidebar} />

              <div className="flex w-full pt-16">
                {/* Sidebar */}
                <Sidebar isSidebarOpen={isSidebarOpen} />
                <div className={`${isSidebarOpen ? "lg:pl-20" : "lg:pl-64"}`}></div>
                <div id="main-content" className="relative w-full h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
                  {children}

                  {/* Footer */}
                  <Footer />
                </div>
              </div>
            </div>)}
          <PopupWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
