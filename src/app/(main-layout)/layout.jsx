import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import ReportModal from "../../components/Modals/reportModal";
import { ReportModalContextProvider } from "@/lib/contexts/reportModalContext";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <ReportModalContextProvider>
        {children}
        <ReportModal />
      </ReportModalContextProvider>
      <Footer />
    </div>
  );
};

export default MainLayout;
