# Facebook Ads Simulator - Reference Manual

## 1. Project Overview

The **Facebook Ads Simulator** is an educational Progressive Web Application (PWA) designed to teach students (specifically MARK 4360) the fundamentals of the Meta (Facebook/Instagram) Ads Manager interface.

It provides a safe, risk-free environment where users can practice creating ad campaigns, setting budgets, defining audiences, and designing creatives without needing a real ad account or spending actual money.

### Key Objectives
- **Education**: Explain complex advertising concepts (e.g., Auction vs. Reach & Frequency, Campaign Objectives) via integrated tooltips.
- **Simulation**: Replicate the "Wizard" workflow of the actual Ads Manager (Campaign → Ad Set → Ad → Review).
- **Visualization**: Provide real-time feedback on how the ad will look across devices.
- **Accessibility**: Run as a standalone web app that is installable on devices (PWA).

---

## 2. Key Functionalities

### 2.1 Multi-Step Wizard Architecture
The application is structured as a linear 4-step wizard, mirroring the real ad creation flow:

1.  **Campaign Level**: Defines the "Why" (Objective) and "How" (Buying Type).
2.  **Ad Set Level**: Defines the "Who" (Audience), "Where" (Placements/Locations), and "How much" (Budget).
3.  **Ad Level**: Defines the "What" (Creative, Text, Links).
4.  **Review Level**: Summary and export options.

### 2.2 Live Split-Screen Preview
- **Left Panel**: Contains all input forms, selections, and educational tooltips.
- **Right Panel**: A persistent "Ad Preview" that updates in real-time as the user types or selects options.
- **Behavior**: The preview stays fixed (sticky) or scrolls independently to ensure the user always sees the result of their changes immediately.

### 2.3 Educational Tooltips (`InfoIcon`)
Throughout the interface, "Info" icons (?) are placed next to complex terms. Hovering over these provides context-specific definitions derived from `src/data/educationalContent.js`.
- **Example**: Hovering over "Buying Type" explains the difference between *Auction* and *Reach & Frequency*.

### 2.4 Progressive Web App (PWA)
- **Installability**: Users can install the app to their home screen on mobile or desktop (via Chrome/Edge).
- **Offline Mode**: The app caches necessary assets (CSS, JS, Icons) so it loads instantly and works even with spotty internet connections.
- **Manifest**: Includes proper branding, icons, and theme colors.

### 2.5 Print & PDF Export
- In the **Review Step**, a specific "Print / Save PDF" feature is available.
- **CSS Print Media Queries**: The app is optimized for printing. When printing, the layout simplifies, ensuring the Ad Preview and the Summary details are perfectly aligned on the page, suitable for submitting as a homework assignment.

---

## 3. Detailed Feature Reference

### Step 1: Campaign
The foundation of the ad structure.
- **Campaign Name**: Standard text input.
- **Buying Type**:
    - *Auction*: Standard bidding.
    - *Reach and Frequency*: Fixed booking (simulated).
- **Campaign Objective**:
    - *Awareness*: Brand recall.
    - *Traffic*: Link clicks.
    - *Sales*: Conversions.
- **Special Ad Categories**: Checkbox for declaring Credit, Employment, Housing, or Social Issues (simulates restricted targeting).

### Step 2: Ad Set
Targeting and Budgeting.
- **Ad Set Name**: Identification.
- **Budget**:
    - Daily Budget input (Currency simulated as USD).
- **Start Date**: Date picker.
- **Audience**:
    - Dropdown simulator offering "Broad", "Interest-based", and "Lookalike" options.
- **Locations**: Text input to simulate geographic targeting (e.g., "United States").

### Step 3: Ad Creative
The visual component.
- **Ad Name**: Internal identifier.
- **Format**:
    - *Single Image*: Standard display.
    - *Carousel*: Multi-card (simulated UI).
    - *Video*: Video content (simulated UI).
- **Media**: Placeholder upload area (visual representation only).
- **Primary Text**: The main copy appearing above the image.
- **Headline**: The bold text near the button.
- **Call To Action (CTA)**: Dropdown for buttons like "Shop Now", "Learn More", etc.

### Step 4: Review
- **Summary Cards**: Read-only view of all selections made in previous steps.
- **Validation**: Green checkmarks indicate completion.
- **Publish Action**: Simulates the final "Publish" network request (alerts the user).
- **Print**: Triggers the browser's print dialog.

---

## 4. Technical Specifications

### Architecture
- **Framework**: React 19 + Vite
- **State Management**: React Context API (`WizardContext`) for sharing state between steps.
- **Styling**: Tailwind CSS v4 for utility-first, responsive design.
- **Icons**: `lucide-react` for UI elements.
- **Motion**: `tailwindcss-animate` / CSS transitions for smooth step switching.

### Directory Structure (`/app`)
- `src/components/steps/`: Individual form components for each wizard step.
- `src/context/WizardContext.jsx`: Central store for Campaign/AdSet/Ad data.
- `src/data/educationalContent.js`: Centralized text for all educational tooltips.
- `src/App.jsx`: Main router/layout manager.
- `DEPLOY.md`: Instructions for Cloudflare/GitHub Pages.

### PWA Configuration
- **Plugin**: `vite-plugin-pwa`
- **Service Worker**: `generateSW` strategy (auto-updates).
- **Assets**: Favicons and PWA icons are referenced in `vite.config.js`.

---

## 5. Usage Guide for Students

1.  **Launch the App**: Open the URL in your browser.
2.  **Start Campaign**: Enter a name and choose an objective (e.g., "Traffic").
    - *Tip*: Hover over the (?) icons to learn why you might choose one objective over another.
3.  **Define Audience**: Click "Next". Set your budget and choose a simulated audience.
4.  **Create Ad**: Click "Next".
    - Type your "Primary Text" and watch the Preview on the right update instantly.
    - Select a CTA button that matches your goal.
5.  **Review**: Click "Next". Review all your settings.
6.  **Save/Submit**: Click "Print / Save PDF".
    - In the print dialog, choose "Save as PDF".
    - Submit this PDF as your assignment proof.
