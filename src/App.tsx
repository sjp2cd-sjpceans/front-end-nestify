import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Authentication from './pages/Authentication';
import './App.css';

function App() {
  return (
    <Router>
    <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/signup" element={<Navigate to="/auth?tab=register" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
