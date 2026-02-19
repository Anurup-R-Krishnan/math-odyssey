import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Download } from "lucide-react";

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
  const handleDownload = async () => {
    // Dynamically import to keep initial bundle small
    const { generateSubmissionZip } = await import("@/lib/docGenerator");
    await generateSubmissionZip();
  };

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

      <Card className="border-2 border-primary/10 rounded-[2rem] overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/30 pt-8 px-8">
          <CardTitle className="text-xl font-bold">Mission Assets</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-4">
          <p className="text-base text-muted-foreground leading-relaxed">
            Download the full mission package containing development documentation and final evaluation screenshots.
          </p>
          <Button onClick={handleDownload} size="lg" className="rounded-xl h-14 px-8 font-bold shadow-sm">
            <Download className="h-5 w-5 mr-3" />
            Download Submission ZIP
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default Members;
