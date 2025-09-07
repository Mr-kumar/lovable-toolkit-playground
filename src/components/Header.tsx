import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronDown, Grid3X3, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { PDFToolsDropdown } from "./PDFToolsDropdown";

export const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when navigating
  useEffect(() => {
    const handleRouteChange = () => {
      setActiveDropdown(null);
      setMobileMenuOpen(false);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <div ref={dropdownRef}>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" onClick={closeDropdowns}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Heart className="h-8 w-8 text-red-500 fill-current" />
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
                  PDFFlow
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <Link
                to="/tool/merge-pdf"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm xl:text-base"
                onClick={closeDropdowns}
              >
                MERGE PDF
              </Link>
              <Link
                to="/tool/split-pdf"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm xl:text-base"
                onClick={closeDropdowns}
              >
                SPLIT PDF
              </Link>
              <Link
                to="/tool/compress-pdf"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm xl:text-base"
                onClick={closeDropdowns}
              >
                COMPRESS PDF
              </Link>
              <button
                className={`font-medium flex items-center transition-colors text-sm xl:text-base ${
                  activeDropdown === "convert"
                    ? "text-red-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleDropdownToggle("convert")}
              >
                CONVERT PDF
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${
                    activeDropdown === "convert" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <button
                className={`font-medium flex items-center transition-colors text-sm xl:text-base ${
                  activeDropdown === "all-tools"
                    ? "text-red-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleDropdownToggle("all-tools")}
              >
                ALL PDF TOOLS
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${
                    activeDropdown === "all-tools" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 text-sm"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2"
                asChild
              >
                <Link to="/signup">Sign up</Link>
              </Button>
              <Button variant="ghost" size="icon" className="hidden lg:flex">
                <Grid3X3 className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border-t border-gray-200 bg-white"
              >
                <div className="py-4 space-y-2">
                  <Link
                    to="/tool/merge-pdf"
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium"
                    onClick={closeDropdowns}
                  >
                    MERGE PDF
                  </Link>
                  <Link
                    to="/tool/split-pdf"
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium"
                    onClick={closeDropdowns}
                  >
                    SPLIT PDF
                  </Link>
                  <Link
                    to="/tool/compress-pdf"
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium"
                    onClick={closeDropdowns}
                  >
                    COMPRESS PDF
                  </Link>

                  {/* Convert PDF Mobile Section */}
                  <div className="space-y-2">
                    <button
                      className={`block w-full text-left px-4 py-2 font-medium transition-colors ${
                        activeDropdown === "convert"
                          ? "text-red-500 bg-red-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => handleDropdownToggle("convert")}
                    >
                      CONVERT PDF
                    </button>
                    {activeDropdown === "convert" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 mx-4 rounded-lg"
                      >
                        <div className="p-3 space-y-3">
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                              TO PDF
                            </h4>
                            <div className="space-y-1">
                              <button
                                onClick={() => {
                                  navigate("/tool/jpg-to-pdf");
                                  closeDropdowns();
                                }}
                                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                JPG to PDF
                              </button>
                              <button
                                onClick={() => {
                                  navigate("/tool/word-to-pdf");
                                  closeDropdowns();
                                }}
                                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                WORD to PDF
                              </button>
                              <button
                                onClick={() => {
                                  navigate("/tool/excel-to-pdf");
                                  closeDropdowns();
                                }}
                                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                EXCEL to PDF
                              </button>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                              FROM PDF
                            </h4>
                            <div className="space-y-1">
                              <button
                                onClick={() => {
                                  navigate("/tool/pdf-to-jpg");
                                  closeDropdowns();
                                }}
                                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                PDF to JPG
                              </button>
                              <button
                                onClick={() => {
                                  navigate("/tool/pdf-to-word");
                                  closeDropdowns();
                                }}
                                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                PDF to WORD
                              </button>
                              <button
                                onClick={() => {
                                  navigate("/tool/pdf-to-excel");
                                  closeDropdowns();
                                }}
                                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                PDF to EXCEL
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* All Tools Mobile Section */}
                  <div className="space-y-2">
                    <button
                      className={`block w-full text-left px-4 py-2 font-medium transition-colors ${
                        activeDropdown === "all-tools"
                          ? "text-red-500 bg-red-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => handleDropdownToggle("all-tools")}
                    >
                      ALL PDF TOOLS
                    </button>
                    {activeDropdown === "all-tools" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 mx-4 rounded-lg"
                      >
                        <div className="p-3 space-y-4">
                          {/* Popular Tools */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                              POPULAR
                            </h4>
                            <div className="space-y-1">
                              <button
                                onClick={() => {
                                  navigate("/tool/merge-pdf");
                                  closeDropdowns();
                                }}
                                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                Merge PDF
                              </button>
                              <button
                                onClick={() => {
                                  navigate("/tool/split-pdf");
                                  closeDropdowns();
                                }}
                                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                Split PDF
                              </button>
                              <button
                                onClick={() => {
                                  navigate("/tool/compress-pdf");
                                  closeDropdowns();
                                }}
                                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                Compress PDF
                              </button>
                              <button
                                onClick={() => {
                                  navigate("/tool/rotate-pdf");
                                  closeDropdowns();
                                }}
                                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                Rotate PDF
                              </button>
                            </div>
                          </div>

                          {/* Convert Tools */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                              CONVERT
                            </h4>
                            <div className="space-y-1">
                              <button
                                onClick={() => {
                                  navigate("/pdf-to-jpg");
                                  closeDropdowns();
                                }}
                                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                PDF to JPG
                              </button>
                              <button
                                onClick={() => {
                                  navigate("/jpg-to-pdf");
                                  closeDropdowns();
                                }}
                                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                JPG to PDF
                              </button>
                              <button
                                onClick={() => {
                                  navigate("/word-to-pdf");
                                  closeDropdowns();
                                }}
                                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                WORD to PDF
                              </button>
                            </div>
                          </div>

                          {/* Security Tools */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                              SECURITY
                            </h4>
                            <div className="space-y-1">
                              <button
                                onClick={() => {
                                  navigate("/tool/unlock-pdf");
                                  closeDropdowns();
                                }}
                                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                Unlock PDF
                              </button>
                              <button
                                onClick={() => {
                                  navigate("/tool/protect-pdf");
                                  closeDropdowns();
                                }}
                                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                Protect PDF
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-4 px-4 space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600 hover:text-gray-900"
                      onClick={closeDropdowns}
                      asChild
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                      asChild
                    >
                      <Link to="/signup">Sign up</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Dropdown Menu */}
          <AnimatePresence>
            {activeDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="hidden lg:block absolute left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
              >
                <PDFToolsDropdown
                  activeDropdown={activeDropdown}
                  onToolClick={closeDropdowns}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </div>
  );
};
