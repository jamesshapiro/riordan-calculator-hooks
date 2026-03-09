# Things Already Tried to Debug the Client-Side Navigation Bug

## The Problem
Navigating between pages (e.g., `/` to `/papers/`) causes a full hard page refresh instead of a smooth client-side transition. The video-player app at `https://master.d1yos8zfbmm0av.amplifyapp.com/` does not have this issue despite using the same Next.js version and config.

## What Was Tried (and didn't work)

### 1. Switch from `<a>` tags to Next.js `<Link>` components
- **Commit:** `bab551e` — "Use Next.js Link for Header and NavBar, add styled NavLink component"
- **Rationale:** Plain `<a>` tags cause full page loads; Next.js `<Link>` enables client-side navigation
- **Result:** Still hard refreshes. Links were actually already using `<Link>` inside `<NavItem>` wrappers before this change.

### 2. Add `shallow` routing prop to all navigation links
- **Commit:** `818e04e` — "Add shallow routing to header, navbar and dropdown navigation links"
- **Rationale:** `shallow` routing might prevent full re-renders
- **Result:** Still hard refreshes. `shallow` only works for URL changes within the *same* page (e.g., query param changes), not for cross-page navigation.

### 3. Switch UserDropdown from `<Link>` to `router.push()`
- **Commit:** `e75e09f` — "Switch UserDropdown menu links to router.push navigation"
- **Rationale:** `<Link>` inside Radix dropdown may not work correctly; `router.push()` is an alternative
- **Result:** Still hard refreshes.

### 4. Remove `shallow` prop from navigation links
- **Rationale:** Since `shallow` only works within a page, removing it might let normal client-side navigation work
- **Result:** Just reverts to the state from attempt #1, which also didn't work.

### 5. Wrap `dynamic()` component in a regular page function
- **Commit:** `89da549` — "attempt to fix static pathing refresh issue"
- **Change:** From `export default PapersRoute` (where PapersRoute = dynamic(...)) to `export default function PapersPage() { return <PapersRoute /> }`
- **Rationale:** Give Next.js router a regular component as the page's default export
- **Result:** Still hard refreshes. The `dynamic()` with `ssr: false` was still being used inside.
- **Deployed version:** v1.0.2 — confirmed deployed and still broken.

## Root Cause (identified)
All page files used `dynamic(() => import(...), { ssr: false })` which was added because `NumberBox.js` and `SequenceEditorNumberBox.js` call `getComputedStyle(document.body)` at render time (not inside useEffect). This browser API doesn't exist during SSR, so `ssr: false` was the workaround.

The video-player app does NOT use `dynamic()` with `ssr: false` at all — its components properly guard browser API access.

## Fix (pending deployment)
- Remove all `dynamic()` / `ssr: false` wrappers from page files
- Guard the `getComputedStyle` calls with `typeof window !== 'undefined'`
- Build succeeds with all pages statically generated
- Version bumped to v1.0.3
