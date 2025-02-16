import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Users, MessageCircle, Briefcase, Clock, Globe,
  ChevronDown, ExternalLink, Play, CheckCircle, Brain
} from 'lucide-react';
import { Particles } from './Particles';

const skillsData = [
  {
    title: 'Communication Skills',
    description: 'Enhance your verbal and non-verbal communication to effectively convey ideas.',
    icon: MessageCircle,
    resources: [
      { type: 'YouTube Video', link: 'https://www.youtube.com/watch?v=eIho2S0ZahI', title: 'How to Speak So That People Want to Listen' },
      { type: 'Book', link: 'https://www.goodreads.com/book/show/4865.How_to_Win_Friends_and_Influence_People', title: 'How to Win Friends & Influence People' },
      { type: 'Article', link: 'https://hbr.org/topic/communication', title: 'Harvard Business Review on Communication' },
      { type: 'Online Course', link: 'https://www.coursera.org/learn/communication-skills', title: 'Effective Communication in the Workplace' },
    ],
    practice: [
      "Record yourself explaining a complex topic, then review it to identify areas for improvement",
      "Join a local Toastmasters club to practice public speaking",
      "Practice active listening in your next three conversations",
      "Write an email persuading someone to take a specific action"
    ],
    aiPrompt: "communication skills improvement exercises"
  },
  {
    title: 'Interpersonal Skills',
    description: 'Develop the ability to interact effectively with others in various contexts.',
    icon: Users,
    resources: [
      { type: 'YouTube Video', link: 'https://www.youtube.com/watch?v=lmyZMtPVodo', title: 'Why Good Leaders Make You Feel Safe' },
      { type: 'Book', link: 'https://www.goodreads.com/book/show/17383956-leaders-eat-last', title: 'Leaders Eat Last' },
      { type: 'Article', link: 'https://www.forbes.com/sites/forbeshumanresourcescouncil/2023/01/10/the-importance-of-team-collaboration/', title: 'The Importance of Team Collaboration' },
      { type: 'Podcast', link: 'https://hbr.org/podcast/dear-hbr', title: 'Dear HBR: Workplace Dilemmas' },
    ],
    practice: [
      "Volunteer for a team project where you can practice collaboration",
      "Practice giving constructive feedback to a colleague or friend",
      "Attend a networking event and make three new connections",
      "Practice conflict resolution by mediating a minor disagreement"
    ],
    aiPrompt: "building better relationships at work exercises"
  },
  {
    title: 'Problem-Solving & Critical Thinking',
    description: 'Learn to analyze situations and develop effective solutions.',
    icon: Brain,
    resources: [
      { type: 'YouTube Video', link: 'https://www.youtube.com/watch?v=dVk9f9n5vwE', title: 'Critical Thinking – The Socratic Method' },
      { type: 'Book', link: 'https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow', title: 'Thinking, Fast and Slow' },
      { type: 'Article', link: 'https://fs.blog/thinking-tools/', title: 'Farnam Street Blog on Thinking Smarter' },
      { type: 'Online Course', link: 'https://www.coursera.org/learn/critical-thinking-skills', title: 'Critical Thinking Skills for the Professional' },
    ],
    practice: [
      "Choose a problem at work and apply the 5 Whys technique to find the root cause",
      "Practice decision making by creating a pros/cons list for an upcoming choice",
      "Solve a logic puzzle or brain teaser daily for one week",
      "Analyze a recent mistake and create an action plan to prevent it in the future"
    ],
    aiPrompt: "critical thinking exercises for professionals"
  },
  {
    title: 'Time & Task Management',
    description: 'Master the art of managing your time and tasks efficiently.',
    icon: Clock,
    resources: [
      { type: 'YouTube Video', link: 'https://www.youtube.com/watch?v=JY_TnbI0hZI', title: 'Atomic Habits: How to Build Good Habits & Break Bad Ones' },
      { type: 'Book', link: 'https://www.goodreads.com/book/show/40121378-atomic-habits', title: 'Atomic Habits' },
      { type: 'Article', link: 'https://zenhabits.net/', title: 'Zen Habits on Productivity' },
      { type: 'App', link: 'https://todoist.com/', title: 'Todoist - Task Management App' },
    ],
    practice: [
      "Try the Pomodoro Technique (25 min work, 5 min break) for one day",
      "Create a weekly schedule with priorities and stick to it",
      "Identify and eliminate three time-wasting activities from your routine",
      "Practice saying 'no' to non-essential tasks for one week"
    ],
    aiPrompt: "productivity techniques for busy professionals"
  },
  {
    title: 'Professional & Workplace Etiquette',
    description: 'Understand the norms and behaviors expected in a professional setting.',
    icon: Briefcase,
    resources: [
      { type: 'YouTube Video', link: 'https://www.youtube.com/watch?v=5kFsp6aR-9g', title: 'Delivering Soft Skills Content Online' },
      { type: 'Article', link: 'https://www.dol.gov/agencies/odep/program-areas/individuals/youth/transition/soft-skills', title: 'Soft Skills to Pay the Bills' },
      { type: 'Book', link: 'https://www.goodreads.com/book/show/25776630-the-etiquette-advantage-in-business', title: 'The Etiquette Advantage in Business' },
      { type: 'Online Course', link: 'https://www.linkedin.com/learning/business-etiquette-phone-email-and-text', title: 'Business Etiquette: Phone, Email, and Text' },
    ],
    practice: [
      "Practice writing professional emails with clear subject lines and concise content",
      "Role-play a difficult conversation with a colleague or supervisor",
      "Attend a business networking event and practice your elevator pitch",
      "Shadow a respected colleague and observe their workplace interactions"
    ],
    aiPrompt: "professional etiquette in modern workplace tips"
  },
  {
    title: 'Digital & Tech Adaptability',
    description: 'Stay updated with the latest digital tools and adapt to technological changes.',
    icon: Globe,
    resources: [
      { type: 'Online Course', link: 'https://learndigital.withgoogle.com/digitalgarage', title: 'Google Digital Garage' },
      { type: 'Article', link: 'https://www.startupschool.org/', title: 'Startup School by Y Combinator' },
      { type: 'Podcast', link: 'https://a16z.com/podcasts/', title: 'a16z Podcast on Tech Trends' },
      { type: 'Newsletter', link: 'https://www.thehustle.co/', title: 'The Hustle - Tech & Business Newsletter' },
    ],
    practice: [
      "Learn a new digital tool or software that could improve your workflow",
      "Set up automated systems for repetitive digital tasks",
      "Create or update your LinkedIn profile to showcase digital skills",
      "Participate in an online forum or community related to your industry"
    ],
    aiPrompt: "staying current with technology trends exercises"
  },
  {
    title: 'Emotional Intelligence',
    description: 'Develop awareness of emotions and how they impact workplace interactions.',
    icon: BookOpen,
    resources: [
      { type: 'Book', link: 'https://www.goodreads.com/book/show/26329.Emotional_Intelligence', title: 'Emotional Intelligence by Daniel Goleman' },
      { type: 'YouTube Video', link: 'https://www.youtube.com/watch?v=n9h8fG1DKhA', title: 'The Power of Emotional Intelligence' },
      { type: 'Online Course', link: 'https://www.coursera.org/learn/emotional-intelligence-eq', title: 'Developing Your Emotional Intelligence' },
      { type: 'Assessment', link: 'https://www.mindtools.com/pages/article/ei-quiz.htm', title: 'Emotional Intelligence Self-Assessment' },
    ],
    practice: [
      "Keep an emotion journal for one week to track your feelings and responses",
      "Practice recognizing emotions in others during meetings",
      "Try meditation or mindfulness for managing emotional reactions",
      "Ask for feedback on how you handle stressful situations"
    ],
    aiPrompt: "emotional intelligence exercises for workplace"
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const SkillCard = ({ skill }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAIResults, setShowAIResults] = useState(false);
  const [aiResults, setAIResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAIResults = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(skill.aiPrompt)}`);
      const data = await response.text();
      // Parse the results into an array of tips
      const results = data.split('\n').filter(tip => tip.trim().length > 0);
      setAIResults(results.slice(0, 3)); // Limit to top 3 results
    } catch (error) {
      console.error("Error fetching AI results:", error);
      setAIResults(["Could not load AI-generated tips. Please try again later."]);
    }
    setIsLoading(false);
    setShowAIResults(true);
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      variants={itemVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <motion.div
            whileHover={{ scale: 1.2, rotate: 5 }}
            className="mr-3 p-2 bg-blue-100 rounded-full"
          >
            <skill.icon className="w-6 h-6 text-blue-600" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-800">{skill.title}</h3>
        </div>
        
        <p className="text-gray-700 mb-4">{skill.description}</p>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-blue-600 font-medium mb-2 hover:text-blue-800 transition-colors"
        >
          <span>View resources & practice exercises</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="ml-1 w-4 h-4" />
          </motion.div>
        </button>
        
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3"
          >
            <h4 className="font-semibold text-gray-800 mb-2">Learning Resources:</h4>
            <ul className="list-disc list-inside mb-4 space-y-1">
              {skill.resources.map((resource, idx) => (
                <li key={idx} className="text-gray-600">
                  <a 
                    href={resource.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    {resource.title} <span className="text-gray-500 text-sm ml-1">({resource.type})</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
              ))}
            </ul>
            
            <h4 className="font-semibold text-gray-800 mb-2">Practice Exercises:</h4>
            <ul className="space-y-2 mb-4">
              {skill.practice.map((exercise, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{exercise}</span>
                </li>
              ))}
            </ul>
            
            {!showAIResults ? (
              <button
                onClick={fetchAIResults}
                disabled={isLoading}
                className="flex items-center justify-center w-full py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-blue-700 border-t-transparent rounded-full"></div>
                    Loading AI tips...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Get AI-Powered Tips
                  </>
                )}
              </button>
            ) : (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">AI-Suggested Tips:</h4>
                <ul className="space-y-2">
                  {aiResults.map((tip, idx) => (
                    <li key={idx} className="bg-gray-50 p-3 rounded-md text-gray-700">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const SoftSkillsTracker = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-3">Your Soft Skills Progress</h3>
      <p className="text-gray-700 mb-4">Track your learning journey and practice sessions here.</p>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {skillsData.map((skill, idx) => (
          <div key={idx} className="bg-white rounded-lg p-3 text-center shadow">
            <skill.icon className="w-8 h-8 mx-auto text-blue-500 mb-2" />
            <h4 className="text-sm font-medium text-gray-800">{skill.title}</h4>
            <div className="mt-2 flex justify-center">
              <div className="bg-gray-200 h-2 w-16 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-green-500 h-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.floor(Math.random() * 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          Take Skills Assessment
        </button>
      </div>
    </div>
  );
};

const Skills = () => {
  return (
    <div className="bg-[#131830] min-h-screen">
      <div className="container mx-auto px-10 py-12">
        <Particles />
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
            Master Your Soft Skills
          </motion.h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Develop the essential human capabilities that will set you apart in any career path.
            Our interactive resources help you learn, practice, and apply crucial soft skills.
          </p>
        </motion.div>
        
        {/* Skills Grid */}
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {skillsData.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </motion.div>
        
        {/* Progress Tracker */}
        <SoftSkillsTracker />
        
        {/* Community Section */}
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6 mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Join Our Soft Skills Community</h2>
          <p className="text-gray-700 mb-6">
            Connect with others on their soft skills journey. Share experiences, participate in
            challenges, and get feedback from peers and mentors.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Weekly Challenges</h3>
              <p className="text-gray-600 text-sm">Put your skills to the test with guided weekly exercises</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Discussion Forums</h3>
              <p className="text-gray-600 text-sm">Ask questions and share insights with the community</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Expert Webinars</h3>
              <p className="text-gray-600 text-sm">Learn from industry professionals in live sessions</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors">
              Join Community
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Skills;