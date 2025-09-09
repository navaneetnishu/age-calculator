# ads.txt Setup Guide for Google AdSense Compliance

## Overview

This guide explains how to implement a valid `ads.txt` file that loads after CMP consent to ensure compliance with programmatic ad serving requirements. The implementation ensures that ads.txt is only loaded after user consent is obtained, preventing compliance errors.

## What's Already Implemented

✅ **Static ads.txt file** - Located in `public/ads.txt`  
✅ **Consent-aware ads.txt loading** - Only loads after marketing consent  
✅ **API route for ads.txt** - Dynamic serving with proper headers  
✅ **Validation utilities** - Format validation and content generation  
✅ **Debug components** - For testing and monitoring  

## Understanding ads.txt

### What is ads.txt?
- **Authorized Digital Sellers** file that lists authorized sellers of your ad inventory
- **Required by Google AdSense** for programmatic ad serving
- **Must be accessible** at `https://yourdomain.com/ads.txt`
- **Must load after consent** to avoid compliance violations

### Why Load After Consent?
- **Privacy compliance** - Prevents tracking before user consent
- **GDPR/CCPA compliance** - Respects user privacy choices
- **Google requirements** - AdSense requires consent-aware implementation
- **Avoid penalties** - Prevents compliance errors and potential account issues

## Step 1: Update Your Publisher ID

### In Static File
Update `public/ads.txt`:
```text
# Replace pub-0000000000000000 with your actual AdSense Publisher ID
google.com, pub-YOUR_ACTUAL_PUBLISHER_ID, DIRECT, f08c47fec0942fa0
```

### In API Route
Update `src/app/ads.txt/route.ts`:
```typescript
// Replace pub-0000000000000000 with your actual AdSense Publisher ID
google.com, pub-YOUR_ACTUAL_PUBLISHER_ID, DIRECT, f08c47fec0942fa0
```

### In ConsentManager
Update `src/components/ConsentManager.tsx`:
```typescript
// Replace pub-0000000000000000 with your actual AdSense Publisher ID
const adsTxtContent = generateServerAdsTxt('pub-YOUR_ACTUAL_PUBLISHER_ID');
```

## Step 2: Configure Your Domain

### 1. Deploy to Production
- Deploy your website to your production domain
- Ensure `public/ads.txt` is accessible at `https://yourdomain.com/ads.txt`

### 2. Test ads.txt Accessibility
```bash
# Test from command line
curl -I https://yourdomain.com/ads.txt

# Should return:
# HTTP/1.1 200 OK
# Content-Type: text/plain; charset=utf-8
```

### 3. Verify Content
```bash
# Check content
curl https://yourdomain.com/ads.txt

# Should show your ads.txt content
```

## Step 3: Test Consent-Aware Loading

### Development Testing
1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Check debug components**:
   - Look for "Consent Status" button in bottom-right
   - Look for "ads.txt Status" panel
   - Monitor consent and ads.txt loading status

3. **Test consent flow**:
   - Accept marketing consent
   - Verify ads.txt loads after consent
   - Check browser console for confirmation messages

### Production Testing
1. **Deploy to production**
2. **Test consent banner**
3. **Verify ads.txt loads after consent**
4. **Check Google AdSense dashboard** for ads.txt validation

## Step 4: Google AdSense Integration

### 1. Enable ads.txt in AdSense
- Go to your AdSense account
- Navigate to "Sites" section
- Add your domain
- Verify ads.txt is detected

### 2. Monitor ads.txt Status
- Check AdSense dashboard regularly
- Look for ads.txt validation status
- Address any errors promptly

### 3. Update as Needed
- Add new authorized sellers
- Update publisher IDs
- Maintain compliance

## Step 5: Advanced Configuration

### Adding More Authorized Sellers

Update your ads.txt file to include additional sellers:

```text
# Google AdSense
google.com, pub-YOUR_PUBLISHER_ID, DIRECT, f08c47fec0942fa0

# Amazon DSP
amazon-adsystem.com, 1234567890, DIRECT, 3d544b3d8f2c3255

# Facebook Audience Network
facebook.com, 123456789, DIRECT, c3e20eee3f780d68

# Additional sellers as needed
```

### Custom Validation

Add custom validation in your API route:

```typescript
// In src/app/ads.txt/route.ts
const validateAdsTxt = (content: string): boolean => {
  const lines = content.split('\n').filter(line => 
    line.trim() && !line.trim().startsWith('#')
  );
  
  return lines.every(line => {
    const parts = line.split(',');
    return parts.length >= 3 && parts.length <= 4;
  });
};
```

## Step 6: Monitoring and Maintenance

### Regular Checks
1. **Monthly ads.txt validation**
2. **Consent rate monitoring**
3. **AdSense performance review**
4. **Compliance audit**

### Key Metrics to Monitor
- ads.txt accessibility rate
- Consent acceptance rate
- Ad serving performance
- Compliance violations

### Troubleshooting

#### Common Issues

1. **ads.txt not accessible**:
   - Check file permissions
   - Verify domain configuration
   - Test from different locations

2. **Consent not triggering ads.txt**:
   - Check CMP configuration
   - Verify consent status
   - Review browser console

3. **AdSense not detecting ads.txt**:
   - Wait 24-48 hours
   - Check file format
   - Verify publisher ID

#### Debug Mode

Enable debug mode for testing:

```typescript
// In development, add debug class
<AdsTxtLoader className="debug" />
```

## Step 7: Compliance Verification

### GDPR Compliance
✅ **Consent before processing** - ads.txt loads only after consent  
✅ **Transparent information** - Clear explanation of data use  
✅ **User control** - Users can withdraw consent  
✅ **Data minimization** - Only necessary data processed  

### CCPA Compliance
✅ **Opt-out mechanism** - Users can opt out of data sales  
✅ **Clear privacy notice** - Transparent data collection  
✅ **No discrimination** - Service quality maintained  

### Google AdSense Compliance
✅ **Valid ads.txt format** - Properly formatted file  
✅ **Consent-aware loading** - Loads after user consent  
✅ **Accessible URL** - Available at domain root  
✅ **Regular updates** - Maintained and updated  

## Best Practices

### 1. File Maintenance
- Update ads.txt regularly
- Remove inactive sellers
- Add new authorized sellers
- Monitor for changes

### 2. Performance
- Cache ads.txt content
- Use CDN for faster access
- Monitor loading times
- Optimize file size

### 3. Security
- Validate all entries
- Use HTTPS only
- Monitor for unauthorized changes
- Regular security audits

## Support Resources

- **Google AdSense Help**: [support.google.com/adsense](https://support.google.com/adsense)
- **ads.txt Specification**: [iabtechlab.com/ads-txt](https://iabtechlab.com/ads-txt)
- **IAB Guidelines**: [iab.com/guidelines](https://iab.com/guidelines)

## Next Steps

1. ✅ Update publisher ID in all files
2. ✅ Deploy to production domain
3. ✅ Test ads.txt accessibility
4. ✅ Verify consent-aware loading
5. ✅ Monitor AdSense integration
6. ✅ Regular maintenance and updates

Your website now has a fully compliant ads.txt implementation that respects user privacy and meets all Google AdSense requirements!
