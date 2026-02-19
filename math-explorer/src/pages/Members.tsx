import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TEAM_MEMBERS = [
  {
    name: "[Member Name 1]",
    rollNo: "[Roll No 1]",
    role: "Developer",
    initials: "M1",
  },
  {
    name: "[Member Name 2]",
    rollNo: "[Roll No 2]",
    role: "Designer",
    initials: "M2",
  },
  {
    name: "[Member Name 3]",
    rollNo: "[Roll No 3]",
    role: "Tester",
    initials: "M3",
  },
];

const Members = () => {
  return (
    <section className="container max-w-4xl py-12 px-6 space-y-12 animate-in fade-in duration-500">
      <div className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight">Mission Control</h1>
        <p className="text-lg text-muted-foreground">
          The team behind NeuroMath.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {TEAM_MEMBERS.map((member) => (
          <Card key={member.rollNo} className="border-2 border-primary/5 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-8 flex flex-col items-center text-center space-y-4 p-8">
              <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xl font-bold">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-bold text-lg">{member.name}</p>
                <p className="text-sm font-medium text-primary uppercase tracking-tight">{member.role}</p>
                <p className="text-xs text-muted-foreground font-mono">{member.rollNo}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Members;
