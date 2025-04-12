import { Layout } from "../components/Layout"
import { Particles } from "../components/Particles"
import { FadeIn, FadeInStagger, FadeInStaggerItem, ScaleOnHover } from "../components/Animations"
import { motion } from "framer-motion"
import { BrainCircuit, BookOpen, MessageSquare, Briefcase, User } from 'lucide-react'
import { Zap, Users, TrendingUp, Shield } from 'lucide-react'
import BotButton from "../components/BotButton"
import { useEffect, useState } from "react"
import { onAuthStateChanged, getAuth } from "firebase/auth"
import { useNavigate, Link } from "react-router-dom"


export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  // useEffect(() => {
  //   console.log("Setting up auth state listener");
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     if (currentUser) {
  //       console.log("User is signed in:", currentUser.email);
  //       setUser(currentUser);
  //     } else {
  //       console.log("No user is signed in");
  //       setUser(null);
  //       navigate('/login');
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [navigate, auth]);

  const getUserName = () => {
    if (!user) return "";

    // Try to get the display name first
    if (user.displayName) return user.displayName;

    // If no display name, try to use the email username part
    if (user.email) {
      const emailName = user.email.split('@')[0];
      // Capitalize first letter and replace dots/underscores with spaces
      return emailName
        .split(/[._]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }

    return "User";
  };

  const getProfileImage = () => {
    if (!user) return null;

    // Use photoURL if available (typically from Google auth)
    if (user.photoURL) {
      return (
        <img
          src={user.photoURL}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-purple-400"
        />
      );
    }

    // Otherwise use default avatar
    return (
      <div className="w-10 h-10 bg-purple-500/30 rounded-full flex items-center justify-center">
        <User className="w-6 h-6 text-purple-400" />
      </div>
    );
  };

  return (
    <Layout>
      <BotButton />
      {/* User Profile Display in Header */}
      {user && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-white/70">Welcome,</p>
            <p className="text-white font-medium">{getUserName()}</p>
          </div>
          {getProfileImage()}
        </div>
      )}
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <Particles />
        <div className="container mx-auto relative pt-24 pb-20 md:pt-32 md:pb-28 px-4">
          <div className="text-center space-y-8">
            <FadeIn>
              <motion.h1
                className="text-4xl md:text-6xl h-20 font-bold tracking-tighter text-white"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundImage: "linear-gradient(to right, #fff, #a855f7, #fff)",
                  backgroundSize: "200%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Intelligent Career Support
              </motion.h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Navigate your career path with AI-powered guidance, personalized resources, and skill development tools designed
                for your success.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="flex justify-center gap-4">
                <Link to="/kys">
                  <ScaleOnHover>
                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-md text-lg font-medium cursor-pointer">
                      Get Started
                    </button>
                  </ScaleOnHover>
                </Link>
                <a href="#modules">
                <ScaleOnHover>
                  <button className="border border-purple-500 text-purple-400 px-6 py-3 rounded-md text-lg font-medium cursor-pointer">
                    Learn More
                  </button>
                </ScaleOnHover>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-black/20">
        <div className="container mx-auto px-4 md:px-8">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Powerful Features for Your Career Growth
            </h2>
          </FadeIn>
          <FadeInStagger>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Zap,
                  title: "AI-Powered Insights",
                  description: "Get personalized career guidance based on your unique skills and preferences."
                },
                {
                  icon: Users,
                  title: "Community Support",
                  description: "Connect with peers and mentors to share experiences and grow together."
                },
                {
                  icon: TrendingUp,
                  title: "Skill Analytics",
                  description: "Track your progress and identify areas for improvement with detailed analytics."
                },
                {
                  icon: Shield,
                  title: "Secure Platform",
                  description: "Your data is protected with state-of-the-art security measures."
                }
              ].map((feature, index) => (
                <FadeInStaggerItem key={index}>
                  <motion.div
                    className="bg-white/5 border border-white/10 rounded-lg p-6 h-full"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <motion.div
                      className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="w-6 h-6 text-purple-400" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </motion.div>
                </FadeInStaggerItem>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(147,51,234,0.1),transparent_70%)]" />
        <div className="container mx-auto relative px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-white mb-12">Our Modules</h2>
          </FadeIn>
          <FadeInStagger>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: BrainCircuit,
                  title: "Know Your Self (KYS)",
                  description: "Take our AI-powered quiz to discover your strengths, get personalized insights about your thinking patterns and potential career paths.",
                  link: "/kys",
                },
                {
                  icon: BookOpen,
                  title: "Train Your Self (TYS)",
                  description: "Access curated learning resources, including documents, videos, and websites. Get AI chatbot assistance for your learning journey.",
                  link: "/tys",
                },
                {
                  icon: MessageSquare,
                  title: "Soft Skills Development",
                  description: "Enhance your communication, Management , presentation, Techinal and interpersonal skills with AI-guided practice and feedback.",
                  link: "/skills",
                },
                {
                  icon: Briefcase,
                  title: "Job & Freelance Portal",
                  description: "Find opportunities which is related and match your skills with AI-driven job suggestions and freelance project recommendations.",
                  link: "#",
                }
              ].map((module, index) => (
                <FadeInStaggerItem key={index}>
                  <ScaleOnHover>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-6">
                      <module.icon className="w-10 h-10 text-purple-400 mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">{module.title}</h3>
                      <p className="text-white/70">{module.description}</p>
                      <div className="flex justify-end">
                        <button onClick={() => window.location.href = module.link} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded hover:scale-105 cursor-pointer">Read More</button>
                      </div>
                    </div>
                  </ScaleOnHover>
                </FadeInStaggerItem>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      <section id="about" className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center text-white mb-12">About Next-Step</h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-12 items-center px-8">
            <FadeIn>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-2xl font-semibold text-white mb-4">Our Mission</h3>
                <p className="text-white/70 mb-6">
                  At next-step, we're committed to revolutionizing career development through cutting-edge AI technology and personalized guidance. Our mission is to empower individuals to discover their true potential and navigate their career paths with confidence.
                </p>
                <ScaleOnHover>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-md text-lg font-medium ">
                    Learn More About Us
                  </button>
                </ScaleOnHover>
              </motion.div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src="https://imgs.search.brave.com/7ThjARnyd4Sk-eAzWL_JJx8pypXewQTdyzc18vbwbdM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kZWVs/LXdlYnNpdGUtbWVk/aWEtcHJvZC5zMy5h/bWF6b25hd3MuY29t/L2VuZ2FnZV9jYXJl/ZXJfbWFuYWdlbWVu/dF8yZWNiYTA5NDc4/LnBuZw"
                    alt="Team collaboration"
                    className="rounded-lg object-cover"
                  />
                </div>
                <motion.div
                  className="absolute -bottom-6 -right-6 bg-purple-500 rounded-lg p-4 shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <p className="text-white font-semibold">Trusted by 10,000+ users worldwide</p>
                </motion.div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Why Choose Next-Step?</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Our platform combines cutting-edge AI technology with comprehensive career development tools to give you the
                edge you need.
              </p>
            </div>
          </FadeIn>
          <FadeInStagger>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: BrainCircuit,
                  title: "AI-Powered Insights",
                  description: "Get personalized career guidance based on skills and preferences."
                },
                {
                  icon: BookOpen,
                  title: "Comprehensive Resources",
                  description: "Access a vast library of learning materials and development tools."
                },
                {
                  icon: MessageSquare,
                  title: "24/7 Support",
                  description: "Get help anytime with our AI chatbot and expert support team."
                }
              ].map((feature, index) => (
                <FadeInStaggerItem key={index}>
                  <ScaleOnHover>
                    <div className="text-center">
                      <motion.div
                        className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ type: "spring", duration: 0.8 }}
                      >
                        <feature.icon className="w-6 h-6 text-purple-400" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-white/70">{feature.description}</p>
                    </div>
                  </ScaleOnHover>
                </FadeInStaggerItem>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <motion.div
              className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm"
              whileHover={{ boxShadow: "0 0 30px rgba(147, 51, 234, 0.2)" }}
            >
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
                <p className="text-white/70 mb-8">
                  Join thousands of others who have already discovered their career path with next-step.
                </p>
                <Link to="/kys">
                <ScaleOnHover>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-md text-lg font-medium cursor-pointer">
                    Get Started Now
                  </button>
                </ScaleOnHover>
                </Link>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  )
}