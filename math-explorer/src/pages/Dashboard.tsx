import { useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { useGameSession } from "@/hooks/useGameSession";
import { Download, Rocket } from "lucide-react";

const COLORS = [
  "hsl(208, 64%, 78%)", // Primary Blue
  "hsl(119, 31%, 81%)", // Secondary Green
  "hsl(25, 82%, 85%)",  // Accent Peach
  "hsl(12, 58%, 73%)",  // Destructive Terracotta
];

const Dashboard = () => {
  const { getAllSessions, exportCSV } = useGameSession();
  const sessions = useMemo(() => getAllSessions(), [getAllSessions]);

  const totalAttempts = useMemo(
    () => sessions.reduce((sum, s) => sum + s.attempts.length, 0),
    [sessions]
  );
  const totalCorrect = useMemo(
    () =>
      sessions.reduce(
        (sum, s) => sum + s.attempts.filter((a) => a.correct).length,
        0
      ),
    [sessions]
  );
  const totalHints = useMemo(
    () =>
      sessions.reduce(
        (sum, s) => sum + s.attempts.filter((a) => a.hintUsed).length,
        0
      ),
    [sessions]
  );

  const accuracyData = useMemo(() => {
    return sessions.map((s, i) => {
      const correct = s.attempts.filter((a) => a.correct).length;
      const total = s.attempts.length;
      return {
        session: `Session ${i + 1}`,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
        attempts: total,
      };
    });
  }, [sessions]);

  const pieData = useMemo(() => {
    const correct = totalCorrect;
    const incorrect = totalAttempts - totalCorrect;
    return [
      { name: "Correct", value: correct },
      { name: "Incorrect", value: incorrect },
    ];
  }, [totalAttempts, totalCorrect]);

  const handleExport = useCallback(() => {
    const csv = exportCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "neuromath_session_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [exportCSV]);

  const chartConfig = {
    accuracy: { label: "Accuracy %", color: "hsl(208, 64%, 78%)" },
    correct: { label: "Correct", color: "hsl(119, 31%, 81%)" },
    incorrect: { label: "Incorrect", color: "hsl(12, 58%, 73%)" },
  };

  return (
    <section className="container max-w-5xl py-12 px-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Mission Log</h1>
          <p className="text-muted-foreground">
            Your progress through the mathematical galaxy.
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl border-2 hover:bg-muted"
          onClick={handleExport}
          disabled={sessions.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Mission Data
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Missions", value: sessions.length, color: "bg-primary/10 text-primary-foreground" },
          { label: "Problems Solved", value: totalAttempts, color: "bg-secondary/10 text-secondary-foreground" },
          { label: "Correct Answers", value: totalCorrect, color: "bg-accent/20 text-accent-foreground" },
          { label: "Support Used", value: totalHints, color: "bg-destructive/10 text-destructive-foreground" },
        ].map((stat) => (
          <Card key={stat.label} className="border-2 border-primary/5 rounded-3xl overflow-hidden shadow-sm">
            <CardContent className="p-6 text-center space-y-1">
              <p className="text-3xl font-black">{stat.value}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {sessions.length === 0 ? (
        <Card className="border-2 border-dashed border-primary/20 rounded-[3rem] bg-muted/5">
          <CardContent className="py-20 text-center space-y-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary animate-bounce">
              <Rocket className="w-12 h-12 rotate-45" />
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-2xl font-bold tracking-tight">Ready for Takeoff?</h3>
              <p className="text-muted-foreground">
                Your mission log is empty. Complete your first mission to start tracking your progress through the stars!
              </p>
            </div>
            <Button size="lg" className="rounded-full px-10 h-14 font-bold shadow-md" onClick={() => window.location.href = "/"}>
              Go to Mission Map
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 border-primary/5 rounded-[2rem] overflow-hidden shadow-sm">
            <CardHeader className="pb-2 pt-6 px-8">
              <CardTitle className="text-lg font-bold">Accuracy by Mission</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <ChartContainer config={chartConfig} className="h-[240px] w-full">
                <BarChart data={accuracyData}>
                  <XAxis dataKey="session" tick={{ fontSize: 12, fontWeight: 500 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fontWeight: 500 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="accuracy" fill="var(--color-accuracy)" radius={8} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/5 rounded-[2rem] overflow-hidden shadow-sm">
            <CardHeader className="pb-2 pt-6 px-8">
              <CardTitle className="text-lg font-bold">
                Knowledge Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-8">
              <ChartContainer config={chartConfig} className="h-[240px] w-[240px]">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
