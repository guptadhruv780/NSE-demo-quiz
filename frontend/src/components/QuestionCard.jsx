import { motion } from "framer-motion";
import "./QuestionCard.css";

/**
 * @param {string} question
 * @param {string[]} options
 * @param {number|null} selectedIndex
 * @param {boolean} locked
 * @param {(index: number) => void} onSelect
 */
export default function QuestionCard({
  question,
  options,
  selectedIndex,
  locked,
  onSelect,
}) {
  return (
    <div className="question-card">
      <h2 className="question-card-text">{question}</h2>
      <div className="question-card-options" role="listbox" aria-label="Answer options">
        {options.map((opt, i) => {
          const selected = selectedIndex === i;
          const letters = ["A", "B", "C", "D"];
          return (
            <motion.button
              key={`${opt}-${i}`}
              type="button"
              role="option"
              aria-selected={selected}
              className={`question-option ${selected ? "is-selected" : ""} ${
                locked && selected ? "is-locked" : ""
              }`}
              disabled={locked}
              onClick={() => onSelect(i)}
              whileTap={locked ? undefined : { scale: 0.98 }}
              animate={
                locked && selected
                  ? { scale: [1, 1.03, 1], boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 24px rgba(201,162,39,0.45)", "0 4px 16px rgba(11,31,58,0.12)"] }
                  : {}
              }
              transition={{ duration: 0.45 }}
            >
              <span className="question-option-letter">{letters[i]}</span>
              <span className="question-option-text">{opt}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
