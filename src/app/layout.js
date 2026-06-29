import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { Poppins, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { ReportModalContextProvider } from "@/lib/contexts/reportModalContext";
import ReportModal from "@/components/Modals/reportModal";
import { EditProfileModalContextProvider } from "@/lib/contexts/editProfileModalContext";
import EditProfileModal from "@/components/Modals/editProfileModal";
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

// Load Roboto Slab for your modern punchy section headers
const robotoSlab = Roboto_Slab({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-roboto-slab",
});

export const metadata = {
  title: "Life Echo - Rooted in Wisdom",
  description: "Rooted in wisdom.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${robotoSlab.variable} h-full antialiased`}
    >
      {/* font-poppins added here applies it universally so you don't need it everywhere */}
      <body className="min-h-full flex flex-col bg-[#FAF8F5] font-poppins text-gray-700">
      <ReportModalContextProvider>
        <EditProfileModalContextProvider>
          {children}
          <ReportModal />
          <EditProfileModal />
        </EditProfileModalContextProvider>
      </ReportModalContextProvider>
      </body>
    </html>
  );
}
