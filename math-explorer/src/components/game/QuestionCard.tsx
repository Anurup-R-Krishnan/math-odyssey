import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HintDisplay } from "@/components/game/HintDisplay";
import {
  ObjectVisualizer,
  PatternVisualizer,
} from "@/components/game/ObjectVisualizer";
import { Question, QuestionAttempt } from "@/types/game";
import { useStars } from "@/hooks/useStars";
import { Star } from "lucide-react";
import {
  getHintForAttempt,
  getRevealMessage,
  shouldRevealAnswer,
} from "@/data/hints";
import { generateMicroPractice } from "@/data/questions";

interface QuestionCardProps {
  question: Question;
  onComplete: (attempt: QuestionAttempt) => void;
  onNextQuestion: () => void;
}

type Phase = "answering" | "revealed" | "microPractice" | "complete";

export function QuestionCard({
  question,
  onComplete,
  onNextQuestion,
}: QuestionCardProps) {
  const { addStar } = useStars();
  const [attemptCount, setAttemptCount] = useState(0);

  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("answering");
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFadeOut, setShowFadeOut] = useState(false);

  // Micro-practice state
  const [microQuestion, setMicroQuestion] = useState<Question | null>(null);
  const [microAttempts, setMicroAttempts] = useState(0);

  // Determine active question based on phase
  const activeQuestion = phase === "microPractice" && microQuestion ? microQuestion : question;

  const handleAnswer = useCallback(
    (option: number | string) => {
      if (phase !== "answering") return;
      setSelectedOption(option);

      const correct = String(option) === String(question.answer);
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      if (correct) {
        setIsCorrect(true);
        setCurrentHint("Nice -- you solved it.");
        setPhase("complete");
        addStar();
        onComplete({
          questionId: question.id,
          attempts: newAttemptCount,
          hintUsed: newAttemptCount > 1,
          hintsShown: Math.min(newAttemptCount - 1, 2),
          correct: true,
          timestamp: Date.now(),
        });
        return;
      }

      // Incorrect
      if (shouldRevealAnswer(newAttemptCount)) {
        // 3rd wrong -- reveal answer
        setCurrentHint(getRevealMessage(question.type));
        setPhase("revealed");
        if (question.type === "subtraction") {
          setShowFadeOut(true);
        }
        onComplete({
          questionId: question.id,
          attempts: newAttemptCount,
          hintUsed: true,
          hintsShown: 2,
          correct: false,
          timestamp: Date.now(),
        });
      } else {
        // Show hint
        const hint = getHintForAttempt(question.type, newAttemptCount);
        setCurrentHint(hint);
        // Reset selection after a moment
        setTimeout(() => setSelectedOption(null), 600);
      }
    },
    [attemptCount, phase, question, onComplete, addStar]
  );

  const handleMicroAnswer = useCallback(
    (option: number | string) => {
      if (!microQuestion) return;
      const correct = String(option) === String(microQuestion.answer);
      setMicroAttempts((p) => p + 1);
      setSelectedOption(option);

      if (correct) {
        setCurrentHint("Nice -- you solved it.");
        setPhase("complete");
      } else {
        setCurrentHint("Try again.");
        setTimeout(() => {
          setSelectedOption(null);
          setCurrentHint(null);
        }, 800);
      }
    },
    [microQuestion]
  );

  const handleRevealContinue = useCallback(() => {
    const micro = generateMicroPractice(question);
    setMicroQuestion(micro);
    setPhase("microPractice");
    setCurrentHint(null);
    setSelectedOption(null);
    setMicroAttempts(0);
    setShowFadeOut(false);
  }, [question]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "answering" && phase !== "microPractice") return;

      const key = e.key;
      const index = parseInt(key, 10) - 1;

      if (activeQuestion && index >= 0 && index < activeQuestion.options.length) {
        const option = activeQuestion.options[index];
        if (phase === "microPractice") {
          handleMicroAnswer(option);
        } else {
          handleAnswer(option);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, activeQuestion, handleAnswer, handleMicroAnswer]);

  const motionProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <motion.div {...motionProps}>
      <Card className="w-full max-w-lg mx-auto border-2 border-primary/10 rounded-[2rem] overflow-hidden shadow-sm">
        <CardHeader className="pb-6 pt-8 bg-muted/30">
          <CardTitle className="text-xl text-center font-bold">
            {phase === "microPractice"
              ? "Practice Time!"
              : activeQuestion.prompt}
          </CardTitle>
          {phase === "microPractice" && microQuestion && (
            <p className="text-center text-base text-muted-foreground mt-1">
              {microQuestion.prompt}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-8 p-8">
          {/* Visual representation */}
          {activeQuestion.type === "pattern" && activeQuestion.patternSequence && (
            <PatternVisualizer sequence={activeQuestion.patternSequence} />
          )}

          {activeQuestion.type === "addition" &&
            activeQuestion.operandA !== undefined &&
            activeQuestion.operandB !== undefined && (
              <div className="flex items-center justify-center gap-4">
                <ObjectVisualizer
                  count={activeQuestion.operandA}
                  color="blue"
                  label={String(activeQuestion.operandA)}
                  groupSize={5}
                />
                <span className="text-xl font-bold text-muted-foreground">+</span>
                <ObjectVisualizer
                  count={activeQuestion.operandB}
                  color="green"
                  label={String(activeQuestion.operandB)}
                  groupSize={5}
                />
              </div>
            )}

          {activeQuestion.type === "subtraction" &&
            activeQuestion.operandA !== undefined &&
            activeQuestion.operandB !== undefined && (
              <div className="flex items-center justify-center gap-4">
                <ObjectVisualizer
                  count={activeQuestion.operandA}
                  color="blue"
                  label={String(activeQuestion.operandA)}
                  groupSize={5}
                />
                <span className="text-xl font-bold text-muted-foreground">-</span>
                <ObjectVisualizer
                  count={activeQuestion.operandB}
                  color="red"
                  fadeOut={showFadeOut}
                  label={String(activeQuestion.operandB)}
                  groupSize={5}
                />
              </div>
            )}

          {/* Answer reveal */}
          {phase === "revealed" && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                The answer is{" "}
                <span className="font-bold text-foreground">
                  {String(question.answer)}
                </span>
              </p>
              <Button onClick={handleRevealContinue} size="sm">
                Try a practice question
              </Button>
            </div>
          )}

          {/* Hint display */}
          <AnimatePresence>
            {currentHint && phase !== "revealed" && (
              <HintDisplay
                hint={currentHint}
                isReveal={phase === "complete" && isCorrect}
              />
            )}
          </AnimatePresence>

          {/* Options */}
          {(phase === "answering" || phase === "microPractice") && (
            <div className="grid grid-cols-2 gap-4">
              {activeQuestion.options.map((option) => {
                const isSelected = selectedOption === option;
                // Check if this option is the one selected AND we are not in correct state yet
                // If it IS selected and it IS NOT the answer, it's wrong.
                const isWrong = isSelected && String(option) !== String(activeQuestion.answer) && !isCorrect;

                // Determine button class based on state
                let buttonClass = "h-16 text-xl font-bold rounded-2xl border-2 transition-all ";
                if (isWrong) {
                  buttonClass += "border-destructive/50 bg-destructive/5 animate-shake";
                } else if (isSelected && isCorrect) {
                  // Only show green if they got it correct
                  buttonClass += "border-secondary bg-secondary animate-correct-glow";
                } else {
                  buttonClass += "border-transparent";
                }

                return (
                  <Button
                    key={String(option)}
                    variant={isWrong ? "outline" : (isSelected && isCorrect) ? "default" : "secondary"}
                    className={buttonClass}
                    onClick={() =>
                      phase === "microPractice"
                        ? handleMicroAnswer(option)
                        : handleAnswer(option)
                    }
                    disabled={false}
                    aria-label={`Answer: ${option}`}
                  >
                    <span className="flex items-center justify-between w-full">
                      <span className="flex-1 text-center">{String(option)}</span>
                      <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-50">
                        {activeQuestion.options.indexOf(option) + 1}
                      </kbd>
                    </span>
                  </Button>
                );
              })}
            </div>
          )}

          {/* Continue button after completion */}
          {phase === "complete" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center pt-2 space-y-4"
            >
              <div className="flex justify-center gap-2">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 0.8, // Faster, one-shot animation
                      times: [0, 0.5, 1],
                      delay: i * 0.1
                    }}
                  >
                    <Star className="w-8 h-8 text-secondary-foreground fill-secondary-foreground shadow-sm" />
                  </motion.div>
                ))}
              </div>
              <Button onClick={onNextQuestion} size="lg" className="rounded-full px-10 h-14 text-lg font-bold shadow-md">
                Next Mission →
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
