# Identity Habits - Development Plan

## Project Overview
**App Name:** Identity Habits
**Tagline:** "Become who you want to be, one habit at a time"
**Platform:** Android (React Native + Expo)
**Monetization:** Freemium (free = current week only, premium = full analytics)

---

## Tech Stack
- **Framework:** React Native with Expo
- **Storage:** AsyncStorage (local data persistence)
- **Charts:** react-native-chart-kit or Victory Native
- **Notifications:** Expo Notifications
- **Payments:** React Native IAP (later phase)
- **Navigation:** React Navigation

---

## Development Phases

### Phase 1: Project Setup & Basic Habit Tracking ✅ COMPLETED
**Goal:** Get a working habit tracker with checkboxes that persists data

**Steps:**
1. ✅ Initialize Expo project (`npx create-expo-app identity-habits`)
2. ✅ Set up project structure (screens, components, utils folders)
3. ✅ Install AsyncStorage: `npx expo install @react-native-async-storage/async-storage`
4. ✅ Create home screen with:
   - Today's date display
   - List of 3-4 hardcoded habits (e.g., "I am someone who exercises")
   - Checkbox for each habit
   - Tap to toggle complete/incomplete
5. ✅ Implement AsyncStorage to save daily completion state
6. ✅ Test: Close app, reopen - state should persist

**Success Criteria:**
- ✅ Habits display on screen
- ✅ Can check/uncheck habits
- ✅ Data persists after closing app
- ✅ Works on Expo Go app

**Implementation Details:**
- Created `app/(tabs)/index.tsx` with full habit tracking UI
- Habits stored in AsyncStorage under 'habits' key
- Daily records stored under 'dailyRecords' key with date-based indexing
- 4 default habits with identity-based statements and weekly goals
- Visual feedback: completed habits show checkmark and green highlight
- TypeScript interfaces for type safety (Habit, DailyRecord)

---

### Phase 2: Habit Management
**Goal:** Allow users to create, edit, and delete their own habits

**Steps:**
1. Create habit data model:
```javascript
   {
     id: uuid,
     identity: "I am someone who exercises",
     weeklyGoal: 5,
     createdDate: timestamp
   }
```
2. Build "Add Habit" screen/modal:
   - Text input for identity statement
   - Number picker for weekly goal (1-7)
   - Save button
3. Add edit/delete functionality:
   - Long-press on habit to edit or delete
   - Confirmation dialog for delete
4. Store habits array in AsyncStorage
5. Update home screen to load from stored habits

**Success Criteria:**
- ✅ Can add new habits with custom text
- ✅ Can set weekly goal per habit
- ✅ Can edit existing habits
- ✅ Can delete habits (with confirmation)
- ✅ Habits persist across app restarts

---

### Phase 3: Weekly Goal Tracking
**Goal:** Show progress toward weekly goals for each habit

**Steps:**
1. Update data model to track completion by date:
```javascript
   // Daily records
   {
     date: "2025-11-15",
     completedHabits: [habitId1, habitId3]
   }
```
2. Calculate weekly progress for each habit:
   - Count completions in current week (Mon-Sun)
   - Display as "4/5" or progress bar
3. Add visual progress indicator:
   - Progress bar under each habit
   - Color coding (red = behind, yellow = on track, green = goal met)
   - Show streak count if applicable
4. Add "This Week" view:
   - Summary of all habits and their weekly progress
   - Highlight best/worst performing habits

**Success Criteria:**
- ✅ Weekly progress calculates correctly
- ✅ Progress updates when checking/unchecking habits
- ✅ Visual feedback for goal achievement
- ✅ Week resets properly on Monday

---

### Phase 4: Weight Tracking
**Goal:** Add daily weight entry and display basic trend

**Steps:**
1. Add weight field to daily records:
```javascript
   {
     date: "2025-11-15",
     completedHabits: [habitId1, habitId3],
     weight: 75.2
   }
```
2. Add weight input to home screen:
   - Simple numeric input field
   - "Log Weight" button
   - Display today's weight if already logged
3. Create basic weight history view:
   - List of last 7 days with weights
   - Show delta from previous day
   - Calculate week average
4. Simple line chart for weight trend (use react-native-chart-kit)

**Success Criteria:**
- ✅ Can enter weight for today
- ✅ Weight persists and displays correctly
- ✅ Can view weight history
- ✅ Basic chart shows trend

---

### Phase 5: Weekly To-Do List
**Goal:** Add separate weekly task list that auto-resets

