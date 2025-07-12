import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ETF Garage - Quality Pre-owned Vehicles",
  description:
    "Find your perfect pre-owned vehicle at ETF Garage. We offer a wide selection of quality used cars at competitive prices.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-md">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                ETF Garage {process.env.MONGODB_URI}
              </Link>

              <div className="hidden md:flex space-x-8">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-blue-600 transition duration-300"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-blue-600 transition duration-300"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-blue-600 transition duration-300"
                >
                  Contact
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button className="text-gray-700 hover:text-blue-600 focus:outline-none">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </nav>
        </header>

        {children}

        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">ETF Garage</h3>
                <p className="text-gray-300">
                  Your trusted partner in finding quality pre-owned vehicles.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-300 hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-gray-300 hover:text-white"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-gray-300 hover:text-white"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>123 Car Street</li>
                  <li>Automotive District</li>
                  <li>Phone: +1 (555) 123-4567</li>
                  <li>Email: info@etfgarage.com</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
              <p>
                &copy; {new Date().getFullYear()} ETF Garage. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
