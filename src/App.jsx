import Chat from "./components/Chat"
import Kys from "./components/Kys"
import LandingPage from "./pages/LandingPage"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import StudyBuddy from "./components/StudyBuddy";
import Skills from "./components/Skills";
import Tys from "./components/Tys";
import PrivateRoute from "./components/PrivateRoute";
import NotFoundPage from "./components/NotFoundPage";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/study-buddy" element={
            <PrivateRoute>
              <StudyBuddy />
            </PrivateRoute>
          } />
          <Route path="/kys" element={
            <PrivateRoute>
              <Kys />
            </PrivateRoute>
          } />
          <Route path="/skills" element={
            <PrivateRoute>
              <Skills />
            </PrivateRoute>
          } />
          <Route path="/tys" element={
            <PrivateRoute>
              <Tys />
            </PrivateRoute>
          } />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App