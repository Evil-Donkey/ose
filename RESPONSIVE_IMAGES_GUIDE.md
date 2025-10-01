# Responsive Images Implementation Guide

## Overview

This guide explains how to implement responsive images in your Oxford Science Enterprises website to improve PageSpeed Insights scores and reduce image download times.

## What We've Implemented

### 1. Next.js Image Optimization Configuration

Updated `next.config.mjs` with:
- **Modern formats**: WebP and AVIF support for better compression
- **Device sizes**: Optimized breakpoints for different screen sizes
- **Image sizes**: Various sizes for different use cases
- **Caching**: 60-second minimum cache TTL

### 2. ResponsiveImage Component

Created `/src/components/ResponsiveImage/index.js` with features:
- Automatic responsive sizing
- Loading states and error handling
- Priority loading for above-the-fold images
- Lazy loading for below-the-fold images
- Quality optimization based on context
- Smooth loading transitions

### 3. Image Utility Functions

Created `/src/lib/imageUtils.js` with helper functions:
- `shouldPriorityLoad()` - Determines if image should be priority loaded
- `getResponsiveSizes()` - Generates appropriate sizes strings
- `getOptimalQuality()` - Sets quality based on context and size
- `getOptimizedImageProps()` - Generates complete optimized props

## How to Use Responsive Images

### Basic Usage

```jsx
import ResponsiveImage from "../../components/ResponsiveImage";

<ResponsiveImage
  src={image.mediaItemUrl}
  alt={image.altText}
  width={image.mediaDetails?.width || 800}
  height={image.mediaDetails?.height || 600}
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
  quality={80}
/>
```

### Advanced Usage with Utilities

```jsx
import ResponsiveImage from "../../components/ResponsiveImage";
import { getOptimizedImageProps } from "../../lib/imageUtils";

<ResponsiveImage
  {...getOptimizedImageProps(imageData, {
    context: 'hero',
    isAboveFold: true,
    isHero: true,
    index: 0,
    className: "absolute inset-0 w-full h-full object-cover"
  })}
/>
```

## Context Types and Their Optimizations

### Hero Images
- **Context**: `'hero'`
- **Quality**: 90
- **Sizes**: `'100vw'`
- **Priority**: Always true
- **Use case**: Full-width background images, main banners

### Card Images
- **Context**: `'card'`
- **Quality**: 80
- **Sizes**: `'(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'`
- **Priority**: First 3 items
- **Use case**: Grid layouts, card components

### Gallery Images
- **Context**: `'gallery'`
- **Quality**: 75
- **Sizes**: `'(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'`
- **Priority**: First few items
- **Use case**: Image galleries, portfolios

### Content Images
- **Context**: `'content'`
- **Quality**: 80
- **Sizes**: `'(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px'`
- **Priority**: Based on position
- **Use case**: Article images, inline content

## Priority Loading Rules

Images are marked for priority loading when:
- They are above the fold (visible without scrolling)
- They are hero images
- They are the first 3 items in a list/grid
- They are explicitly marked with `priority={true}`

## Sizes Attribute Explained

The `sizes` attribute tells the browser which image size to download:

```jsx
// For a hero image that's always full width
sizes="100vw"

// For a card that's 1/3 width on desktop, full width on mobile
sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"

// For content that's 80% width on large screens
sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
```

## Performance Benefits

### Before (Fixed 1000x1000 images)
- Large file sizes regardless of display size
- No format optimization
- No priority loading
- No lazy loading
- Poor LCP scores

### After (Responsive images)
- **50-80% smaller file sizes** for mobile devices
- **WebP/AVIF formats** for modern browsers
- **Priority loading** for above-the-fold content
- **Lazy loading** for below-the-fold content
- **Better LCP scores** and perceived performance

## Migration Checklist

To convert existing images to responsive:

1. **Import the ResponsiveImage component**
   ```jsx
   import ResponsiveImage from "../../components/ResponsiveImage";
   ```

2. **Replace Image with ResponsiveImage**
   ```jsx
   // Before
   <Image src={image.mediaItemUrl} alt={image.altText} width={1000} height={1000} />
   
   // After
   <ResponsiveImage
     src={image.mediaItemUrl}
     alt={image.altText}
     width={image.mediaDetails?.width || 800}
     height={image.mediaDetails?.height || 600}
     sizes="(max-width: 768px) 100vw, 50vw"
   />
   ```

3. **Add appropriate context and sizing**
   - Determine the image's context (hero, card, gallery, content)
   - Set appropriate sizes based on layout
   - Mark priority for above-the-fold images

4. **Test performance**
   - Use Chrome DevTools Network tab
   - Check PageSpeed Insights
   - Verify different device sizes

## Components Already Updated

- ✅ `OneColumnCopyAlternate` - Background and content images
- ✅ `StoryImage` - Full-width and contained images
- ✅ `Cards` - Grid and carousel images
- ✅ `StoriesClient` - Hero story image with priority loading

## Next Steps

1. **Update remaining components** that use Image
2. **Test on different devices** and screen sizes
3. **Monitor PageSpeed Insights** for improvements
4. **Lazy loading is already implemented** for below-the-fold images
5. **Blur placeholders are already implemented** for better UX

## Common Issues and Solutions

### Issue: Images not loading
**Solution**: Check that `mediaDetails` exists in your image data, use fallback dimensions

### Issue: Images too blurry
**Solution**: Increase quality value (80-90 for hero images, 70-80 for others)

### Issue: Images too large on mobile
**Solution**: Adjust sizes attribute to be more specific about mobile breakpoints

### Issue: Poor LCP scores
**Solution**: Ensure hero/above-the-fold images have `priority={true}` and appropriate sizing

## Performance Monitoring

Use these tools to monitor improvements:
- **PageSpeed Insights**: Overall performance scores
- **Chrome DevTools**: Network tab for actual file sizes
- **Lighthouse**: Detailed performance audit
- **WebPageTest**: Real-world performance testing

Remember: The goal is to serve the smallest possible image that still looks good on each device and screen size.
