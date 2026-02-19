import { useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuestionCard } from "@/components/game/QuestionCard";
import { useGameSession } from "@/hooks/useGameSession";
import { generateQuestion } from "@/data/questions";
import { Question, QuestionAttempt } from "@/types/game";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Star, Rocket, Target, Flag, Ghost, Zap } from "lucide-react";

type GameMode = "addition" | "subtraction" | "pattern";
type PilotIcon = "rocket" | "ghost" | "zap";

const VALID_MODES: GameMode[] = ["addition", "subtraction", "pattern"];

function isValidMode(value: string | null): value is GameMode {
  return VALID_MODES.includes(value as GameMode);
}

const Game = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlType = searchParams.get("type");
  const preselectedMode: GameMode | null = isValidMode(urlType) ? urlType : null;

  const { session, difficulty, startSession, recordAttempt, endSession } =
    useGameSession();
  const [rollNo, setRollNo] = useState("");
  const [mode, setMode] = useState<GameMode | null>(null);
  const [pilot, setPilot] = useState<PilotIcon>("rocket");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const totalQuestions = 10;

  const handleStart = useCallback(
    (selectedMode: GameMode) => {
      if (!rollNo.trim()) return;
      startSession(rollNo.trim());
      setMode(selectedMode);
      setCurrentQuestion(generateQuestion(selectedMode, 1));
      setQuestionsAnswered(0);
      setCorrectCount(0);
    },
    [rollNo, startSession]
  );

  const handleComplete = useCallback(
    (attempt: QuestionAttempt) => {
      recordAttempt(attempt);
      if (attempt.correct) setCorrectCount((c) => c + 1);
    },
    [recordAttempt]
  );

  const handleNext = useCallback(() => {
    const next = questionsAnswered + 1;
    setQuestionsAnswered(next);

    if (next >= totalQuestions) {
      endSession();
      setCurrentQuestion(null);
      return;
    }

    if (mode) {
      setCurrentQuestion(generateQuestion(mode, difficulty.level));
    }
  }, [questionsAnswered, mode, difficulty.level, endSession]);

  const handleRestart = useCallback(() => {
    setMode(null);
    setCurrentQuestion(null);
    setQuestionsAnswered(0);
    setCorrectCount(0);
  }, []);

  // Pre-game: roll number entry (+ mode selection if no URL type)
  if (!session || !mode) {
    return (
      <section className="container max-w-2xl py-12 px-6 space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Mission Briefing</h1>
          <p className="text-muted-foreground">
            {preselectedMode
              ? `Get ready for the ${preselectedMode.charAt(0).toUpperCase() + preselectedMode.slice(1)} Mission! Enter your pilot ID to begin.`
              : "Enter your pilot ID and choose your destination."}
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-8 bg-card border-2 border-primary/10 rounded-[2rem] p-8 shadow-sm">
          <div className="space-y-4">
            <Label className="text-base font-medium">Choose Your Ship</Label>
            <div className="flex justify-center gap-4">
              {[
                { id: "rocket" as PilotIcon, icon: Rocket, label: "Rocket Ship" },
                { id: "ghost" as PilotIcon, icon: Ghost, label: "Ghost Ship" },
                { id: "zap" as PilotIcon, icon: Zap, label: "Zap Ship" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPilot(p.id)}
                  aria-label={`Select ${p.label}`}
                  aria-pressed={pilot === p.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${pilot === p.id
                      ? "border-primary bg-primary/10 scale-110 shadow-md"
                      : "border-transparent hover:bg-muted"
                    }`}
                >
                  <p.icon className={`w-8 h-8 ${pilot === p.id ? "text-primary" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="rollno" className="text-base font-medium">Pilot ID (Roll Number)</Label>
            <Input
              id="rollno"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && rollNo.trim() && preselectedMode) {
                  handleStart(preselectedMode);
                }
              }}
              placeholder="e.g., EXPLORER-1"
              className="h-12 rounded-xl border-2 focus-visible:ring-primary"
            />
          </div>

          {/* If a mode was pre-selected via URL, show a single Launch button */}
          {preselectedMode ? (
            <Button
              size="lg"
              className="w-full h-14 rounded-2xl text-base font-bold shadow-sm"
              onClick={() => handleStart(preselectedMode)}
              disabled={!rollNo.trim()}
            >
              Launch Mission 🚀
            </Button>
          ) : (
            <div className="space-y-4">
              <Label className="text-base font-medium">Choose Your Mission</Label>
              <div className="grid grid-cols-1 gap-3">
                {(
                  [
                    { key: "addition" as GameMode, label: "Addition Station", desc: "Combine numbers together" },
                    { key: "subtraction" as GameMode, label: "Subtraction Station", desc: "Find what remains" },
                    { key: "pattern" as GameMode, label: "Pattern Station", desc: "Follow the sequence" },
                  ] as const
                ).map((m) => (
                  <Button
                    key={m.key}
                    variant="outline"
                    className="h-auto flex flex-col items-start p-4 text-left border-2 hover:border-primary/50 hover:bg-primary/5 rounded-2xl transition-all"
                    onClick={() => handleStart(m.key)}
                    disabled={!rollNo.trim()}
                  >
                    <span className="font-bold text-base">{m.label}</span>
                    <span className="text-xs text-muted-foreground">{m.desc}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Post-game: summary
  if (!currentQuestion && questionsAnswered >= totalQuestions) {
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    return (
      <section className="container max-w-md py-12 px-6 space-y-8 animate-in zoom-in-95 duration-500">
        <div className="bg-card border-2 border-primary/10 rounded-[2.5rem] p-10 text-center space-y-6 shadow-md">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-2 text-secondary-foreground">
            <Star className="w-10 h-10 fill-current" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Mission Accomplished!</h2>
            <p className="text-muted-foreground">
              Great job! You solved {correctCount} out of {totalQuestions} problems.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground px-1">
              <span>Accuracy</span>
              <span>{accuracy}%</span>
            </div>
            <Progress value={accuracy} className="h-4 rounded-full" />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button size="lg" className="rounded-2xl h-14 text-base font-bold shadow-sm" onClick={handleRestart}>Play Again</Button>
            <Button variant="outline" size="lg" className="rounded-2xl h-14 text-base" onClick={() => navigate("/dashboard")}>
              View My Progress
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // In-game
  const progressPercent = (questionsAnswered / totalQuestions) * 100;

  return (
    <section className="container max-w-lg py-8 px-4 space-y-8 animate-in fade-in duration-500">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm font-bold text-muted-foreground px-1">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span>Mission Progress</span>
          </div>
          <div className="flex items-center gap-2 bg-muted px-2 py-0.5 rounded-full">
            <span>Level {difficulty.level}</span>
          </div>
        </div>

        <div className="relative pt-6 pb-2">
          {/* Progress Bar */}
          <Progress
            value={progressPercent}
            className="h-4 rounded-full border-2 border-muted bg-muted/30"
          />

          {/* Moving Pilot */}
          <motion.div
            className="absolute top-0 -mt-1"
            initial={false}
            animate={{ left: `${progressPercent}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ x: "-50%" }}
          >
            <div className="bg-primary p-1.5 rounded-full shadow-md border-2 border-background">
              {pilot === "rocket" && <Rocket className="w-4 h-4 text-primary-foreground rotate-45" />}
              {pilot === "ghost" && <Ghost className="w-4 h-4 text-primary-foreground" />}
              {pilot === "zap" && <Zap className="w-4 h-4 text-primary-foreground" />}
            </div>
          </motion.div>

          {/* Checkpoints */}
          <div className="absolute top-6 left-0 w-full flex justify-between px-0.5 pointer-events-none">
            <div className="w-1 h-4 bg-muted rounded-full" />
            <div className="w-1 h-4 bg-muted rounded-full" />
            <Flag className="w-4 h-4 text-muted -mt-4" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Problem {questionsAnswered + 1} of {totalQuestions}
          </p>
        </div>
      </div>

      {currentQuestion && (
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onComplete={handleComplete}
          onNextQuestion={handleNext}
        />
      )}
    </section>
  );
};

export default Game;
