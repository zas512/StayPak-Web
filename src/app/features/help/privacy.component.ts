import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/ui/card.component';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header class="mb-12">
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
          <p class="text-gray-600 dark:text-gray-400">Last updated: August 26, 2026</p>
        </header>

        <div class="space-y-8">
          <app-card class="prose prose-gray dark:prose-invert max-w-none">
            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Introduction</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">StayPak Pvt. Ltd. ("StayPak", "we", "our", "us") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform (the "Platform").</p>
              <p class="text-gray-600 dark:text-gray-400">We are committed to complying with Pakistan's Personal Data Protection Bill and international privacy standards including GDPR principles.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Information We Collect</h2>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">2.1 Information You Provide</h3>
              <ul class="space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Account information: name, email, phone number, password</li>
                <li>Profile information: photo, bio, date of birth, gender</li>
                <li>Verification documents: CNIC number, CNIC document images (encrypted)</li>
                <li>Payment information: processed by our payment partners (JazzCash, EasyPaisa, SafePay)</li>
                <li>Listing information: property details, photos, pricing, availability</li>
                <li>Communications: messages with other users, support tickets</li>
              </ul>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">2.2 Automatically Collected Information</h3>
              <ul class="space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Device information: IP address, browser type, operating system, device IDs</li>
                <li>Usage data: pages visited, search queries, booking history, time spent</li>
                <li>Location data: approximate location from IP (with consent for precise location)</li>
                <li>Cookies and similar technologies (see Section 10)</li>
              </ul>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">3. How We Use Your Information</h2>
              <ul class="space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Provide, maintain, and improve the Platform</li>
                <li>Process bookings, payments, and refunds</li>
                <li>Verify identity and prevent fraud (CNIC verification)</li>
                <li>Communicate with you about bookings, updates, and promotions</li>
                <li>Personalize your experience and show relevant listings</li>
                <li>Ensure safety and security of our community</li>
                <li>Comply with legal obligations (Pakistani tax law, anti-money laundering)</li>
                <li>Resolve disputes and enforce our Terms</li>
              </ul>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Information Sharing</h2>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">4.1 With Other Users</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">When a booking is confirmed, we share necessary information between Guest and Host: names, profile photos, contact numbers, and booking details.</p>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">4.2 With Service Providers</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">We share data with trusted third parties who perform services on our behalf:</p>
              <ul class="space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside ml-4">
                <li>Payment processors: JazzCash, EasyPaisa, SafePay</li>
                <li>Cloud hosting: AWS/Azure (servers in Pakistan/Singapore)</li>
                <li>Verification services: NADRA API partners for CNIC validation</li>
                <li>Communication: SMS/email providers for notifications</li>
                <li>Analytics: Google Analytics, Mixpanel (anonymized)</li>
              </ul>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">4.3 Legal Requirements</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">We may disclose information when required by Pakistani law, court order, or government request, or to protect rights and safety.</p>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">4.4 Business Transfers</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">In case of merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">5. CNIC Verification & Sensitive Data</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">CNIC numbers and document images are sensitive personal data. We handle them with extra protection:</p>
              <ul class="space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Encrypted at rest using AES-256</li>
                <li>Transmitted only over TLS 1.3</li>
                <li>Accessed only by authorized verification staff</li>
                <li>Deleted within 30 days after verification completion</li>
                <li>Never shared with other users or third parties (except NADRA verification API)</li>
                <li>Not used for marketing or profiling</li>
              </ul>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Data Retention</h2>
              <ul class="space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Account data: Retained while account is active + 2 years after closure</li>
                <li>Booking records: 7 years (Pakistani tax law requirement)</li>
                <li>Payment records: 7 years (State Bank of Pakistan regulations)</li>
                <li>CNIC documents: 30 days post-verification</li>
                <li>Message history: Retained while account is active</li>
                <li>Analytics data: 26 months (anonymized)</li>
              </ul>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">7. Your Rights</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Under applicable law, you have the right to:</p>
              <ul class="space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Request deletion (right to be forgotten) — subject to legal retention requirements</li>
                <li>Restrict or object to processing</li>
                <li>Data portability — receive your data in a structured format</li>
                <li>Withdraw consent where processing is based on consent</li>
                <li>Lodge a complaint with Pakistan's Personal Data Protection Authority</li>
              </ul>
              <p class="text-gray-600 dark:text-gray-400 mt-4">To exercise these rights, email <a href="mailto:privacy@staypak.com" class="text-emerald-600 hover:underline">privacy@staypak.com</a> or use the Data Request form in Settings.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">8. Data Security</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">We implement appropriate technical and organizational measures:</p>
              <ul class="space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Encryption in transit (TLS 1.3) and at rest (AES-256)</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and principle of least privilege</li>
                <li>Incident response plan with 72-hour breach notification</li>
                <li>Employee training on data protection</li>
              </ul>
              <p class="text-gray-600 dark:text-gray-400 mt-4">However, no internet transmission is 100% secure. We cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">9. International Transfers</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Your data may be processed on servers in Pakistan, Singapore, or the United States. We ensure adequate protection through Standard Contractual Clauses or equivalent safeguards for cross-border transfers.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">10. Cookies & Tracking</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">We use cookies and similar technologies for:</p>
              <ul class="space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li><strong>Essential:</strong> Authentication, security, session management</li>
                <li><strong>Preferences:</strong> Language, currency, dark mode</li>
                <li><strong>Analytics:</strong> Usage patterns, performance (anonymized)</li>
                <li><strong>Marketing:</strong> Relevant ads (with consent)</li>
              </ul>
              <p class="text-gray-600 dark:text-gray-400 mt-4">You can manage cookie preferences in your browser settings. Disabling essential cookies may break Platform functionality.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">11. Children's Privacy</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">The Platform is not intended for users under 18. We do not knowingly collect data from children. If you believe a child has provided data, contact us immediately for deletion.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">12. Changes to This Policy</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">We may update this Policy. Material changes will be notified via email or in-app at least 30 days before taking effect. Continued use constitutes acceptance.</p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">13. Contact Us</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-2">Data Protection Officer: dpo@staypak.com</p>
              <p class="text-gray-600 dark:text-gray-400 mb-2">General privacy inquiries: privacy@staypak.com</p>
              <p class="text-gray-600 dark:text-gray-400">Postal: StayPak Pvt. Ltd., 10th Floor, Tech Park, Shahrah-e-Faisal, Karachi, Pakistan</p>
            </section>
          </app-card>
        </div>
      </div>
    </div>
  `,
})
export class PrivacyComponent {}