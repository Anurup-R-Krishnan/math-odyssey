# Real-Time Co-Play Mode with Emotion Tracking - VC Plan

## Implementation Plan

### Phase 1: Foundation (Week 1-2)

**1.1 WebRTC Screen Sharing**
- Add peer-to-peer connection between parent and child devices
- Child shares game screen to parent dashboard
- Parent sees live feed with <500ms latency

**1.2 Role System**
- New user types: `child`, `parent`, `therapist`
- Session pairing via 6-digit room codes
- Parent dashboard route: `/parent-view/:sessionCode`

**1.3 Basic UI**
- Parent sees: Child's screen feed + question metadata
- Child sees: Small "👁️ Parent watching" indicator (toggleable)

**Tech:**
- `simple-peer` for WebRTC
- `socket.io` for signaling server
- Deploy signaling server on AWS Lambda + API Gateway (serverless)

---

### Phase 2: Silent Encouragement System (Week 3)

**2.1 Sticker Library**
- 8 animated stickers: ⭐ Great job, 💪 Keep going, 🎯 Focus, 🧠 Think, 👀 Look closer, ✨ Almost, 🚀 You got this, ❤️ Love you
- Parent clicks sticker → appears on child's screen for 3 seconds
- Framer Motion animation: fade in from top, gentle bounce, fade out

**2.2 Timing Intelligence**
- Stickers only appear between questions (not during active answering)
- Queue system if parent sends multiple
- Child can disable stickers in settings

**Tech:**
- Socket event: `parent:sendSticker` → `child:receiveSticker`
- Store sticker preferences in localStorage

---

### Phase 3: Ghost Drawing (Week 4-5)

**3.1 Canvas Overlay**
- Transparent canvas layer over child's game screen
- Parent draws with mouse/touch → strokes appear on child's screen
- Auto-fade after 5 seconds
- Parent can clear drawing instantly

**3.2 Drawing Tools**
- Circle tool (highlight dots/numbers)
- Arrow tool (point to correct answer area)
- Free draw (for custom hints)
- Color picker (default: yellow with 40% opacity)

**3.3 Smart Constraints**
- Drawing only enabled when child is on "answering" phase
- Cannot draw over answer buttons (prevent spoilers)
- Max 3 strokes per question

**Tech:**
- HTML5 Canvas API
- Capture parent's canvas coordinates → transmit via socket → replay on child's canvas
- Use `fabric.js` for drawing tools

---

### Phase 4: Emotion Detection (Week 6-7)

**4.1 Webcam Integration (Optional)**
- Child opts-in via settings
- Camera permission request with clear privacy explanation
- Video stays local (not transmitted to parent)

**4.2 Emotion Model**
- Use `face-api.js` (TensorFlow.js wrapper)
- Detect 4 states: Neutral, Frustrated, Confused, Happy
- Run inference every 2 seconds (low CPU usage)
- Display emotion timeline on parent dashboard

**4.3 Frustration Alerts**
- If "Frustrated" detected for 6+ seconds → notify parent
- Parent gets vibration + sound alert
- Shows which question triggered frustration

**4.4 Privacy First**
- All processing happens in browser (no video uploaded)
- Parent sees emotion labels only, not video feed
- Child can disable camera anytime

**Tech:**
- `face-api.js` with tiny face detector model (~300KB)
- Emotion data sent as JSON: `{timestamp, emotion, questionId}`

---

### Phase 5: Pause & Rewind (Week 8)

**5.1 Session Control**
- Parent can pause child's game
- Child sees: "Mom wants to help - taking a break ☕"
- Timer stops, question stays visible
- Parent can unpause or trigger "Try Again" (resets current question)

**5.2 Question History**
- Parent sees last 3 questions with child's attempts
- Can click "Redo this one" → child gets same question again
- Useful for reinforcing concepts

**Tech:**
- Socket events: `parent:pauseGame`, `parent:resumeGame`, `parent:redoQuestion`
- Store question history in session state

---

### Phase 6: Parent Dashboard Analytics (Week 9-10)

**6.1 Live Metrics**
- Current question number (3/10)
- Accuracy so far (70%)
- Hints used (2)
- Emotion timeline graph
- Average time per question

