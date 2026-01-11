"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function GlobalLoading() {
  const [mounted, setMounted] = useState(false);

  // We must wait for the component to mount to access 'document'
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-9999 backdrop-blur-sm">
      <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>,
    document.body
  );
}
