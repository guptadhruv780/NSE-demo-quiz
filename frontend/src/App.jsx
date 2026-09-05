import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import LandingScreen from "./screens/LandingScreen";
import ScratchScreen from "./screens/ScratchScreen";
import QuizScreen from "./screens/QuizScreen";
import ResultScreen from "./screens/ResultScreen";
import "./App.css";

export default function App() {
  return (
    <QuizProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<LandingScreen />} />
            <Route path="/scratch" element={<ScratchScreen />} />
            <Route path="/quiz" element={<QuizScreen />} />
            <Route path="/result" element={<ResultScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QuizProvider>
  );
}
