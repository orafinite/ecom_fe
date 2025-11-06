import React from 'react';
import Navbar from './navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return(
    <main className="layout">
      <Navbar/>
      {children}
    </main>
  )
};

export default Layout;