# NeuroMath Redesign Proposal: The Mission Map 🎨

This proposal outlines a visual and structural redesign for NeuroMath, specifically tailored for autistic children aged 7–10. The goal is to reduce cognitive overload, improve predictability, and create a delightful, sensory-friendly learning environment.

## 1. Design System Principles
- **Predictability over Novelty**: Consistent layouts and clear expectations.
- **Calm over Excitement**: Reducing sensory intensity while maintaining engagement.
- **Guided over Exploratory**: Clear pathways and "missions" instead of open-ended navigation.
- **Accessibility as Standard**: High readability, clear focus states, and keyboard support.

## 2. Color Palette Recommendations
We use a palette that avoids high-frequency "vibrating" colors and instead uses muted, calming tones.

| Use Case | Color Name | HEX Code | Rationale |
|----------|------------|----------|-----------|
| **Background** | Soft Cream | `#FCF9F2` | Reduces glare compared to pure white. |
| **Primary Action** | Calm Blue | `#A5C9EA` | Calming, widely associated with trust and stability. |
| **Success/Progress** | Sage Green | `#BDE0BC` | Natural, grounding, and provides gentle positive feedback. |
| **Alert/Warning** | Soft Terracotta | `#E2A292` | Less alarming than bright red, while still distinct. |
| **Text** | Charcoal | `#333333` | High contrast for readability, but softer than pure black. |
| **Secondary/Accent** | Muted Peach | `#F9D5BB` | Warm and friendly without being overwhelming. |

## 3. Typography
- **Primary Font**: **Lexend**
    - *Why*: Specifically designed to reduce visual stress and improve reading fluency. It has generous character spacing and distinct letterforms.
- **Hierarchy**:
    - **H1 (Titles)**: 32px, Bold, Charcoal. Used for page goals (e.g., "Addition Mission").
    - **Body Text**: 20px, Regular, Charcoal. Large enough for easy reading without squinting.
    - **Button Text**: 18px, Medium. Clear and legible.

## 4. Layout Structure: The Mission Map
The website will transition from a traditional multi-page site to a "Guided Mission" experience.

### Homepage (The Map)
- **Visual**: A simple, grid-based or slightly winding path layout.
- **Stations**: Three main "Mission Stations" (Addition, Subtraction, Pattern Recognition).
- **Structure**:
    - Header: Simple logo (NeuroMath) and a "Dashboard" link for parents/teachers.
    - Main Area: The Map. Large, friendly cards for each station.
    - Footer: Minimalist, neutral.

### Lesson/Game Page
- **Visual**: Centered focus. No sidebars or distracting headers.
- **Components**:
    - **Progress Bar**: A simple, thick bar at the top showing "Mission Progress".
    - **Question Card**: Large, centered card with rounded corners.
    - **Visual Aids**: Abstract icons (circles/squares) used for math operations to maintain focus on logic rather than complex illustrations.

## 5. Navigation Improvements
- **Linear Flow**: Home -> Mission Selection -> Gameplay -> Results -> Back to Home.
- **Predictable Back Buttons**: Always in the same top-left location.
- **Simplified Menu**: Reducing the 6-link header to just the essentials for the child learner.

## 6. UI Component Design
- **Buttons**: Large touch targets (min 48px height), rounded corners, subtle hover scale effects (1.02x).
- **Cards**: Soft shadows (shadow-sm) to create depth without visual clutter.
- **Icons**: Simple, thick-stroke icons (Lucide-react) in muted colors.
- **Focus States**: Thick, high-contrast rings (Sage Green) around active elements.

## 7. Sensory & Accessibility Considerations
- **Animations**:
    - No auto-playing or looping animations.
    - Micro-interactions (e.g., button clicks) use gentle "fade" or "scale" transitions.
    - Transitions are kept under 300ms.
- **Contrast**: Ensuring all text meets WCAG AA standards (4.5:1 ratio).
- **Sound**: Strictly no background sounds. (Audio feedback for correct answers is optional and must be user-triggered).
- **Negative Space**: Generous margins (min 24px) between elements to prevent a "crowded" feeling.
