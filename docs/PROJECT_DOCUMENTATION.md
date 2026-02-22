# Math Odyssey - Lab Evaluation 2

## Course Details

| Field | Value |
|-------|-------|
| **Course Code** | 23CSE461 |
| **Course Name** | Full Stack Development |
| **Course Teacher** | Dr. T. Senthil Kumar, Professor |
| **Institution** | Amrita School of Computing, Amrita Vishwa Vidyapeetham |
| **Location** | Coimbatore - 641112 |
| **Email** | [t_senthilkumar@cb.amrita.edu](mailto:t_senthilkumar@cb.amrita.edu) |

## Team Member Details

| Roll No | Name |
|---------|------|
| CB.SC.U4CSE23155 | Anurup R Krishnan |

## GitHub Product Page Details

- **Product Name**: Math Odyssey
- **Live Demo**: https://math-safari-gold.vercel.app/
- **GitHub URL**: https://github.com/Anurup-R-Krishnan/math-odyssey
- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, shadcn/ui

---

## Product Description

### About the Project

**Math Odyssey** is a mission-driven, browser-based mathematics learning platform designed for children with Autism Spectrum Disorder (ASD). Built with React 18 and TypeScript, the application provides structured, predictable learning experiences through gamification and adaptive difficulty.

The portal includes the following missions:

1. **Addition Basics** - Visual dot grouping with blue and green objects
2. **Subtraction Start** - Animated fade-out of red dots
3. **Multiplication Magic** - Tiered difficulty (0-5, 0-9, 1-12)
4. **Division Dash** - Whole number results only
5. **Fraction Fun** - SVG pie chart visualization
6. **Pattern Recognition** - Color sequences (ABAB, AABB, ABC)
7. **Math Master (Boss Mission)** - Mixed problems at Level 3

### Core Features

- **10-Question Missions** - Each session contains 10 problems
- **Adaptive Difficulty** - Increases after 5 correct, decreases after 3 wrong
- **Progressive Hints** - 3-tier support system (Hint 1 → Hint 2 → Answer Reveal)
- **Micro-Practice** - Easier practice question after 3 wrong attempts
- **Focus Mode** - Respects `prefers-reduced-motion` for sensory sensitivity
- **Star Rewards** - 0-3 stars based on accuracy (>90% = 3★, >70% = 2★, >50% = 1★)
- **Analytics Dashboard** - Session tracking, accuracy charts, CSV export

---

## Role of React and TypeScript

### React (Frontend)

**Math Odyssey** is a fully client-side application with no backend server.

- **Functional Components** - Modular, reusable UI (`QuestionCard`, `MissionMap`, `ObjectVisualizer`)
- **Custom Hooks** - Business logic encapsulation:
  - `useMissionProgress` - Mission state and sequential unlocking
  - `useGameSession` - Session tracking and CSV export
  - `useFocusMode` - Accessibility preferences
  - `useStars` - Global star counter
- **State Management** - localStorage for client-side persistence
- **Framer Motion** - Declarative animations (star celebration, pilot movement, fade-out)
- **React Router** - Client-side routing (Mission Map, Game, Dashboard)

### TypeScript

- **Type Safety** - Interfaces for `Question`, `Mission`, `GameSession`, `QuestionAttempt`
- **Compile-Time Checks** - Prevents runtime errors
- **Better Developer Experience** - IntelliSense and autocomplete

### No Backend (Privacy-First)

- All data stored in browser localStorage
- No server-side tracking or user accounts
- CSV export generated client-side using Blob API
- Ensures complete privacy for learners

---

## How Each Mission Helps Autism Learners

### 1. Addition Basics

**Visual Representation**: Blue dots (operand A) + Green dots (operand B), grouped by 5s

**How it Helps**:
- Concrete visualization makes abstract addition tangible
- Grouping by 5s reduces counting cognitive load
- Immediate feedback builds confidence

**React Concepts**: `useState`, `ObjectVisualizer` component, conditional rendering

---

### 2. Subtraction Start

**Visual Representation**: Blue dots (minuend) - Red dots (subtrahend) with fade-out animation

**How it Helps**:
- Visual removal makes subtraction concrete
- Fade-out animation shows "taking away"
- Reduces abstract numerical stress

**React Concepts**: `useState`, `useEffect`, Framer Motion animations

---

### 3. Multiplication Magic

**Difficulty Tiers**:
- Level 1: Factors 0-5
- Level 2: Factors 0-9
- Level 3+: Factors 1-12

**How it Helps**:
- Gradual complexity builds confidence
- Adaptive difficulty prevents frustration
- Repetition strengthens retention

**React Concepts**: `useState`, adaptive difficulty algorithm

---

### 4. Division Dash

