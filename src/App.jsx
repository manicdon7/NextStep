import { useState } from "react";
import axios from "axios";
const questions = [
  {
    id: 1,
    text: "How much do you enjoy solving complex problems?",
    domains: [
      { name: "Computer Science", weight: 1 },
      { name: "Engineering", weight: 0.8 },
    ],
  },
  {
    id: 2,
    text: "Do you prefer working with visual elements over textual content?",
    domains: [
      { name: "Artist", weight: 1 },
      { name: "Designer", weight: 0.9 },
    ],
  },
  {
    id: 3,
    text: "How comfortable are you with public speaking?",
    domains: [
      { name: "Teaching", weight: 1 },
      { name: "Management", weight: 0.7 },
    ],
  },
  {
    id: 4,
    text: "Do you enjoy creating music or singing?",
    domains: [
      { name: "Singer", weight: 1 },
      { name: "Artist", weight: 0.6 },
    ],
  },
  {
    id: 5,
    text: "How good are you at organizing and planning tasks?",
    domains: [
      { name: "Management", weight: 1 },
      { name: "Teaching", weight: 0.5 },
    ],
  },
  {
    id: 6,
    text: "Do you enjoy designing user interfaces or graphics?",
    domains: [
      { name: "Designer", weight: 1 },
      { name: "Artist", weight: 0.8 },
    ],
  },

];
const choices = [
  { value: 1, label: "Not at all" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Often" },
  { value: 5, label: "Always" },
];
export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };
  const analyzeResults = async () => {
    setIsLoading(true);
    const prompt = `Calculate domain expertise percentages based on these rules:
  
    **Scoring System:**
    1. For each question answer (1-5 scale):
       - Multiply answer value by domain weight
       - Sum values per domain
    2. Max possible score per domain = 5 * (sum of weights for all its questions)
    3. Percentage = (Actual Score / Max Score) * 100
  
    **Data:**
    Questions: ${JSON.stringify(questions, null, 2)}
    Answers: ${JSON.stringify(answers, null, 2)}
  
    **Required Output:**
    {
      "domains": [
        {"name": "Computer Science", "score": 85},
        {"name": "Teaching", "score": 70},
        {"name": "Artist", "score": 60},
        {"name": "Singer", "score": 50},
        {"name": "Management", "score": 80},
        {"name": "Designer", "score": 75}
      ],
      "top_domain": "Computer Science"
    }
  
    Return ONLY valid JSON, no additional text.`;
  
    try {
      const response = await axios.get(`https://text.pollinations.ai/${prompt}`)
      console.log(response.data);
      
      setResult(response.data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to fetch results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {!result ? (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {questions[currentQuestion].text}
          </h2>
          <div className="space-y-4">
            {choices.map((choice) => (
              <button
                key={choice.value}
                onClick={() =>
                  handleAnswer(questions[currentQuestion].id, choice.value)
                }
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
              >
                {choice.label}
              </button>
            ))}
          </div>
          {currentQuestion === questions.length - 1 && (
            <button
              onClick={analyzeResults}
              disabled={isLoading}
              className="w-full mt-6 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
            >
              {isLoading ? "Analyzing..." : "Get Results"}
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Your Top Domain: {result.top_domain}
          </h3>
          <div className="space-y-4">
            {result.domains &&
              result.domains.map((domain) => (
                <div
                  key={domain.name}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded"
                >
                  <span className="font-medium">{domain.name}</span>
                  <span className="text-blue-600 font-bold">
                    {domain.score}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}


