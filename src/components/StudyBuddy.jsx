import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, BookOpen, Sparkles, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Particles } from './Particles';
import { Link, useLocation , useNavigate } from 'react-router-dom';
import { saveMessages, loadMessages } from "./ChatStorage";



const TypingIndicator = () => (
  <div className="flex space-x-2 p-2">
    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

const StudyBuddy = () => {
  const location = useLocation();
  const [messages, setMessages] = useState(location.state?.messages || loadMessages());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    saveMessages(messages);
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  // Adjust textarea height
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleFullscreen = () => {
    navigate("/#chat", { state: { messages } });
  };

  // ... (previous imports and component code remains the same)

  const encodePrompt = (text) => {
    return encodeURIComponent(`
      You are a friendly, enthusiastic, and supportive tutor who loves helping students learn. 
      Your name is Study Buddy and you have a warm, encouraging personality.
      
      Guidelines for your response:
      1. Start with a warm greeting or acknowledgment
      2. Use emojis occasionally to convey friendliness (but don't overuse them)
      3. Format your response using markdown:
         - Use ## for main topics
         - Use ### for subtopics
         - Use ** for important terms or emphasis
         - Use bullet points (*) for lists
         - Use > for important notes or tips
      4. Break down complex topics into simple explanations
      5. End with an encouraging note or gentle question to keep the conversation going
      6. Keep your tone casual but educational
      
      Make your response sound natural and conversational, like a knowledgeable friend explaining something over coffee.
      If appropriate, share a brief interesting fact or real-world example to make the topic more engaging.
      
      Remember to:
      - Be supportive and patient
      - Celebrate small victories and understanding
      - Acknowledge the complexity of topics when relevant
      - Use phrases like "Let's explore this together" or "Think of it this way"
      
      Format everything as markdown and structure your response clearly.
      
      The student asked: ${text}
      
      Respond in a friendly, clear, and structured way while maintaining educational value.
    `);
  };


  const getAIResponse = async (userInput) => {
    try {
      const encodedPrompt = encodePrompt(userInput);
      const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return "## Oops! 🤔\n\nI apologize, but I'm having trouble connecting right now. Could you please try asking your question again?";
    }
  };

  const simulateTyping = async (text) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const aiMessage = {
      role: 'ai',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMessage]);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const aiResponse = await getAIResponse(input.trim());
    await simulateTyping(aiResponse);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (

      <div className="relative overflow-hidden">
        <Particles />
        <div className="p-4 md:p-6">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-purple-400" />
            <span className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Next-Step
            </span>
          </Link>
        </div>
        <div className="max-w-6xl mx-auto p-4 sm:p-6 h-[600px] flex flex-col">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-violet-600 via-purple-500 to-violet-400 p-4 sm:p-6">
              <div className='flex justify-between'>
              <div className="flex items-center space-x-4">
                <div className="bg-violet-400 p-3 rounded-xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className=''>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    Study Buddy
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </h2>
                  <p className="text-blue-100 text-sm sm:text-base">Your intelligent learning companion</p>
                </div>
              </div>
              <button
               onClick={handleFullscreen}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <Minimize2 className="w-10 h-8" />
                </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8 p-6 bg-white/50 rounded-2xl backdrop-blur-sm">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-violet-500" />
                  <p className="text-xl font-medium text-violet-600 mb-2">Welcome to Study Buddy AI! 👋</p>
                  <p className="text-gray-600">I'm here to help you learn and understand any subject. Ask me anything!</p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start max-w-[85%] space-x-2 ${msg.role === 'user' ? 'flex-row-reverse gap-2' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-violet-500' : 'bg-purple-500'
                      }`}>
                      {msg.role === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-8 h-6 text-white" />
                      )}
                    </div>
                    <div
                      style={{ borderRadius: msg.role === "user" ? "20px 0px 20px 20px" : "0px 20px 20px 20px" }}
                      className={`p-4 mt-5 ${msg.role === 'user'
                          ? 'bg-violet-500 text-white'
                          : 'bg-violet-200 shadow-md text-gray-800'
                        }`}
                    >
                      {msg.role === 'ai' ? (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.text}</p>
                      )}
                      <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-indigo-200' : 'text-gray-400'
                        }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl p-3 shadow-md">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input Area */}
            <div className="p-4 bg-white border-t border-gray-100" id='scroll-container'>
              <div className="flex items-end space-x-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything about your studies..."
                  className="flex-1 text-gray-800 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none max-h-32 bg-gray-50"
                  rows="1"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className={`p-4 rounded-xl ${loading || !input.trim()
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                    } transition-all duration-200 ease-in-out`}
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <footer className="py-6 text-center text-gray-400 text-sm">
        <p>NextStep © {new Date().getFullYear()} | Expand your knowledge and skills</p>
      </footer> */}
      </div>
 
  );
};

export default StudyBuddy;