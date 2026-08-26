import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/ui/card.component';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header class="mb-12">
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
          <p class="text-gray-600 dark:text-gray-400">Last updated: August 26, 2026</p>
        </header>

        <div class="space-y-8">
          <app-card class="prose prose-gray dark:prose-invert max-w-none">
            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">By accessing or using StayPak (the "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not use the Platform.</p>
              <p class="text-gray-600 dark:text-gray-400">StayPak is operated by StayPak Pvt. Ltd., a company registered in Pakistan. These Terms constitute a legally binding agreement between you and StayPak Pvt. Ltd.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Definitions</h2>
              <ul class="space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li><strong>Guest:</strong> A user who books accommodations on the Platform.</li>
                <li><strong>Host:</strong> A user who lists accommodations on the Platform.</li>
                <li><strong>Listing:</strong> An accommodation offered by a Host on the Platform.</li>
                <li><strong>Booking:</strong> A reservation confirmed between a Guest and Host.</li>
                <li><strong>CNIC:</strong> Computerized National Identity Card issued by NADRA.</li>
              </ul>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Eligibility</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">You must be at least 18 years old to use the Platform. By using the Platform, you represent and warrant that you have the legal capacity to enter into these Terms.</p>
              <p class="text-gray-600 dark:text-gray-400">For hosts operating in Pakistan, you must have a valid CNIC and comply with all applicable Pakistani laws including but not limited to the Punjab Tourism for Economic Growth Act, Sindh Tourism Act, and local municipal regulations.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Account Registration</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">You must provide accurate, complete, and current registration information. You are responsible for safeguarding your password and for all activities under your account.</p>
              <p class="text-gray-600 dark:text-gray-400">We may require identity verification including CNIC verification for certain features. Providing false verification information is a violation of these Terms.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Bookings and Payments</h2>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">5.1 Booking Process</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Bookings are created when a Guest submits a request and the Host accepts, or when a Guest uses Instant Book. A binding contract is formed between Guest and Host upon confirmation.</p>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">5.2 Pricing</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Prices are displayed in Pakistani Rupees (PKR). The total price includes the nightly rate, cleaning fee (if applicable), and StayPak service fee (10% of subtotal, minimum PKR 500, maximum PKR 5,000). Taxes may apply as per Pakistani law.</p>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">5.3 Payment Methods</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">We accept JazzCash, EasyPaisa, SafePay, and major credit/debit cards. Payments are processed through licensed Pakistani payment gateways.</p>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">5.4 Cancellation & Refunds</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Cancellation policies are set by Hosts (Flexible, Moderate, or Strict). Refunds are processed according to the policy in effect at time of booking. StayPak service fees are non-refundable except as required by law.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Host Responsibilities</h2>
              <ul class="space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Provide accurate listing information including photos, amenities, and location</li>
                <li>Comply with all applicable Pakistani laws, regulations, and tax obligations</li>
                <li>Ensure the property meets safety standards (fire extinguisher, emergency exits, etc.)</li>
                <li>Honor confirmed bookings and not cancel without valid reason</li>
                <li>Respond to Guest inquiries within 24 hours</li>
                <li>Maintain property condition as advertised</li>
              </ul>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">7. Guest Responsibilities</h2>
              <ul class="space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Provide accurate information during booking</li>
                <li>Respect the property, house rules, and neighbors</li>
                <li>Not exceed the maximum guest count</li>
                <li>Report any damages or issues promptly</li>
                <li>Not use the property for illegal activities</li>
                <li>Check out on time and leave the property in reasonable condition</li>
              </ul>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">8. Reviews</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Reviews must be accurate, based on personal experience, and comply with our content policy. We reserve the right to remove reviews that violate these Terms. Reviews cannot be removed by Hosts or Guests once published.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">9. Intellectual Property</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">The Platform and its original content (excluding user-provided content) are owned by StayPak and protected by international copyright laws. You grant StayPak a license to use, display, and distribute your listing content and reviews for Platform operations.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">10. Disclaimer of Warranties</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">11. Limitation of Liability</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">TO THE MAXIMUM EXTENT PERMITTED BY LAW, STAYPAK SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, OR GOODWILL.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">12. Indemnification</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">You agree to indemnify and hold StayPak harmless from any claims, damages, or expenses arising from your use of the Platform, violation of these Terms, or violation of any law.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">13. Governing Law & Dispute Resolution</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">These Terms are governed by the laws of the Islamic Republic of Pakistan. Any disputes shall be resolved through binding arbitration in Karachi, Pakistan, in English, under the Arbitration Act, 1940.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">14. Changes to Terms</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">We may modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance. Material changes will be communicated via email or in-app notification.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">15. Contact Information</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-2">StayPak Pvt. Ltd.</p>
              <p class="text-gray-600 dark:text-gray-400 mb-2">10th Floor, Tech Park, Shahrah-e-Faisal, Karachi, Pakistan</p>
              <p class="text-gray-600 dark:text-gray-400">Email: legal@staypak.com</p>
            </section>
          </app-card>
        </div>
      </div>
    </div>
  `,
})
export class TermsComponent {}