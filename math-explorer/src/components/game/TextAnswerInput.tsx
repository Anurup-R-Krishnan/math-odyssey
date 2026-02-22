import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TextAnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

export function TextAnswerInput({ value, onChange, onSubmit }: TextAnswerInputProps) {
  return (
    <div className="space-y-4">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit(value);
          }
        }}
        placeholder="Type your answer..."
        className="h-16 text-xl text-center rounded-2xl border-2 focus-visible:ring-primary"
      />
      <Button
        onClick={() => onSubmit(value)}
        className="w-full h-12 rounded-2xl text-base font-bold"
        disabled={!value.trim()}
      >
        Submit Answer
      </Button>
    </div>
  );
}
