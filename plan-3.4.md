# Plan 3.4: Dashboard Pages Development (Professional UI)

## Overview

The dashboard pages currently exist as basic placeholder "stubs" created during Phase 3.2. This plan outlines the comprehensive visual and functional refinement of these pages to match the premium, professional, and highly polished aesthetic we established in Plan 3.3. We will build out full layouts, intricate small components, empty states, and mock data views for each page.

---

## 1. Dashboard Home (`/dashboard`)
**Goal:** A high-density, informative welcome screen.

*   **Welcome Banner Refinement**: Upgrade the welcome banner to use a subtle glassmorphism or sleek gradient map background. Add an elegant illustration or animated icon.
*   **Stats Grid Refinement**: Polish the `StatCard` components. Use refined typography, subtle drop shadows, and pill-shaped trend badges (e.g., small green pills with up arrows for positive trends).
*   **Recent Activity Feed**: Create a beautiful vertical timeline component indicating recent actions (e.g., "Resume parsed", "New jobs matched", "Interview prep generated").
*   **Quick Actions**: Upgrade action cards to have group hover effects (e.g., icon slightly translates, border glows).

## 2. Jobs Page (`/dashboard/jobs`)
**Goal:** A powerful, Jira-like job search interface.

*   **Search & Filter Bar**: A sticky top bar below the header containing a sophisticated search input, dropdowns for Location/Type/Salary, and toggle buttons (e.g., "Remote only"). Use Radix Select/Dropdown menus for premium feel.
*   **Job Card (List & Grid Views)**: 
    *   Implement a highly detailed job card.
    *   Include company logo placeholder (Avatar), Job Title, Company Name, and Location.
    *   Use small UI Badges for tags like "Remote", "Full-time", "High Match".
    *   Add a subtle "Save" button (heart icon) with a micro-interaction on click.
*   **Pagination/Infinite Scroll**: A classic, minimal pagination control at the bottom.

## 3. Matches Page (`/dashboard/matches`)
**Goal:** Highlighting AI-curated job matches with match scores.

*   **Split View Layout**: A left sidebar list of matched jobs and a right-side sticky detail pane (similar to premium email clients or classic dashboard views).
*   **Match Score Circular Progress**: Implement an SVG circular progress indicator for the "Match Percentage" (e.g., 92% in a glowing green circle).
*   **Insight Tooltips**: Add small "Why it's a match" tooltips explaining the score using our standard shadcn tooltip styling.

## 4. Preparation Page (`/dashboard/preparation`)
**Goal:** Clean, focused interface for interview preparation materials.

*   **Tabs Navigation**: Use Radix UI Tabs to switch between "Interview Questions", "Company Insights", and "Resume Tips".
*   **Accordion Component**: Implement a beautifully animated accordion (using Framer Motion or Radix Accordion) for Interview Q&A, keeping the interface uncluttered.
*   **Actionable Items**: Add checkboxes (custom styled) to mark questions as "practiced".

## 5. Settings Page (`/dashboard/settings`)
**Goal:** Classic, OS-level settings layout.

*   **Left Navigation Pane**: A secondary vertical navigation for settings categories (Profile, Account, Preferences, Notifications).
*   **Form Layouts**: Crisp, cleanly separated form groups with subtle borders (`border-slate-200`). Use polished toggle switches (Radix Switch) and custom styled select inputs.
*   **Danger Zone**: A red-accented area for account deletion or critical actions.

---

## Next Steps

1.  **Review and Approve**: Please let me know if this UI/UX direction for the dashboard pages looks good.
2.  **Implementation**: Once approved, I will implement these pages step-by-step, starting with the `Dashboard Home` and `Jobs` pages, utilizing our new design system.
