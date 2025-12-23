'use client';

import { useEffect } from 'react';

export default function V4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Set dark background on html and body to prevent white flash on overscroll
  useEffect(() => {
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    const originalBodyBg = document.body.style.backgroundColor;

    document.documentElement.style.backgroundColor = '#04070d';
    document.body.style.backgroundColor = '#04070d';

    return () => {
      document.documentElement.style.backgroundColor = originalHtmlBg;
      document.body.style.backgroundColor = originalBodyBg;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#04070d]">
      {children}
    </div>
  );
}
