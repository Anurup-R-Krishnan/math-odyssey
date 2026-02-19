import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProductDescription = () => {
  return (
    <section className="container max-w-4xl py-12 px-6 space-y-12 animate-in fade-in duration-500">
      <div className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight">Mission Brief</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          NeuroMath is a visual, game-based learning environment crafted specifically for the unique needs of autistic learners.
        </p>
      </div>

      <Card className="border-2 border-primary/10 rounded-[2rem] overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/30 pt-8 px-8">
          <CardTitle className="text-xl font-bold">Logistics & Command</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-2 text-base">
          <p>
            <span className="font-medium">Course Teacher:</span> Dr. T. Senthil
            Kumar
          </p>
          <p>
            <span className="font-medium">Department:</span> Amrita School of
            Computing
          </p>
          <p>
            <span className="font-medium">Institution:</span> Amrita Vishwa
            Vidyapeetham
          </p>
          <p>
            <span className="font-medium">Address:</span> Coimbatore - 641112
          </p>
          <p>
            <span className="font-medium">Email:</span>{" "}
            <a
              href="mailto:t_senthilkumar@cb.amrita.edu"
              className="text-primary hover:underline"
            >
              t_senthilkumar@cb.amrita.edu
            </a>
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Why NeuroMath?
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          Children on the autism spectrum often benefit from structured,
          predictable, and visually engaging learning environments. Traditional
          math instruction can be overwhelming due to social expectations, rapid
          pacing, and ambiguous feedback. NeuroMath addresses these challenges
          with:
        </p>
        <ul className="space-y-3">
          {[
            "Emotion-neutral feedback to reduce performance anxiety.",
            "Guided micro-hints that scaffold learning step-by-step.",
            "Concrete visual representations using geometric shapes.",
            "Adaptive difficulty that respects the learner's individual pace.",
            "Sensory-friendly design with a permanent focus-first layout."
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-3 text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-secondary-foreground mt-0.5">
                {i + 1}
              </div>
              <span className="text-base">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Adaptive Support System
        </h2>
        <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
          <p>
            <span className="font-medium text-foreground">Neutral feedback:</span>{" "}
            The system never uses negative phrasing. On an incorrect attempt, the
            learner sees "Try Again" or "Give it another shot." On success, a calm
            acknowledgment: "Nice -- you solved it."
          </p>
          <p>
            <span className="font-medium text-foreground">Micro-hint escalation:</span>{" "}
            After the first incorrect attempt, a contextual hint appears (e.g.,
            "Try grouping into fives"). A second incorrect attempt triggers a more
            specific hint. After a third incorrect attempt, the answer is gently
            revealed with an animated demonstration, followed by a micro-practice
            question at the same support level.
          </p>
          <p>
            <span className="font-medium text-foreground">Privacy-first metrics:</span>{" "}
            All data stays local. Session exports contain only anonymized
            performance data -- no PII, no images.
          </p>
        </div>
      </div>

      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-center">
          Mission Specialties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Addition Mission",
              desc: "Visual dot grouping with calming animations. Missions guide learners to discover the power of combining sets.",
              color: "bg-primary/10"
            },
            {
              title: "Subtraction Mission",
              desc: "Concrete visual removal of items. See the remainder clearly as objects gently fade from the field.",
              color: "bg-destructive/10"
            },
            {
              title: "Pattern Mission",
              desc: "Color and shape sequences that build predictive thinking and logic through visual repetition.",
              color: "bg-accent/20"
            },
          ].map((item) => (
            <Card key={item.title} className="border-2 border-primary/5 rounded-[2rem] overflow-hidden shadow-sm">
              <CardHeader className={`${item.color} pt-6 pb-4`}>
                <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductDescription;
