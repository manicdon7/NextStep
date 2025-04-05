import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, Award, RefreshCw, Sparkles, Circle, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import questions from "../json/questions.json";
import choices from "../json/choices.json";
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Theme colors
const THEME = {
  primary: '#AD46FF',
  secondary: '#0D1324',
  primaryLight: '#C278FF',
  secondaryLight: '#1E2942',
  text: {
    light: '#FFFFFF',
    dark: '#0D1324',
    muted: 'rgba(255, 255, 255, 0.7)'
  }
};

const PDFResult = ({ result, insights }) => (
  <div
    style={{
      padding: '40px',
      backgroundColor: '#ffffff',
      color: THEME.secondary,
      width: '800px',
      fontFamily: 'Arial, sans-serif'
    }}
  >
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '10px', color: THEME.primary }}>
        Next-Step Career Assessment
      </h1>
      <p style={{ color: '#666' }}>
        Generated on: {new Date().toLocaleDateString()}
      </p>
    </div>

    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ fontSize: '22px', color: THEME.secondary, marginBottom: '20px' }}>Career Matches</h2>
      {result?.domains?.map((domain, index) => (
        <div key={index} style={{
          marginBottom: '20px',
          padding: '15px',
          border: `1px solid ${THEME.primary}20`,
          borderRadius: '8px'
        }}>
          <h3 style={{ fontSize: '18px', color: THEME.primary, marginBottom: '10px' }}>{domain.name}</h3>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            {domain.keywords.join(' • ')}
          </p>
          <div style={{
            fontSize: '24px',
            color: THEME.secondary,
            fontWeight: 'bold'
          }}>
            {domain.score}% Match
          </div>
        </div>
      ))}
    </div>

    <div style={{ marginTop: '30px' }}>
      <h2 style={{ fontSize: '22px', color: THEME.secondary, marginBottom: '20px' }}>Career Insights</h2>
      <div style={{
        color: '#444',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap'
      }}>
        {insights}
      </div>
    </div>
  </div>
);

const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div className="bg-black/30 backdrop-blur-md p-8 rounded-2xl flex flex-col items-center border border-white/10">
      <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" style={{ color: THEME.primary }} />
      <p className="text-white text-lg font-medium">Analyzing your responses...</p>
      <p className="text-white/70 text-sm mt-2">This may take a few moments</p>
    </div>
  </motion.div>
);

