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
      padding: "40px",
      backgroundColor: "#ffffff",
      color: THEME.secondary,
      width: "800px",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <div style={{ textAlign: "center", marginBottom: "30px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "10px", color: THEME.primary }}>Next-Step Career Assessment</h1>
      <p style={{ color: "#666" }}>Generated on: {new Date().toLocaleDateString()}</p>
    </div>

    <div style={{ marginBottom: "30px" }}>
      <h2 style={{ fontSize: "22px", color: THEME.secondary, marginBottom: "20px" }}>Career Matches</h2>
      {result?.domains?.map((domain, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: `1px solid ${THEME.primary}20`,
            borderRadius: "8px",
          }}
        >
          <h3 style={{ fontSize: "18px", color: THEME.primary, marginBottom: "10px" }}>{domain.name}</h3>
          <p style={{ color: "#666", marginBottom: "10px" }}>{domain.keywords.join(" • ")}</p>
          <div
            style={{
              fontSize: "24px",
              color: THEME.secondary,
              fontWeight: "bold",
            }}
          >
            {domain.score}% Match
          </div>
        </div>
      ))}
    </div>

    <div style={{ marginTop: "30px" }}>
      <h2
        style={{
          fontSize: "22px",
          color: THEME.secondary,
          marginBottom: "20px",
          fontWeight: "bold",
          borderBottom: `2px solid ${THEME.primary}`,
          paddingBottom: "10px",
        }}
      >
        Career Insights
      </h2>
      <div
        style={{
          color: "#444",
          lineHeight: "1.6",
          whiteSpace: "pre-wrap",
          padding: "15px",
          border: `1px solid ${THEME.primary}20`,
          borderRadius: "8px",
        }}
      >
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
      setIsLoading(true)
  
      // Create PDF with proper dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })
  
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
  
      // Create separate elements for each page
      const pageElements = []
  
      // Page 1: Title and introduction
      const titlePage = document.createElement("div")
      titlePage.style.width = "794px"
      titlePage.style.height = "1123px"
      titlePage.style.padding = "40px"
      titlePage.style.backgroundColor = "#ffffff"
      titlePage.style.position = "relative"
      titlePage.style.border = `5px solid ${THEME.primary}`
      titlePage.style.boxSizing = "border-box"
      titlePage.innerHTML = `
        <div style="text-align: center; margin-top: 350px;">
          <h1 style="font-size: 32px; margin-bottom: 10px; color: ${THEME.primary}">Next-Step Career Assessment</h1>
          <p style="color: #666;">Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <div style="margin-top: 50px; text-align: center;">
          <p style="font-size: 18px; color: #444; margin-bottom: 20px;">
            This report contains your personalized career assessment results based on your responses.
          </p>
          <p style="font-size: 16px; color: #666;">
            The following pages contain your Career Matches and detailed Career Insights.
          </p>
        </div>
        <div style="position: absolute; bottom: 20px; text-align: center; width: calc(100% - 80px);">
          <p style="color: #888; font-size: 12px;">Page 1</p>
        </div>
      `
      pageElements.push(titlePage)
  
      // Career Matches - Split across multiple pages if needed
      if (result?.domains && result.domains.length > 0) {
        // Changed from 3 to 5 career matches per page
        const domainsPerPage = 5 
        const totalDomainPages = Math.ceil(result.domains.length / domainsPerPage)
  
        for (let pageIndex = 0; pageIndex < totalDomainPages; pageIndex++) {
          const startIdx = pageIndex * domainsPerPage
          const endIdx = Math.min(startIdx + domainsPerPage, result.domains.length)
          const currentPageDomains = result.domains.slice(startIdx, endIdx)
  
          const matchesPage = document.createElement("div")
          matchesPage.style.width = "794px"
          matchesPage.style.height = "1123px"
          matchesPage.style.padding = "40px"
          matchesPage.style.backgroundColor = "#ffffff"
          matchesPage.style.position = "relative"
          matchesPage.style.border = `5px solid ${THEME.primary}`
          matchesPage.style.boxSizing = "border-box"
  
          let matchesHTML = `
            <h2 style="font-size: 24px; color: ${THEME.secondary}; margin-bottom: 30px; border-bottom: 2px solid ${THEME.primary}; padding-bottom: 10px;">
              ${pageIndex === 0 ? "Career Matches" : "Career Matches"}
            </h2>
          `
  
          // Add each domain for this page
          currentPageDomains.forEach((domain) => {
            // Adjusted margin and padding slightly to fit 5 items
            matchesHTML += `
              <div style="margin-bottom: 20px; padding: 15px; border: 1px solid ${THEME.primary}20; border-radius: 8px; background-color: #fafafa;">
                <h3 style="font-size: 20px; color: ${THEME.primary}; margin-bottom: 10px;">${domain.name}</h3>
                <p style="color: #666; margin-bottom: 10px; font-size: 14px;">${domain.keywords.join(" • ")}</p>
                <div style="font-size: 24px; color: ${THEME.secondary}; font-weight: bold;">
                  ${domain.score}% Match
                </div>
              </div>
            `
          })
  
          // Add page number
          const pageNum = pageIndex + 2 // +2 because title page is page 1
          matchesHTML += `
            <div style="position: absolute; bottom: 20px; text-align: center; width: calc(100% - 80px);">
              <p style="color: #888; font-size: 12px;">Page ${pageNum}</p>
            </div>
          `
  
          matchesPage.innerHTML = matchesHTML
          pageElements.push(matchesPage)
        }
      }
  
      // Calculate the starting page number for insights
      const insightsStartPage = pageElements.length + 1
  
      // Career Insights - Split across multiple pages if needed
      if (insights) {
        // Function to convert markdown to HTML
        const convertMarkdownToHTML = (text) => {
          // Convert headings (### Heading)
          text = text.replace(/###\s+([^\n]+)/g, '<h3 style="font-size: 18px; font-weight: bold; margin-top: 15px; margin-bottom: 10px; color: ' + THEME.secondary + ';">$1</h3>');
          text = text.replace(/##\s+([^\n]+)/g, '<h2 style="font-size: 20px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; color: ' + THEME.secondary + ';">$1</h2>');
          text = text.replace(/#\s+([^\n]+)/g, '<h1 style="font-size: 22px; font-weight: bold; margin-top: 25px; margin-bottom: 15px; color: ' + THEME.secondary + ';">$1</h1>');
          
          // Convert bold (**text**)
          text = text.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight: bold;">$1</strong>');
          
          // Convert italic (*text*)
          text = text.replace(/\*([^*]+)\*/g, '<em style="font-style: italic;">$1</em>');
          
          
          // Convert lists
          text = text.replace(/^\s*-\s+(.+)$/gm, '<li style="margin-bottom: 5px;">$1</li>');
          text = text.replace(/(<li[^>]*>[\s\S]*?<\/li>)/g, '<ul style="margin-top: 10px; margin-bottom: 10px; padding-left: 20px;">$1</ul>');
          
          // Convert paragraphs (double line breaks)
          text = text.replace(/\n\n/g, '</p><p style="margin-bottom: 15px; line-height: 1.6;">');
          
          // Wrap with paragraph tags if not already done
          if (!text.startsWith('<')) {
            text = '<p style="margin-bottom: 15px; line-height: 1.6;">' + text;
          }
          if (!text.endsWith('>')) {
            text += '</p>';
          }
          
          return text;
        };
  
        // Split insights into chunks by paragraphs for better pagination
        const splitInsightsIntoParagraphs = (text) => {
          // Split by double line breaks (paragraphs)
          const paragraphs = text.split(/\n\n+/);
          const chunks = [];
          let currentChunk = [];
          let currentLength = 0;
          
          // Target size for each chunk (in characters)
          const targetChunkSize = 2500;
          
          paragraphs.forEach(paragraph => {
            // If adding this paragraph would exceed our target size and we already have content
            if (currentLength + paragraph.length > targetChunkSize && currentLength > 0) {
              // Save current chunk and start a new one
              chunks.push(currentChunk.join('\n\n'));
              currentChunk = [paragraph];
              currentLength = paragraph.length;
            } else {
              // Add to current chunk
              currentChunk.push(paragraph);
              currentLength += paragraph.length + 2; // +2 for the line breaks
            }
          });
          
          // Add the last chunk if not empty
          if (currentChunk.length > 0) {
            chunks.push(currentChunk.join('\n\n'));
          }
          
          return chunks.length > 0 ? chunks : [text]; // Return the original text if no chunks were created
        };
        
        // Format insights text with proper HTML formatting and split into chunks
        const insightsText = insights || "";
        const chunks = splitInsightsIntoParagraphs(insightsText);
        
        // Create pages for insights
        for (let i = 0; i < chunks.length; i++) {
          const chunkFormatted = convertMarkdownToHTML(chunks[i]);
          
          const insightsPage = document.createElement("div");
          insightsPage.style.width = "794px";
          insightsPage.style.height = "1123px";
          insightsPage.style.padding = "40px";
          insightsPage.style.backgroundColor = "#ffffff";
          insightsPage.style.position = "relative";
          insightsPage.style.border = `5px solid ${THEME.primary}`;
          insightsPage.style.boxSizing = "border-box";
  
          const pageTitle = "Career Insights";
          
          insightsPage.innerHTML = `
            <h2 style="font-size: 24px; color: ${THEME.secondary}; margin-bottom: 20px; border-bottom: 2px solid ${THEME.primary}; padding-bottom: 10px;">
              ${pageTitle}
            </h2>
            <div style="color: #444; line-height: 1.6; font-size: 15px; display: flex; flex-direction: column; min-height: 900px;">
              ${chunkFormatted}
            </div>
            <div style="position: absolute; bottom: 20px; text-align: center; width: calc(100% - 80px);">
              <p style="color: #888; font-size: 12px;">Page ${insightsStartPage + i}</p>
            </div>
          `;
          pageElements.push(insightsPage);
        }
      }
  
      // Process each page element and add to PDF
      for (let i = 0; i < pageElements.length; i++) {
        const pageElement = pageElements[i];
  
        // Temporarily add to document for rendering
        document.body.appendChild(pageElement);
  
        // If not the first page, add a new page to PDF
        if (i > 0) {
          pdf.addPage();
        }
  
        // Render the page to canvas
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });
  
        // Add to PDF
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
  
        // Remove the temporary element
        document.body.removeChild(pageElement);
      }
  
      // Save the PDF
      pdf.save(`next-step-career-assessment-${Date.now()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating your PDF. Please try again.");
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
              cursor: isLoading ? "not-allowed" : "pointer",
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