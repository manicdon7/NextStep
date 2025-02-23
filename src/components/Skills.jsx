import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  BookOpen, Users, MessageCircle, Briefcase, Clock, Globe, Brain, X, Play, CheckCircle, ExternalLink
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import skillsData from '../json/skillsData.json';
import { Particles } from './Particles';

// Map string icon names to actual components
const iconMap = {
  BookOpen,
  Users,
  MessageCircle,
  Briefcase,
  Clock,
  Globe,
  Brain
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

// Utility functions for local storage
const getCompletedExercises = (skillTitle) => {
  const key = `completedExercises_${skillTitle.replace(/\s+/g, '')}`;
  return JSON.parse(localStorage.getItem(key)) || [];
};

const saveCompletedExercises = (skillTitle, exercises) => {
  const key = `completedExercises_${skillTitle.replace(/\s+/g, '')}`;
  localStorage.setItem(key, JSON.stringify(exercises));
};

const SkillCard = ({ skill, openModal }) => {
  const Icon = iconMap[skill.icon] || (() => null);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div 
      ref={ref}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#A89CD6]/20 cursor-pointer hover:bg-gradient-to-br hover:from-[#A89CD6]/10 hover:to-[#4B2E87]/10"
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(75, 46, 135, 0.2)", transition: { duration: 0.2 } }}
      onClick={() => openModal(skill)}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="mr-4 p-2 bg-gradient-to-br from-[#A89CD6] to-[#4B2E87] rounded-full"
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold text-[#4B2E87]">{skill.title}</h3>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{skill.description}</p>
      </div>
    </motion.div>
  );
};

const SkillModal = ({ skill, closeModal }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showGeneralAIResults, setShowGeneralAIResults] = useState(false);
  const [generalAIResults, setGeneralAIResults] = useState([]);
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(false);
  const [specificQuestion, setSpecificQuestion] = useState('');
  const [specificAIResults, setSpecificAIResults] = useState([]);
  const [isLoadingSpecific, setIsLoadingSpecific] = useState(false);
  const [completedExercises, setCompletedExercises] = useState(getCompletedExercises(skill.title));
  const Icon = iconMap[skill.icon] || (() => null);

  useEffect(() => {
    setCompletedExercises(getCompletedExercises(skill.title));
  }, [skill.title]);

  const fetchGeneralAIResults = async () => {
    setIsLoadingGeneral(true);
    try {
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(skill.aiPrompt)}`);
      const data = await response.text();
      const results = data.split('\n').filter(tip => tip.trim().length > 0);
      setGeneralAIResults(results);
    } catch (error) {
      console.error("Error fetching general AI results:", error);
      setGeneralAIResults(["Could not load AI-generated tips. Please try again later."]);
    }
    setIsLoadingGeneral(false);
    setShowGeneralAIResults(true);
  };

  const fetchSpecificAIResults = async () => {
    if (!specificQuestion.trim()) return;
    setIsLoadingSpecific(true);
    const prompt = `Provide tips for improving ${skill.title} based on the question: ${specificQuestion}`;
    try {
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
      const data = await response.text();
      const results = data.split('\n').filter(tip => tip.trim().length > 0);
      setSpecificAIResults(results);
    } catch (error) {
      console.error("Error fetching specific AI results:", error);
      setSpecificAIResults(["Could not load AI-generated tips. Please try again later."]);
    }
    setIsLoadingSpecific(false);
  };

  const handleExerciseToggle = (index) => {
    const newCompleted = completedExercises.includes(index)
      ? completedExercises.filter(i => i !== index)
      : [...completedExercises, index];
    setCompletedExercises(newCompleted);
    saveCompletedExercises(skill.title, newCompleted);
  };

  const tabs = ['Overview', 'Resources', 'Practice', 'AI Tips', 'Progress'];

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
      onClick={closeModal}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#A89CD6] scrollbar-track-[#A89CD6]/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="mr-4 p-2 bg-gradient-to-br from-[#A89CD6] to-[#4B2E87] rounded-full">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#4B2E87]">{skill.title}</h3>
          </div>
          <button onClick={closeModal} className="text-[#4B2E87] hover:text-[#A89CD6]">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-[#A89CD6]/20 mb-4">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 cursor-pointer text-sm font-medium ${activeTab === tab ? 'text-[#4B2E87] border-b-2 border-[#4B2E87]' : 'text-gray-600 hover:text-[#4B2E87]'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && (
          <div>
            <p className="text-gray-700 text-sm leading-relaxed">{skill.description}</p>
          </div>
        )}

        {activeTab === 'Resources' && (
          <div>
            <h4 className="font-semibold text-[#4B2E87] mb-3 text-sm">Learning Resources</h4>
            <ul className="space-y-2">
              {skill.resources.map((resource, idx) => (
                <li key={idx} className="text-gray-700">
                  <a 
                    href={resource.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#4B2E87] hover:text-[#A89CD6] flex items-center text-sm transition-colors duration-200"
                  >
                    {resource.title} 
                    <span className="text-gray-500 text-xs ml-1">({resource.type})</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'Practice' && (
          <div>
            <h4 className="font-semibold text-[#4B2E87] mb-3 text-sm">Practice Exercises</h4>
            <ul className="space-y-3">
              {skill.practice.map((exercise, idx) => (
                <li key={idx} className="flex items-start">
                  <input
                    type="checkbox"
                    checked={completedExercises.includes(idx)}
                    onChange={() => handleExerciseToggle(idx)}
                    className="mr-2 mt-1 w-4 h-4 text-[#4B2E87] border-[#A89CD6] rounded focus:ring-[#4B2E87]"
                  />
                  <span className="text-gray-700 text-sm">{exercise}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'AI Tips' && (
          <div>
            <h4 className="font-semibold text-[#4B2E87] mb-3 text-sm">General AI Tips</h4>
            {!showGeneralAIResults ? (
              <motion.button
                onClick={fetchGeneralAIResults}
                disabled={isLoadingGeneral}
                className="flex items-center justify-center w-full py-2 bg-gradient-to-r from-[#4B2E87] to-[#A89CD6] text-white rounded-lg hover:from-[#A89CD6] hover:to-[#4B2E87] transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoadingGeneral ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Get General Tips
                  </>
                )}
              </motion.button>
            ) : (
              <div className="mb-6">
                <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-[#A89CD6] scrollbar-track-[#A89CD6]/10 mb-4">
                  <ul className="space-y-3">
                    {generalAIResults.map((tip, idx) => (
                      <li key={idx} className="bg-[#A89CD6]/10 p-3 rounded-lg text-gray-700 text-sm border border-[#A89CD6]/20">
                        <ReactMarkdown>{tip}</ReactMarkdown>
                      </li>
                    ))}
                  </ul>
                </div>
                <motion.button
                  onClick={fetchGeneralAIResults}
                  disabled={isLoadingGeneral}
                  className="flex items-center justify-center w-full py-2 bg-gradient-to-r from-[#A89CD6] to-[#4B2E87] text-white rounded-lg hover:from-[#4B2E87] hover:to-[#A89CD6] transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoadingGeneral ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Fetching Again...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Ask Again
                    </>
                  )}
                </motion.button>
              </div>
            )}

            <h4 className="font-semibold text-[#4B2E87] mb-3 text-sm mt-6">Specific AI Tips</h4>
            <textarea
              value={specificQuestion}
              onChange={(e) => setSpecificQuestion(e.target.value)}
              placeholder="Ask a specific question (e.g., How can I improve public speaking?)"
              className="w-full p-2 border border-[#A89CD6]/20 rounded-lg text-sm text-gray-700 mb-3 focus:outline-none focus:ring-2 focus:ring-[#4B2E87]"
              rows="3"
            />
            <motion.button
              onClick={fetchSpecificAIResults}
              disabled={isLoadingSpecific || !specificQuestion.trim()}
              className="flex items-center justify-center w-full py-2 bg-gradient-to-r from-[#4B2E87] to-[#A89CD6] text-white rounded-lg hover:from-[#A89CD6] hover:to-[#4B2E87] transition-all duration-300 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoadingSpecific ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Get Specific Tips
                </>
              )}
            </motion.button>
            {specificAIResults.length > 0 && (
              <div className="mt-4 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-[#A89CD6] scrollbar-track-[#A89CD6]/10">
                <ul className="space-y-3">
                  {specificAIResults.map((tip, idx) => (
                    <li key={idx} className="bg-[#A89CD6]/10 p-3 rounded-lg text-gray-700 text-sm border border-[#A89CD6]/20">
                      <ReactMarkdown>{tip}</ReactMarkdown>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Progress' && (
          <div>
            <h4 className="font-semibold text-[#4B2E87] mb-3 text-sm">Your Progress</h4>
            {completedExercises.length === 0 ? (
              <p className="text-gray-700 text-sm">No exercises completed yet. Start practicing!</p>
            ) : (
              <ul className="space-y-3">
                {skill.practice
                  .filter((_, idx) => completedExercises.includes(idx))
                  .map((exercise, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-[#A89CD6] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{exercise}</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const SoftSkillsTracker = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div 
      ref={ref}
      className="bg-gradient-to-br from-[#A89CD6]/20 to-[#4B2E87]/20 p-6 rounded-xl mt-12 shadow-xl"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h3 className="text-2xl font-bold text-[#4B2E87] mb-4">Your Soft Skills Journey</h3>
      <p className="text-gray-700 mb-6 text-sm">Track your mastery and celebrate your achievements.</p>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {skillsData.map((skill, idx) => {
          const Icon = iconMap[skill.icon] || (() => null);
          const completed = getCompletedExercises(skill.title);
          const progress = (completed.length / skill.practice.length) * 100 || 0;
          return (
            <motion.div 
              key={idx} 
              className="bg-white rounded-lg p-4 text-center shadow-md border border-[#A89CD6]/20"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(75, 46, 135, 0.2)" }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-8 h-8 mx-auto text-[#4B2E87] mb-2" />
              <h4 className="text-sm font-medium text-[#4B2E87]">{skill.title}</h4>
              <div className="mt-2 flex justify-center">
                <div className="bg-[#A89CD6]/20 h-2 w-16 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-[#A89CD6] to-[#4B2E87] h-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${progress}%` } : { width: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-6 text-center">
        <motion.button 
          className="bg-gradient-to-r from-[#4B2E87] to-[#A89CD6] text-white py-2 px-6 rounded-full shadow-lg hover:from-[#A89CD6] hover:to-[#4B2E87] transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Take Skills Assessment
        </motion.button>
      </div>
    </motion.div>
  );
};

