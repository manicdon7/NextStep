import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-md bg-black/20">
                <div className="container flex h-16 items-center justify-between">
                    <Link className="flex items-center space-x-2" to="/">
                        <Sparkles className="h-6 w-6 text-purple-400" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            next-step
                        </span>
                    </Link>
                    <div className="hidden md:flex space-x-8">
                        <a className="text-sm text-white/70 hover:text-white transition-colors" href="#features">
                            Features
                        </a>
                        <a className="text-sm text-white/70 hover:text-white transition-colors" href="#modules">
                            Modules
                        </a>
                        <a className="text-sm text-white/70 hover:text-white transition-colors" href="#about">
                            About
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button variant="ghost" className="text-white/70 hover:text-white">
                            Login
                        </button>
                        <button className="bg-purple-500 hover:bg-purple-600 text-white">Sign Up</button>
                    </div>
                </div>
            </nav>
            <main className="pt-16">{children}</main>
            <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="container py-8 md:py-12">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <Link className="text-sm text-white/70 hover:text-white" href="#">
                                                Features
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-sm text-white/70 hover:text-white" href="#">
                                                Modules
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-sm text-white/70 hover:text-white" href="#">
                                                Pricing
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <Link className="text-sm text-white/70 hover:text-white" href="#">
                                                Documentation
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-sm text-white/70 hover:text-white" href="#">
                                                Guides
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-sm text-white/70 hover:text-white" href="#">
                                                Support
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <Link className="text-sm text-white/70 hover:text-white" href="#">
                                                About
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-sm text-white/70 hover:text-white" href="#">
                                                Blog
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-sm text-white/70 hover:text-white" href="#">
                                                Careers
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <Link className="text-sm text-white/70 hover:text-white" href="#">
                                                Privacy
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-sm text-white/70 hover:text-white" href="#">
                                                Terms
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-sm text-white/70 hover:text-white" href="#">
                                                Cookie Policy
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
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