import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Brain, ChevronRight, Award, RefreshCw, Sparkles, Circle  } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const questions = [
  {
    id: 1,
    text: "How much do you enjoy solving complex problems?",
    subtext: "Think about times when you've faced challenging puzzles or technical issues.",
    domains: [
      { name: "Computer Science", weight: 1, keywords: ["programming", "algorithms", "problem-solving"] },
      { name: "Engineering", weight: 0.8, keywords: ["technical", "analytical", "systematic"] }
    ]
  },
  {
    id: 2,
    text: "Do you prefer working with visual elements over textual content?",
    subtext: "Consider your preference for design and visual communication.",
    domains: [
      { name: "Artist", weight: 1, keywords: ["creative", "visual", "aesthetic"] },
      { name: "Designer", weight: 0.9, keywords: ["layout", "composition", "visual-thinking"] }
    ]
  },
  {
    id: 3,
    text: "How comfortable are you with public speaking?",
    subtext: "Think about presenting to groups or leading discussions.",
    domains: [
      { name: "Teaching", weight: 1, keywords: ["communication", "presentation", "leadership"] },
      { name: "Management", weight: 0.7, keywords: ["leadership", "communication", "confidence"] }
    ]
  },
  {
    id: 4,
    text: "Do you enjoy creating music or singing?",
    subtext: "Consider your interest in musical expression and performance.",
    domains: [
      { name: "Singer", weight: 1, keywords: ["musical", "performance", "artistic"] },
      { name: "Artist", weight: 0.6, keywords: ["creative", "expressive", "performance"] }
    ]
  },
  {
    id: 5,
    text: "How good are you at organizing and planning tasks?",
    subtext: "Think about your ability to manage projects and deadlines.",
    domains: [
      { name: "Management", weight: 1, keywords: ["organization", "planning", "leadership"] },
      { name: "Teaching", weight: 0.5, keywords: ["structure", "planning", "organization"] }
    ]
  }
];

