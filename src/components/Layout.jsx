import { Sparkles } from 'lucide-react';
import { Menu, X, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../Firebase';

export function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);
    
    useEffect(() => {
        // Check for stored email from traditional login
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }

        // Check for Firebase authentication
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // If we have a Firebase user, use their email
                if (currentUser.email) {
                    setEmail(currentUser.email);
                }
            } else {
                setUser(null);
                // If no stored email and no Firebase user, clear email
                if (!storedEmail) {
                    setEmail("");
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current && 
                !buttonRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            setEmail("");
            setUser(null);
            setIsDropdownOpen(false);
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const UserMenu = () => (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-white/90 hover:text-white bg-purple-500 hover:bg-purple-600 rounded-xl p-2 cursor-pointer"
            >
                {user?.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center ">
                        <User className="w-5 h-5 text-white" />
                    </div>
                )}
                <span className="text-sm">{user?.displayName || email}</span>
            </button>

            {isDropdownOpen && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-purple-500 border border-white/10 rounded-md shadow-lg py-1 z-50">
                    <Link
                        to="/profile"
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:text-white hover:bg-purple-800 cursor-pointer"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                        My Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:text-white hover:bg-purple-800 cursor-pointer"
                    >
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );

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
                            {user || email ? (
                                <UserMenu />
                            ) : (
                                <button
                                    onClick={() => handleNavigation('/login')}
                                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded hover:scale-105 cursor-pointer"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-white/70 hover:text-white cursor-pointer"
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 border-b border-white/10 z-50">
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
                                
                                {user || email ? (
                                    <div className="pt-2 border-t border-white/10">
                                        <div className="flex items-center space-x-2 mb-4 bg-purple-500 hover:bg-purple-600 rounded-xl p-2">
                                            {user?.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt="Profile"
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                            <span className="text-sm text-white">{user?.displayName || email}</span>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="block w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded text-center mb-2 cursor-pointer"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            My Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded cursor-pointer"
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleNavigation('/login')}
                                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded hover:scale-105 w-full cursor-pointer"
                                    >
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            <main className="pt-16">{children}</main>
            <div className='border-t border-white/10 bg-black/20 backdrop-blur-md '>
            <footer className="pl-2 md:pl-4 lg:pl-20">
                <div className="container mx-auto py-8 md:py-12 px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#features" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#modules" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Modules
                                    </a>
                                </li>
                                <li>
                                    <a href="#pricing" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Pricing
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#docs" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a href="#guides" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Guides
                                    </a>
                                </li>
                                <li>
                                    <a href="#support" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Support
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#about" className="text-sm text-white/70 hover:text-white hover:underline">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#blog" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#careers" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Careers
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#privacy" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Privacy
                                    </a>
                                </li>
                                <li>
                                    <a href="#terms" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Terms
                                    </a>
                                </li>
                                <li>
                                    <a href="#cookies" className="text-sm text-white/70 hover:text-white hover:underline">
                                        Cookie Policy
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <p className="text-center text-sm text-white/70">
                        NextStep © {new Date().getFullYear()} | Expand your knowledge and skills
                        </p>
                    </div>
                </div>
            </footer>
            </div>
        </div>
    );
}