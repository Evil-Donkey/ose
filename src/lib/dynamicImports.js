import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Loading component for dynamic imports
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Higher-order component for dynamic imports with loading
const withDynamicImport = (importFunc, options = {}) => {
  return dynamic(importFunc, {
    loading: () => <LoadingSpinner />,
    ssr: false,
    ...options,
  });
};

// Dynamic imports for heavy components
export const DynamicHeroVideo = withDynamicImport(() => import('@/components/FlexibleContent/HeroVideo'));
export const DynamicFullScreenPanel = withDynamicImport(() => import('@/components/FlexibleContent/FullScreenPanel'));
export const DynamicInfographicMap = withDynamicImport(() => import('@/components/FlexibleContent/InfographicMap'));
export const DynamicInfographicEcosystem = withDynamicImport(() => import('@/components/FlexibleContent/InfographicEcosystem'));
export const DynamicPortfolio = withDynamicImport(() => import('@/components/FlexibleContent/Portfolio'));
export const DynamicStories = withDynamicImport(() => import('@/components/FlexibleContent/Stories'));
export const DynamicFullPanelCarousel = withDynamicImport(() => import('@/components/FlexibleContent/FullPanelCarousel'));
export const DynamicTeam = withDynamicImport(() => import('@/components/FlexibleContent/Team'));
export const DynamicCards = withDynamicImport(() => import('@/components/FlexibleContent/Cards'));
export const DynamicExampleProjects = withDynamicImport(() => import('@/components/FlexibleContent/ExampleProjects'));
export const DynamicExits = withDynamicImport(() => import('@/components/FlexibleContent/Exits'));

// Dynamic imports for animation-heavy components
export const DynamicStatsModule = withDynamicImport(() => import('@/components/FlexibleContent/StatsModule'));
export const DynamicExpertise = withDynamicImport(() => import('@/components/FlexibleContent/Expertise'));
export const DynamicSectors = withDynamicImport(() => import('@/components/FlexibleContent/Sectors'));
export const DynamicWhatWeDo = withDynamicImport(() => import('@/components/FlexibleContent/WhatWeDo'));
export const DynamicInspirationalQuotes = withDynamicImport(() => import('@/components/FlexibleContent/InspirationalQuotes'));

// Dynamic imports for form components
export const DynamicLoginForm = withDynamicImport(() => import('@/components/LoginForm'));
export const DynamicSignupForm = withDynamicImport(() => import('@/components/SignupForm'));

// Dynamic imports for heavy UI components
export const DynamicGoogleMap = withDynamicImport(() => import('@/components/GoogleMap'));
export const DynamicLottieLogo = withDynamicImport(() => import('@/components/LottieLogo'));

// Dynamic imports for portfolio and news components
export const DynamicPortfolioClient = withDynamicImport(() => import('@/app/portfolio/PortfolioClient'));
export const DynamicStoriesClient = withDynamicImport(() => import('@/app/stories/StoriesClient'));
export const DynamicNews = withDynamicImport(() => import('@/components/News'));
export const DynamicPortfolioNews = withDynamicImport(() => import('@/components/PortfolioNews'));

// Utility function to wrap components with Suspense
export const withSuspense = (Component, fallback = <LoadingSpinner />) => {
  const SuspenseWrapper = (props) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
  SuspenseWrapper.displayName = `withSuspense(${Component.displayName || Component.name || 'Component'})`;
  return SuspenseWrapper;
};

// Conditional loading utility
export const loadComponentWhenNeeded = (condition, importFunc) => {
  if (condition) {
    return importFunc();
  }
  return Promise.resolve(() => null);
};
