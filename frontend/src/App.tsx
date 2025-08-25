// React import not required with new JSX transform
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import { ToastContainer } from './components/UI/Toast'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Simulation from './pages/Simulation'
import Analytics from './pages/Analytics'
import Impact from './pages/Impact'
import Features from './pages/Features'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <ToastContainer />
      </div>
    </Router>
  )
}

export default App