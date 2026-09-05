import { createContext, useContext, useMemo, useState, useCallback } from "react";

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [participant, setParticipant] = useState(null);
  const [tier, setTier] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [quizStartedAt, setQuizStartedAt] = useState(null);

  const reset = useCallback(() => {
    setParticipant(null);
    setTier(null);
    setQuiz(null);
    setAnswers([]);
    setResult(null);
    setQuizStartedAt(null);
  }, []);

  const value = useMemo(
    () => ({
      participant,
      setParticipant,
      tier,
      setTier,
      quiz,
      setQuiz,
      answers,
      setAnswers,
      result,
      setResult,
      quizStartedAt,
      setQuizStartedAt,
      reset,
    }),
    [participant, tier, quiz, answers, result, quizStartedAt, reset]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}
