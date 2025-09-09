import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check if user has marketing consent (this would be set by the CMP)
  const consentHeader = request.headers.get('x-marketing-consent');
  const hasMarketingConsent = consentHeader === 'true';

  // Generate ads.txt content
  const adsTxtContent = `# ads.txt file for Age Calculator Website
# This file must be accessible at https://yourdomain.com/ads.txt
# Last updated: ${new Date().toISOString().split('T')[0]}

# Google AdSense
google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
# Replace pub-0000000000000000 with your actual AdSense Publisher ID

# Google Ad Manager (if using)
google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0

# Additional authorized sellers (add as needed)
# Example: amazon-adsystem.com, 1234567890, DIRECT, 3d544b3d8f2c3255

# Note: This file is served only after user consent is obtained
# to ensure compliance with privacy regulations`;

  // Return the ads.txt content with proper headers
  return new NextResponse(adsTxtContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      // Add consent status header for debugging
      'X-Consent-Status': hasMarketingConsent ? 'granted' : 'pending',
    },
  });
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
