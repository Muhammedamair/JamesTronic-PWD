import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';

function HomePage() {
  return (
    <div>
      <h1>Welcome to JamesTronic PWA</h1>
      <Link to="/register">Go to Registration</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </Router>
  )
}

export default App;