**6.2 Post-Session Report**
- Which questions took longest
- Emotion patterns (frustrated on division, happy on patterns)
- Stickers sent vs. child's performance correlation
- Downloadable PDF report

**6.3 Multi-Session Trends**
- Compare today vs. last week
- Identify consistent struggle areas
- Emotion stability over time

**Tech:**
- Recharts for live graphs
- `jsPDF` for report generation
- Store session data in localStorage + optional cloud sync

---

### Phase 7: Monetization & Scaling (Week 11-12)

**7.1 Pricing Tiers**

**Free:**
- Solo play (existing features)
- 3 co-play sessions/month

**Premium ($15/mo):**
- Unlimited co-play
- Emotion tracking
- Session recordings (30 days)
- PDF reports

**Clinical ($50/mo):**
- Multi-therapist access (3 therapists per child)
- 90-day session history
- HIPAA-compliant cloud storage
- Export to CSV for clinical notes

**7.2 Payment Integration**
- Stripe Checkout for subscriptions
- Trial: 14 days free premium

**7.3 Therapist Marketplace (Future)**
- Parents book 30-min sessions with certified therapists
- Therapist joins co-play mode
- Platform takes 20% commission

---

### Phase 8: Privacy & Compliance (Week 13)

**8.1 COPPA Compliance**
- Parental consent flow for users <13
- No data collection without consent
- Clear privacy policy

**8.2 Data Encryption**
- WebRTC uses DTLS (encrypted by default)
- Emotion data encrypted at rest
- Option to delete all data

**8.3 Accessibility**
- Screen reader support for parent dashboard
- Keyboard navigation for all controls
- High contrast mode

---

## Technical Architecture

```
┌─────────────────┐         ┌──────────────────┐
│  Child Device   │◄───────►│ Signaling Server │
│  (React App)    │  Socket │  (AWS Lambda)    │
└─────────────────┘         └──────────────────┘
        │                            ▲
        │ WebRTC P2P                 │
        ▼                            │
┌─────────────────┐                 │
│ Parent Device   │─────────────────┘
│ (Dashboard)     │
└─────────────────┘
```

**Key Dependencies:**
- `simple-peer` - WebRTC wrapper
- `socket.io-client` - Real-time communication
- `face-api.js` - Emotion detection
- `fabric.js` - Canvas drawing
- `stripe` - Payments

**Infrastructure:**
- Frontend: Vercel (existing)
- Signaling: AWS Lambda + API Gateway WebSocket
- Database: Firebase Firestore (session history)
- Storage: AWS S3 (session recordings)

---

## MVP Scope (Ship in 4 Weeks)

**Include:**
- WebRTC screen sharing
- Room code pairing
- Silent sticker system (5 stickers)
- Basic parent dashboard (live view + current question)
- Pause/resume control

**Exclude (v2):**
- Ghost drawing
- Emotion detection
- Session recordings
- Payment system

**Success Metrics:**
- 50 parent-child pairs using co-play
- Average session length >15 minutes
- 80% of parents say "this helps me support my child better"

---

## Risk Mitigation

**Technical Risks:**
- WebRTC fails on some networks → Fallback to TURN server (AWS)
- Emotion model too slow → Use lighter model or reduce inference frequency
- High latency → Show latency indicator, suggest better WiFi

**Product Risks:**
- Parents over-intervene → Add "intervention score" to make them aware
- Kids feel watched → Make indicator more subtle, add "solo mode" quick toggle
- Privacy concerns → Emphasize local processing, add "no camera" mode

---

## Next Steps

### 1. Set up Socket.io Signaling Server

**Goal:** Enable real-time communication between parent and child devices

**Tasks:**
- Create new AWS Lambda function for WebSocket handling
- Configure API Gateway WebSocket routes (`$connect`, `$disconnect`, `$default`)
- Implement room management logic (create room, join room, leave room)
- Add connection state tracking (active sessions, peer mappings)
- Deploy and test with basic ping/pong messages

**Deliverables:**
- Lambda function code in `/server/signaling.js`
- API Gateway WebSocket endpoint URL
- Environment variables for frontend integration

**Time:** 2-3 days

---

### 2. Build Room Pairing Flow

**Goal:** Allow parents and children to connect via simple 6-digit codes

