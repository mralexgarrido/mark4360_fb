# Facebook Ads Simulator - Reference Manual

**Version:** 2.0
**Course:** MARK 4360: Social Media & eMarketing
**Target Audience:** Marketing Students & Instructors

---

## 1. Introduction

The **Facebook Ads Simulator** is an interactive educational tool designed to simulate the experience of creating a professional advertising campaign on the Meta (Facebook/Instagram) platform.

Unlike the complex and overwhelming interface of the actual Meta Ads Manager, this simulator provides a streamlined, scaffolded environment. It focuses on the core strategic decisions—Objective, Audience, and Creative—while providing real-time educational feedback and high-fidelity visual previews.

### Key Goals
*   **Educational**: Teaches standard industry terminology and strategy via integrated tooltips.
*   **Realistic**: Generates pixel-perfect previews of how ads appear on mobile and desktop feeds.
*   **Assessable**: Generates a clean, date-stamped PDF report for students to submit to instructors.

---

## 2. Core Workflow

The application guides users through a **4-step linear wizard**, mirroring the actual hierarchy of a Meta ad account:

### Step 1: Campaign Level
*Focus: The "Why" of the advertisement.*

*   **Campaign Name**: Students learn professional naming conventions (e.g., *Client_Objective_Date*).
*   **Buying Type**: Simulates the choice between 'Auction' (standard) and 'Reach and Frequency'.
*   **Special Ad Categories**: Highlights restricted categories (Housing, Credit, Employment) to teach compliance.
*   **Campaign Objective**: The critical decision point. Users choose from 6 objectives (Awareness, Traffic, Engagement, Leads, App Promotion, Sales).
*   **Spending Limit**: Introduces the concept of campaign-level budget caps.

### Step 2: Ad Set Level
*Focus: The "Who", "When", and "How Much".*

*   **Budget & Schedule**:
    *   **Daily vs. Lifetime Budget**: Explains the difference between pacing methods.
    *   **Budget Simulator**: An interactive **Area Chart** visualizes estimated reach and clicks based on the entered budget, helping students understand the correlation between spend and results.
*   **Audience Controls**:
    *   **Locations**: Geotargeting input.
    *   **Demographics**: Age and Gender selection.
    *   **Detailed Targeting**: A free-text area for interests and behaviors, accompanied by tips on not "over-constraining" the audience.

### Step 3: Ad Creative Level
*Focus: The "What" (Visuals and Copy).*

*   **Identity**: Configuration of the Facebook Page and Instagram Account representation.
*   **Ad Setup**:
    *   **Image URL**: Accepts external image links (supports Unsplash for easy testing).
    *   **Primary Text**: The main copy appearing above (FB) or below (IG) the creative.
    *   **Headline**: The bold text next to the call-to-action.
    *   **Website URL**: The destination landing page.
    *   **Call to Action (CTA)**: Dropdown of standard buttons (e.g., Learn More, Shop Now).
*   **Ad Strength Meter**: A gamified "health bar" that updates in real-time (Poor/Good/Excellent) to encourage students to complete all fields for maximum effectiveness.

### Step 4: Review & Submit
*Focus: Reflection and Submission.*

*   **Summary Cards**: A read-only overview of all choices made in previous steps.
*   **Strategy Rationale**: A dedicated section for students to explain *why* they made their choices, connecting theory to practice.
    *   *Student Name*: For grading identification.
    *   *Strategic Reasoning*: Text area for justification.
*   **Date Stamp**: Automatically generates the current date to verify timely submission.

---

## 3. Key Features

### 📱 Real-Time Live Preview
The simulator features a persistent "Right Panel" that updates instantly as the user types.
*   **Platform Toggle**: Switch between **Facebook** and **Instagram** views to see how the same creative adapts to different platforms.
*   **Device Toggle**: Switch between **Mobile** and **Desktop** layouts.
*   **High Fidelity**: Mimics fonts, colors, spacing, and UI elements (like the "Sponsored" tag and "Like/Comment/Share" buttons) of the actual platforms.

### 🎓 Educational Info Icons
Every input field is paired with a blue **Info Icon (`i`)**.
*   **Contextual Learning**: Clicking an icon opens a modal with a concise, professional definition of the term (e.g., defining "Lookalike Audiences" or "Auction Buying").
*   **Marketing Best Practices**: Tooltips include tips, such as "Ensure your image has less than 20% text" or "Narrowing your audience too much can increase costs."

### 🖨️ Optimized Print/PDF Mode
The "Review" step is specifically engineered for submission.
*   **Clean Layout**: When `Print / Save PDF` is clicked, the app applies a special CSS print stylesheet.
*   **Automatic Hiding**: Navigation bars, progress steps, and non-essential UI elements (like the "Back" button) are hidden.
*   **Date Verification**: A "Date Generated" timestamp appears in the top right corner of the printed document.
*   **WYSIWYG**: The Student Rationale and the Ad Preview are preserved, allowing instructors to grade both the strategy and the creative execution.

---

## 4. Technical Specifications

*   **Framework**: React 19
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS v4 (Utility-first styling)
*   **Animations**: Framer Motion (Smooth page transitions and modal effects)
*   **Charts**: Recharts (Budget simulation visualization)
*   **Icons**: Lucide React
*   **Architecture**:
    *   `AdCampaignContext`: Centralized state management for the wizard data.
    *   `docs/`: Production build output directory, configured for zero-config deployment to **GitHub Pages**.

## 5. Deployment Guide

The project is pre-configured for deployment to GitHub Pages.

1.  **Build**: Run `npm run build`. This generates the static application in the `docs/` folder.
2.  **Deploy**: Push the code to a GitHub repository. Enable GitHub Pages in the repository settings and select the `docs` folder as the source.
