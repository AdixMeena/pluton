import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import SubjectHome from './pages/SubjectHome'
import GeneralChat from './pages/GeneralChat'
import SubjectChat from './pages/SubjectChat'
import Quiz from './pages/Quiz'
import ExamPrep from './pages/ExamPrep'
import History from './pages/History'
import Profile from './pages/Profile'
import ProtectedRoute from './ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        {/* Protected routes — must be logged in */}
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/subject/:subjectName" element={<ProtectedRoute><SubjectHome /></ProtectedRoute>} />
        <Route path="/chat/general" element={<ProtectedRoute><GeneralChat /></ProtectedRoute>} />
        <Route path="/chat/:subjectName" element={<ProtectedRoute><SubjectChat /></ProtectedRoute>} />
        <Route path="/quiz/:subjectName" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/exam-prep" element={<ProtectedRoute><ExamPrep /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App