**Feature**: Whole number results only (no remainders)

**How it Helps**:
- Reduces cognitive load for beginners
- Ensures correct answers are integers
- Builds foundational understanding

**React Concepts**: `useState`, answer validation logic

---

### 5. Fraction Fun

**Visual Representation**: SVG pie chart with filled portions

**How it Helps**:
- Concrete visual for "parts of a whole"
- Color-coded filled vs. unfilled sections
- Bridges abstract fractions to visual understanding

**React Concepts**: Dynamic SVG rendering, `useState`

---

### 6. Pattern Recognition

**Visual Representation**: Color sequences with distinct shapes

**Patterns**:
- Level 1: ABAB or AABB
- Level 2+: ABC

**How it Helps**:
- Trains logical order and prediction
- Color labels support color-blind learners
- Distinct shapes (circle, square, leaf, diamond) aid recognition

**React Concepts**: `PatternVisualizer` component, array mapping

---

### 7. Math Master (Boss Mission)

**Challenge**: Mixed problems at Level 3

**How it Helps**:
- Tests mastery across all concepts
- Unlocked after completing 6 missions
- Provides sense of achievement

**React Concepts**: Mission unlocking logic, star rewards

---

## About the Use Case - Autism Learning Portal

### Why is this portal required for autism children?

Children with Autism Spectrum Disorder (ASD) often face challenges such as:
- Difficulty in abstract thinking
- Sensory sensitivity
- Short attention span
- Difficulty in working memory
- Need for repetitive structured learning

Traditional learning methods may not suit their cognitive style. **Math Odyssey** provides a predictable, structured, and visually supportive environment.

### Challenges Addressed by This Portal

| Challenge | Solution in Math Odyssey |
|-----------|--------------------------|
| **Abstract Number Understanding** | Visual dots, pattern blocks, fraction pie charts |
| **Short Attention Span** | 10-question missions with animated progress bar |
| **Sensory Overload** | Focus mode toggle, calm color palette, optional animations |
| **Need for Repetition** | Randomized question generation, unlimited practice |
| **Working Memory Difficulty** | Visual cues, grouped dots (by 5s), progressive hints |

### Highlights and Novelty of the Portal

- **Adaptive Difficulty Algorithm**: Real-time adjustment based on performance
- **Micro-Practice System**: After 3 wrong attempts, provides easier practice question
- **Focus Mode**: Respects `prefers-reduced-motion` media query
- **Privacy-First**: No backend, all data in localStorage
- **Keyboard Navigation**: Number keys (1-4) for answer selection
- **Star Rewards**: 0-3 stars based on accuracy
- **Mission Progression**: Sequential unlocking (complete N to unlock N+1)
- **Analytics Dashboard**: Bar charts (accuracy), pie charts (correct/incorrect), CSV export

### Importance of Visualization in This Portal

Visualization is critical for autism learners because:
- **Concrete visuals** improve number comprehension
- **Dot grouping** (by 5s) makes counting easier
- **Fade-out animation** (subtraction) makes removal tangible
- **Pattern sequences** demonstrate logical order visually
- **Pie charts** (fractions) show "parts of a whole" concept

Visualization bridges the gap between symbolic numbers and real-world understanding.

---

## Improvements Brought to Autism Children

### 1. Memory Improvement
- Repeated exposure through randomized questions
- Visual cues reduce memory load
- Micro-practice reinforces concepts

### 2. Contextual Learning
- Mission-based narrative (space/pilot theme)
- Consistent UI reduces cognitive switching
- Predictable structure builds confidence

### 3. Attention Stabilization
- 10-question sessions prevent fatigue
- Animated progress bar maintains engagement
- Immediate feedback holds focus

### 4. Logical Thinking Development
- Step-by-step arithmetic reasoning
- Progressive hints scaffold learning
- Adaptive difficulty matches skill level

### 5. Confidence Building
- Emotion-neutral feedback ("Try Again" not "Wrong")
- Star rewards for achievement
- Micro-practice after struggles (not punishment)

---

## List of Operations in the Portal

