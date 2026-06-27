import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import ReportModal from "../../components/Modals/reportModal";
import { ReportModalContextProvider } from "@/lib/contexts/reportModalContext";

const MainLayout = ({ children }) => {
  return (
    <ReportModalContextProvider>
      <div>
        <Navbar />
        {children}
        <Footer />
        <ReportModal />
      </div>
    </ReportModalContextProvider>
  );
};

export default MainLayout;
