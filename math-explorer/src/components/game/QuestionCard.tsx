import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HintDisplay } from "@/components/game/HintDisplay";
import { MultipleChoiceInput } from "@/components/game/MultipleChoiceInput";
import { DrawingCanvas } from "@/components/game/DrawingCanvas";
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
  inputMode: "multiple" | "draw";
  useTensorFlow?: boolean;
}

type Phase = "answering" | "revealed" | "microPractice" | "complete";

export function QuestionCard({
  question,
  onComplete,
  onNextQuestion,
  inputMode,
  useTensorFlow = true,
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

  // Reset states when question changes
  useEffect(() => {
    setAttemptCount(0);
    setCurrentHint(null);
    setPhase("answering");
    setSelectedOption(null);
    setIsCorrect(false);
    setShowFadeOut(false);
    setMicroQuestion(null);
    setMicroAttempts(0);
  }, [question.id]);

  const activeQuestion = useMemo(
    () => (phase === "microPractice" && microQuestion ? microQuestion : question),
    [phase, microQuestion, question]
  );

  const processAnswer = useCallback(
    (answer: string | number, isMicroPractice: boolean) => {
      const targetQuestion = isMicroPractice ? microQuestion : question;
      if (!targetQuestion) return;

      const correct = String(answer) === String(targetQuestion.answer);
      
      if (isMicroPractice) {
        setMicroAttempts((p) => p + 1);
        setSelectedOption(answer);
        
        if (correct) {
          setCurrentHint("Nice -- you solved it.");
          setPhase("complete");
        } else {
          setCurrentHint("Try again.");
          setTimeout(() => {
            setSelectedOption(null);
            setTextInput("");
            setCurrentHint(null);
          }, 800);
        }
        return;
      }

      // Main question logic
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
        const hint = getHintForAttempt(question.type, newAttemptCount);
        setCurrentHint(hint);
        setTimeout(() => {
          setSelectedOption(null);
        }, 600);
      }
    },
    [attemptCount, question, microQuestion, onComplete, addStar]
  );

  const handleAnswer = useCallback(
    (option: number | string) => {
      if (phase !== "answering") return;
      setSelectedOption(option);
      processAnswer(option, false);
    },
    [phase, processAnswer]
  );

  const handleDrawingSubmit = useCallback((recognizedNumber: number | null) => {
    if (phase !== "answering" && phase !== "microPractice") return;
    
    if (recognizedNumber !== null) {
      // Use recognized number
      if (phase === "microPractice") {
        processAnswer(recognizedNumber, true);
      } else {
        processAnswer(recognizedNumber, false);
      }
    } else {
      // Recognition failed
      setCurrentHint("I couldn't recognize that. Try drawing clearer or use the buttons below.");
    }
  }, [phase, processAnswer]);

  const handleMicroAnswer = useCallback(
    (option: number | string) => {
      if (!microQuestion) return;
      processAnswer(option, true);
    },
    [microQuestion, processAnswer]
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
      if (inputMode === "draw") return; // No keyboard shortcuts in draw mode

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
  }, [phase, activeQuestion, handleAnswer, handleMicroAnswer, inputMode]);

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

          {/* Fraction Visualizer */}
          {activeQuestion.type === "fraction" &&
            activeQuestion.operandA !== undefined &&
            activeQuestion.operandB !== undefined && (
              <div className="flex justify-center p-4">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
                    <circle cx="16" cy="16" r="16" fill="#e2e8f0" /> {/* Background Circle */}
                    <path
                      d={`M 16 16 L 32 16 A 16 16 0 ${activeQuestion.operandA / activeQuestion.operandB > 0.5 ? 1 : 0} 1 ${16 + 16 * Math.cos(2 * Math.PI * (activeQuestion.operandA / activeQuestion.operandB))
                        } ${16 + 16 * Math.sin(2 * Math.PI * (activeQuestion.operandA / activeQuestion.operandB))
                        } Z`}
                      fill="#6366f1"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              </div>
            )
          }

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

          {/* Answer Input */}
          {(phase === "answering" || phase === "microPractice") && (
            <>
              {inputMode === "multiple" ? (
                <MultipleChoiceInput
                  options={activeQuestion.options}
                  selectedOption={selectedOption}
                  correctAnswer={activeQuestion.answer}
                  isCorrect={isCorrect}
                  onSelect={(option) =>
                    phase === "microPractice"
                      ? handleMicroAnswer(option)
                      : handleAnswer(option)
                  }
                />
              ) : (
                <DrawingCanvas
                  onSubmit={handleDrawingSubmit}
                  onClear={() => setCurrentHint(null)}
                  isCorrect={isCorrect}
                  showFeedback={phase === "complete" || (currentHint !== null && currentHint !== "I couldn't recognize that. Try drawing clearer or use the buttons below.")}
                  useTensorFlow={useTensorFlow}
                />
              )}
            </>
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
