import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import { finishQuiz, submitAnswer } from "../api/stubs";
import { useQuiz } from "../context/QuizContext";
import ProgressBar from "../components/ProgressBar";
import TimerBar from "../components/TimerBar";
import QuestionCard from "../components/QuestionCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import "./QuizScreen.css";

const SECONDS_PER_QUESTION = 30;
const LOCK_MS = 550;

export default function QuizScreen() {
  const navigate = useNavigate();
  const {
    participant,
    quiz,
    answers,
    setAnswers,
    setResult,
    quizStartedAt,
  } = useQuiz();

  const questions = quiz?.questions ?? [];
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [direction, setDirection] = useState(1);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState(null);
  const [timerRunning, setTimerRunning] = useState(true);
  const advancing = useRef(false);
  const answersRef = useRef(answers);
  const indexRef = useRef(index);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const current = questions[index];
  const isLast = total > 0 && index >= total - 1;

  const goNext = useCallback(
    async (chosenIndex, timedOut) => {
      if (advancing.current || !current) return;
      advancing.current = true;
      setTimerRunning(false);

      const isCorrect =
        !timedOut && chosenIndex !== null && chosenIndex === current.correctIndex;

      const entry = {
        questionId: current.id,
        selectedIndex: timedOut ? null : chosenIndex,
        isCorrect: Boolean(isCorrect),
        timedOut: Boolean(timedOut),
      };

      const nextAnswers = [...answersRef.current, entry];
      setAnswers(nextAnswers);
      answersRef.current = nextAnswers;

      submitAnswer(participant.id, entry).catch(() => {});

      await wait(LOCK_MS);

      if (isLast) {
        setFinishing(true);
        try {
          const elapsedSec = quizStartedAt
            ? (Date.now() - quizStartedAt) / 1000
            : total * SECONDS_PER_QUESTION;
          const result = await finishQuiz(participant.id, {
            answers: nextAnswers,
            timeTakenSec: elapsedSec,
          });
          setResult(result);
          navigate("/result");
        } catch {
          setError("finish");
          setFinishing(false);
          advancing.current = false;
        }
        return;
      }

      setDirection(1);
      setIndex((i) => i + 1);
      setSelected(null);
      setLocked(false);
      setTimerRunning(true);
      advancing.current = false;
    },
    [
      current,
      isLast,
      navigate,
      participant?.id,
      quizStartedAt,
      setAnswers,
      setResult,
      total,
    ]
  );

  const handleSelect = (i) => {
    if (locked || advancing.current) return;
    setSelected(i);
    setLocked(true);
    goNext(i, false);
  };

  const handleExpire = () => {
    if (locked || advancing.current) return;
    setLocked(true);
    setSelected(null);
    goNext(null, true);
  };

  const retryFinish = () => {
    setError(null);
    setFinishing(true);
    const elapsedSec = quizStartedAt
      ? (Date.now() - quizStartedAt) / 1000
      : total * SECONDS_PER_QUESTION;
    finishQuiz(participant.id, {
      answers: answersRef.current,
      timeTakenSec: elapsedSec,
    })
      .then((result) => {
        setResult(result);
        navigate("/result");
      })
      .catch(() => {
        setError("finish");
        setFinishing(false);
      });
  };

  if (!participant || !quiz?.questions?.length) {
    return <Navigate to="/" replace />;
  }

  if (finishing) {
    return (
      <div className="screen quiz-screen">
        <LoadingState message="Scoring your answers…" subtext="Calculating live rank" />
      </div>
    );
  }

  if (error === "finish") {
    return (
      <div className="screen quiz-screen">
        <ErrorState
          title="Couldn’t submit results"
          message="Your answers are saved locally — retry to push your score to the leaderboard."
          onRetry={retryFinish}
        />
      </div>
    );
  }

  return (
    <div className="screen quiz-screen">
      <header className="quiz-top">
        <div className="quiz-top-row">
          <ProgressBar current={index + 1} total={total} />
          <TimerBar
            mode="question"
            variant="circular"
            durationSec={SECONDS_PER_QUESTION}
            running={timerRunning}
            resetKey={current.id}
            onExpire={handleExpire}
          />
        </div>
        <TimerBar
          mode="question"
          variant="linear"
          durationSec={SECONDS_PER_QUESTION}
          running={timerRunning}
          resetKey={current.id}
        />
      </header>

      <div className="quiz-body">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="quiz-slide"
          >
            <QuestionCard
              question={current.text}
              options={current.options}
              selectedIndex={selected}
              locked={locked}
              onSelect={handleSelect}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
