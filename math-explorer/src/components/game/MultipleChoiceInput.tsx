import { Button } from "@/components/ui/button";

interface MultipleChoiceInputProps {
  options: (number | string)[];
  selectedOption: number | string | null;
  correctAnswer: number | string;
  isCorrect: boolean;
  onSelect: (option: number | string) => void;
}

export function MultipleChoiceInput({
  options,
  selectedOption,
  correctAnswer,
  isCorrect,
  onSelect,
}: MultipleChoiceInputProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option) => {
        const isSelected = selectedOption === option;
        const isWrong = isSelected && String(option) !== String(correctAnswer) && !isCorrect;

        let buttonClass = "h-16 text-xl font-bold rounded-2xl border-2 transition-all ";
        if (isWrong) {
          buttonClass += "border-destructive/50 bg-destructive/5 animate-shake";
        } else if (isSelected && isCorrect) {
          buttonClass += "border-secondary bg-secondary animate-correct-glow";
        } else {
          buttonClass += "border-transparent";
        }

        return (
          <Button
            key={String(option)}
            variant={isWrong ? "outline" : (isSelected && isCorrect) ? "default" : "secondary"}
            className={buttonClass}
            onClick={() => onSelect(option)}
            aria-label={`Answer: ${option}`}
          >
            <span className="flex items-center justify-between w-full">
              <span className="flex-1 text-center">{String(option)}</span>
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-50">
                {options.indexOf(option) + 1}
              </kbd>
            </span>
          </Button>
        );
      })}
    </div>
  );
}