const Kys = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [question, setQuestion] = useState([]);
  const [choice, setChoice] = useState([]);
  const [result, setResult] = useState(null);
  const [insights, setInsights] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const pdfRef = useRef(null);

  useEffect(() => {
    setQuestion(questions);
    setChoice(choices);
    
    // Set full screen styles
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = THEME.secondary;
    
    return () => {
      // Cleanup styles when component unmounts
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflow = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowLoadingScreen(true);
      calculateResults();
    }
  };

  const downloadPDF = async () => {
    if (!pdfRef.current) {
      console.error('PDF reference not found');
      return;
    }

    try {
      setIsLoading(true);

      // Configure html2canvas with optimal settings
      const canvas = await html2canvas(pdfRef.current, {
        scale: 1, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        removeContainer: true,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          // Ensure all styles are computed before capture
          const element = clonedDoc.querySelector('#pdf-content');
          if (element) {
            element.style.width = '800px';
            element.style.height = 'auto';
          }
        }
      });

      // Create PDF with proper dimensions
      const imgData = canvas.toDataURL('image/jpeg', 1.0); // Using JPEG instead of PNG
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      // Add content to PDF
      pdf.setFontSize(24);
      pdf.setTextColor(173, 70, 255); // THEME.primary
      pdf.text('Next-Step Career Assessment', pdfWidth / 2, 20, { align: 'center' });

      try {
        pdf.addImage(
          imgData,
          'JPEG',
          imgX,
          30, // Start after the title
          imgWidth * ratio,
          imgHeight * ratio
        );
      } catch (imageError) {
        console.error('Error adding image to PDF:', imageError);
        // Fallback to text-only PDF
        pdf.text('Error adding visual content. Please try again.', 20, 50);
      }

      // Save the PDF
      pdf.save(`next-step-career-assessment-${Date.now()}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating your PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAIInsights = async (topDomain, keywords) => {
    try {
      const prompt = `Evaluate the career of a ${topDomain} professional, emphasizing key strengths in ${keywords.join(', ')}. Offer actionable insights on career potential and growth opportunities in a natural, engaging manner.`;
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

      question.forEach(question => {
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

      setResult({ domains: finalResults, top_domain: topDomain.name });
      setInsights(aiInsight);
    } catch (error) {
      console.error('Error in calculation:', error);
      setInsights('Unable to generate insights at this time. Please try again later.');
    } finally {
      setIsLoading(false);
      setShowLoadingScreen(false);
    }
  };

  const QuestionCard = ({ question, onAnswer }) => (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      className="relative backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-md overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${THEME.secondaryLight}80, ${THEME.secondary}90)`,
        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3), 0 0 30px ${THEME.primary}30`
      }}
    >
      {/* Decorative elements */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl" 
           style={{ background: `radial-gradient(circle, ${THEME.primary}30, ${THEME.primary}10)` }} />
      <div className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full blur-2xl" 
           style={{ background: `radial-gradient(circle, ${THEME.primary}20, ${THEME.secondary}20)` }} />

      {/* Question header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-xl p-2 shadow-lg" style={{ background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.primaryLight})` }}>
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: THEME.primary }} />
            <span className="text-sm font-medium" style={{ color: THEME.primary }}> Next-Step AI Assessment</span>
          </div>
          <span className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {questions?.length || 0}
          </span>
        </div>
      </div>

      {/* Question content */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-3 leading-tight text-white">
          {question.text}
        </h2>
        {question.subtext && (
          <p className="text-gray-300">{question.subtext}</p>
        )}
      </div>

      {/* Choices */}
      <div className="space-y-3">
        {choice.map((choice, index) => (
          <motion.button
            key={choice.value}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onAnswer(question.id, choice.value)}
            className="w-full backdrop-blur-sm py-4 px-6 rounded-xl transition-all duration-200 flex items-center gap-4 group hover:shadow-lg"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              borderColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: THEME.text.light
            }}
          >
            <Circle className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
            <span className="flex-1 text-left">{choice.label}</span>
            <ChevronRight
              className="w-5 h-5 transform group-hover:translate-x-1 transition-all"
              style={{ color: 'rgba(255, 255, 255, 0.4)' }}
            />
          </motion.button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <motion.div
          className="h-1 rounded-full"
          style={{ background: `linear-gradient(to right, ${THEME.primary}, ${THEME.primaryLight})` }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: (currentQuestion + 1) / (questions?.length || 1) }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );

  const ResultCard = ({ result, insights, isLoading }) => (
    <>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="backdrop-blur-lg p-8 rounded-xl shadow-xl border border-white/10 w-full max-w-4xl"
        style={{ 
          background: `linear-gradient(135deg, ${THEME.secondaryLight}90, ${THEME.secondary}95)`,
          boxShadow: `0 10px 30px rgba(0, 0, 0, 0.2), 0 0 20px ${THEME.primary}20`
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Award className="w-10 h-10" style={{ color: THEME.primary }} />
            <div>
              <h3 className="text-3xl font-bold text-white">Your Career Path</h3>
              <p className="text-gray-300 mt-1">Based on your responses and AI analysis</p>
            </div>
          </div>
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6" style={{ color: THEME.primary }} />
            <span className="text-xl font-bold" style={{ 
              background: `linear-gradient(to right, ${THEME.primary}, ${THEME.primaryLight})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Next-Step
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto p-4">
          {/* Score Cards */}
          <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${THEME.primary}20, transparent)` }} />
            <div className="relative p-4">
              <h2 className="text-xl font-bold mb-4 text-white">Career Matches</h2>
              <div className="h-[400px] overflow-y-auto pr-4 space-y-4 scrollbar-thin">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {result?.domains?.map((domain, index) => (
                      <div
                        key={index}
                        className="backdrop-blur-sm rounded-lg p-4 shadow-sm border"
                        style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <h3 className="font-semibold text-white text-lg">{domain.name}</h3>
                        <p className="text-sm text-gray-300 mt-1">
                          {domain.keywords.join(' • ')}
                        </p>
                        <div className="mt-2 flex items-center">
                          <span className="text-2xl font-bold" style={{ color: THEME.primary }}>{domain.score}%</span>
                          <span className="ml-2 text-sm text-gray-300">Match</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${THEME.primary}20, transparent)` }} />
            <div className="relative p-4">
              <h2 className="text-xl font-bold mb-4 text-white">Career Insights</h2>
              <div className="h-[400px] overflow-y-auto pr-4 scrollbar-thin">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="prose prose-sm prose-invert">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="text-gray-300 leading-relaxed mb-4">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <span className="font-semibold text-white">{children}</span>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xl font-semibold text-white mb-3">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-semibold text-white mb-2">{children}</h3>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>
                        ),
                        li: ({ children }) => (
                          <li className="text-gray-300">{children}</li>
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

        <div className="flex gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadPDF}
            disabled={isLoading}
            className="flex-1 text-white py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 font-medium disabled:opacity-50 cursor-pointer"
            style={{ 
              background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.primaryLight})`,
              boxShadow: `0 4px 10px ${THEME.primary}40`
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download Report</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="flex-1 text-white py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 font-medium cursor-pointer"
            style={{ 
              backgroundColor: THEME.secondaryLight,
              border: `1px solid ${THEME.primary}40`,
            }}
          >
            <RefreshCw className="w-5 h-5" />
            <span>Start New Assessment</span>
          </motion.button>
        </div>
      </motion.div>
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={pdfRef} id="pdf-content">
          <PDFResult result={result} insights={insights} />
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" 
         style={{ 
           background: `radial-gradient(circle at top right, ${THEME.secondaryLight}, ${THEME.secondary})`,
           height: '100vh',
           width: '100vw',
           margin: 0,
           padding: 0,
           overflow: 'hidden'
         }}>
      <AnimatePresence mode="wait">
        {showLoadingScreen && !result && (
          <LoadingScreen key="loading" />
        )}
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

export default Kys;