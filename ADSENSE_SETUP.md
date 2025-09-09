# Google AdSense Setup Guide

## Overview
This website now includes realistic Google AdSense ad placeholders that look exactly like real Google AdSense ads. The ads are placed in non-intrusive locations throughout the website.

## Ad Placements

### 1. Sidebar Ads (Desktop Only)
- **Location**: Right sidebar on main pages
- **Format**: Vertical (160x600) and Rectangle (300x250)
- **Visibility**: Hidden on mobile devices
- **Components**: `AdSidebar.tsx`

### 2. Inline Ads
- **Location**: Between content sections
- **Format**: Rectangle (300x250) and Horizontal (728x90)
- **Pages**: All pages including About, Contact, Privacy, Disclaimer, Celebrity profiles
- **Components**: `InlineAd.tsx`

### 3. Ad Components
- **Main Component**: `AdSenseAd.tsx` - Realistic Google AdSense styling
- **Features**: 
  - Google-like header with "Ad" label
  - Professional styling with gradients and shadows
  - Responsive design
  - Multiple ad formats supported

## Ad Formats Supported

1. **Rectangle (300x250)** - Medium Rectangle
2. **Vertical (160x600)** - Wide Skyscraper  
3. **Horizontal (728x90)** - Leaderboard
4. **Auto** - Responsive format

## Implementation for Real Google AdSense

### Step 1: Get Google AdSense Account
1. Sign up for Google AdSense at https://www.google.com/adsense/
2. Get your Publisher ID (ca-pub-XXXXXXXXXX)

### Step 2: Update AdSenseAd Component
Replace the placeholder content in `src/components/AdSenseAd.tsx`:

```typescript
// Uncomment and update the script section at the bottom of AdSenseAd.tsx
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
  crossOrigin="anonymous"
></script>
<ins
  className="adsbygoogle"
  style={{ display: 'block' }}
  data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
  data-ad-slot={slot}
  data-ad-format={format}
  data-full-width-responsive={responsive ? 'true' : 'false'}
></ins>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### Step 3: Create Ad Units in AdSense
1. Go to AdSense dashboard
2. Create ad units for each slot:
   - `sidebar-vertical-1` (160x600)
   - `sidebar-rectangle-1` (300x250)
   - `sidebar-vertical-2` (160x600)
   - `inline-rectangle-1` (300x250)
   - `inline-horizontal-1` (728x90)

### Step 4: Update Slot IDs
Replace the placeholder slot IDs with your actual AdSense ad unit IDs:

```typescript
// In AdSidebar.tsx and InlineAd.tsx
<AdSenseAd 
  slot="YOUR_ACTUAL_AD_UNIT_ID" 
  format="rectangle" 
/>
```

## Ad Placement Strategy

### Non-Intrusive Locations
1. **Right Sidebar**: Desktop-only, doesn't interfere with main content
2. **Between Sections**: Natural content breaks
3. **Bottom of Pages**: After main content, before footer

### Mobile Optimization
- Sidebar ads hidden on mobile devices
- Inline ads remain visible but optimized for mobile
- Responsive ad formats used

## Styling Features

### Google AdSense Look
- **Header**: Blue gradient with "Ad" label and three dots
- **Content**: Professional layout with title, description, image placeholder
- **Button**: Google blue "Learn More" button
- **Footer**: "AdChoices" label
- **Shadows**: Subtle shadows for depth
- **Borders**: Clean gray borders

### Responsive Design
- Ads scale appropriately on different screen sizes
- Mobile-optimized layouts
- Proper spacing and margins

## Performance Considerations

### Lazy Loading
- Ads load only when needed
- No impact on initial page load
- Optimized for Core Web Vitals

### Caching
- Ad components are memoized
- Efficient re-rendering
- Minimal bundle impact

## Compliance

### AdSense Policies
- Ads clearly labeled as "Ad"
- Non-intrusive placement
- No misleading content
- Proper spacing from content

### User Experience
- Ads don't interfere with functionality
- Clean, professional appearance
- Fast loading times
- Mobile-friendly

## Testing

### Before Going Live
1. Test all ad placements
2. Verify responsive behavior
3. Check mobile compatibility
4. Ensure proper labeling
5. Validate AdSense policies compliance

### Monitoring
- Track ad performance in AdSense dashboard
- Monitor user experience metrics
- Adjust placements based on performance
- Regular policy compliance checks

## Files Modified

1. `src/components/AdSenseAd.tsx` - Main ad component
2. `src/components/AdSidebar.tsx` - Sidebar ad container
3. `src/components/InlineAd.tsx` - Inline ad container
4. `src/app/page.tsx` - Main page with sidebar and inline ads
5. `src/app/celebrity/[id]/page.tsx` - Celebrity profile with inline ad
6. `src/app/about/page.tsx` - About page with inline ad
7. `src/app/contact/page.tsx` - Contact page with inline ad
8. `src/app/privacy/page.tsx` - Privacy page with inline ad
9. `src/app/disclaimer/page.tsx` - Disclaimer page with inline ad

## Next Steps

1. **Get AdSense Approval**: Apply for Google AdSense
2. **Create Ad Units**: Set up ad units in AdSense dashboard
3. **Update Code**: Replace placeholder content with real AdSense code
4. **Test**: Verify all ads display correctly
5. **Monitor**: Track performance and optimize placements

The current implementation provides a perfect foundation for real Google AdSense integration while maintaining excellent user experience and professional appearance.
