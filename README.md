# H&B Bundles Component Test

## At a glance
- **Purpose:** React Bundles component for H&B, dynamic pricing & CTA updates.  
- **API:** Fetches products (mocked), shows only in-stock, logs SKUs.  
- **UX:** Updates totals & button text live, handles offline/errors gracefully.  
- **Testing / Storybook:** Interactive stories showcase edge cases & behavior.  

---

A React + Storybook implementation of the **Bundles component**, built as part of a H&B exercise.  

The goal of the test was to create a reusable component that:  
- Fetches products (mocked in Storybook)  
- Updates total price and CTA text dynamically  
- Displays only in-stock products  
- Logs selected SKUs on add-to-basket  
- Handles offline / error scenarios gracefully
- Offloads expensive calculations to **Web Workers / multithreading** for smooth UI updates (bundle calculations as example)

This project demonstrates **component architecture, state management, API integration, and defensive UI design**.

---

## Key Features

- Reusable **Bundles component** with dynamic pricing & CTA updates  
- **Storybook-first development** with interactive scenarios  
- **TypeScript** for type safety and maintainability  
- Clear separation of concerns: components, adapters, and theme  
- Offline / error handling with fallback UI  

---

## Quick Start

```bash
npm install
npm run storybook
```

Storybook is the primary interface for testing and exploring component behavior.

---

## Bundles Component Behavior

- Fetches products from [`https://hb.demo/products`](https://hb.demo/products) (mocked in Storybook)  
- Users select products; totals and button text update in real time  
- Logs selected SKUs on add-to-basket  
- Handles offline/error states gracefully with disabled actions  

---

## Storybook Scenarios

- **Default** – Products loaded and selectable  
- **API Offline / Error** – Fallback UI displayed  
- **Empty / Out of Stock** – No selections possible  
- **Interactive State** – Live total & CTA updates  

---

## Project Structure

src/
├── adapters/apiAdapters.ts
├── components/
│   ├── Bundles/
│   │   ├── Bundles.mdx
│   │   ├── Bundles.module.css
│   │   ├── Bundles.stories.tsx
│   │   ├── Bundles.test.tsx
│   │   ├── Bundles.tsx
│   │   └── index.ts
│   ├── Button/
│   │   ├── Button.mdx
│   │   ├── Button.module.css
│   │   ├── Button.stories.tsx
│   │   ├── Button.tsx
│   │   └── index.ts
│   └── ProductCard/
│       ├── index.ts
│       ├── ProductCard.mdx
│       ├── ProductCard.module.css
│       ├── ProductCard.stories.tsx
│       └── ProductCard.tsx
├── index.ts
├── setupTests.ts
├── theme/
│   ├── index.css
│   └── theme.css
└── vite-env.d.ts

---

## Architecture Notes

- **State-driven UI:** derived totals and CTA text, no redundant state  
- **Defensive rendering:** loading, error, and empty states handled explicitly  
- **Storybook as a testing surface:** visualizes edge cases & interaction  
- **API abstraction:** `adapters/apiAdapters.ts` separates concerns for future scaling  

---

## Next Steps / Improvements

- More Extensive Unit & integration tests (Jest / Testing Library)  
- Data-fetching abstraction (React Query / SWR)  
- Suspense-based loading states i.e. fallback UI until API or product bundle is ready
- Accessibility improvements (ARIA, keyboard navigation)  
- Storybook snapshot/interaction tests  