**Steps:**
1. Create weekly to-do data model:
```javascript
   {
     weekStart: "2025-11-11", // Monday of current week
     todos: [
       { id: uuid, text: "Meal prep", completed: false }
     ]
   }
```
2. Build to-do section (separate tab or collapsible section):
   - Input field to add new task
   - Checkbox list for tasks
   - Delete/edit tasks
3. Implement auto-reset logic:
   - Check if current week has changed
   - Clear completed tasks from previous week
   - Keep incomplete tasks or start fresh (user preference?)
4. Save to AsyncStorage

**Success Criteria:**
- ✅ Can add/complete/delete weekly tasks
- ✅ Tasks persist during the week
- ✅ Tasks reset on new week (Monday)
- ✅ Clear separation from daily habits

---

### Phase 6: Analytics Dashboard
**Goal:** Show historical data, trends, and insights

**Steps:**
1. Install charting library: `npm install react-native-chart-kit react-native-svg`
2. Create Analytics screen with tabs/sections:
   - **Habits tab:**
     - Week selector (dropdown or swipe)
     - Bar chart: completion % by habit
     - Streak counters (current & longest)
   - **Weight tab:**
     - Line chart: last 4-8 weeks
     - Weekly averages
     - Total change calculation
   - **Insights tab:**
     - Best performing habit this week
     - Correlation hints (e.g., "5+ workouts = -0.3kg avg")
     - Month/year summary stats
3. Implement data aggregation functions:
   - Calculate weekly completion rates
   - Find streaks
   - Compute correlations
4. Make it visually appealing with color coding

**Success Criteria:**
- ✅ Can view past weeks' data
- ✅ Charts render correctly
- ✅ Insights are accurate and meaningful
- ✅ Performance is smooth (even with months of data)

---

### Phase 7: Push Notifications
**Goal:** Daily reminders to track habits

**Steps:**
1. Install Expo Notifications: `npx expo install expo-notifications`
2. Request notification permissions on first launch
3. Implement notification scheduling:
   - Daily reminder (user sets time in settings)
   - Evening nudge if habits incomplete (optional)
   - Streak celebration (e.g., "7 day streak on exercise! 🔥")
4. Create Settings screen:
   - Toggle notifications on/off
   - Set notification time (time picker)
   - Customize notification messages
5. Handle notification tap (deep link to app)

**Success Criteria:**
- ✅ Notifications appear at scheduled time
- ✅ User can customize notification time
- ✅ Notifications work even when app is closed
- ✅ Can disable notifications easily

---

### Phase 8: UI/UX Polish
**Goal:** Make the app beautiful and satisfying to use

**Steps:**
1. Add animations:
   - Checkbox completion animation (scale, color change)
   - Confetti/celebration for completing all daily habits
   - Smooth transitions between screens
2. Implement haptic feedback:
   - Vibration on checkbox tap
   - Different patterns for achievements
3. Add motivational quotes:
   - Rotate custom quotes on home screen
   - Context-aware (e.g., show encouragement if behind on goals)
4. Design polish:
   - Consistent color scheme (identity/brand colors)
   - Custom icons
   - Professional typography
   - Dark mode support (optional)
5. Create app icon and splash screen

**Success Criteria:**
- ✅ Interactions feel smooth and satisfying
- ✅ App looks professional
- ✅ Quotes add value without being annoying
- ✅ Consistent design language throughout

---

### Phase 9: Freemium Implementation
**Goal:** Gate analytics features behind premium paywall

**Steps:**
1. Define free vs premium features:
   - **Free:** Current week tracking only, max 5 habits, basic notifications
   - **Premium:** Unlimited habits, full historical analytics, data export, advanced insights
2. Install React Native IAP: `npm install react-native-iap`
3. Implement premium check logic:
   - Check premium status before showing analytics
   - Show upgrade prompt when accessing locked features
4. Create upgrade/paywall screen:
   - List premium benefits
   - Pricing options (monthly/yearly)
   - Purchase buttons
5. Implement purchase flow:
   - Google Play Billing integration
   - Handle purchase success/failure
   - Restore purchases functionality
6. Store premium status locally and verify

**Success Criteria:**
- ✅ Free users can track current week
- ✅ Premium features clearly gated
- ✅ Purchase flow works smoothly
- ✅ Premium status persists
- ✅ Can restore purchases on reinstall

---

### Phase 10: Data Export & Backup
**Goal:** Allow users to export their data (especially premium users)

**Steps:**
1. Create export function:
   - Generate CSV with all habit completions and weight data
   - Include metadata (habit names, goals, dates)
2. Implement share functionality:
   - Use Expo Sharing API
   - Allow export via email, cloud storage, etc.
