import { Layout } from "../components/Layout"
import { Particles } from "../components/Particles"
import { FadeIn, FadeInStagger, FadeInStaggerItem, ScaleOnHover } from "../components/Animations"
import { motion } from "framer-motion"
import { BrainCircuit, BookOpen, MessageSquare, Briefcase } from 'lucide-react'

export default function Home() {
  return (
    <Layout>
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
                <ScaleOnHover>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-md text-lg font-medium">
                    Get Started
                  </button>
                </ScaleOnHover>
                <ScaleOnHover>
                  <button className="border border-purple-500 text-purple-400 px-6 py-3 rounded-md text-lg font-medium">
                    Learn More
                  </button>
                </ScaleOnHover>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(147,51,234,0.1),transparent_70%)]" />
        <div className="container mx-auto relative px-4">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-white mb-12">Our Modules</h2>
          </FadeIn>
          <FadeInStagger>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: BrainCircuit,
                  title: "Know Your Skills (KYS)",
                  description: "Take our AI-powered quiz to discover your strengths, get personalized insights about your thinking patterns and potential career paths."
                },
                {
                  icon: BookOpen,
                  title: "Train Your Skills (TYS)",
                  description: "Access curated learning resources, including documents, videos, and websites. Get AI chatbot assistance for your learning journey."
                },
                {
                  icon: MessageSquare,
                  title: "Soft Skills Development",
                  description: "Enhance your communication, presentation, and interpersonal skills with AI-guided practice and feedback."
                },
                {
                  icon: Briefcase,
                  title: "Job & Freelance Portal",
                  description: "Find opportunities that match your skills with AI-driven job suggestions and freelance project recommendations."
                }
              ].map((module, index) => (
                <FadeInStaggerItem key={index}>
                  <ScaleOnHover>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-6">
                      <module.icon className="w-10 h-10 text-purple-400 mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">{module.title}</h3>
                      <p className="text-white/70">{module.description}</p>
                    </div>
                  </ScaleOnHover>
                </FadeInStaggerItem>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Why Choose next-step?</h2>
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
                  description: "Get personalized career guidance based on your unique skills and preferences."
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
                <ScaleOnHover>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-md text-lg font-medium">
                    Get Started Now
                  </button>
                </ScaleOnHover>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  )
}