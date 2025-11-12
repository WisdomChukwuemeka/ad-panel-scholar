"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CheckSquare,
  BarChart,
  MessageSquare,
  Bell,
  BookOpen,
  CreditCard,
  ShieldOff,
  Edit,
  Code,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/users", label: "Users", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "#", label: "Notifications", icon: Bell },
  { href: "/publications", label: "Publications", icon: BookOpen },
  { href: "#", label: "Payments", icon: CreditCard },
  { href: "/users", label: "Blocked Users", icon: ShieldOff },
  { href: "/editors", label: "Editors", icon: Edit },
  { href: "/passcode", label: "Access code", icon: Code },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem("access_token"));
    checkAuth();
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("is_superuser");
    window.dispatchEvent(new Event("authChange"));
    setIsLoggedIn(false);
    router.push("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="relative flex justify-center items-center text-[1rem] md:text-[1.3rem] xl:text-2xl">
        <header className="relative w-full bg-white shadow-md p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--primary-color)]">Admin Panel</h1>

          <div className="flex gap-5 items-center">
            {isLoggedIn ? (
              <button
                className="flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link href="/login">
                <button className="flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition duration-300">
                  Login
                </button>
              </Link>
            )}

            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none transition duration-300"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </header>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-full left-0 w-full z-10 bg-white shadow-lg rounded-b-lg overflow-hidden"
            >
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 p-6">
                {navItems.map((item, index) => (
                  <div key={index} className="flex justify-center">
                    <Link
                      href={item.href}
                      className="flex flex-col items-center gap-2 text-gray-700 hover:text-blue-600 transition duration-300 group"
                      onClick={toggleMenu} // Close menu on click
                    >
                      <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}