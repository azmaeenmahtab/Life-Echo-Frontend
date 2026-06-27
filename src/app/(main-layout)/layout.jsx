import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import ReportModal from "../../components/Modals/reportModal";
import { ReportModalContextProvider } from "@/lib/contexts/reportModalContext";
import { Toaster } from "react-hot-toast";

const MainLayout = ({ children }) => {
  return (
    <ReportModalContextProvider>
      <div>
        <Navbar />
        {children}
        <Footer />
        <ReportModal />
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </ReportModalContextProvider>
  );
};

export default MainLayout;
