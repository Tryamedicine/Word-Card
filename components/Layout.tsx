import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* Abstract Background Blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-blue-600/30 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-purple-600/30 rounded-full blur-[100px] animate-pulse delay-1000" />
      <div className="absolute top-[30%] left-[30%] w-[60vw] h-[60vw] bg-indigo-500/20 rounded-full blur-[120px]" />
      
      {/* Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </div>
  );
};

export default Layout;