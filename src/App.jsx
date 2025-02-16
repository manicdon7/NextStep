import Chat from "./components/Chat"
import Kys from "./components/Kys"
import LandingPage from "./pages/LandingPage"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import Skills from "./components/Skills";


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/chat" element={<Chat/>} />
          <Route path="/kys" element={<Kys/>} />
          <Route path="/skills" element={<Skills/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
