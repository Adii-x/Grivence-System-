import React from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-[100dvh]">
      <Sidebar />
      <main className="lg:ml-[220px] p-4 pt-14 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:p-6 sm:pt-14 lg:p-7 lg:pt-7 page-enter">
        <div className="max-w-[1100px] mx-auto w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
