'use client';

import { useRouter } from 'next/navigation';

export default function Disclaimer() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back to Home</span>
            </button>
            
            <h1 className="text-xl font-bold text-gray-900">Disclaimer</h1>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
              ⚠️
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Disclaimer</h1>
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* General Disclaimer */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">General Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The information provided on Age Calculator (the &quot;Website&quot;) is for general informational purposes only. 
              While we strive to provide accurate and up-to-date information, we make no representations or warranties 
              of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability 
              of the Website or the information, products, services, or related graphics contained on the Website.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Any reliance you place on such information is strictly at your own risk. We disclaim all liability and 
              responsibility arising from any reliance placed on such materials by you or any other visitor to the Website, 
              or by anyone who may be informed of any of its contents.
            </p>
          </div>

          {/* Age Calculation Disclaimer */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Age Calculation Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our age calculator is designed to provide approximate age calculations based on the birth date you provide. 
              While we use standard calendar calculations, please note the following limitations:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Age calculations are based on standard calendar years and may not account for leap years in all scenarios</li>
              <li>Time zone differences may affect the accuracy of calculations</li>
              <li>Calculations assume standard calendar systems and may not be accurate for all cultural or historical contexts</li>
              <li>Results are provided for entertainment and general reference purposes only</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              For official age verification or legal purposes, please consult appropriate authorities or use official 
              documentation. We are not responsible for any decisions made based on our age calculations.
            </p>
          </div>

          {/* Celebrity Information Disclaimer */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Celebrity Information Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The celebrity information provided on our Website is compiled from various public sources and is intended 
              for entertainment and informational purposes only. We make every effort to ensure accuracy, but we cannot 
              guarantee the following:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>All celebrity birth dates and personal information are accurate and up-to-date</li>
              <li>Celebrity ages are calculated correctly at all times</li>
              <li>All celebrities listed are currently alive or have accurate death dates</li>
              <li>Professional information and achievements are current and complete</li>
              <li>Social media links and contact information are valid and accessible</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Celebrity information may become outdated, and we are not responsible for any inaccuracies. We do not 
              claim ownership of any celebrity images, names, or personal information displayed on our Website.
            </p>
          </div>

          {/* Medical and Legal Disclaimer */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Medical and Legal Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The information on this Website is not intended to be a substitute for professional medical, legal, 
              financial, or other professional advice. Always seek the advice of qualified professionals regarding 
              any questions you may have about medical conditions, legal matters, financial decisions, or other 
              professional concerns.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We do not provide medical, legal, financial, or other professional advice. Any information provided 
              on this Website should not be used as the sole basis for making important decisions.
            </p>
          </div>

          {/* Third-Party Content */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Content and Links</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our Website may contain links to third-party websites, services, or content. We are not responsible 
              for the content, privacy policies, or practices of these third-party sites. The inclusion of any 
              link does not imply endorsement by us of the site or its contents.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You access third-party websites at your own risk. We recommend reviewing the terms of service and 
              privacy policies of any third-party sites you visit.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In no event shall Age Calculator, its owners, employees, or affiliates be liable for any direct, 
              indirect, incidental, special, consequential, or punitive damages, including without limitation, 
              loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Website.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This limitation of liability applies whether the alleged liability is based on contract, tort, 
              negligence, strict liability, or any other basis, even if we have been advised of the possibility 
              of such damage.
            </p>
          </div>

          {/* Indemnification */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to defend, indemnify, and hold harmless Age Calculator and its affiliates from and against 
              any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including 
              attorney&apos;s fees) arising from your use of the Website or violation of any term of this Disclaimer.
            </p>
          </div>

          {/* Website Availability */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Website Availability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strive to maintain the availability of our Website, but we do not guarantee that the Website will 
              be available at all times. The Website may be temporarily unavailable due to maintenance, technical 
              issues, or other factors beyond our control.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue the Website or any part of it at any time 
              without notice. We are not liable for any consequences resulting from such actions.
            </p>
          </div>

          {/* Changes to Disclaimer */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to update or change this Disclaimer at any time. Any changes will be posted on 
              this page with an updated revision date. Your continued use of the Website after any such changes 
              constitutes your acceptance of the new Disclaimer.
            </p>
          </div>

          {/* Governing Law */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              This Disclaimer shall be governed by and construed in accordance with applicable laws, without regard 
              to conflict of law principles. Any legal action or proceeding arising under this Disclaimer shall be 
              brought exclusively in the courts of competent jurisdiction.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Disclaimer, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> legal@agecalculator.com</p>
              <p><strong>Website:</strong> <button onClick={() => router.push('/contact')} className="text-blue-600 hover:underline">Contact Form</button></p>
            </div>
          </div>

          {/* Final Note */}
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Important Notice</h3>
                <p className="text-gray-700 text-sm">
                  By using our Website, you acknowledge that you have read, understood, and agree to be bound by this Disclaimer. 
                  If you do not agree with any part of this Disclaimer, you must not use our Website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
