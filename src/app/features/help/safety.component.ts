import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/ui/card.component';

@Component({
  selector: 'app-safety',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
            <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Your safety is our priority</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">We're committed to creating a trusted community where everyone feels safe and welcome.</p>
        </div>

        <!-- Safety Features -->
        <div class="space-y-12">
          <!-- Verification -->
          <section>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span class="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </span>
              Identity Verification
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              @for (item of verificationItems; track item.title) {
                <app-card>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ item.title }}</h3>
                  <p class="text-gray-600 dark:text-gray-400">{{ item.description }}</p>
                </app-card>
              }
            </div>
          </section>

          <!-- Secure Payments -->
          <section>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </span>
              Secure Payments
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              @for (item of paymentItems; track item.title) {
                <app-card class="text-center">
                  <div class="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="item.icon"></path>
                    </svg>
                  </div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ item.title }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.description }}</p>
                </app-card>
              }
            </div>
          </section>

          <!-- In-Person Safety -->
          <section>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span class="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </span>
              Staying Safe During Your Trip
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              @for (item of safetyItems; track item.title) {
                <app-card>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ item.title }}</h3>
                  <p class="text-gray-600 dark:text-gray-400">{{ item.description }}</p>
                </app-card>
              }
            </div>
          </section>

          <!-- Emergency Support -->
          <section>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span class="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </span>
              24/7 Emergency Support
            </h2>
            <app-card class="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-3">In case of emergency</h3>
                  <ul class="space-y-2 text-gray-600 dark:text-gray-400">
                    <li class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>Call <strong>1122</strong> (Rescue 1122) for immediate emergency assistance in Pakistan</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>Contact StayPak Safety Line: <strong>+92 300 111 2222</strong> (24/7)</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>Use the emergency button in your active trip details</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Safety features in the app</h3>
                  <ul class="space-y-2 text-gray-600 dark:text-gray-400">
                    <li class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>Share trip details with trusted contacts</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>In-app messaging keeps communication on-platform</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>Report safety concerns directly from any listing or message</span>
                    </li>
                  </ul>
                </div>
              </div>
            </app-card>
          </section>

          <!-- Community Standards -->
          <section>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </span>
              Community Standards
            </h2>
            <app-card>
              <p class="text-gray-600 dark:text-gray-400 mb-6">All members of the StayPak community agree to follow these standards:</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (standard of communityStandards; track standard) {
                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                    <span class="text-gray-700 dark:text-gray-300">{{ standard }}</span>
                  </div>
                }
              </div>
            </app-card>
          </section>

          <!-- Resources -->
          <section>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </span>
              Helpful Resources
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (resource of resources; track resource.title) {
                <a [href]="resource.url" target="_blank" rel="noopener noreferrer" class="app-card hover:shadow-md transition-shadow group">
                  <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1">{{ resource.title }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ resource.description }}</p>
                </a>
              }
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
})
export class SafetyComponent {
  verificationItems = [
    {
      title: 'CNIC Verification',
      description: 'Hosts and guests can verify their identity using Pakistan\'s Computerized National Identity Card. This builds trust and accountability in our community.',
    },
    {
      title: 'Phone & Email Verification',
      description: 'All accounts must verify their phone number and email address before booking or hosting.',
    },
    {
      title: 'Profile Completeness',
      description: 'Complete profiles with photos and verified details help everyone make informed decisions.',
    },
    {
      title: 'Host Guarantee',
      description: 'Verified hosts are eligible for StayPak\'s Host Guarantee program for property protection.',
    },
  ];

  paymentItems = [
    {
      title: 'Encrypted Transactions',
      description: 'All payments use bank-grade encryption through regulated Pakistani payment gateways.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
    {
      title: 'No Direct Transfers',
      description: 'Payments are held securely and only released after check-in. Never pay outside the platform.',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'Refund Protection',
      description: 'Clear cancellation policies with automated refunds based on host\'s policy and timing.',
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    },
  ];

  safetyItems = [
    {
      title: 'Meet in Public First',
      description: 'For key exchanges or meetups, choose well-lit public places. Many Pakistani cities have police stations or mall security that can serve as safe meeting points.',
    },
    {
      title: 'Verify the Listing',
      description: 'Check that the listing photos match the actual property. Look for verified badges and read recent reviews from other guests.',
    },
    {
      title: 'Keep Valuables Secure',
      description: 'Use the property\'s safe or lockbox for passports, jewelry, and electronics. Don\'t leave valuables in plain sight.',
    },
    {
      title: 'Know Emergency Exits',
      description: 'Familiarize yourself with emergency exits, fire extinguishers, and evacuation routes when you check in.',
    },
    {
      title: 'Share Your Plans',
      description: 'Use the Share Trip feature to send your itinerary and host details to a trusted friend or family member.',
    },
    {
      title: 'Trust Your Instincts',
      description: 'If something feels off, contact StayPak support immediately. You can cancel and request a refund if you feel unsafe.',
    },
  ];

  communityStandards = [
    'Treat everyone with respect — no discrimination based on race, religion, gender, disability, or other protected characteristics',
    'Be honest and accurate in your profile, listings, and communications',
    'Respect the property and follow house rules set by hosts',
    'No parties, events, or unauthorized guests without host permission',
    'Keep communication on the StayPak platform for safety and dispute resolution',
    'Follow all local Pakistani laws and regulations',
    'Report safety concerns or violations promptly',
    'Respect quiet hours and neighbors in residential areas',
  ];

  resources = [
    {
      title: 'Tourist Police Pakistan',
      description: 'Emergency assistance for tourists: 1414 or visit touristpolice.punjab.gov.pk',
      url: 'https://touristpolice.punjab.gov.pk',
    },
    {
      title: 'Cyber Crime Wing FIA',
      description: 'Report online fraud or cybercrime: 1991 or nr3c.gov.pk',
      url: 'https://nr3c.gov.pk',
    },
    {
      title: 'Consumer Protection Council',
      description: 'File complaints about services: cp.gov.pk',
      url: 'https://cp.gov.pk',
    },
    {
      title: 'Pakistan Tourism Development Corp',
      description: 'Official tourism information: ptdc.gov.pk',
      url: 'https://ptdc.gov.pk',
    },
  ];
}