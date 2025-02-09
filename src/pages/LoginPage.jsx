import { Sparkles } from "lucide-react";
import { Particles } from "../components/Particles";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let response;
            if (isLogin) {
                response = await axios.post('https://nextstep-backend-api.vercel.app/login', formData);
                if (response.data.error === 'User does not exist') {
                    setError('User does not exist. Please sign up.');
                    setIsLogin(false);
                    return;
                }
                navigate('/');
            } else {
                response = await axios.post('https://nextstep-backend-api.vercel.app/register', formData);
                if (response.data.error === 'User already exists') {
                    setError('User already exists. Please login.');
                    setIsLogin(true);
                    return;
                }
                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'An error occurred');
            } else {
                setError('Network error. Please try again.');
            }
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ name: '', email: '', password: '' });
    };

    return (
        <div className="relative overflow-hidden">
            <Particles />
            <div className="p-6">
                <Link to="/" className="flex items-center space-x-2">
                    <Sparkles className="h-10 w-10 text-purple-400" />
                    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        Next-Step
                    </span>
                </Link>
            </div>
            <div className="flex items-center justify-center p-4">
                <div className={`w-full max-w-6xl h-[580px] relative perspective-1000`}>
                    {error && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
                            <div className="bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg">
                                {error}
                            </div>
                        </div>
                    )}

                    <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isLogin ? '' : 'rotate-y-180'}`}>
                        {/* Login Side (Front) */}
                        <div className={`absolute w-full h-full backdrop-blur-md bg-white/10 rounded-xl overflow-hidden backface-hidden`}>
                            <div className="flex h-full">
                                <div className="w-1/2">
                                    <img
                                        src="https://imgs.search.brave.com/IDptzc2Hmb-Ihts5zQdjFRiVvDgPqaUEerF0kdD9ULQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyMy8w/Ny8xNy8wOS8yNS90/cmVlLTgxMzIyNTBf/MTI4MC5qcGc"
                                        alt="Nature"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="w-1/2 p-8 flex flex-col justify-center">
                                    <h2 className="text-3xl font-bold text-white mb-8">Welcome Back</h2>
                                    <button className="w-full bg-white text-black rounded-lg py-3 mb-6 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
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
                                        />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                                            onChange={handleInputChange}
                                            value={formData.password}
                                        />
                                        <button
                                            type="submit"
                                            className="w-full bg-purple-600 text-white rounded-lg py-3 hover:bg-purple-700 transition-colors"
                                        >
                                            Log In
                                        </button>
                                    </form>

                                    <p className="text-center mt-6 text-gray-400">
                                        Don't have an account?{' '}
                                        <button
                                            onClick={toggleForm}
                                            className="text-purple-400 hover:text-purple-300"
                                        >
                                            Sign Up
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Signup Side (Back) */}
                        <div id="sign-up" className={`absolute w-full h-full bg-white/10 rounded-xl overflow-hidden backface-hidden rotate-y-180`}>
                            <div className="flex h-full">
                                <div className="w-1/2 p-8 flex flex-col justify-center">
                                    <h2 className="text-3xl font-bold text-white mb-8">Create Account</h2>
                                    <button className="w-full bg-white text-black rounded-lg py-3 mb-6 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
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
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                                            onChange={handleInputChange}
                                            value={formData.email}
                                        />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                                            onChange={handleInputChange}
                                            value={formData.password}
                                        />
                                        <button
                                            type="submit"
                                            className="w-full bg-purple-600 text-white rounded-lg py-3 hover:bg-purple-700 transition-colors"
                                        >
                                            Sign Up
                                        </button>
                                    </form>

                                    <p className="text-center mt-6 text-gray-400">
                                        Already have an account?{' '}
                                        <button
                                            onClick={toggleForm}
                                            className="text-purple-400 hover:text-purple-300"
                                        >
                                            Log In
                                        </button>
                                    </p>
                                </div>
                                <div className="w-1/2">
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