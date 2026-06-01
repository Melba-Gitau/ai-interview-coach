import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StackSelector from "./pages/StackSelector";
import InterviewType from "./pages/InterviewType";
import Interview from "./pages/Interview";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select-stack" element={<StackSelector />} />
        <Route path="/interview/:stack" element={<InterviewType />} />
        <Route path="/interview/chat/:type" element={<Interview />} />
        <Route
          path="/story-builder"
          element={<div>Story Builder Coming Soon</div>}
        />
      </Routes>
    </Router>
  );
}
