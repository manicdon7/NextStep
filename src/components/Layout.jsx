import { Sparkles } from 'lucide-react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';



export function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-md bg-black/20">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <Sparkles className="h-6 w-6 text-purple-400" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                                Next-Step
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">
                                Features
                            </a>
                            <a href="#modules" className="text-sm text-white/70 hover:text-white transition-colors">
                                Modules
                            </a>
                            <a href="#about" className="text-sm text-white/70 hover:text-white transition-colors">
                                About
                            </a>
                        </div>

                        {/* Desktop Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <button
                                onClick={() => handleNavigation('/login')}
                                className="border border-purple-500 text-purple-400 px-4 py-2 rounded transition-colors hover:scale-105"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => handleNavigation('/login')}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded hover:scale-105"
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-white/70 hover:text-white"
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 border-b border-white/10">
                            <div className="flex flex-col space-y-4 p-4">
                                <a
                                    href="#features"
                                    className="text-sm text-white/70 hover:text-white transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Features
                                </a>
                                <a
                                    href="#modules"
                                    className="text-sm text-white/70 hover:text-white transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Modules
                                </a>
                                <a
                                    href="#about"
                                    className="text-sm text-white/70 hover:text-white transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    About
                                </a>
                                <button
                                    onClick={() => handleNavigation('/login')}
                                    className="border border-purple-500 text-purple-400 px-4 py-2 rounded transition-colors hover:scale-105 w-full"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => handleNavigation('/login')}
                                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded hover:scale-105 w-full"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            <main className="pt-16">{children}</main>
            <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md">
                <div className="container mx-auto py-8 md:py-12 px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a to="#" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a to="#" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Modules
                                    </a>
                                </li>
                                <li>
                                    <a to="#" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Pricing
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a to="#" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a to="#" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Guides
                                    </a>
                                </li>
                                <li>
                                    <a to="#" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Support
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a to="#" className="text-sm text-white/70 hover:text-white hover:underline">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a to="#" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a to="#" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Careers
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a to="#" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Privacy
                                    </a>
                                </li>
                                <li>
                                    <a to="#" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Terms
                                    </a>
                                </li>
                                <li>
                                    <a to="#" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Cookie Policy
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <p className="text-center text-sm text-white/70">
                            © {new Date().getFullYear()} next-step. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}