const Skills = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const openModal = (skill) => setSelectedSkill(skill);
  const closeModal = () => setSelectedSkill(null);

  return (
    <div className="bg-gradient-to-b from-[#4B2E87] to-[#1e2447] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-20">
        <Particles />
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold tracking-tight text-white"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: "linear-gradient(to right, #fff, #A89CD6, #fff)",
              backgroundSize: "200%",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Master Your Soft Skills
          </motion.h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mt-4 leading-relaxed">
            Elevate your career with essential human skills. Explore resources, practice, and track your progress.
          </p>
        </motion.div>
        
        {/* Skills Grid */}
        <motion.div 
          ref={ref}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {skillsData.map((skill, index) => (
            <SkillCard key={index} skill={skill} openModal={openModal} />
          ))}
        </motion.div>
        
        {/* Progress Tracker */}
        <SoftSkillsTracker />
        
        {/* Community Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-xl p-8 mt-20 border border-[#A89CD6]/20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-bold text-[#4B2E87] mb-4">Join Our Community</h2>
          <p className="text-gray-700 mb-6 text-sm leading-relaxed">
            Collaborate with peers, share insights, and grow within our dynamic soft skills network.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Weekly Challenges", desc: "Engage in skill-building exercises" },
              { title: "Discussion Forums", desc: "Connect and exchange ideas" },
              { title: "Expert Webinars", desc: "Gain wisdom from professionals" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                className="bg-gradient-to-br from-[#A89CD6]/20 to-[#4B2E87]/20 p-4 rounded-lg"
                whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(75, 46, 135, 0.2)" }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-semibold text-[#4B2E87] mb-2">{item.title}</h3>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <motion.button 
              className="bg-gradient-to-r from-[#4B2E87] to-[#A89CD6] text-white font-medium py-2 px-8 rounded-full shadow-lg hover:from-[#A89CD6] hover:to-[#4B2E87] transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Community
            </motion.button>
          </div>
        </motion.div>

        {/* Modal */}
        {selectedSkill && <SkillModal skill={selectedSkill} closeModal={closeModal} />}
      </div>
    </div>
  );
};

export default Skills;