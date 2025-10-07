# Team & Founders Performance Fix

## Problem Identified

The Team and Founders components had major loading performance issues due to:

1. **Client-side data fetching** - Both components fetched data using `useEffect` AFTER component mount, causing:
   - Waterfall loading effect (component renders → then fetches data → then re-renders)
   - No server-side rendering benefits
   - Slower time to first meaningful paint
   - Increased perceived loading time

2. **Unoptimized images** - Using CSS background-image with direct URLs instead of Next.js Image component:
   - No automatic image optimization
   - No WebP conversion
   - No lazy loading
   - No responsive sizing

3. **Heavy GSAP animations** (Founders component) - Multiple ScrollTrigger animations adding overhead

## Solution Implemented

### Quick Fix: Server-Side Data Prefetching

Implemented a server-side data prefetching strategy that eliminates client-side fetch delays:

1. **Modified Components** (`/src/components/FlexibleContent/Founders/index.js` & `/src/components/FlexibleContent/Team/index.js`):
   - Added optional `foundersData` and `teamData` props
   - Components now use provided data immediately if available
   - Fall back to client-side fetch only if data not provided (backward compatibility)
   - Loading state is `false` when data is provided, eliminating loading flash

2. **Updated Data Flow** (`/src/components/FlexibleContent/index.js` & `/src/components/Templates/FlexiblePage.js`):
   - Added prop drilling for `foundersData` and `teamData` through component tree
   - FlexiblePageClient → FlexiblePage → PageFlexibleContent → Team/Founders components

3. **Created Helper Utility** (`/src/lib/checkFlexibleComponents.js`):
   - `hasTeamComponent()` - Checks if flexible content includes Team component
   - `hasFoundersComponent()` - Checks if flexible content includes Founders component
   - Enables conditional data fetching only when needed

4. **Updated All Flexible Pages** (main pages like `/who`, `/what`, `/how`, `/why`, etc.):
   - Conditionally fetch team/founders data on server-side based on component presence
   - Pass data as props to FlexiblePageClient
   - Server-side fetches benefit from Next.js caching (revalidate: 10 seconds)

## Performance Improvements

### Before:
```
1. Page loads
2. Component mounts (shows "Loading...")
3. Client-side fetch starts
4. Data arrives
5. Component re-renders with data
```

### After:
```
1. Server fetches data in parallel with other page data
2. Page loads with data already available
3. Component renders immediately with data (no loading state)
```

### Benefits:
- ✅ **Faster perceived loading** - No client-side fetch delay
- ✅ **Better UX** - No loading flash or skeleton states
- ✅ **Server-side rendering** - Data available on initial page load
- ✅ **Cached data** - Server-side caching with 10-second revalidation
- ✅ **Backward compatible** - Components still work if data not provided
- ✅ **Conditional fetching** - Only fetches data when components are actually used

## Files Modified

### Components:
- `/src/components/FlexibleContent/Founders/index.js` - Accept optional foundersData prop
- `/src/components/FlexibleContent/Team/index.js` - Accept optional teamData prop
- `/src/components/FlexibleContent/index.js` - Pass data props to Team/Founders
- `/src/components/Templates/FlexiblePage.js` - Accept and pass foundersData/teamData
- `/src/components/Templates/FlexiblePageClient.js` - Accept and pass foundersData/teamData

### Utilities:
- `/src/lib/checkFlexibleComponents.js` - NEW - Helper functions to detect component usage

### Pages Updated:
- `/src/app/page.js` - Added conditional data fetching
- `/src/app/who/page.js` - Added conditional data fetching
- `/src/app/what/page.js` - Added conditional data fetching
- `/src/app/how/page.js` - Added conditional data fetching
- `/src/app/why/page.js` - Added conditional data fetching

(Note: Same pattern can be applied to other flexible pages as needed)

## Future Optimization Opportunities

While this quick fix significantly improves performance, there are additional optimizations that could be implemented:

1. **Image Optimization**:
   - Replace CSS background-image with Next.js Image component
   - Enable automatic WebP conversion
   - Implement responsive image sizes
   - Add lazy loading for below-fold images

2. **Animation Optimization** (Founders component):
   - Defer GSAP initialization until component is in viewport
   - Use CSS animations for simpler transitions
   - Implement intersection observer for scroll-triggered animations

3. **Data Optimization**:
   - Reduce GraphQL query payload (request only needed fields)
   - Implement data pagination for large teams
   - Add client-side caching with SWR or React Query

4. **Code Splitting**:
   - Lazy load GSAP library
   - Split heavy components into separate bundles

## Testing Recommendations

1. Test pages with Team component (e.g., `/who`)
2. Test pages with Founders component
3. Verify loading states are minimal/absent
4. Check Network tab to confirm server-side data fetching
5. Test with slow network to verify improvement
6. Verify fallback behavior if data fetch fails

## Summary

The performance issue was caused by client-side data fetching creating a waterfall effect. The fix moves data fetching to the server-side, pre-fetching it in parallel with other page data, and passing it as props to the components. This eliminates the client-side fetch delay and provides immediate rendering with data, significantly improving perceived performance and user experience.

