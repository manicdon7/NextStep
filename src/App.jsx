import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Brain, ChevronRight, Award, RefreshCw } from 'lucide-react';

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

  const calculateResults = () => {
    setIsLoading(true);
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
    
    const aiInsight = `Based on your responses, you show exceptional potential in ${topDomain.name}. Your strengths in ${topDomain.keywords.join(', ')} suggest you would excel in this field. Consider exploring career paths that leverage these skills.`;
    
    setResult({ domains: finalResults, top_domain: topDomain.name });
    setInsights(aiInsight);
    setIsLoading(false);
  };

  const QuestionCard = ({ question, onAnswer }) => (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="relative backdrop-blur-lg bg-white/30 p-8 rounded-xl shadow-xl border border-white/20 w-full max-w-md"
    >
      <div className="absolute -top-4 -right-4 bg-blue-500 rounded-full p-2">
        <Brain className="w-6 h-6 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold mb-3 text-gray-800">{question.text}</h2>
      <p className="text-gray-600 mb-6">{question.subtext}</p>
      
      <div className="space-y-3">
        {choices.map((choice) => (
          <motion.button
            key={choice.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(question.id, choice.value)}
            className="w-full backdrop-blur-sm bg-white/50 hover:bg-white/70 text-gray-800 py-3 px-6 rounded-lg border border-white/20 transition-all duration-200 flex items-center justify-between group"
          >
            <span>{choice.label}</span>
            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
          </motion.button>
        ))}
      </div>
      
      <div className="mt-6 flex justify-between items-center text-gray-500">
        <span>Question {currentQuestion + 1} of {questions.length}</span>
        <motion.div 
          className="h-2 bg-blue-200 rounded-full w-32"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentQuestion + 1) / questions.length }}
        />
      </div>
    </motion.div>
  );

  const ResultCard = ({ result, insights }) => (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="backdrop-blur-lg bg-white/30 p-8 rounded-xl shadow-xl border border-white/20 w-full max-w-md"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Your Career Path</h3>
        <Award className="w-8 h-8 text-blue-500" />
      </div>

      <div className="space-y-4">
        {result.domains.map((domain) => (
          <motion.div
            key={domain.name}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            className="relative bg-white/50 p-4 rounded-lg"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">{domain.name}</span>
              <span className="text-blue-600 font-bold">{domain.score}%</span>
            </div>
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${domain.score}%` }}
              transition={{ delay: 0.5 }}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 p-6 backdrop-blur-md bg-white/40 rounded-lg border border-white/30"
      >
        <div className="flex items-start space-x-3">
          <MessageSquare className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
          <p className="text-gray-700 leading-relaxed">{insights}</p>
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => window.location.reload()}
        className="mt-6 w-full bg-blue-500 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors duration-200"
      >
        <RefreshCw className="w-5 h-5" />
        <span>Start Over</span>
      </motion.button>
    </motion.div>
  );

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
          <ResultCard key="result" result={result} insights={insights} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerQuiz;