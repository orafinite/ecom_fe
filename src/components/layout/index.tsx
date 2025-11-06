import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="layout">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
};

export default Layout;
