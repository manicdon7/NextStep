
import Kys from "./components/Kys"
import LandingPage from "./pages/LandingPage"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import LoginPage from "./pages/LoginPage";


const App = () => {
  return (
    // <div>
    //   {/* <Kys/> */}
    //   <LandingPage/>
    // </div>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
