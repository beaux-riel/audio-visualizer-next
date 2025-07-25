"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info } from "lucide-react";

const Navigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400"
          >
            Audio Visualizer
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-4">
            <Link
              href="/"
              className={`nav-link flex items-center gap-2 ${
                pathname === "/" ? "active" : ""
              }`}
            >
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              href="/about"
              className={`nav-link flex items-center gap-2 ${
                pathname === "/about" ? "active" : ""
              }`}
            >
              <Info size={18} />
              <span className="hidden sm:inline">About</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