| Operation | Expected Output | React Concepts Used | How the Concept Improved Application |
|-----------|----------------|---------------------|-------------------------------------|
| **Addition Mission** | Compute sum correctly | `useState`, `ObjectVisualizer`, conditional rendering | Visual dot grouping makes addition concrete |
| **Subtraction Mission** | Find remaining after removal | `useState`, `useEffect`, Framer Motion | Fade-out animation shows "taking away" |
| **Multiplication Mission** | Compute product | `useState`, adaptive difficulty | Tiered difficulty builds confidence gradually |
| **Division Mission** | Compute quotient | `useState`, answer validation | Whole number results reduce cognitive load |
| **Fraction Mission** | Identify fraction | Dynamic SVG rendering, `useState` | Pie chart visualizes "parts of a whole" |
| **Pattern Mission** | Complete sequence | `PatternVisualizer`, array mapping | Color/shape sequences train logical order |
| **Mission Progression** | Unlock next mission | `useMissionProgress`, localStorage | Sequential unlocking provides structure |
| **Difficulty Adaptation** | Adjust problem complexity | `useGameSession`, consecutive tracking | Real-time adjustment prevents frustration |
| **Hint System** | Provide scaffolded support | `useState`, conditional rendering | 3-tier hints guide without revealing immediately |
| **Micro-Practice** | Practice after 3 wrong | `generateMicroPractice`, `useState` | Easier question reinforces concept |
| **Analytics Dashboard** | View performance | `useMemo`, Recharts, CSV export | Bar/pie charts show progress visually |
| **Focus Mode** | Reduce animations | `useFocusMode`, media query | Respects sensory sensitivity preferences |

---

## Algorithms Implemented in the Product

### 1. Random Number Generation
Used in all question generators.
```javascript
Math.floor(Math.random() * N) + 1
```

### 2. Unique Option Generation using Set
Ensures no duplicate answer options.
```javascript
const distractors = new Set<number>();
distractors.add(answer);
while (distractors.size < 4) {
  const d = answer + Math.floor(Math.random() * range) - offset;
  if (d >= 0 && d !== answer) distractors.add(d);
}
```

### 3. Adaptive Difficulty Algorithm
```javascript
// Increase difficulty after 5 consecutive correct
if (consecutiveCorrect >= 5) {
  level = level + 1;
  consecutiveCorrect = 0;
  consecutiveWrong = 0;
}

// Decrease difficulty after 3 consecutive wrong
if (consecutiveWrong >= 3) {
  level = Math.max(1, level - 1);
  consecutiveCorrect = 0;
  consecutiveWrong = 0;
}
```

### 4. Star Calculation Algorithm
```javascript
const accuracy = (correctCount / totalQuestions) * 100;
let stars = 0;
if (accuracy >= 90) stars = 3;
else if (accuracy >= 70) stars = 2;
else if (accuracy >= 50) stars = 1;
```

### 5. Addition Question Generation
```javascript
if (difficulty === 1) {
  a = Math.floor(Math.random() * 6); // 0-5
  b = Math.floor(Math.random() * (11 - a)); // sum <= 10
} else if (difficulty === 2) {
  a = Math.floor(Math.random() * 10); // 0-9
  b = Math.floor(Math.random() * 10); // 0-9
} else {
  const max = 10 + difficulty * 5;
  a = Math.floor(Math.random() * max) + 1;
  b = Math.floor(Math.random() * max) + 1;
}
```

### 6. Pattern Sequence Generation
```javascript
if (patternType === "ABAB") {
  sequence = [c1, c2, c1, c2, c1, "?"];
  answer = c2;
} else if (patternType === "AABB") {
  sequence = [c1, c1, c2, c2, c1, "?"];
  answer = c1;
} else { // ABC
  sequence = [c1, c2, c3, c1, c2, "?"];
  answer = c3;
}
```

### 7. Micro-Practice Generation
```javascript
export function generateMicroPractice(original: Question): Question {
  return generateQuestion(original.type, Math.max(1, original.difficulty - 1));
}
```

---

## Similar Products

| Product Name | URL | Description | Key Features |
|--------------|-----|-------------|--------------|
| **Khan Academy Kids** | https://www.khanacademy.org/kids | Free educational app for ages 2-8 | Math games, adaptive learning, progress tracking |
| **Prodigy Math** | https://www.prodigygame.com | Game-based math platform | RPG-style missions, adaptive difficulty, curriculum-aligned |
| **SplashLearn** | https://www.splashlearn.com | Math & reading games | Visual learning, rewards system, parent dashboard |
| **Number Kids: Math Games** | https://apps.apple.com | Montessori-style math app | Counting, tracing, addition, subtraction, comparison |

**Math Odyssey Differentiators**:
- Specifically designed for autism learners
- No backend (privacy-first)
- Focus mode for sensory sensitivity
- Micro-practice after struggles
- Open-source and free

---

## Feature Enhancements That Can Be Done

### 1. AI-Based Difficulty Adaptation
- Use machine learning to predict optimal difficulty
- Analyze time-per-question for engagement metrics
- Personalize hint timing based on learner patterns

### 2. Progress Tracking Dashboard (Enhanced)
- Time-per-question graphs
- Concept mastery heatmaps
- Difficulty progression timeline

### 3. Parent/Educator Analytics Module
- Class-wide performance reports
- Individual learner insights
- Exportable PDF reports

