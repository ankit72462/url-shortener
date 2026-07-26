# URL Shortener - Phase 2 Tasks

- [x] Update `lib/api.ts` to support storing/retrieving the JWT token from `localStorage` and attach it as a `Bearer` token in the `Authorization` header for all requests.
- [x] Add new API functions for auth (login, signup, getMe) and link CRUD (list user links, update, delete).
- [x] Create dedicated `/login` and `/signup` pages with proper form validation and error handling.
- [x] Update `Header.tsx` to show the logged-in user state (e.g. Dashboard link, Logout button).
- [x] Create a `/dashboard` page to list, edit (toggle active state), and delete the user's owned links.
- [x] Update the `ShortenForm` on the home page to conditionally show a "Custom Alias" input field if the user is logged in.

# Phase 3 Tasks (Analytics)
- [x] Install `recharts` and `lucide-react`.
- [x] Add `getAnalytics(shortCode)` API call in `lib/api.ts`.
- [x] Update `/dashboard` to add a "View Analytics" button on each link card.
- [x] Create `/dashboard/analytics/[shortCode]/page.tsx` page.
- [x] Implement charts using `recharts` for clicks over time, Browsers, OS, and Referrers.
- [x] Ensure analytics page matches the dark-mode glassmorphism design system.
