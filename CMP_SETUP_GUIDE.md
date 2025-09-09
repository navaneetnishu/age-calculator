# Google-Certified Consent Management Platform (CMP) Setup Guide

## Overview

This guide will help you implement and deploy a Google-certified Consent Management Platform (CMP) on your age calculator website. The implementation uses **Cookiebot** as the CMP provider, which is Google-certified and supports the IAB Transparency and Consent Framework (TCF) v2.2.

## What's Already Implemented

✅ **ConsentManager Component** - Handles CMP initialization and Google Consent Mode integration  
✅ **Google Consent Mode Integration** - Automatically updates consent states  
✅ **AdSense Components Updated** - All ad components now respect user consent  
✅ **Consent Utilities** - Helper functions for checking consent status  

## Step 1: Get Your Cookiebot Account

1. **Sign up for Cookiebot**:
   - Visit [cookiebot.com](https://www.cookiebot.com)
   - Create a free account (supports up to 25,000 page views/month)
   - Choose the "Cookiebot CMP" plan

2. **Get Your Cookiebot ID**:
   - After signing up, you'll receive a unique Cookiebot ID
   - It looks like: `12345678-1234-1234-1234-123456789012`

## Step 2: Configure Your Cookiebot Account

1. **Add Your Domain**:
   - In your Cookiebot dashboard, add your domain (e.g., `yourdomain.com`)
   - Add both `www.yourdomain.com` and `yourdomain.com`

2. **Configure Cookie Categories**:
   - **Necessary**: Always enabled (required for site functionality)
   - **Preferences**: For user preferences and settings
   - **Statistics**: For analytics (Google Analytics, etc.)
   - **Marketing**: For advertising (Google AdSense, etc.)

3. **Customize Consent Banner**:
   - Choose your preferred language
   - Customize colors to match your site design
   - Set banner position (bottom, top, or center)
   - Configure auto-blocking settings

## Step 3: Update Your Website Code

### Replace the Cookiebot ID

In `src/components/ConsentManager.tsx`, replace `YOUR_COOKIEBOT_ID` with your actual Cookiebot ID:

```typescript
script.setAttribute('data-cbid', 'YOUR_ACTUAL_COOKIEBOT_ID');
```

### Example:
```typescript
script.setAttribute('data-cbid', '12345678-1234-1234-1234-123456789012');
```

## Step 4: Test Your Implementation

### Local Testing

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Check the consent banner**:
   - Visit your local site
   - You should see the Cookiebot consent banner
   - Test accepting/rejecting different cookie categories

3. **Verify ad behavior**:
   - With marketing consent: Ads should display normally
   - Without marketing consent: Ads should show placeholder text

### Production Testing

1. **Deploy to your domain**
2. **Test on different devices and browsers**
3. **Verify consent persistence across sessions**

## Step 5: Google AdSense Integration

### Enable Google Consent Mode

Your implementation already includes Google Consent Mode. When you're ready to add real AdSense:

1. **Replace placeholder ads** in `src/components/AdSenseAd.tsx`:
   ```typescript
   // Uncomment and update the AdSense script section
   <script
     async
     src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
     crossOrigin="anonymous"
   ></script>
   ```

2. **Update your AdSense account**:
   - Enable "Consent Mode" in your AdSense settings
   - Configure your ad units to work with consent mode

## Step 6: Compliance Verification

### GDPR Compliance

✅ **Consent before processing**: Users must consent before any tracking  
✅ **Granular consent**: Users can choose specific cookie categories  
✅ **Easy withdrawal**: Users can change consent preferences anytime  
✅ **Transparent information**: Clear explanation of what each category does  

### CCPA Compliance

✅ **Opt-out mechanism**: Users can opt out of data sales  
✅ **Clear privacy notice**: Transparent data collection practices  
✅ **No discrimination**: Service quality doesn't change based on consent  

## Step 7: Advanced Configuration

### Custom Consent Banner Styling

You can customize the consent banner appearance by adding CSS to your `globals.css`:

```css
/* Custom Cookiebot banner styling */
#CybotCookiebotDialog {
  font-family: 'Inter', sans-serif !important;
}

#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll {
  background-color: #3b82f6 !important;
  border-color: #3b82f6 !important;
}

#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll:hover {
  background-color: #2563eb !important;
}
```

### Analytics Integration

To integrate Google Analytics with consent:

```typescript
// In your analytics setup
useEffect(() => {
  if (hasAnalyticsConsent()) {
    // Initialize Google Analytics
    gtag('config', 'GA_MEASUREMENT_ID');
  }
}, []);
```

## Troubleshooting

### Common Issues

1. **Consent banner not showing**:
   - Check your Cookiebot ID is correct
   - Verify your domain is added to Cookiebot dashboard
   - Clear browser cache and cookies

2. **Ads not respecting consent**:
   - Ensure `hasMarketingConsent()` is working correctly
   - Check that AdSense components are using the consent check
   - Verify Google Consent Mode is properly initialized

3. **Consent not persisting**:
   - Check that cookies are being set correctly
   - Verify domain configuration in Cookiebot
   - Test in incognito/private browsing mode

### Debug Mode

Enable debug mode in Cookiebot for testing:

```typescript
script.setAttribute('data-culture', 'EN');
script.setAttribute('data-framework', 'IAB');
script.setAttribute('data-level', 'strict');
```

## Monitoring and Maintenance

### Regular Checks

1. **Monthly consent rate review**
2. **Cookie audit and cleanup**
3. **Compliance regulation updates**
4. **Performance impact assessment**

### Analytics

Monitor these metrics:
- Consent acceptance rates by category
- User experience impact
- Revenue impact from consent changes
- Technical performance metrics

## Support Resources

- **Cookiebot Documentation**: [help.cookiebot.com](https://help.cookiebot.com)
- **Google Consent Mode**: [developers.google.com/tag-platform/security/guides/consent](https://developers.google.com/tag-platform/security/guides/consent)
- **IAB TCF Framework**: [iabeurope.eu/transparency-consent-framework](https://iabeurope.eu/transparency-consent-framework)

## Next Steps

1. ✅ Complete Cookiebot account setup
2. ✅ Update Cookiebot ID in code
3. ✅ Test consent functionality
4. ✅ Deploy to production
5. ✅ Monitor and optimize

Your website is now ready for Google AdSense with full compliance support!
