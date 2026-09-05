import { getMockQuestions } from "../data/mockQuestions";

/**
 * API stubs — replace each TODO with real FastAPI calls.
 * All functions return Promises so screens can use loading/error states.
 */

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

function randomId() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * TODO: replace with real API call to POST /participants
 * Body: { name, phone?, sessionId }
 */
export async function createParticipant({ name, phone, sessionId = "aug2026" }) {
  await delay(500);
  // TODO: POST /participants
  return {
    id: randomId(),
    name: name.trim(),
    phone: phone?.trim() || null,
    sessionId,
    createdAt: new Date().toISOString(),
  };
}

/**
 * TODO: replace with real API call to POST /participants/{id}/tier
 * Backend must assign the authoritative tier — never trust client-only choice.
 */
export async function assignTier(participantId) {
  await delay(800 + Math.random() * 400);
  // TODO: POST /participants/{id}/tier
  const tiers = ["low", "medium", "high"];
  const tier = tiers[Math.floor(Math.random() * tiers.length)];
  void participantId;
  return { tier };
}

/**
 * TODO: replace with real API call to GET /participants/{id}/quiz
 * Returns 20 shuffled questions for the participant's tier.
 */
export async function fetchQuiz(participantId, tier) {
  await delay(700);
  // TODO: GET /participants/{id}/quiz  (or POST /quiz/start)
  void participantId;
  return {
    quizId: `q_${Date.now().toString(36)}`,
    tier,
    questions: getMockQuestions(tier, 20),
    startedAt: new Date().toISOString(),
  };
}

/**
 * TODO: replace with real API call to POST /participants/{id}/answers
 * Submit a single answer (or batch at end — match your FastAPI design).
 */
export async function submitAnswer(participantId, payload) {
  await delay(120);
  // TODO: POST /participants/{id}/answers
  void participantId;
  void payload;
  return { ok: true };
}

/**
 * TODO: replace with real API call to POST /participants/{id}/finish
 * Returns score, correct count, time, rank.
 */
export async function finishQuiz(participantId, { answers, timeTakenSec }) {
  await delay(900);
  // TODO: POST /participants/{id}/finish
  const correct = answers.filter((a) => a.isCorrect).length;
  const total = answers.length;
  const score = Math.max(0, Math.round(correct * 100 - timeTakenSec * 0.5));
  const totalParticipants = 180 + Math.floor(Math.random() * 80);
  const rank = Math.max(1, Math.min(totalParticipants, Math.floor((1 - correct / total) * totalParticipants) + 1 + Math.floor(Math.random() * 5)));

  void participantId;
  return {
    correct,
    total,
    score,
    timeTakenSec,
    rank,
    totalParticipants,
  };
}

/**
 * TODO: replace with real API call to GET /session/{id}/leaderboard
 * Returns top N + this participant's rank for live polling.
 */
export async function fetchLeaderboard(sessionId, participantId) {
  await delay(400);
  // TODO: GET /session/{id}/leaderboard?participantId=...
  void sessionId;

  const names = [
    "Aarav S.",
    "Priya M.",
    "Rohan K.",
    "Ananya P.",
    "Vikram D.",
    "Isha R.",
    "Kabir N.",
    "Meera T.",
    "Arjun B.",
    "Diya L.",
  ];

  const top = names.slice(0, 5).map((name, i) => ({
    rank: i + 1,
    participantId: i === 2 ? participantId : `other_${i}`,
    name: i === 2 ? null : name, // null = use local name when highlighting self
    correct: 20 - i,
    score: 2000 - i * 40 - Math.floor(Math.random() * 20),
    timeTakenSec: 280 + i * 18,
    isSelf: i === 2,
  }));

  const totalParticipants = 200 + Math.floor(Math.random() * 40);
  const rank = 3 + Math.floor(Math.random() * 4);

  return {
    top,
    participant: {
      rank,
      totalParticipants,
      correct: 18,
      score: 1750 + Math.floor(Math.random() * 30),
    },
    updatedAt: new Date().toISOString(),
  };
}
