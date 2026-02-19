import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const REPO_URL = "https://github.com/placeholder/neuromath";

const ProjectPage = () => {
  return (
    <section className="container max-w-4xl py-12 px-6 space-y-12 animate-in fade-in duration-500">
      <div className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight">Mission Tech</h1>
        <p className="text-lg text-muted-foreground">
          Behind the scenes of the mathematical galaxy.
        </p>
      </div>

      <Card className="border-2 border-primary/10 rounded-[2rem] overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/30 pt-8 px-8">
          <CardTitle className="text-xl font-bold">Base of Operations</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium inline-flex items-center gap-2"
          >
            GitHub Repository <ExternalLink className="h-4 w-4" />
          </a>
          <div className="space-y-3">
            <p className="font-bold text-foreground">Local System Boot</p>
            <pre className="bg-muted p-5 rounded-2xl text-xs font-mono overflow-x-auto border-2 border-primary/5 shadow-inner">
{`# Clone the repository
git clone ${REPO_URL}.git
cd neuromath

# Install dependencies (required)
pnpm install

# Start development server
pnpm dev

# Run mission tests
pnpm test`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/5 rounded-[2rem] overflow-hidden shadow-sm">
        <CardHeader className="pt-8 px-8">
          <CardTitle className="text-xl font-bold">Collaborators</CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="space-y-4 text-base">
            <div>
              <p className="font-medium">Academic Advisor</p>
              <p className="text-muted-foreground">
                Dr. T. Senthil Kumar, Amrita School of Computing
              </p>
            </div>
            <div>
              <p className="font-medium">Development Team</p>
              <p className="text-muted-foreground">
                See the Team page for full member details
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/5 rounded-[2rem] overflow-hidden shadow-sm">
        <CardHeader className="pt-8 px-8">
          <CardTitle className="text-xl font-bold">Engine Components</CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="flex flex-wrap gap-3">
            {[
              "React",
              "Vite",
              "TypeScript",
              "Tailwind CSS",
              "Framer Motion",
              "Recharts",
              "React Router",
              "Vitest",
              "shadcn/ui",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 text-sm font-bold rounded-full bg-secondary text-secondary-foreground shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/5 rounded-[2rem] overflow-hidden shadow-sm">
        <CardHeader className="pt-8 px-8">
          <CardTitle className="text-xl font-bold">Intelligence Sources</CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Autism CRC -- Cooperative Research Centre for Living with Autism",
              "MIT Media Lab -- Affective Computing Group",
              "Stanford Autism Center -- Behavioral Interventions",
              "University of Bath -- Entertainment Research (CAMERA)",
              "National Autistic Society -- Education Research",
              "Georgia Tech -- Assistive Technology Lab"
            ].map((ref, i) => (
              <li key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-primary/5 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                {ref}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
};

export default ProjectPage;