### 4. Speech-Based Instructions
- Text-to-speech for questions
- Speech-to-text for answers
- Multi-language support

### 5. Multilingual Support
- Translate UI and questions
- Support for regional languages
- Audio instructions in native language

### 6. Reward Badges System
- Achievement badges for milestones
- Customizable pilot avatars
- Mission completion certificates

### Justification

These enhancements will:
- **Personalize learning** through AI adaptation
- **Monitor cognitive progress** via detailed analytics
- **Improve engagement** with rewards and gamification
- **Increase accessibility** through speech and multilingual support
- **Support educators** with class-wide insights

---

## Mouse Events, Touch Events, and Screen Interaction

### Keyboard Navigation

**Implementation**: Number keys (1-4) select answer options

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key;
    const index = parseInt(key, 10) - 1;
    if (index >= 0 && index < activeQuestion.options.length) {
      const option = activeQuestion.options[index];
      handleAnswer(option);
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [activeQuestion, handleAnswer]);
```

**How it Improves Application**:
- Faster answer selection for keyboard users
- Accessibility for motor-impaired learners
- Reduces mouse dependency

---

### Mouse Events

**Implementation**: Click on answer buttons

```typescript
<Button
  onClick={() => handleAnswer(option)}
  className={isSelected ? "border-primary" : ""}
>
  {String(option)}
</Button>
```

**How it Improves Application**:
- Intuitive point-and-click interaction
- Visual feedback on hover
- Shake animation on wrong answer

---

### Touch Events

**Implementation**: Touch support for mobile devices

All buttons and interactive elements use React's synthetic events, which automatically handle touch events on mobile browsers.

**How it Improves Application**:
- Full mobile device support
- Responsive touch targets (minimum 44x44px)
- Works on tablets and smartphones

---

### Screen Interaction - Animated Feedback

#### 1. Star Celebration Animation
When a correct answer is submitted:
```typescript
<motion.div
  animate={{
    scale: [1, 1.2, 1],
    rotate: [0, 10, -10, 0],
    y: [0, -10, 0]
  }}
  transition={{ duration: 0.8 }}
>
  <Star className="fill-current" />
</motion.div>
```

#### 2. Pilot Progress Animation
Pilot icon moves along progress bar:
```typescript
<motion.div
  animate={{ left: `${progressPercent}%` }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
  <Rocket className="rotate-45" />
</motion.div>
```

#### 3. Fade-Out Animation (Subtraction)
Red dots fade out to show removal:
```typescript
<motion.div
  animate={fadeOut ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
  transition={{ delay: i * 0.04, duration: 0.25 }}
/>
```

**How it Improves Application**:
- Visual feedback reinforces learning
- Animations maintain engagement
- Concrete representation of abstract concepts

---

## Research Evidence

### 1. Adaptive Serious Games for Autism
**Study**: Abouelenein et al. (2025)  
**Sample**: 14 autistic children  
**Findings**: Adaptive serious games improved communication pathways and motivation  
**Application in Math Odyssey**: Mission pacing, star-based feedback, adaptive difficulty  
**DOI**: https://doi.org/10.1007/s10639-025-13728-w

### 2. Digital Math Games for Learning Disabilities
**Study**: Polydoros & Antoniou (2025)  
**Design**: Controlled comparison  
**Findings**: Digital math games produced superior math performance  
**Application in Math Odyssey**: 10-question mission structure, gamification elements  
**DOI**: https://doi.org/10.3390/bs15030282

### 3. Serious Games for Social Skills Development
**Study**: Carneiro et al. (2024)  
**Type**: Systematic review  
**Findings**: Predictable, gamified environments improve emotion recognition  
**Application in Math Odyssey**: Consistent UI, repetitive structure, neutral feedback  
**DOI**: https://doi.org/10.3390/healthcare12050508

---

## Development Setup

### Local Installation

```bash
# Clone repository
git clone https://github.com/Anurup-R-Krishnan/math-odyssey.git
cd math-odyssey/math-explorer

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server (http://localhost:5173) |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run Vitest tests |
| `pnpm lint` | Run ESLint |

### CI/CD Pipeline

**GitHub Actions** (`.github/workflows/ci.yml`):
- Type check with TypeScript
- Run unit tests
- Build production bundle
- Deploy to Vercel

---

## Acknowledgments

- **Course Instructor**: Dr. T. Senthil Kumar
- **Institution**: Amrita School of Computing, Amrita Vishwa Vidyapeetham
- **Target Audience**: Children with Autism Spectrum Disorder
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Deployment**: Vercel

---

*Last Updated: February 19, 2026*  
*Version: 1.0.0*  
*Developer: Anurup R Krishnan (CB.SC.U4CSE23155)*
