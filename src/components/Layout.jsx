import { Link } from "lucide-react";
import { Sparkles } from 'lucide-react'

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-md bg-black/20">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              next-step
            </span>
          </a>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">Features</a>
            <a href="#modules" className="text-sm text-white/70 hover:text-white transition-colors">Modules</a>
            <a href="#about" className="text-sm text-white/70 hover:text-white transition-colors">About</a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-white/70 hover:text-white transition-colors">Login</button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">Sign Up</button>
          </div>
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
                  <a to="#" className="text-sm text-white/70 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a to="#" className="text-sm text-white/70 hover:text-white">
                    Modules
                  </a>
                </li>
                <li>
                  <a to="#" className="text-sm text-white/70 hover:text-white">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a to="#" className="text-sm text-white/70 hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a to="#" className="text-sm text-white/70 hover:text-white">
                    Guides
                  </a>
                </li>
                <li>
                  <a to="#" className="text-sm text-white/70 hover:text-white">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a to="#" className="text-sm text-white/70 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a to="#" className="text-sm text-white/70 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a to="#" className="text-sm text-white/70 hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a to="#" className="text-sm text-white/70 hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a to="#" className="text-sm text-white/70 hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a to="#" className="text-sm text-white/70 hover:text-white">
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