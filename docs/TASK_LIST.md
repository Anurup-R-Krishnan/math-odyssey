# Math Explorer Enhancement Task List

## ✅ COMPLETED TASKS

### [x] 1. Refactor Duplicate Logic (HIGH PRIORITY) ✅
- [x] Extract shared `processAnswer` function
- [x] Update `handleAnswer` to use `processAnswer`
- [x] Update `handleTextSubmit` to use `processAnswer`
- [x] Update `handleMicroAnswer` to use `processAnswer`
- [x] Update `handleMicroTextSubmit` to use `processAnswer`
**Result:** Reduced code from ~150 lines to ~70 lines (53% reduction)

### [x] 2. Add Drawing Input Mode (HIGH PRIORITY) ✅
- [x] Create `DrawingCanvas.tsx` component
- [x] Add canvas drawing functionality (touch + mouse)
- [x] Add clear/undo buttons
- [x] Integrate with QuestionCard
- [x] Update input mode toggle to include "draw"
**Result:** Kids can now draw answers on screen!

### [x] 4. Extract Answer Input Components (MEDIUM PRIORITY) ✅
- [x] Create `MultipleChoiceInput.tsx`
- [x] Create `DrawingCanvas.tsx`
- [x] Update `QuestionCard.tsx` to use new components
**Result:** Better code organization and reusability

### [x] 6. Add Comprehensive Tests (HIGH PRIORITY) ✅
- [x] Test mode toggle switching (multiple/draw)
- [x] Test drawing canvas functionality
- [x] Test multiple choice input
- [x] Test correct/incorrect styling
**Result:** 7 new tests added, all passing

---

## 🔄 REMAINING TASKS

### [ ] 3. Add Smart Drawing Recognition (HIGH PRIORITY - Next Step)
- [ ] Research lightweight OCR/handwriting recognition
- [ ] Integrate TensorFlow.js or similar
- [ ] Train/load digit recognition model
- [ ] Add confidence scoring
- [ ] Auto-match drawn answer to options


### [ ] 5. Add Visual Feedback for Drawing (MEDIUM PRIORITY)
- [ ] Add success/error animations to canvas
- [ ] Show "Draw the number X" prompt
- [ ] Add stroke color change on submit
- [ ] Animate canvas border (green=correct, red=wrong)

### [ ] 7. Accessibility Improvements (MEDIUM PRIORITY)
- [x] Add `aria-label` to canvas (already done)
- [ ] Add keyboard alternative for drawing mode
- [ ] Add screen reader announcements
- [ ] Add voice guidance option
- [ ] Add high contrast mode

### [ ] 8. Improve Touch & Stylus Support (LOW PRIORITY)
- [ ] Optimize for tablets
- [ ] Add pressure sensitivity
- [ ] Add different brush sizes
- [ ] Add color picker for fun
- [ ] Add eraser tool (partial erase, not full clear)

### [ ] 9. Performance Optimizations (LOW PRIORITY)
- [ ] Memoize `activeQuestion` with useMemo
- [ ] Optimize canvas rendering
- [ ] Add canvas stroke debouncing
- [ ] Lazy load drawing components

---

## 📋 Quick Reference

### Files Modified
- ✅ `src/components/game/QuestionCard.tsx` - Refactored + drawing support
- ✅ `src/pages/Game.tsx` - Updated toggle UI
- ✅ `src/components/game/DrawingCanvas.tsx` - NEW
- ✅ `src/components/game/MultipleChoiceInput.tsx` - NEW
- ✅ `src/test/DrawingCanvas.test.tsx` - NEW
- ✅ `src/test/MultipleChoiceInput.test.tsx` - NEW

### Commands
```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm test             # Run all tests
pnpm test Drawing     # Test drawing component
```

### How to Use Drawing Mode
1. Start a mission in Game page
2. Toggle "Draw answers" switch // its for kids right think of an alternative to this
3. Draw your answer on the canvas
4. Click "Submit Drawing"
5. (Currently shows hint - ready for OCR integration)

---

## 🎯 Recommended Next Action

**Implement Task 3: Smart Drawing Recognition**

. **Best Experience:** TensorFlow.js OCR
   - High accuracy digit recognition
   - Auto-submit when confident
   - Most work but best UX (8 hours)