3. Optional: Simple backup/restore within app
   - Export full app state as JSON
   - Import to restore data

**Success Criteria:**
- ✅ Can export data to CSV
- ✅ CSV opens in Excel/Sheets correctly
- ✅ Premium users can backup full history

---

### Phase 11: Build & Test APK
**Goal:** Create installable APK for testing on real device

**Steps:**
1. Configure app.json:
   - Set app name, package identifier
   - Add version number
   - Configure permissions (notifications, etc.)
2. Build APK using Expo:
   - `eas build --platform android --profile preview`
   - Or local build: `npx expo run:android`
3. Test APK on physical device:
   - Install via USB or download link
   - Test all features thoroughly
   - Check notifications work properly
   - Verify data persistence
4. Fix bugs and iterate

**Success Criteria:**
- ✅ APK installs successfully
- ✅ All features work on real device
- ✅ No crashes or major bugs
- ✅ Performance is acceptable

---

### Phase 12: Google Play Publishing Prep
**Goal:** Prepare everything needed for Play Store submission

**Steps:**
1. Create Google Play Developer account ($25 one-time)
2. Prepare store listing assets:
   - App icon (512x512 PNG)
   - Feature graphic (1024x500)
   - Screenshots (at least 2, phone + tablet)
   - App description (short + full)
   - Categorization (Productivity, Health & Fitness)
3. Write privacy policy:
   - Even though data is local, Google requires one
   - Use generator or write simple one
   - Host on GitHub Pages or simple website
4. Complete content rating questionnaire
5. Set up app signing:
   - Use Google Play App Signing (recommended)
   - Keep your upload key secure
6. Build release AAB (Android App Bundle):
   - `eas build --platform android --profile production`
7. Submit for review

**Success Criteria:**
- ✅ All store assets look professional
- ✅ Privacy policy is live and compliant
- ✅ Release build passes Google Play checks
- ✅ App submitted successfully

---

### Phase 13: Marketing & Launch (Optional)
**Goal:** Get initial users and feedback

**Steps:**
1. Soft launch to friends/family for beta testing
2. Create landing page or simple website
3. Post on relevant subreddits:
   - r/productivity
   - r/getdisciplined
   - r/habits
   - r/sideproject
4. Share on Twitter/X with #buildinpublic
5. Submit to Product Hunt
6. Collect feedback and iterate

---

## Data Models Reference

### Habit Definition
```javascript
{
  id: "uuid-v4",
  identity: "I am someone who exercises",
  weeklyGoal: 5,
  createdDate: "2025-11-15T10:00:00Z",
  archived: false
}
```

### Daily Record
```javascript
{
  date: "2025-11-15",
  completedHabits: ["habit-id-1", "habit-id-3"],
  weight: 75.2
}
```

### Weekly To-Do
```javascript
{
  weekStart: "2025-11-11", // Monday
  todos: [
    {
      id: "uuid-v4",
      text: "Meal prep for the week",
      completed: false,
      createdAt: "2025-11-11T08:00:00Z"
    }
  ]
}
```

### User Settings
```javascript
{
  notificationsEnabled: true,
  notificationTime: "20:00",
  isPremium: false,
  premiumPurchaseDate: null,
  theme: "light" // or "dark"
}
```

---

## Testing Checklist (Before Each Phase)
- [ ] Feature works as expected
- [ ] Data persists correctly in AsyncStorage
- [ ] No console errors or warnings
- [ ] Performance is smooth (no lag)
- [ ] UI looks good on different screen sizes
- [ ] Edge cases handled (empty states, max limits, etc.)

---

## Launch Checklist (Final)
- [ ] All core features working
- [ ] No critical bugs
- [ ] Tested on multiple devices/Android versions
- [ ] Notifications work reliably
- [ ] Payment flow tested (sandbox mode)
- [ ] Privacy policy published
- [ ] Store listing complete
- [ ] Screenshots and graphics professional
- [ ] App icon looks good
- [ ] Version number set correctly
- [ ] Terms of service written (if needed)

---

## Future Enhancements (Post-Launch)
- Cloud sync across devices
- Social features (share progress, accountability partners)
- Custom themes/personalization
- More advanced analytics (machine learning insights)
- Integration with fitness trackers
- Habit templates/suggestions
- Community habit challenges
- Widget for home screen
- Apple Watch support (if expanding to iOS)

---

## Notes
- Start simple, iterate based on real usage
- Test each phase thoroughly before moving on
- Use Expo Go for rapid development
- Build APK periodically to test on real device
- Keep code clean and documented
- Commit to git regularly
- Have fun building this! 🚀
