import React from 'react';
import Sidebar from '@/components/common/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-white">
        <div className="px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;