**Tasks:**
- Create room code generation utility (6-digit alphanumeric)
- Build "Start Co-Play Session" UI for child (generates code)
- Build "Join Session" UI for parent (enters code)
- Add room validation and error handling (invalid code, expired room, room full)
- Store active room mappings in DynamoDB or in-memory cache
- Add visual feedback (waiting for parent, connection established)

**Deliverables:**
- `/src/pages/CoPlayStart.tsx` - Child's session creation page
- `/src/pages/ParentJoin.tsx` - Parent's join page
- `/src/hooks/useRoomPairing.ts` - Room management hook
- Room code display component with copy-to-clipboard

**Time:** 2-3 days

---

### 3. Implement WebRTC Screen Sharing

**Goal:** Stream child's game screen to parent's dashboard with low latency

**Tasks:**
- Install and configure `simple-peer` library
- Implement screen capture on child device (`navigator.mediaDevices.getDisplayMedia`)
- Set up peer connection initialization (offer/answer exchange via signaling server)
- Handle ICE candidate exchange
- Display remote stream on parent dashboard
- Add connection quality indicators (latency, packet loss)
- Implement reconnection logic for dropped connections
- Add fallback to TURN server for restrictive networks

**Deliverables:**
- `/src/hooks/useWebRTC.ts` - WebRTC connection management
- `/src/components/coplay/ScreenStream.tsx` - Video display component
- TURN server configuration (Twilio or AWS)
- Connection status UI component

**Time:** 3-4 days

---

### 4. Create Parent Dashboard Skeleton

**Goal:** Build the parent-facing interface for monitoring and interaction