const choices = [
  { value: 1, label: "Not at all" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Always" }
];

const CareerQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [insights, setInsights] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const getAIInsights = async (topDomain, keywords) => {
    try {
      const prompt = `Career analysis for ${topDomain} professional: Key strengths in ${keywords.join(', ')}. Focus on career potential and growth opportunities.`;
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain'
        }
      });
      console.log(encodeURIComponent(prompt));
      
      console.log(response, response.ok);
      
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      console.log(text);
      
      
      // // Extract the main content without markdown formatting
      // const cleanedText = text
      //   .replace(/^###|##|#/gm, '') // Remove markdown headers
      //   .replace(/\*\*/g, '')        // Remove bold markers
      //   .replace(/\n+/g, ' ')        // Replace multiple newlines with space
      //   .replace(/\s+/g, ' ')        // Normalize spaces
      //   .trim();                     // Remove extra whitespace
      
      // // Take the first few sentences for a concise insight
      // const sentences = cleanedText.split(/[.!?]+\s+/);
      // const summary = sentences.slice(0, 3).join('. ') + '.';
      
      return text;
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      return `Your profile shows strong alignment with ${topDomain}. Your key strengths in ${keywords.join(', ')} suggest excellent potential in this field.`;
    }
  };

  const calculateResults = async () => {
    setIsLoading(true);
    try {
      let domainScores = {};
      let domainMaxScores = {};
      let domainKeywords = {};

      questions.forEach(question => {
        const answerValue = answers[question.id] || 1;
        question.domains.forEach(domain => {
          domainScores[domain.name] = (domainScores[domain.name] || 0) + answerValue * domain.weight;
          domainMaxScores[domain.name] = (domainMaxScores[domain.name] || 0) + 5 * domain.weight;
          domainKeywords[domain.name] = [...(domainKeywords[domain.name] || []), ...domain.keywords];
        });
      });

      let finalResults = Object.keys(domainScores).map(domain => ({
        name: domain,
        score: Math.round((domainScores[domain] / domainMaxScores[domain]) * 100),
        keywords: [...new Set(domainKeywords[domain])]
      }));

      finalResults.sort((a, b) => b.score - a.score);
      const topDomain = finalResults[0];
      
      const aiInsight = await getAIInsights(topDomain.name, topDomain.keywords);
      console.log("aiinsight:", aiInsight);
      
      setResult({ domains: finalResults, top_domain: topDomain.name });
      setInsights(aiInsight);
    } catch (error) {
      console.error('Error in calculation:', error);
      setInsights('Unable to generate insights at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const QuestionCard = ({ question, onAnswer }) => (
    <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -20, opacity: 0 }}
    className="relative backdrop-blur-xl bg-gradient-to-br from-white/40 to-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md overflow-hidden"
  >
    {/* Decorative elements */}
    <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
    <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl" />
    
    {/* Question header */}
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-2 shadow-lg">
        <Brain className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-500">AI Assessment</span>
        </div>
        <span className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions?.length || 0}
        </span>
      </div>
    </div>

    {/* Question content */}
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-3 text-gray-800 leading-tight">
        {question.text}
      </h2>
      {question.subtext && (
        <p className="text-gray-600">{question.subtext}</p>
      )}
    </div>

    {/* Choices */}
    <div className="space-y-3">
      {choices.map((choice, index) => (
        <motion.button
          key={choice.value}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onAnswer(question.id, choice.value)}
          className="w-full backdrop-blur-sm bg-white/60 text-gray-800 py-4 px-6 rounded-xl border border-white/20 transition-all duration-200 flex items-center gap-4 group hover:shadow-lg"
        >
          <Circle className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <span className="flex-1 text-left">{choice.label}</span>
          <ChevronRight 
            className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" 
          />
        </motion.button>
      ))}
    </div>

    {/* Progress bar */}
    <div className="mt-8">
      <motion.div 
        className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: (currentQuestion + 1) / (questions?.length || 1) }}
        transition={{ duration: 0.5 }}
      />
    </div>
  </motion.div>
  );

  const ResultCard = ({ result, insights, isLoading }) => (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="backdrop-blur-lg bg-white/30 p-8 rounded-xl shadow-xl border border-white/20 w-full max-w-4xl"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Award className="w-10 h-10 text-blue-500" />
          <div>
            <h3 className="text-3xl font-bold text-gray-800">Your Career Path</h3>
            <p className="text-gray-600 mt-1">Based on your responses and AI analysis</p>
          </div>
        </div>
        <Sparkles className="w-6 h-6 text-yellow-500" />
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto p-4">
      {/* Score Cards */}
      <div className="relative rounded-lg overflow-hidden bg-white shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-20" />
        <div className="relative p-4">
          <h2 className="text-xl font-bold mb-4">Career Matches</h2>
          <div className="h-[400px] overflow-y-auto pr-4 space-y-4 scrollbar-thin">
            {result?.domains?.map((domain, index) => (
              <div 
                key={index}
                className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-100"
              >
                <h3 className="font-semibold text-lg">{domain.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {domain.keywords.join(' • ')}
                </p>
                <div className="mt-2 flex items-center">
                  <span className="text-2xl font-bold">{domain.score}%</span>
                  <span className="ml-2 text-sm">Match</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="relative rounded-lg overflow-hidden bg-white shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 opacity-20" />
      <div className="relative p-4">
        <h2 className="text-xl font-bold mb-4">Career Insights</h2>
        <div className="h-[400px] overflow-y-auto pr-4 scrollbar-thin">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="prose prose-sm">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <span className="font-semibold text-gray-800">{children}</span>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{children}</h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700">{children}</li>
                  ),
                }}
              >
                {insights}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => window.location.reload()}
        className="mt-8 w-full bg-blue-500 text-white py-4 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors duration-200 font-medium"
      >
        <RefreshCw className="w-5 h-5" />
        <span>Start New Assessment</span>
      </motion.button>
    </motion.div>
  );
  
  // Return statement remains the same
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!result ? (
          <QuestionCard
            key="question"
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
          />
        ) : (
          <ResultCard 
            key="result" 
            result={result} 
            insights={insights}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerQuiz;