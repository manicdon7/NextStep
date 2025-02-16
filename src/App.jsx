import Chat from "./components/Chat"
import Kys from "./components/Kys"
import LandingPage from "./pages/LandingPage"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import StudyBuddy from "./components/StudyBuddy";
import Skills from "./components/Skills";


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/chat" element={<StudyBuddy/>} />
          <Route path="/kys" element={<Kys/>} />
          <Route path="/skills" element={<Skills/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