**Tasks:**
- Create `/src/pages/ParentDashboard.tsx` route
- Design layout: Main area (child's screen), sidebar (controls + metadata)
- Display live game metadata (current question, progress, accuracy)
- Add connection status indicator
- Build control panel skeleton (pause/resume buttons, sticker selector)
- Add responsive design for tablet/mobile parents
- Implement "End Session" flow with confirmation

**Deliverables:**
- `/src/pages/ParentDashboard.tsx` - Main dashboard page
- `/src/components/coplay/ParentControls.tsx` - Control panel
- `/src/components/coplay/LiveMetrics.tsx` - Real-time stats display
- `/src/types/coplay.ts` - TypeScript interfaces for co-play data

**Time:** 2-3 days

---

### 5. Test with 5 Beta Families

**Goal:** Validate core functionality and gather user feedback

**Tasks:**
- Recruit 5 families from autism support communities (Reddit, Facebook groups)
- Create beta testing guide with setup instructions
- Provide test accounts and session codes
- Schedule 30-minute observation sessions per family
- Collect feedback via post-session survey (Google Forms)
- Track technical issues (connection failures, latency problems)
- Measure key metrics (session completion rate, average latency, parent satisfaction)
- Document bugs and feature requests in GitHub Issues

**Deliverables:**
- Beta testing guide document
- Feedback survey with 10 key questions
- Bug report spreadsheet
- User feedback summary report
- Prioritized feature backlog for v2

**Time:** 1 week (including recruitment and testing)

---

## Total MVP Timeline: 4 Weeks

**Week 1:** Steps 1-2 (Signaling server + Room pairing)  
**Week 2:** Step 3 (WebRTC implementation)  
**Week 3:** Step 4 (Parent dashboard)  
**Week 4:** Step 5 (Beta testing + iteration)

**Go/No-Go Decision Point:** After beta testing, evaluate:
- Technical feasibility (connection success rate >90%)
- User satisfaction (NPS score >40)
- Product-market fit signals (parents willing to pay)

If metrics are positive → Proceed to Phase 2 (Silent Encouragement System)  
If metrics are weak → Pivot or iterate on core experience

---

## Post-MVP: Phases 6-8 (Week 9-13)

### Phase 6: Parent Dashboard Analytics (Week 9-10)

**Goal:** Transform raw session data into actionable insights for parents and therapists

**6.1 Live Metrics Dashboard**
- Real-time progress tracking (question 3/10, 70% accuracy)
- Hints usage counter with trend indicator
- Time-per-question live graph
- Emotion state timeline (if webcam enabled)
- Streak indicators (consecutive correct/wrong)

**6.2 Post-Session Reports**
- Session summary card (duration, accuracy, stars earned)
- Question-level breakdown (which took longest, which needed hints)
- Emotion correlation analysis (frustrated on division, confident on patterns)
- Sticker effectiveness metrics (performance after encouragement)
- Downloadable PDF report with charts

**6.3 Multi-Session Trend Analysis**
- Week-over-week comparison graphs
- Identify persistent struggle areas (e.g., always struggles with 7×8)
- Emotion stability tracking (is frustration decreasing over time?)
- Optimal session timing recommendations (performs best at 4pm)
- Progress milestones (first 10/10 session, 5-day streak)

**6.4 Therapist Integration**
- Export session data to CSV for clinical notes
- Annotate sessions with therapist observations
- Compare home practice vs. therapy session performance
- Goal tracking (IEP objectives progress)

**Tech Stack:**
- `recharts` for interactive graphs (already in project)
- `jsPDF` + `html2canvas` for PDF generation
- `date-fns` for time-series analysis
- Firebase Firestore for cloud session storage (optional)
- `react-query` for efficient data fetching

**Deliverables:**
- `/src/pages/SessionReport.tsx` - Detailed session view
- `/src/components/analytics/TrendChart.tsx` - Multi-session graphs
- `/src/components/analytics/EmotionTimeline.tsx` - Emotion visualization
- `/src/lib/reportGenerator.ts` - PDF export logic
- `/src/hooks/useSessionAnalytics.ts` - Data aggregation hook

**Time:** 2 weeks

---

### Phase 7: Monetization & Scaling (Week 11-12)

**Goal:** Launch sustainable revenue model and prepare for scale

**7.1 Pricing Tiers**

| Feature | Free | Premium ($15/mo) | Clinical ($50/mo) |
|---------|------|------------------|-------------------|
| Solo play | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited |
| Co-play sessions | 3/month | ✅ Unlimited | ✅ Unlimited |
| Emotion tracking | ❌ | ✅ | ✅ |
| Session recordings | ❌ | 30 days | 90 days |
| PDF reports | ❌ | ✅ | ✅ Advanced |
| Multi-therapist access | ❌ | ❌ | ✅ (3 therapists) |
| HIPAA compliance | ❌ | ❌ | ✅ |
| Priority support | ❌ | ❌ | ✅ |
| CSV export | ❌ | ✅ | ✅ |
| API access | ❌ | ❌ | ✅ |

**7.2 Payment Integration**
- Stripe Checkout for subscriptions
- 14-day free trial for Premium (no credit card required)
- Annual discount (2 months free)
- Family plan (2 children, $25/mo)
- School/clinic bulk licensing (custom pricing)

**7.3 Conversion Funnel**
- Free users hit 3-session limit → upgrade prompt with testimonial
- Show "locked" features during free sessions (emotion tracking preview)
- Email drip campaign after first co-play session
- Referral program (1 month free for each referral)

**7.4 Therapist Marketplace (Future Revenue Stream)**
- Certified therapists create profiles
- Parents book 30-min co-play sessions ($40-80/session)
- Platform takes 20% commission
- Therapist ratings and reviews
- Insurance billing integration (long-term)

**7.5 B2B Sales Strategy**
- Pilot program with 3 autism therapy centers
- School district licensing (per-student pricing)
- Research partnerships (free access for data contribution)
- White-label option for large organizations

**Tech Stack:**
- `@stripe/stripe-js` + `@stripe/react-stripe-js` for payments
- Stripe Webhooks for subscription management
- Feature flags system (`launchdarkly` or custom)
- Usage tracking middleware
- Admin dashboard for subscription management

**Deliverables:**
- `/src/pages/Pricing.tsx` - Pricing page with tier comparison
- `/src/components/payment/CheckoutFlow.tsx` - Stripe integration
- `/src/hooks/useSubscription.ts` - Subscription state management
- `/src/middleware/featureGate.ts` - Feature access control
- Stripe webhook handlers in backend
- Admin panel for customer management

**Time:** 2 weeks

---

### Phase 8: Privacy & Compliance (Week 13)

**Goal:** Ensure legal compliance and build trust with parents

**8.1 COPPA Compliance (Children's Online Privacy Protection Act)**
- Parental consent flow before any data collection
- Age gate on signup (parent must verify child is <13)
- Clear privacy notice in plain language
- Parental access to child's data (view/download/delete)
- No third-party advertising or tracking
- Annual privacy policy review

**8.2 HIPAA Compliance (for Clinical tier)**
- Business Associate Agreements (BAA) with therapists
- Encrypted data at rest (AES-256) and in transit (TLS 1.3)
- Access logs and audit trails
- Data breach notification procedures
- Minimum necessary data collection
- Secure data disposal after retention period

**8.3 Data Encryption & Security**
- WebRTC uses DTLS (encrypted by default)
- End-to-end encryption for emotion data
- Secure session token management (JWT with short expiry)
- Rate limiting on API endpoints
- DDoS protection (Cloudflare)
- Regular security audits (quarterly)

**8.4 User Data Rights**
- GDPR compliance (for international users)
- Right to access (download all data)
- Right to deletion (permanent account removal)
- Right to portability (export to JSON/CSV)
- Data retention policy (delete after 2 years of inactivity)

**8.5 Accessibility (WCAG 2.1 AA Compliance)**
- Screen reader support (ARIA labels on all interactive elements)
- Keyboard navigation (tab order, focus indicators)
- High contrast mode toggle
- Adjustable font sizes
- Reduced motion mode (respects `prefers-reduced-motion`)
- Alt text for all images and icons
- Color-blind friendly palette

**8.6 Terms of Service & Legal**
- Clear terms of service (reviewed by lawyer)
- Liability limitations
- Dispute resolution process
- Content ownership (user data belongs to user)
- Service availability disclaimers

**Tech Stack:**
- `aws-sdk` for KMS encryption
- `helmet` for security headers
- `rate-limiter-flexible` for rate limiting
- `winston` for audit logging
- `react-aria` for accessibility primitives
- Legal document templates (Termly or custom)

**Deliverables:**
- `/src/pages/Privacy.tsx` - Privacy policy page
- `/src/pages/Terms.tsx` - Terms of service page
- `/src/components/consent/ParentalConsent.tsx` - COPPA consent flow
- `/src/components/accessibility/AccessibilityMenu.tsx` - A11y controls
- `/src/lib/encryption.ts` - Data encryption utilities
- `/src/lib/auditLog.ts` - Compliance logging
- HIPAA compliance documentation
- Security audit report

**Time:** 1 week

---

## Improved Tech Stack

### Frontend (React App)

**Core:**
- React 18.3+ (concurrent features for smooth animations)
- TypeScript 5.3+ (strict mode enabled)
- Vite 5+ (fast dev server, optimized builds)
- React Router 6.20+ (client-side routing)

**UI & Styling:**
- Tailwind CSS 3.4+ (utility-first styling)
- shadcn/ui (accessible component primitives)
- Framer Motion 11+ (declarative animations)
- Lucide React (icon library)
- `react-aria` (accessibility primitives)

**Real-Time Communication:**
- `socket.io-client` 4.6+ (WebSocket client)
- `simple-peer` 9.11+ (WebRTC wrapper)
- `peerjs` (alternative WebRTC library, fallback)

**Data Visualization:**
- `recharts` 2.10+ (charts for analytics)
- `d3` 7.8+ (custom visualizations if needed)

**Emotion Detection:**
- `face-api.js` 0.22+ (TensorFlow.js wrapper)
- `@tensorflow/tfjs` 4.15+ (ML runtime)

**Canvas Drawing:**
- `fabric.js` 5.3+ (canvas manipulation)
- `perfect-freehand` (smooth drawing strokes)

**File Generation:**
- `jspdf` 2.5+ (PDF generation)
- `html2canvas` 1.4+ (DOM to canvas)
- `papaparse` 5.4+ (CSV parsing/generation)

**State Management:**
- React Context + hooks (lightweight state)
- `zustand` 4.4+ (global state if needed)
- `react-query` 5.17+ (server state management)

**Forms & Validation:**
- `react-hook-form` 7.49+ (form handling)
- `zod` 3.22+ (schema validation)

**Payment:**
- `@stripe/stripe-js` 2.4+
- `@stripe/react-stripe-js` 2.4+

**Utilities:**
- `date-fns` 3.0+ (date manipulation)
- `clsx` + `tailwind-merge` (className utilities)
- `nanoid` (unique ID generation)

---

### Backend (Signaling Server)

**Runtime:**
- Node.js 20 LTS (AWS Lambda or standalone)
- TypeScript 5.3+

**Framework:**
- Express 4.18+ (REST API)
- `socket.io` 4.6+ (WebSocket server)

**Database:**
- Firebase Firestore (real-time NoSQL, free tier generous)
- DynamoDB (alternative for AWS-native stack)
- Redis (session caching, room state)

**Authentication:**
- Firebase Auth (email/password, Google OAuth)
- JWT tokens for API authentication

**Storage:**
- AWS S3 (session recordings, PDF reports)
- CloudFront CDN (asset delivery)

**Serverless:**
- AWS Lambda (signaling server, webhooks)
- API Gateway WebSocket (WebSocket routing)
- AWS EventBridge (scheduled tasks)

**TURN Server:**
- Twilio TURN (reliable, pay-as-you-go)
- AWS Kinesis Video Streams (alternative)
- Self-hosted Coturn (cost-effective for scale)

**Monitoring:**
- AWS CloudWatch (logs, metrics)
- Sentry (error tracking)
- LogRocket (session replay for debugging)

**Security:**
- `helmet` (security headers)
- `rate-limiter-flexible` (rate limiting)
- AWS WAF (firewall)
- AWS KMS (encryption key management)

---

### Infrastructure & DevOps

**Hosting:**
- Vercel (frontend, existing)
- AWS Lambda + API Gateway (backend)
- Firebase Hosting (alternative frontend)

**CI/CD:**
- GitHub Actions (automated testing, deployment)
- Vercel auto-deploy (preview branches)

**Testing:**
- Vitest (unit tests, existing)
- Playwright (E2E tests)
- React Testing Library (component tests)
- `socket.io-client` mock for WebSocket tests

**Code Quality:**
- ESLint + TypeScript ESLint (linting)
- Prettier (formatting)
- Husky + lint-staged (pre-commit hooks)
- Conventional Commits (commit message format)

**Analytics:**
- PostHog (product analytics, privacy-friendly)
- Plausible (web analytics, GDPR-compliant)
- Custom event tracking (session metrics)

---

### Development Tools

**Local Development:**
- Docker Compose (local signaling server + Redis)
- ngrok (expose localhost for mobile testing)
- Postman (API testing)

**Documentation:**
- Storybook (component documentation)
- TypeDoc (API documentation)
- Mermaid (architecture diagrams)

**Collaboration:**
- Linear (issue tracking)
- Figma (design handoff)
- Loom (async video updates)

---

## Post-Phase 8: Growth & Expansion

### Short-Term (Month 4-6)

**Product:**
- Mobile apps (React Native, share 80% codebase)
- Offline mode (PWA with service workers)
- Multi-language support (Spanish, Mandarin)
- Voice commands for accessibility

**Growth:**
- Partner with 10 autism therapy centers for pilot programs
- Publish clinical research paper with anonymized data
- Launch affiliate program for autism influencers
- Attend autism conferences (IMFAR, INSAR)

**Revenue:**
- Target: 500 paying subscribers ($7,500 MRR)
- 5 clinical tier customers ($250 MRR)
- First B2B contract (school district, $5,000)

---

### Medium-Term (Month 7-12)

**Product:**
- Expand to ADHD learning mode (focus tracking, break reminders)
- Dyslexia reading mode (text-to-speech, dyslexia-friendly fonts)
- AI-powered question generation (adaptive difficulty)
- Social learning mode (2 kids play together)

**Growth:**
- Raise seed round ($500K-1M)
- Hire 2 engineers, 1 designer, 1 clinical advisor
- Launch therapist marketplace beta
- International expansion (UK, Canada, Australia)

**Revenue:**
- Target: 2,000 paying subscribers ($30,000 MRR)
- 20 clinical tier customers ($1,000 MRR)
- 10 B2B contracts ($20,000 MRR)
- Therapist marketplace (5% of revenue)

---

### Long-Term (Year 2+)

**Product:**
- Full curriculum (K-5 math standards)
- Science and reading modules
- Teacher dashboard for classroom use
- VR mode for immersive learning

**Growth:**
- Series A funding ($5-10M)
- Team of 20+ (engineering, sales, clinical)
- Partnerships with major autism organizations (Autism Speaks, ASAN)
- Government contracts (special education departments)

**Revenue:**
- Target: 10,000 paying subscribers ($150,000 MRR)
- 100 clinical tier customers ($5,000 MRR)
- 50 B2B contracts ($100,000 MRR)
- Therapist marketplace ($20,000 MRR)
- **Total ARR: $3.3M**

**Exit Strategy:**
- Acquisition by EdTech giant (Pearson, McGraw-Hill, Khan Academy)
- Acquisition by autism services company (Hopebridge, Centria)
- Continue as independent company with strong unit economics

---

## Success Metrics by Phase

| Phase | Key Metric | Target |
|-------|------------|--------|
| MVP (Week 4) | Beta families completed sessions | 5/5 |
| Phase 2 (Week 5) | Sticker usage rate | >60% of sessions |
| Phase 3 (Week 7) | Ghost drawing usage | >40% of sessions |
| Phase 4 (Week 9) | Emotion detection opt-in | >50% of users |
| Phase 6 (Week 11) | PDF report downloads | >70% of sessions |
| Phase 7 (Week 13) | Free-to-paid conversion | >10% |
| Month 6 | Monthly Recurring Revenue | $7,500 |
| Year 1 | Annual Recurring Revenue | $250,000 |
| Year 2 | Annual Recurring Revenue | $3,300,000 |

---

## Risk Mitigation (Updated)

### Technical Risks

| Risk | Mitigation |
|------|------------|
| WebRTC fails on restrictive networks | Fallback to TURN server (Twilio), test on school/corporate networks |
| Emotion model too slow on old devices | Use lighter model (MobileNet), reduce inference frequency, make optional |
| High latency (>1s) | Show latency indicator, suggest WiFi upgrade, implement adaptive quality |
| Database costs spiral | Start with Firebase free tier, implement data retention policy, archive old sessions |
| TURN server costs high | Negotiate volume pricing, implement P2P fallback, monitor usage |

### Product Risks

| Risk | Mitigation |
|------|------------|
| Parents over-intervene | Add "intervention score" dashboard, educate on best practices |
| Kids feel watched/anxious | Make indicator subtle, add "solo mode" quick toggle, user research |
| Privacy concerns scare users | Emphasize local processing, no video upload, transparent privacy policy |
| Low free-to-paid conversion | Improve onboarding, add social proof, offer annual discount |
| Therapists don't adopt | Build therapist advisory board, offer free clinical tier for research |

### Market Risks

| Risk | Mitigation |
|------|------------|
| Competitors copy feature | Build data moat (emotion patterns), file patents, move fast |
| Market too small | Expand to ADHD/dyslexia (10x TAM), international markets |
| Regulatory changes | Monitor COPPA/HIPAA updates, hire compliance consultant |
| Economic downturn | Focus on B2B (schools have budgets), offer sliding scale pricing |

---

## Competitive Advantage Summary

**Why we win:**

1. **Deep autism expertise** - Built by people who understand sensory needs, not generic EdTech
2. **Privacy-first architecture** - Parents trust us with their child's data
3. **Clinical validation** - Research-backed, therapist-approved
4. **Network effects** - More users → better emotion models → better outcomes
5. **Dual revenue streams** - B2C subscriptions + B2B licensing + marketplace
6. **Defensible moat** - Emotion-learning correlation data is unique and valuable

**What competitors can't easily copy:**
- Years of emotion pattern data
- Relationships with autism therapy networks
- Clinical research publications
- HIPAA-compliant infrastructure
- Parent + therapist trust

---

## Final Timeline Summary

| Timeframe | Focus | Outcome |
|-----------|-------|---------|
| **Week 1-4** | MVP (Steps 1-5) | 5 beta families validated |
| **Week 5-8** | Phases 2-5 | Full co-play experience |
| **Week 9-10** | Phase 6 | Analytics dashboard |
| **Week 11-12** | Phase 7 | Monetization live |
| **Week 13** | Phase 8 | Compliance complete |
| **Month 4-6** | Growth | 500 paid users |
| **Month 7-12** | Scale | Seed funding, $50K MRR |
| **Year 2+** | Expansion | Series A, $3M ARR |

**Total time to revenue: 13 weeks**  
**Total time to product-market fit: 6 months**  
**Total time to Series A readiness: 18 months**
