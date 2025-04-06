import { Sparkles } from "lucide-react";
import { Particles } from "../components/Particles";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../Firebase";
import { API_URL } from "../constants";

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is already signed in:", user.email);
                navigate('/');
            } else {
                console.log("No user is signed in");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
    
        try {
            console.log("Attempting Google sign in");
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("Google sign in successful:", user.email);
    
            // Store user email in localStorage
            localStorage.setItem('userEmail', user.email);
    
            // Prepare user data to send to the backend
            const googleUserData = {
                name: user.displayName,
                email: user.email,
                password: user.uid
            };
    
            // Send data to backend for registration
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(googleUserData),
            });
    
            const data = await response.json();
            console.log(data);
            
            if (!response.ok) {
                throw new Error(data.message || 'Google Authentication failed');
            }
    
            console.log("User registered in DB successfully");
    
            // Store token if provided
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
    
            navigate('/');
    
        } catch (error) {
            console.error("Google sign in error:", error.code, error.message);
            setError(error.message || 'An error occurred during Google authentication');
        } finally {
            setLoading(false);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
    
        try {
            const apiUrl = isLogin ? `${API_URL}/api/auth/login` : `${API_URL}/api/auth/register`;
            console.log(`Attempting to ${isLogin ? 'login' : 'sign up'} with email:`, formData.email);
    
            // Store email in localStorage
            localStorage.setItem('userEmail', formData.email);
            
            // Prepare request payload using formData
            const requestBody = isLogin
                ? { email: formData.email, password: formData.password } // Login payload
                : { name: formData.name, email: formData.email, password: formData.password }; // Signup payload
    
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }
    
            console.log(`${isLogin ? 'Login' : 'Signup'} successful`);
    
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
    
            navigate('/');
        } catch (error) {
            console.error("Auth error:", error.message);
            
            // Remove email from localStorage if authentication fails
            localStorage.removeItem('userEmail');
            
            if (error.message.includes('User already exists')) {
                setError('User already exists. Please login.');
                setIsLogin(true);
            } else if (error.message.includes('User does not exist')) {
                setError('User does not exist. Please sign up.');
                setIsLogin(false);
            } else if (error.message.includes('Incorrect password')) {
                setError('Incorrect password. Please try again.');
            } else if (error.message.includes('Invalid email')) {
                setError('Invalid email address');
            } else if (error.message.includes('weak password')) {
                setError('Password is too weak. Use at least 6 characters.');
            } else {
                setError(error.message || 'An error occurred during authentication');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ name: '', email: '', password: '' });
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Particles />
            <div className="p-4 md:p-6">
                <Link to="/" className="flex items-center space-x-2">
                    <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-purple-400" />
                    <span className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        Next-Step
                    </span>
                </Link>
            </div>
            <div className="flex items-center justify-center p-4">
                <div className="w-full max-w-6xl h-[580px] md:h-[580px] relative perspective-1000">
                    {error && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
                            <div className="bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg">
                                {error}
                            </div>
                        </div>
                    )}

                    <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isLogin ? '' : 'rotate-y-180'}`}>
                        {/* Login Side (Front) */}
                        <div className="absolute w-full h-full backdrop-blur-md bg-white/10 rounded-xl overflow-hidden backface-hidden">
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="hidden md:block md:w-1/2">
                                    <img
                                        src="https://imgs.search.brave.com/IDptzc2Hmb-Ihts5zQdjFRiVvDgPqaUEerF0kdD9ULQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyMy8w/Ny8xNy8wOS8yNS90/cmVlLTgxMzIyNTBf/MTI4MC5qcGc"
                                        alt="Nature"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Welcome Back</h2>
                                    <button
                                        onClick={handleGoogleSignIn}
                                        disabled={loading}
                                        className="w-full bg-white text-black rounded-lg py-3 mb-6 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    >
                                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                        Continue with Google
                                    </button>
                                    
                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-violet-300"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="bg-violet-500 rounded-xl px-4 text-sm text-white">
                                                or continue with email
                                            </span>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                                            onChange={handleInputChange}
                                            value={formData.email}
                                            required
                                        />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                                            onChange={handleInputChange}
                                            value={formData.password}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-purple-600 text-white rounded-lg py-3 hover:bg-purple-700 transition-colors disabled:opacity-50"
                                        >
                                            {loading ? 'Processing...' : 'Log In'}
                                        </button>
                                    </form>

                                    <p className="text-center mt-6 text-gray-400">
                                        Don't have an account?{' '}
                                        <button
                                            onClick={toggleForm}
                                            disabled={loading}
                                            className="text-purple-400 hover:text-purple-300 disabled:opacity-50"
                                        >
                                            Sign Up
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Signup Side (Back) */}
                        <div id="sign-up" className="absolute w-full h-full bg-white/10 rounded-xl overflow-hidden backface-hidden rotate-y-180">
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Create Account</h2>
                                    <button
                                        onClick={handleGoogleSignIn}
                                        disabled={loading}
                                        className="w-full bg-white text-black rounded-lg py-3 mb-6 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    >
                                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                        Continue with Google
                                    </button>
                                    
                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-violet-300"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="bg-violet-500 rounded-xl px-4 text-sm text-white">
                                                or continue with email
                                            </span>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full Name"
                                            className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                                            onChange={handleInputChange}
                                            value={formData.name}
                                            required
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                                            onChange={handleInputChange}
                                            value={formData.email}
                                            required
                                        />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                                            onChange={handleInputChange}
                                            value={formData.password}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-purple-600 text-white rounded-lg py-3 hover:bg-purple-700 transition-colors disabled:opacity-50"
                                        >
                                            {loading ? 'Processing...' : 'Sign Up'}
                                        </button>
                                    </form>

                                    <p className="text-center mt-6 text-gray-400">
                                        Already have an account?{' '}
                                        <button
                                            onClick={toggleForm}
                                            disabled={loading}
                                            className="text-purple-400 hover:text-purple-300 disabled:opacity-50"
                                        >
                                            Log In
                                        </button>
                                    </p>
                                </div>
                                <div className="hidden md:block md:w-1/2">
                                    <img
                                        src="https://imgs.search.brave.com/IDptzc2Hmb-Ihts5zQdjFRiVvDgPqaUEerF0kdD9ULQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyMy8w/Ny8xNy8wOS8yNS90/cmVlLTgxMzIyNTBf/MTI4MC5qcGc"
                                        alt="Nature"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;