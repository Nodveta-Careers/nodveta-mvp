import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Footer from "components/layout/Footer";
import MainNavigation from "components/layout/Header/MainNavigation";

const Layout = ({ children }) => {
  const { library, account } = useWeb3React();

  useEffect(() => {
    if (library) {
      localStorage.setItem("connected", true);
    }
  }, [library, account]);

  return (
    <>
      <MainNavigation />
      <main className="mt-[90px] mb-[90px]">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
