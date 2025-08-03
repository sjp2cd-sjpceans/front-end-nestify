import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { SearchPage } from './pages/SearchPage'
import { PropertyDetailPage } from './pages/PropertyDetailPage'
import { Chatbot } from './components/ui/Chatbot'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
      </Routes>
      {/* Global Chatbot - positioned at bottom right */}
      <Chatbot />
    </Router>
  )
}

export default App